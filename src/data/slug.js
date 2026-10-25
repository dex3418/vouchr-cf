// Makes a URL slug from a name. Plain letters, digits and hyphens only.
// Devanagari and other non-Latin text is dropped, so names that are only Hindi come out empty (the caller adds a fallback).
export function slugify(text = "") {
  return String(text)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "")
}
