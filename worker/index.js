// Cloudflare Worker entry for Vouchr.
// Static files and the React app are served by the assets binding (ASSETS).
// The Worker only handles the API, the live sitemap and the server-rendered article/directory previews.
// The handlers in /api were written for Vercel (req, res), so a tiny shim adapts them.
import article from "../api/article.js"
import articles from "../api/articles.js"
import directory from "../api/directory.js"
import listing from "../api/listing.js"
import page from "../api/page.js"
import sitemap from "../api/sitemap.js"

const ROUTES = { article, articles, directory, listing, page, sitemap }

function run(handler, request, query) {
  return new Promise((resolve) => {
    const headers = new Headers()
    let status = 200
    const done = (body) => resolve(new Response(body, { status, headers }))
    const res = {
      setHeader: (k, v) => headers.set(k, v),
      status(code) {
        status = code
        return res
      },
      json(data) {
        headers.set("Content-Type", "application/json")
        done(JSON.stringify(data))
      },
      send(body) {
        done(body)
      },
      redirect(code, location) {
        status = code
        headers.set("Location", location)
        done(null)
      },
    }
    const req = { query, headers: Object.fromEntries(request.headers) }
    Promise.resolve(handler(req, res)).catch((e) => {
      console.error(e)
      status = 500
      res.json({ error: "Could not load content" })
    })
  })
}

// The React app's index.html. "/" is fetched, not "/index.html", because the assets binding redirects the latter.
const serveIndex = (env, url, request) =>
  env.ASSETS.fetch(new Request(`${url.origin}/`, { headers: request.headers }))

export default {
  async fetch(request, env) {
    // Secrets also reach process.env (nodejs_compat), which api/_notion.js reads.
    if (env?.NOTION_TOKEN && !process.env.NOTION_TOKEN) process.env.NOTION_TOKEN = env.NOTION_TOKEN
    if (env?.SITE_URL && !process.env.SITE_URL) process.env.SITE_URL = env.SITE_URL
    // api/page.js reads the site's own index.html through this instead of fetching its own address.
    globalThis.__ASSETS = env.ASSETS

    const url = new URL(request.url)
    const path = url.pathname.replace(/(.)\/$/, "$1")
    const query = Object.fromEntries(url.searchParams)

    if (path === "/sitemap.xml") return run(sitemap, request, query)

    if (path.startsWith("/api/")) {
      const handler = ROUTES[path.slice(5)]
      if (handler) return run(handler, request, query)
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } })
    }

    // Pages with server-rendered previews. ?raw=1 skips this and serves the plain app (the fallback if rendering fails).
    if (request.method === "GET" && !url.searchParams.has("raw")) {
      let m
      if (path === "/articles") return run(page, request, { kind: "articles" })
      if (path === "/directory") return run(page, request, { kind: "directory" })
      if ((m = path.match(/^\/articles\/([^/]+)$/))) return run(page, request, { kind: "article", slug: decodeURIComponent(m[1]) })
      if ((m = path.match(/^\/directory\/([^/]+)$/))) return run(page, request, { kind: "listing", slug: decodeURIComponent(m[1]) })
    }
    return serveIndex(env, url, request)
  },
}
