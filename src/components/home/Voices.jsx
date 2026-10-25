import SectionHeading from "../ui/SectionHeading.jsx"
import { useLang } from "../../i18n/LanguageContext.jsx"
import { voices } from "../../data/voices.js"

// Hidden until real quotes are added in src/data/voices.js.
export default function Voices() {
  const { lang, t } = useLang()
  if (voices.length === 0) return null
  return (
    <section className="section section--soft">
      <div className="container">
        <SectionHeading label={t.voices.label} title={t.voices.title} />
        <div className="grid3">
          {voices.map((v) => (
            <figure className="voice" key={v.name + v.place}>
              <blockquote>{v[lang] || v.en}</blockquote>
              <figcaption>{v.name}, {v.place}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
