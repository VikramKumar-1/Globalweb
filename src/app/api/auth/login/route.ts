import { NextResponse } from 'next/server';
import { signJWT } from '@/lib/jwt';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    // Get client IP address
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    
    // 1. Check Rate Limiter (Brute Force Protection)
    const recentFailedAttempts = await db.loginAttempt.count({
      where: {
        ip: ip,
        success: false,
        timestamp: { gte: tenMinutesAgo }
      }
    });

    if (recentFailedAttempts >= 5) {
      // Calculate exact wait time based on the oldest failed attempt in the window
      const firstFailed = await db.loginAttempt.findFirst({
        where: { ip, success: false, timestamp: { gte: tenMinutesAgo } },
        orderBy: { timestamp: 'asc' }
      });
      
      let waitMins = 10;
      if (firstFailed) {
        const expiresAt = new Date(firstFailed.timestamp.getTime() + 10 * 60 * 1000);
        waitMins = Math.max(1, Math.ceil((expiresAt.getTime() - Date.now()) / 60000));
      }
      
      return NextResponse.json(
        { success: false, message: `Too many failed login attempts. Please try again in ${waitMins} minute${waitMins !== 1 ? 's' : ''}.` },
        { status: 429 }
      );
    }

    const { username, password } = await request.json();

    const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'adminpassword123';

    if (username === expectedUsername && password === expectedPassword) {
      // Log successful attempt
      await db.loginAttempt.create({ data: { ip, success: true } });

      const token = await signJWT({ username, role: 'admin' }, 60 * 60 * 24 * 7);
      
      const response = NextResponse.json({ success: true, message: 'Logged in successfully' });
      
      // Set the token as a secure HttpOnly cookie
      response.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    }

    // Log failed attempt
    await db.loginAttempt.create({ data: { ip, success: false } });
    
    const attemptsLeft = 5 - (recentFailedAttempts + 1);
    
    let errorMessage = 'Invalid username or password.';
    if (attemptsLeft > 0) {
      errorMessage += ` You have ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`;
    } else {
      errorMessage = 'Invalid username or password. Account locked. Please try again in 10 minutes.';
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
