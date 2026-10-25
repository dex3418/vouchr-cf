export function fullDate(iso, lang) {
  if (!iso) return ""
  return new Date(iso).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "long", year: "numeric" })
}
