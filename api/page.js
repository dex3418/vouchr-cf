import { DB, queryPublished, getBlocks, getText, getSelect, getDate } from "./_notion.js"
import { loadDirectory } from "./_directory.js"
import { renderHead, withContent, blocksToHtml, esc } from "./_page.js"
import { siteUrl, originOf } from "./_site.js"

// Serves the site's index.html with the right title, description, preview tags and real page text for article and directory pages.
// The React app then loads and replaces the text, exactly as before. If anything here fails, the visitor is sent to the plain page (?raw=1), so pages never break.
const DEFAULT_DESC = "Vouchr connects job seekers, skill learners and local businesses in Dantewada, Sukma and Bijapur (Bastar, Chhattisgarh). Register with a short form."
const CODE = { Hindi: "hi", English: "en" }
const full = (t) => (t ? `${t} | Vouchr` : "Vouchr | Local jobs and skills in Dantewada, Sukma and Bijapur")

// Cuts at a whole word, so previews do not end mid-word.
function clip(text, max = 155) {
  const t = String(text).replace(/\s+/g, " ").trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  return cut.slice(0, Math.max(cut.lastIndexOf(" "), 60)).replace(/[,;:\s]+$/, "") + "…"
}

const page = (inner, lang) => `<main class="section"${lang ? ` lang="${lang}"` : ""}><div class="container article">${inner}</div></main>`

const LISTS = {
  articles: { path: "/articles", title: "Guides and articles", description: "Practical guides on jobs, skills and local business in Dantewada, Sukma and Bijapur, from Vouchr." },
  directory: { path: "/directory", title: "Directory", description: "Skill training, job and business listings in Dantewada, Sukma and Bijapur. Filter by district, qualification, subject and fee." },
}

async function articleList() {
  const rows = await queryPublished(DB.articles, [{ property: "Date", direction: "descending" }])
  const items = rows
    .map((r) => ({ title: getText(r.properties.Title), slug: getText(r.properties.Slug), summary: getText(r.properties.Summary), lang: CODE[getSelect(r.properties.Language)] || "en" }))
    .filter((a) => a.title && a.slug)
    .map((a) => `<li lang="${a.lang}"><h2><a href="/articles/${encodeURIComponent(a.slug)}">${esc(a.title)}</a></h2>${a.summary ? `<p>${esc(a.summary)}</p>` : ""}</li>`)
  return page(`<h1 class="article__title">${esc(LISTS.articles.title)}</h1><p>${esc(LISTS.articles.description)}</p><ul>${items.join("")}</ul>`)
}

async function directoryList() {
  const items = (await loadDirectory()).map((l) => {
    const place = [l.location, l.district].filter(Boolean).join(", ")
    const facts = [l.provider, ...l.fee, ...l.subject].filter(Boolean).join(" · ")
    return `<li><h2><a href="/directory/${encodeURIComponent(l.slug)}">${esc(l.name)}</a></h2>${place ? `<p>${esc(place)}</p>` : ""}${facts ? `<p>${esc(facts)}</p>` : ""}</li>`
  })
  return page(`<h1 class="article__title">${esc(LISTS.directory.title)}</h1><p>${esc(LISTS.directory.description)}</p><ul>${items.join("")}</ul>`)
}

