import { send, fail } from "./_notion.js"
import { loadDirectory } from "./_directory.js"

export default async function handler(req, res) {
  try {
    send(res, await loadDirectory())
  } catch (e) {
    fail(res, e)
  }
}
