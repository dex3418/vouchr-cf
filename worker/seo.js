// Live /robots.txt for Vouchr. /sitemap.xml already comes from api/sitemap.js.
export async function seoResponse(url, env) {
  if (url.pathname !== "/robots.txt") return null
  const site = (env.SITE_URL || url.origin).replace(/\/$/, "")
  return new Response(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site}/sitemap.xml\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  })
}
