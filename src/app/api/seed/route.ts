import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogPosts as staticBlogPosts } from '@/data/posts';
import { WEBSITE_SERVICES, CRM_SERVICES, SEO_SERVICES, HOSTING_SERVICES, MARKETING_SERVICES, BRANDING_SERVICES } from '@/constants/navigation';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function copyFolderRecursiveSync(source: string, target: string) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  for (const file of files) {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);

    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursiveSync(curSource, curTarget);
    } else {
      if (file === 'layout.tsx') continue; // Skip layout to avoid layout duplicates
      fs.copyFileSync(curSource, curTarget);
    }
  }
}

function deleteFolderRecursiveSync(source: string) {
  if (fs.existsSync(source)) {
    const files = fs.readdirSync(source);
    for (const file of files) {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        deleteFolderRecursiveSync(curSource);
      } else {
        try {
          fs.unlinkSync(curSource);
        } catch (e) {
          console.error(`Failed to delete file: ${curSource}`, e);
        }
      }
    }
    try {
      fs.rmdirSync(source);
    } catch (e) {
      console.error(`Failed to delete dir: ${source}`, e);
    }
  }
}

async function handleSeed(clean: boolean) {
  try {
    let seededBlogs = 0;
    let seededServices = 0;
    let removedDirsCount = 0;

    // Relocate services under (dashboard)
    const srcServices = path.join(process.cwd(), 'src', 'app', 'admin', 'services');
    const destServices = path.join(process.cwd(), 'src', 'app', 'admin', '(dashboard)', 'services');
    if (fs.existsSync(srcServices) && srcServices !== destServices) {
      copyFolderRecursiveSync(srcServices, destServices);
      deleteFolderRecursiveSync(srcServices);
    }

    // Relocate blogs under (dashboard)
    const srcBlogs = path.join(process.cwd(), 'src', 'app', 'admin', 'blogs');
    const destBlogs = path.join(process.cwd(), 'src', 'app', 'admin', '(dashboard)', 'blogs');
    if (fs.existsSync(srcBlogs) && srcBlogs !== destBlogs) {
      copyFolderRecursiveSync(srcBlogs, destBlogs);
      deleteFolderRecursiveSync(srcBlogs);
    }

    if (clean) {
      // Clean the database first for a guaranteed fresh start
      await db.servicePage.deleteMany({});
      await db.blogPost.deleteMany({});
    } else {
      // 1. Perform rename of dedicated servers to dedicated hosting
      const dedicatedServersSlugs = ['/dedicated-servers', 'dedicated-servers'];
      const existingDedicated = await db.servicePage.findFirst({
        where: { slug: { in: dedicatedServersSlugs } }
      });
      if (existingDedicated) {
        await db.servicePage.update({
          where: { id: existingDedicated.id },
          data: {
            slug: '/dedicated-hosting',
            title: 'Dedicated Hosting',
            seoTitle: 'Dedicated Hosting | GlobalWebify',
            contentTitle: 'Professional Dedicated Hosting Services',
            heroDescription: 'Get dynamic, high-performance Dedicated Hosting services tailored for growth.',
            seoDescription: 'Professional Dedicated Hosting services to grow your business.'
          }
        });
      }

      // 2. Delete removed pages
      const slugsToDelete = [
        '/domain-registration', 'domain-registration',
        '/domain-transfer', 'domain-transfer',
        '/business-email', 'business-email'
      ];
      await db.servicePage.deleteMany({
        where: { slug: { in: slugsToDelete } }
      });
    }

    // Seed static blogs
    const blogCount = await db.blogPost.count();
    if (clean || blogCount === 0) {
      for (const staticPost of staticBlogPosts) {
        // Build raw HTML content from richContent sections
        let contentHtml = '';
        for (const sec of staticPost.richContent) {
          if (sec.type === 'p') {
            contentHtml += `<p className="text-gray-600 text-[14px] md:text-[15px] leading-relaxed mb-6 font-semibold">${sec.text}</p>`;
          } else if (sec.type === 'h2') {
            contentHtml += `<h2 className="text-[19px] md:text-[21px] font-black text-[#1a8b4c] uppercase tracking-wider mt-10 mb-4 border-b border-gray-100 pb-2.5 scroll-mt-24">${sec.text}</h2>`;
          } else if (sec.type === 'h3') {
            contentHtml += `<h3 className="text-[15px] md:text-[16px] font-black text-gray-950 mt-8 mb-3.5 tracking-tight">${sec.text}</h3>`;
          } else if (sec.type === 'ul') {
            contentHtml += '<ul className="pl-2 mb-6 space-y-3 flex flex-col">';
            for (const item of sec.items || []) {
              contentHtml += `<li className="text-gray-600 text-[14px] md:text-[14.5px] font-semibold flex items-start gap-2.5 hover:text-[#1a8b4c] transition-colors leading-relaxed"><span>${item}</span></li>`;
            }
            contentHtml += '</ul>';
          }
        }

        const exists = await db.blogPost.findUnique({ where: { slug: staticPost.slug } });
        if (!exists) {
          await db.blogPost.create({
            data: {
              title: staticPost.title,
              slug: staticPost.slug,
              summary: staticPost.excerpt,
              content: contentHtml,
              image: staticPost.image,
              isActive: true,
              seoTitle: staticPost.title,
              seoDescription: staticPost.excerpt,
            },
          });
          seededBlogs++;
        }
      }
    }

    // Dynamically seed/update all submenu services from navigation constants
    const createServicePage = async (title: string, slug: string, category: string) => {
      // Validate slug and prevent duplicates
      if (!slug || slug === '/' || slug.startsWith('http')) return;

      const cleanSlug = slug.startsWith('/') ? slug.slice(1) : slug;
      const slugsToCheck = [`/${cleanSlug}`, cleanSlug];

      const exists = await db.servicePage.findFirst({
        where: { slug: { in: slugsToCheck } }
      });

      if (exists) {
        if (exists.category !== category) {
          await db.servicePage.update({
            where: { id: exists.id },
            data: { category }
          });
        }
        return; // Already exists, keep category updated and keep user edits
      }

      // Select default images based on category
      let defaultImage = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
      if (category === 'website') {
        defaultImage = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80';
      } else if (category === 'crm') {
        defaultImage = 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80';
      } else if (category === 'seo') {
        defaultImage = 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=800&q=80';
      } else if (category === 'marketing') {
        defaultImage = 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=800&q=80';
      } else if (category === 'branding') {
        defaultImage = 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80';
      } else if (category === 'hosting') {
        defaultImage = 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80';
      }

      await db.servicePage.create({
        data: {
          title,
          slug: slug.startsWith('/') ? slug : `/${slug}`,
          category,
          content: `
            <h2>Professional ${title} Services</h2>
            <p>Welcome to our ${title} page. We deliver premium solutions designed to help your brand grow and outperform competition.</p>
            <h3>Why Partner With Us:</h3>
            <ul class="pl-4 list-disc space-y-2 mt-4">
              <li>Engineered by industry leading specialists</li>
              <li>Fully data-driven and results-oriented strategy</li>
              <li>Continuous performance audits and standard reporting</li>
            </ul>
          `,
          image: defaultImage,
          seoTitle: `${title} | GlobalWebify`,
          heroDescription: `Get dynamic, high-performance ${title} services tailored for growth.`,
          seoDescription: `Professional ${title} services to grow your business.`,
          isActive: true
        }
      });
      seededServices++;
    };

    // Seed website services
    for (const item of WEBSITE_SERVICES) {
      await createServicePage(item.name, item.href, 'website');
    }

    // Seed CRM services
    for (const item of CRM_SERVICES) {
      await createServicePage(item.name, item.href, 'crm');
    }

    // Seed hosting services
    for (const item of HOSTING_SERVICES) {
      await createServicePage(item.name, item.href, 'hosting');
    }

    // Seed SEO services
    for (const item of SEO_SERVICES) {
      if (item.subLinks && item.subLinks.length > 0) {
        for (const sub of item.subLinks) {
          await createServicePage(sub.name, sub.href, 'seo');
        }
      } else {
        await createServicePage(item.name, item.href, 'seo');
      }
    }

    // Seed branding services
    for (const item of BRANDING_SERVICES) {
      await createServicePage(item.name, item.href, 'branding');
    }

    // Seed marketing services (which may have nested sublinks)
    for (const item of MARKETING_SERVICES) {
      if (item.subLinks && item.subLinks.length > 0) {
        for (const sub of item.subLinks) {
          await createServicePage(sub.name, sub.href, 'marketing');
        }
      } else {
        await createServicePage(item.name, item.href, 'marketing');
      }
    }

    // 3. Remove redundant static placeholder folders to activate the dynamic fallback route
    const directoriesToRemove = [
      'perplexity-ai-seo-services',
      'instagram-marketing',
      'facebook-marketing',
      'linkedin-marketing',
      'youtube-marketing',
      'on-page-seo',
      'off-page-seo',
      'technical-seo',
      'local-business-seo',
      'generative-engine-optimization-services',
      'answer-engine-optimization-services',
      'chatgpt-ai-seo-services',
      'gemini-ai-seo-services',
      'claude-ai-seo-services',
      'agentic-ai-seo-services',
      'ai-powered-content-creation-services',
      'google-ads-management'
    ];

    for (const dir of directoriesToRemove) {
      const dirPath = path.join(process.cwd(), 'src', 'app', dir);
      if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
        removedDirsCount++;
      }
    }

    // 4. Remove duplicate root admin page.tsx to resolve route conflicts
    const oldAdminPage = path.join(process.cwd(), 'src', 'app', 'admin', 'page.tsx');
    if (fs.existsSync(oldAdminPage)) {
      fs.unlinkSync(oldAdminPage);
    }

    return NextResponse.json({
      success: true,
      message: `Database successfully seeded/updated and static directories cleaned up.`,
      seededBlogs,
      seededServices,
      removedDirs: removedDirsCount,
    });
  } catch (error: any) {
    console.error('Seeding Error:', error);
    return NextResponse.json(
      { success: false, message: 'Seeding failed.', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clean = searchParams.get('clean') === 'true';
  return handleSeed(clean);
}

export async function POST(request: Request) {
  let clean = false;
  try {
    const body = await request.json();
    clean = body?.clean === true;
  } catch (e) {
    try {
      const { searchParams } = new URL(request.url);
      clean = searchParams.get('clean') === 'true';
    } catch (_) {}
  }
  return handleSeed(clean);
}
