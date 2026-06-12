const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

const CRM_SERVICES = [
  { name: "CRM Software Development", href: "/crm-software-development" },
  { name: "Lead Management Software", href: "/lead-management-software" },
  { name: "Hotel Management Software", href: "/hotel-management-software" },
  { name: "Hospital Management Software", href: "/hospital-management-software" },
  { name: "HR Management Software", href: "/hr-management-software" },
  { name: "School Management System", href: "/school-management-system" }
];

async function seed() {
  console.log("Seeding CRM pages into the database...");
  for (const item of CRM_SERVICES) {
    const slug = item.href;
    const exists = await db.servicePage.findFirst({
      where: { slug }
    });

    if (exists) {
      console.log(`Page for ${item.name} (${slug}) already exists. Skipping.`);
      continue;
    }

    const defaultImage = 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80';
    await db.servicePage.create({
      data: {
        title: item.name,
        slug: slug,
        category: 'crm',
        content: `
          <h2>Professional ${item.name} Services</h2>
          <p>Welcome to our ${item.name} page. We deliver premium CRM solutions designed to help your business optimize workflows, engage customers, and grow.</p>
          <h3>Key Features:</h3>
          <ul class="pl-4 list-disc space-y-2 mt-4">
            <li>Tailored workflows to match your specific operations</li>
            <li>Real-time analytics and dynamic dashboard reporting</li>
            <li>Multi-channel integrations and security audits</li>
          </ul>
        `,
        image: defaultImage,
        seoTitle: `${item.name} | GlobalWebify`,
        heroDescription: `Get dynamic, high-performance ${item.name} services tailored for growth.`,
        seoDescription: `Professional ${item.name} services to grow your business.`,
        isActive: true
      }
    });
    console.log(`Created page for ${item.name} (${slug})`);
  }
}

seed()
  .then(() => {
    console.log("CRM pages successfully seeded!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
