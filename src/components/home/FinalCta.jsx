import { useLang } from "../../i18n/LanguageContext.jsx"
import { FORMS, CONTACT_EMAIL } from "../../data/links.js"
import WhatsAppButton from "../ui/WhatsAppButton.jsx"

export default function FinalCta() {
  const { t } = useLang()
  const c = t.cta
  const items = t.audiences.items
  const href = { job: FORMS.jobSeeker, skill: FORMS.skillLearner, platform: FORMS.platformSection }
  return (
    <section className="section section--soft">
      <div className="container">
        <div className="cta">
          <h2 className="cta__title">{c.title[0]}<br />{c.title[1]}</h2>
          <p className="cta__text">{c.text}</p>
          <div className="cta__buttons">
            {items.map((it) => (
              <a key={it.key} className="btn btn--white" href={href[it.key]} target="_blank" rel="noopener noreferrer">{it.cta}</a>
            ))}
            <WhatsAppButton label={c.whatsapp} className="btn btn--white" />
          </div>
          <a className="cta__mail" href={`mailto:${CONTACT_EMAIL}`}>{c.questions}</a>
        </div>
      </div>
    </section>
  )
}
