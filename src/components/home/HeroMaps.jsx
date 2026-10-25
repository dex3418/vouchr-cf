import { useLang } from "../../i18n/LanguageContext.jsx"
import { heroMaps } from "../../data/maps.js"

// Three map posters fanned out like cards, Dantewada in front.
export default function HeroMaps() {
  const { lang } = useLang()
  return (
    <div className="fan">
      {heroMaps.map((m) => (
        <img
          key={m.key}
          className={`fan__card fan__card--${m.key}`}
          src={m.src}
          alt={m.alt[lang]}
          width="520"
          height="736"
          loading={m.key === "mid" ? "eager" : "lazy"}
        />
      ))}
    </div>
  )
}
