import { useLang } from "../../i18n/LanguageContext.jsx"

export default function LanguageToggle() {
  const { lang, setLang } = useLang()
  return (
    <div className="lang" role="group" aria-label="Language">
      <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")}>EN</button>
      <button type="button" aria-pressed={lang === "hi"} onClick={() => setLang("hi")} lang="hi">हिंदी</button>
    </div>
  )
}
