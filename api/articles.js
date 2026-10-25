import { DB, listEndpoint, getText, getSelect, getDate, getFile } from "./_notion.js"

// Notion language names become short codes the site uses: Hindi = hi, English = en.
const CODE = { Hindi: "hi", English: "en" }

export default listEndpoint(
  DB.articles,
  (p) => ({
    title: getText(p.Title),
    slug: getText(p.Slug),
    language: CODE[getSelect(p.Language)] || "en",
    summary: getText(p.Summary),
    category: getSelect(p.Category),
    cover: getFile(p["Cover Image"]),
    date: getDate(p.Date),
  }),
  [{ property: "Date", direction: "descending" }]
)
