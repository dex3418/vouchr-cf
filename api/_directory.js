import { DB, queryPublished, getText, getSelect, getNames, getCheck, getUrl, getFile } from "./_notion.js"
import { slugify } from "../src/data/slug.js"

// Notion property names the directory database should have (create them when you set up the database):
//   Name (title) · Slug (text, optional override) · Platform Type (select: Skill Learning, Job Recruitment, Business)
//   Provider (select: Government, Private, NGO) · District (select: Dantewada, Sukma, Bijapur) · Location (text: block or town)
//   Qualification (multi-select: Below 10th, 10th, 12th, Graduate, Post graduate) · Subject (multi-select)
//   Fee Structure (select or multi-select: Free, Paid, Subsidised, Free with stipend)
//   Verified (checkbox) · Logo (files) · Description (text) · Apply Link (url) · Published (checkbox)

// Turns Notion rows into listings. Slugs are made from the name and district unless the Slug property is filled in.
// Rows must arrive in a stable order (oldest first) so a repeated name always gets the same -2, -3 suffix.
export function buildListings(rows) {
  const used = new Set()
  const list = rows.map((r) => {
    const p = r.properties
    const name = getText(p.Name).trim()
    const district = getSelect(p.District)
    const custom = slugify(getText(p.Slug))
    const nameSlug = slugify(name)
    const districtSlug = slugify(district)
    const auto = nameSlug && districtSlug && !nameSlug.includes(districtSlug) ? `${nameSlug}-${districtSlug}` : nameSlug
    let base = custom || auto || `listing-${r.id.replace(/-/g, "").slice(0, 8)}`
    let slug = base
    for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`
    used.add(slug)
    return {
      id: r.id,
      slug,
      name,
      type: getSelect(p["Platform Type"]),
      provider: getSelect(p.Provider),
      district,
      location: getText(p.Location).trim(),
      qualification: getNames(p.Qualification),
      subject: getNames(p.Subject),
      fee: getNames(p["Fee Structure"]),
      verified: getCheck(p.Verified),
      logo: getFile(p.Logo),
      description: getText(p.Description).trim(),
      applyUrl: getUrl(p["Apply Link"]),
      updated: r.last_edited_time || "",
    }
  })
  // Verified first, then A to Z.
  return list.sort((a, b) => Number(b.verified) - Number(a.verified) || a.name.localeCompare(b.name))
}

export async function loadDirectory() {
  if (!DB.directory) return []
  const rows = await queryPublished(DB.directory, [{ timestamp: "created_time", direction: "ascending" }])
  return buildListings(rows)
}
