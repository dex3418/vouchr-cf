import { DB, queryPublished, getBlocks, getText, getSelect, getDate, getFile, send, fail } from "./_notion.js"

const CODE = { Hindi: "hi", English: "en" }

const rich = (arr = []) =>
  arr.map((r) => ({ t: r.plain_text, b: r.annotations.bold, i: r.annotations.italic, c: r.annotations.code, href: r.href }))

function simplify(b) {
  const d = b[b.type]
  switch (b.type) {
    case "paragraph":
    case "heading_1":
    case "heading_2":
    case "heading_3":
    case "bulleted_list_item":
    case "numbered_list_item":
    case "quote":
    case "callout":
      return { type: b.type, text: rich(d.rich_text) }
    case "code":
      return { type: "code", text: d.rich_text.map((r) => r.plain_text).join("") }
    case "image":
      return { type: "image", url: d.file?.url || d.external?.url || "", caption: d.caption.map((r) => r.plain_text).join("") }
    case "divider":
      return { type: "divider" }
    default:
      return null
  }
}

export default async function handler(req, res) {
  try {
    const slug = String(req.query.slug || "")
    const rows = await queryPublished(DB.articles, [], { property: "Slug", rich_text: { equals: slug } })
    if (!rows[0]) return res.status(404).json({ error: "Not found" })
    const page = rows[0]
    const blocks = (await getBlocks(page.id)).map(simplify).filter(Boolean)
    const p = page.properties
    send(res, {
      title: getText(p.Title),
      language: CODE[getSelect(p.Language)] || "en",
      summary: getText(p.Summary),
      category: getSelect(p.Category),
      date: getDate(p.Date),
      cover: getFile(p["Cover Image"]),
      blocks,
    })
  } catch (e) {
    fail(res, e)
  }
}
