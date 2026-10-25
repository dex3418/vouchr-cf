import { useNotion } from "./useNotion.js"
import { useLang } from "../i18n/LanguageContext.jsx"

// Articles in the language the visitor chose. If there are none in that language yet,
// all articles are shown instead and `fallback` is true so the page can say so.
export function useArticles() {
  const { lang } = useLang()
  const { data, loading, error } = useNotion("/api/articles")
  const all = Array.isArray(data) ? data : []
  const inLang = all.filter((a) => a.language === lang)
  const fallback = all.length > 0 && inLang.length === 0
  return { articles: fallback ? all : inLang, fallback, loading, error, empty: Array.isArray(data) && all.length === 0 }
}
