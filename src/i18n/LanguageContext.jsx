import { createContext, useContext, useEffect, useState } from "react"
import { content } from "../data/content.js"

const KEY = "vouchr-lang"
const Ctx = createContext(null)

// First visit: Hindi if the phone is set to Hindi, otherwise English. The choice is remembered.
function initialLang() {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === "en" || saved === "hi") return saved
  } catch {}
  return typeof navigator !== "undefined" && (navigator.language || "").toLowerCase().startsWith("hi") ? "hi" : "en"
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang === "hi" ? "hi" : "en-IN"
    try { localStorage.setItem(KEY, lang) } catch {}
  }, [lang])

  return <Ctx.Provider value={{ lang, setLang, t: content[lang] }}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)
