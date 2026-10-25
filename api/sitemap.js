import { DB, queryPublished, getText } from "./_notion.js"
import { loadDirectory } from "./_directory.js"
import { buildSitemap } from "./_page.js"
import { siteUrl } from "./_site.js"

// A live sitemap: new articles and listings appear here as soon as they are published in Notion.
// If Notion cannot be reached, the fixed pages are still listed.
export default async function handler(req, res) {
  const urls = [{ path: "/" }, { path: "/articles" }, { path: "/privacy" }, { path: "/terms" }]

  try {
    const rows = await queryPublished(DB.articles, [])
    for (const r of rows) {
      const slug = getText(r.properties.Slug)
      if (slug) urls.push({ path: `/articles/${encodeURIComponent(slug)}`, lastmod: r.last_edited_time })
    }
  } catch (e) {
    console.error(e)
  }

  try {
    const listings = await loadDirectory()
    if (listings.length) urls.push({ path: "/directory" })
    for (const l of listings) urls.push({ path: `/directory/${encodeURIComponent(l.slug)}`, lastmod: l.updated })
  } catch (e) {
    console.error(e)
  }

  res.setHeader("Content-Type", "application/xml; charset=utf-8")
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600")
  res.status(200).send(buildSitemap(siteUrl(req), urls))
}
