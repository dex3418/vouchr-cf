// Live /robots.txt for Vouchr. /api/ is NOT blocked: Google loads listings and articles from it to render pages.
// /sitemap.xml comes from api/sitemap.js.
export async function seoResponse(url, env) {
  if (url.pathname !== "/robots.txt") return null
  const site = (env.SITE_URL || url.origin).replace(/\/$/, "")
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  })
}
