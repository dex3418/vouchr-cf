// Shared Notion reader. Files starting with _ are not exposed as endpoints by Vercel.
const VERSION = "2022-06-28"

export const DB = {
  articles: "42a6bb268e244e7ab18af5ebf4175c0c",
  directory: "a2e3140c-caeb-49f6-8a1e-698ed1e5e1a4",
}

async function call(path, method, body) {
  const token = process.env.NOTION_TOKEN
  if (!token) throw new Error("NOTION_TOKEN is not set")
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Notion-Version": VERSION, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`Notion ${res.status}: ${await res.text()}`)
  return res.json()
}

// Only rows with Published ticked. Optional extra filter, e.g. a slug match.
export async function queryPublished(dbId, sorts = [{ property: "Order", direction: "ascending" }], extra) {
  const published = { property: "Published", checkbox: { equals: true } }
  const filter = extra ? { and: [published, extra] } : published
  let results = []
  let cursor
  do {
    const data = await call(`/databases/${dbId}/query`, "POST", {
      filter,
      ...(sorts && sorts.length ? { sorts } : {}),
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    })
    results = results.concat(data.results)
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)
  return results
}

export async function getBlocks(pageId) {
  let blocks = []
  let cursor
  do {
    const data = await call(`/blocks/${pageId}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ""}`, "GET")
    blocks = blocks.concat(data.results)
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)
  return blocks
}

export const getText = (p) => (p?.title || p?.rich_text || []).map((t) => t.plain_text).join("")
export const getUrl = (p) => p?.url || ""
export const getSelect = (p) => p?.select?.name || ""
export const getDate = (p) => p?.date?.start || ""
// Works for both select and multi-select properties: always returns a list of option names.
export const getNames = (p) => (p?.multi_select || (p?.select ? [p.select] : [])).map((o) => o.name)
export const getCheck = (p) => p?.checkbox === true
export const getRelationIds = (p) => (p?.relation || []).map((r) => r.id)
export const getFile = (p) => {
  const f = p?.files?.[0]
  return f ? f.file?.url || f.external?.url || "" : ""
}

// Notion edits show up within about a minute or two. Notion file links expire after about an hour, so keep the cache well under that.
export function send(res, data) {
  res.setHeader("X-Robots-Tag", "noindex")
  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=30")
  res.status(200).json(data)
}

export function fail(res, err) {
  res.setHeader("X-Robots-Tag", "noindex")
  console.error(err)
  res.status(500).json({ error: "Could not load content" })
}

// Builds a simple list endpoint: published rows mapped to plain objects.
export function listEndpoint(dbId, map, sorts) {
  return async function handler(req, res) {
    try {
      const rows = await queryPublished(dbId, sorts)
      send(res, rows.map((r) => ({ id: r.id, ...map(r.properties) })))
    } catch (e) {
      fail(res, e)
    }
  }
}
