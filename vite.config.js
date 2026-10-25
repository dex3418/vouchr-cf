import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// SITE_URL (build env var) is the site's public address, used in meta tags and robots.txt.
const siteUrl = () => (process.env.SITE_URL || "").replace(/\/$/, "")

// Fills __SITE_URL__ in index.html and writes robots.txt at build time.
// /api/ is deliberately NOT blocked: Google must load the listings and articles from it to render pages. API answers send X-Robots-Tag: noindex instead.
// The sitemap is not built here: /sitemap.xml is served live by api/sitemap.js so new content appears without a redeploy.
function seoFiles() {
  return {
    name: "seo-files",
    transformIndexHtml: { order: "pre", handler: (html) => html.replaceAll("__SITE_URL__", siteUrl()) },
    generateBundle() {
      const site = siteUrl()
      this.emitFile({ type: "asset", fileName: "robots.txt", source: `User-agent: *\nAllow: /\n${site ? `\nSitemap: ${site}/sitemap.xml\n` : ""}` })
    },
  }
}

export default defineConfig({ plugins: [react(), seoFiles()] })
