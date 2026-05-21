import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const pages = await db.servicePage.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        isActive: true,
        content: true,
      }
    });

    const pageSummaries = pages.map(p => {
      const match = p.content?.match(/<!-- FAQ_DATA: (.*?) -->/);
      let parsedFaqs = null;
      if (match) {
        try {
          parsedFaqs = JSON.parse(match[1]);
        } catch (e: any) {
          parsedFaqs = `Error parsing JSON: ${e.message}`;
        }
      }
      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        category: p.category,
        isActive: p.isActive,
        hasFaqComment: !!match,
        faqCommentRaw: match ? match[1] : null,
        faqCommentParsed: parsedFaqs,
        contentPreview: p.content ? p.content.substring(0, 100) + '...' : null,
      };
    });

    return NextResponse.json({
      success: true,
      totalCount: pages.length,
      pages: pageSummaries,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Database query failed',
    }, { status: 500 });
  }
}
