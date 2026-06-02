import React from 'react';
import { db } from '@/lib/db';
import ContactsListClient from '@/features/admin/components/contacts/ContactsListClient';

export const revalidate = 0;

async function fetchSubmissions() {
  try {
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS ContactSubmission (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NULL,
        service VARCHAR(255) NULL,
        message TEXT NOT NULL,
        createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
    const data: any[] = await db.$queryRawUnsafe(
      `SELECT * FROM ContactSubmission ORDER BY createdAt DESC`
    );
    return data.map(sub => ({
      ...sub,
      createdAt: sub.createdAt ? new Date(sub.createdAt).toISOString() : new Date().toISOString()
    }));
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default async function ContactsPage() {
  const submissions = await fetchSubmissions();
  return <ContactsListClient initialSubmissions={submissions} />;
}
