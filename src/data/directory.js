// Values the directory filters understand, with English and Hindi labels.
// Notion option names are matched ignoring case and spacing. A value that is not listed here still works:
// it shows its Notion name in both languages.
export const norm = (s) => String(s || "").trim().toLowerCase().replace(/\s+/g, " ")

export const DISTRICTS = [
  { key: "dantewada", en: "Dantewada", hi: "दंतेवाड़ा" },
  { key: "sukma", en: "Sukma", hi: "सुकमा" },
  { key: "bijapur", en: "Bijapur", hi: "बीजापुर" },
]
export const QUALS = [
  { key: "below 10th", en: "Below 10th", hi: "10वीं से कम" },
  { key: "10th", en: "10th", hi: "10वीं" },
  { key: "12th", en: "12th", hi: "12वीं" },
  { key: "graduate", en: "Graduate", hi: "स्नातक" },
  { key: "post graduate", en: "Post graduate", hi: "स्नातकोत्तर" },
]
export const FEES = [
  { key: "free", en: "Free", hi: "निःशुल्क" },
  { key: "paid", en: "Paid", hi: "सशुल्क" },
  { key: "subsidised", en: "Subsidised", hi: "रियायती" },
  { key: "free with stipend", en: "Free with stipend", hi: "निःशुल्क और वजीफ़ा" },
]
export const PROVIDERS = [
  { key: "government", en: "Government", hi: "सरकारी" },
  { key: "private", en: "Private", hi: "निजी" },
  { key: "ngo", en: "NGO", hi: "गैर-सरकारी संस्था (NGO)" },
]
// code is the Vouchr platform code; a verified listing gets a V in front (VSLP, VJR, VB).
export const TYPES = [
  { key: "skill learning", code: "SLP", en: "Skill learning", hi: "हुनर सीखने का मंच" },
  { key: "job recruitment", code: "JR", en: "Job recruitment", hi: "नौकरी भर्ती" },
  { key: "business", code: "B", en: "Business", hi: "कारोबार" },
]

const find = (list, value) => list.find((x) => x.key === norm(value))
export const label = (list, value, lang) => {
  const hit = find(list, value)
  return hit ? hit[lang] : value
}
export const typeCode = (type, verified) => {
  const code = find(TYPES, type)?.code
  return code ? (verified ? "V" : "") + code : ""
}

// The filter groups: which URL parameter, how to read a listing, and the known values in display order.
export const GROUPS = [
  { id: "district", param: "district", known: DISTRICTS, read: (l) => [l.district] },
  { id: "qual", param: "qual", known: QUALS, read: (l) => l.qualification },
  { id: "type", param: "type", known: TYPES, read: (l) => [l.type] },
  { id: "subject", param: "subject", known: [], read: (l) => l.subject },
  { id: "fee", param: "fee", known: FEES, read: (l) => l.fee },
  { id: "provider", param: "provider", known: PROVIDERS, read: (l) => [l.provider] },
]

// Options for one group, taken from the listings that exist. Known values come first, in order.
export function optionsFor(group, listings) {
  const seen = new Map()
  for (const l of listings) for (const v of group.read(l)) if (v && !seen.has(norm(v))) seen.set(norm(v), v)
  const known = group.known.filter((k) => seen.has(k.key)).map((k) => ({ key: k.key, en: k.en, hi: k.hi }))
  const extra = [...seen].filter(([k]) => !group.known.some((x) => x.key === k)).sort((a, b) => a[1].localeCompare(b[1])).map(([k, v]) => ({ key: k, en: v, hi: v }))
  return [...known, ...extra]
}

// selected: { district: ["sukma"], fee: ["free"], ... }. Inside a group any match is enough; every group with a choice must match.
export function applyFilters(listings, selected) {
  return listings.filter((l) =>
    GROUPS.every((g) => {
      const want = selected[g.id] || []
      if (!want.length) return true
      const have = g.read(l).map(norm)
      return want.some((w) => have.includes(w))
    })
  )
}

export const readSelected = (params) =>
  Object.fromEntries(GROUPS.map((g) => [g.id, (params.get(g.param) || "").split(",").map(norm).filter(Boolean)]))
