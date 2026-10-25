import { useLang } from "../../i18n/LanguageContext.jsx"
import { content } from "../../data/content.js"
import { heroPhotos } from "../../data/photos.js"

// Three tiles. With photos they show the photos; without, bold colour tiles with the district names.
const TONES = ["magenta", "green", "blue"]

export default function HeroMosaic() {
  const { lang, t } = useLang()
  const other = content[lang === "en" ? "hi" : "en"].districts.names
  return (
    <div className="mosaic" aria-label={t.districts.title}>
      {t.districts.names.map((name, i) => {
        const photo = heroPhotos[i]
        return (
          <div className={`tile tile--${"abc"[i]} tile--${TONES[i]}`} key={name}>
            {photo && <img className="tile__img" src={photo.src} alt={photo.alt} loading={i === 0 ? "eager" : "lazy"} />}
            <div className={`tile__label ${photo ? "tile__label--photo" : ""}`}>
              <span className="tile__name">{name}</span>
              <span className="tile__alt" aria-hidden="true">{other[i]}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
