import SectionHeading from "../ui/SectionHeading.jsx"
import { useLang } from "../../i18n/LanguageContext.jsx"

export default function HowItWorks() {
  const { t } = useLang()
  const h = t.how
  const cols = [{ ...h.individuals, tone: "magenta" }, { ...h.platforms, tone: "blue" }]
  return (
    <section className="section">
      <div className="container">
        <SectionHeading label={h.label} title={h.title} sub={h.sub} />
        <div className="grid2">
          {cols.map((c) => (
            <div className="card" key={c.title}>
              <h3 className="card__label">{c.title}</h3>
              <ol className="steps">
                {c.steps.map((s, i) => (
                  <li key={s}><span className={`steps__n steps__n--${c.tone}`}>{i + 1}</span><span>{s}</span></li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
