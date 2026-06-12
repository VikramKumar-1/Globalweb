import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

async function ensureTableExists() {
  try {
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS PartnershipSubmission (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NULL,
        companyName VARCHAR(255) NULL,
        websiteUrl VARCHAR(255) NULL,
        partnershipType VARCHAR(255) NULL,
        message TEXT NOT NULL,
        createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
  } catch (e) {
    console.error('Failed to ensure PartnershipSubmission table exists:', e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, companyName, websiteUrl, partnershipType, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await ensureTableExists();

    await db.$executeRawUnsafe(
      `INSERT INTO PartnershipSubmission (name, email, phone, companyName, websiteUrl, partnershipType, message) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      name,
      email,
      phone || null,
      companyName || null,
      websiteUrl || null,
      partnershipType || null,
      message
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Partnership submission POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await ensureTableExists();
    const submissions = await db.$queryRawUnsafe(
      `SELECT * FROM PartnershipSubmission ORDER BY createdAt DESC`
    );
    return NextResponse.json({ success: true, submissions });
  } catch (error: any) {
    console.error('Partnership submission GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idStr = searchParams.get('id');
    if (!idStr) {
      return NextResponse.json({ success: false, error: 'Missing id parameter' }, { status: 400 });
    }
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid id parameter' }, { status: 400 });
    }

    await ensureTableExists();
    await db.$executeRawUnsafe(`DELETE FROM PartnershipSubmission WHERE id = ?`, id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Partnership submission DELETE error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
