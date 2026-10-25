import { send, fail } from "./_notion.js"
import { loadDirectory } from "./_directory.js"

export default async function handler(req, res) {
  try {
    const slug = String(req.query.slug || "")
    const item = (await loadDirectory()).find((x) => x.slug === slug)
    if (!item) return res.status(404).json({ error: "Not found" })
    send(res, item)
  } catch (e) {
    fail(res, e)
  }
}