async function articleMeta(slug, site) {
  const rows = await queryPublished(DB.articles, [], { property: "Slug", rich_text: { equals: slug } })
  if (!rows[0]) return null
  const p = rows[0].properties
  const title = getText(p.Title)
  const language = CODE[getSelect(p.Language)] || "en"
  const summary = getText(p.Summary)
  const blocks = await getBlocks(rows[0].id)
  const first = blocks.find((b) => b.type === "paragraph" && b.paragraph.rich_text.length)
  const firstText = first ? first.paragraph.rich_text.map((r) => r.plain_text).join("") : ""
  return {
    meta: {
      title: full(title),
      description: clip(summary || firstText) || DEFAULT_DESC,
      url: `${site}/articles/${encodeURIComponent(slug)}`,
      type: "article",
      locale: language === "hi" ? "hi_IN" : "en_IN",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        datePublished: getDate(p.Date) || undefined,
        inLanguage: language === "hi" ? "hi" : "en-IN",
        author: { "@type": "Organization", name: "Vouchr" },
        publisher: { "@type": "Organization", name: "Vouchr" },
        articleSection: getSelect(p.Category) || undefined,
      },
    },
    content: page(`<h1 class="article__title">${esc(title)}</h1>${summary ? `<p>${esc(summary)}</p>` : ""}<div class="prose">${blocksToHtml(blocks)}</div>`, language),
  }
}

async function listingMeta(slug, site) {
  const item = (await loadDirectory()).find((x) => x.slug === slug)
  if (!item) return null
  const place = item.location || item.district
  const facts = [
    ["Provided by", item.provider],
    ["District", item.district],
    ["Location", item.location],
    ["Platform type", item.type],
    ["Qualification", item.qualification.join(", ")],
    ["Subject", item.subject.join(", ")],
    ["Fee", item.fee.join(", ")],
  ].filter(([, v]) => v)
  const paragraphs = item.description.split(/\n+/).filter(Boolean).map((t) => `<p>${esc(t)}</p>`).join("")
  return {
    meta: {
      title: full(item.name),
      description: clip(`${item.name}${place ? ` in ${place}` : ""}. ${item.description}`),
      url: `${site}/directory/${encodeURIComponent(slug)}`,
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: item.name,
        description: item.description || undefined,
        areaServed: item.district ? `${item.district}, Chhattisgarh, India` : undefined,
        address: place ? { "@type": "PostalAddress", addressLocality: place, addressRegion: "Chhattisgarh", addressCountry: "IN" } : undefined,
      },
    },
    content: page(`<h1 class="article__title">${esc(item.name)}</h1>${paragraphs}<ul>${facts.map(([k, v]) => `<li><strong>${esc(k)}:</strong> ${esc(v)}</li>`).join("")}</ul>`),
  }
}

const fallbackPath = (kind, slug) =>
  kind === "article" ? `/articles/${encodeURIComponent(slug)}` : kind === "listing" ? `/directory/${encodeURIComponent(slug)}` : LISTS[kind]?.path || "/"

export default async function handler(req, res) {
  const kind = String(req.query.kind || "")
  const slug = String(req.query.slug || "")
  try {
    const site = siteUrl(req)
    // On Cloudflare the Worker reads its own index.html from the assets binding; on Vercel it fetches it.
    const base = globalThis.__ASSETS ? await globalThis.__ASSETS.fetch(new Request(`${originOf(req)}/`)) : await fetch(`${originOf(req)}/index.html`)
    if (!base.ok) throw new Error(`index.html ${base.status}`)
    const html = await base.text()

    let result = null
    if (kind === "article") result = await articleMeta(slug, site)
    else if (kind === "listing") result = await listingMeta(slug, site)
    else if (LISTS[kind]) {
      const content = kind === "articles" ? await articleList() : await directoryList()
      result = { meta: { title: full(LISTS[kind].title), description: LISTS[kind].description, url: site + LISTS[kind].path, type: "website" }, content }
    } else throw new Error(`unknown kind ${kind}`)

    const found = Boolean(result)
    if (!result) result = { meta: { title: full("Not found"), description: DEFAULT_DESC, url: site + fallbackPath(kind, slug), noindex: true }, content: "" }
    result.meta.image = `${site}/og.png`

    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=60")
    res.status(found ? 200 : 404).send(withContent(renderHead(html, result.meta), result.content))
  } catch (e) {
    console.error(e)
    res.redirect(307, `${fallbackPath(kind, slug)}?raw=1`)
  }
}
