import { useLang } from "../../i18n/LanguageContext.jsx"

// A slow scrolling strip of words. The second copy is hidden from screen readers.
export default function Marquee() {
  const { t } = useLang()
  const list = t.marquee
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((n) => (
          <div className="marquee__set" key={n}>
            {list.map((w) => <span className="marquee__item" key={`${n}-${w}`}>{w}</span>)}
          </div>
        ))}
      </div>
    </div>
  )
}
