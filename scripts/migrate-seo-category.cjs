const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

const SEO_SLUGS = [
  '/seo-services', 'seo-services',
  '/on-page-seo', 'on-page-seo',
  '/off-page-seo', 'off-page-seo',
  '/technical-seo', 'technical-seo',
  '/local-business-seo', 'local-business-seo',
  '/gmb-seo', 'gmb-seo',
  '/ai-seo-services', 'ai-seo-services',
  '/generative-engine-optimization-services', 'generative-engine-optimization-services',
  '/answer-engine-optimization-services', 'answer-engine-optimization-services',
  '/perplexity-ai-seo-services', 'perplexity-ai-seo-services',
  '/chatgpt-ai-seo-services', 'chatgpt-ai-seo-services',
  '/gemini-ai-seo-services', 'gemini-ai-seo-services',
  '/claude-ai-seo-services', 'claude-ai-seo-services',
  '/agentic-ai-seo-services', 'agentic-ai-seo-services',
  '/ai-powered-content-creation-services', 'ai-powered-content-creation-services'
];

async function run() {
  console.log("Migrating SEO/AI SEO pages to 'seo' category...");
  const updateResult = await db.servicePage.updateMany({
    where: {
      slug: { in: SEO_SLUGS }
    },
    data: {
      category: 'seo'
    }
  });
  console.log(`Migrated ${updateResult.count} pages to 'seo' category.`);

  // Create GMB SEO if it doesn't exist
  const gmbExists = await db.servicePage.findFirst({
    where: { slug: { in: ['/gmb-seo', 'gmb-seo'] } }
  });

  if (!gmbExists) {
    console.log("Seeding GMB SEO page...");
    await db.servicePage.create({
      data: {
        title: "GMB SEO",
        slug: "/gmb-seo",
        category: "seo",
        content: `
          <h2>Google My Business (GMB) SEO Services</h2>
          <p>Welcome to our GMB SEO page. We optimize your Google Business Profile to help you dominate local map pack search rankings and drive high-intent calls and leads.</p>
          <h3>GMB Optimization Checklist:</h3>
          <ul class="pl-4 list-disc space-y-2 mt-4">
            <li>Complete profile verification and NAP consistency audits</li>
            <li>Category selection and keyword-rich business descriptions</li>
            <li>Review collection strategy and spam fighting</li>
          </ul>
        `,
        image: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=800&q=80",
        seoTitle: "Best GMB SEO Services | GlobalWebify",
        heroDescription: "Get dynamic, high-performance GMB SEO services tailored for local business growth.",
        seoDescription: "Professional GMB SEO services to grow your business online and rank in maps.",
        isActive: true
      }
    });
    console.log("GMB SEO page created.");
  }
}

run()
  .then(() => {
    console.log("Migration complete!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
