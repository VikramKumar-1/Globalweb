import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';

export async function requireAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) {
    throw new Error('Unauthorized: No active session.');
  }

  const payload = await verifyJWT(token);

  if (!payload || payload.role !== 'admin') {
    throw new Error('Unauthorized: Invalid session.');
  }

  return payload;
}
