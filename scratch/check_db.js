const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.servicePage.findMany({
    select: { id: true, slug: true, title: true, content: true }
  });
  
  console.log("Found " + pages.length + " pages.");
  for (const page of pages) {
    console.log(`\n--- Page ID: ${page.id}, Slug: ${page.slug}, Title: ${page.title} ---`);
    const match = page.content.match(/<!-- FAQ_DATA: (.*?) -->/);
    if (match) {
      console.log("FAQ match found!");
      try {
        const faqs = JSON.parse(match[1]);
        console.log("Parsed FAQs length:", faqs.length);
        console.log("FAQs:", JSON.stringify(faqs, null, 2));
      } catch (e) {
        console.error("Failed to parse FAQ JSON:", e.message);
      }
    } else {
      console.log("No FAQ comment pattern matched in content.");
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
