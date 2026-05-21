'use server';

import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'data', 'homepageFaqs.json');

export async function getHomepageFaqs() {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error("Failed to read homepage FAQs", error);
    return [];
  }
}

export async function saveHomepageFaqs(faqs: { question: string, answer: string }[]) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(faqs, null, 2), 'utf8');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save homepage FAQs", error);
    return { success: false, error: error.message };
  }
}
