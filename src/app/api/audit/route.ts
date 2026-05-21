import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // never cache at Next.js route level — we handle caching ourselves

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Normalise URL
  let targetUrl: string;
  try {
    targetUrl = new URL(/^https?:\/\//i.test(rawUrl) ? rawUrl : "https://" + rawUrl).href;
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const apiKey   = process.env.PAGESPEED_API_KEY ?? "";
  const keyParam = apiKey ? `&key=${apiKey}` : "";

  const endpoint =
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
    `?url=${encodeURIComponent(targetUrl)}` +
    `&strategy=mobile` +
    `&category=performance&category=seo&category=accessibility&category=best-practices` +
    keyParam;

  // Use AbortController + setTimeout instead of AbortSignal.timeout()
  // (AbortSignal.timeout requires Node 17.3+ which isn't guaranteed in all Next 14 envs)
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), 28_000); // 28s max

  try {
    console.log("[audit] Fetching PageSpeed for:", targetUrl);

    const res = await fetch(endpoint, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
      // Prevent Next.js from caching this fetch — each URL scan must be live
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const body = await res.text();
      console.error("[audit] PageSpeed API error:", res.status, body.slice(0, 300));
      return NextResponse.json(
        { error: `PageSpeed API error ${res.status}`, detail: body.slice(0, 300) },
        { status: 502 }
      );
    }

    const data = await res.json();
    const cats = data?.lighthouseResult?.categories;

    if (!cats) {
      console.error("[audit] No categories in response:", JSON.stringify(data).slice(0, 300));
      return NextResponse.json({ error: "No Lighthouse data in response" }, { status: 502 });
    }

    const performance   = Math.round((cats.performance?.score       ?? 0) * 100);
    const seo           = Math.round((cats.seo?.score               ?? 0) * 100);
    const accessibility = Math.round((cats.accessibility?.score     ?? 0) * 100);
    const bestPractices = Math.round((cats["best-practices"]?.score ?? 0) * 100);
    const overall       = Math.round((performance + seo + accessibility + bestPractices) / 4);

    console.log("[audit] Success:", { performance, seo, accessibility, bestPractices, overall });

    return NextResponse.json(
      { success: true, url: targetUrl, scores: { performance, seo, accessibility, bestPractices, overall } },
      {
        status: 200,
        headers: {
          // Cache result for 10 minutes — avoids re-scanning same URL repeatedly
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
        },
      }
    );
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const isTimeout = err instanceof Error && err.name === "AbortError";
    const message   = isTimeout ? "Request timed out (PageSpeed took >28s)" : (err instanceof Error ? err.message : String(err));
    console.error("[audit] Fetch failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
