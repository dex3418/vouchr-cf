import SectionHeading from "../ui/SectionHeading.jsx"
import { useLang } from "../../i18n/LanguageContext.jsx"
import { content } from "../../data/content.js"
import { districtPhotos } from "../../data/photos.js"

const TONES = ["magenta", "green", "blue"]

export default function Districts() {
  const { lang, t } = useLang()
  const d = t.districts
  const en = content.en.districts.names
  const other = content[lang === "en" ? "hi" : "en"].districts.names
  return (
    <section className="section">
      <div className="container">
        <SectionHeading centered label={d.label} title={d.title} sub={d.sub} />
        <ul className="dtiles">
          {d.names.map((name, i) => {
            const photo = districtPhotos[en[i]]
            return (
              <li className={`dtile dtile--${TONES[i]}`} key={name}>
                {photo && <img className="dtile__img" src={photo.src} alt={photo.alt} loading="lazy" />}
                <div className={`dtile__label ${photo ? "dtile__label--photo" : ""}`}>
                  <span className="dtile__name">{name}</span>
                  <span className="dtile__alt" aria-hidden="true">{other[i]}</span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
