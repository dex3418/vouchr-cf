import { useLang } from "../../i18n/LanguageContext.jsx"
import { FORMS } from "../../data/links.js"
import WhatsAppButton from "../ui/WhatsAppButton.jsx"
import HeroMaps from "./HeroMaps.jsx"

const out = { target: "_blank", rel: "noopener noreferrer" }

export default function Hero() {
  const { t } = useLang()
  const h = t.hero
  return (
    <section className="hero">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="pill">{h.label}</p>
          <h1 className="hero__title">
            {h.lines[0]}<br />
            <span className="hero__accent">{h.lines[1]}</span><br />
            <span className="hero__mark">{h.lines[2]}</span>
          </h1>
          <p className="hero__sub">{h.sub}</p>
          <div className="hero__actions">
            <a className="btn btn--light-m" href={FORMS.jobSeeker} {...out}>{h.job}</a>
            <a className="btn btn--light-b" href={FORMS.skillLearner} {...out}>{h.skill}</a>
            <a className="btn btn--line" href={FORMS.platformHero} {...out}>{h.platform}</a>
            <WhatsAppButton label={h.whatsapp} className="btn btn--green" />
          </div>
          <p className="hero__note">{h.note}</p>
        </div>
        <div className="hero__media">
          <HeroMaps />
        </div>
      </div>
    </section>
  )
}
