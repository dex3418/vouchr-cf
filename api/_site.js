// The public address of the site, used for canonical links, previews and the sitemap.
// SITE_URL (optional, for a custom domain) wins. On Vercel the production domain is used. Last resort: the host that made the request.
export function siteUrl(req) {
  const env = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "")
  const host = req.headers["x-forwarded-host"] || req.headers.host
  return (env || (host ? `https://${host}` : "")).replace(/\/$/, "")
}

// The address this request came in on. Used to read this deployment's own index.html.
export function originOf(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host
  return `https://${host}`
}
