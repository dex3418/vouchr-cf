import SectionHeading from "../ui/SectionHeading.jsx"
import { useLang } from "../../i18n/LanguageContext.jsx"

// The platform codes, explained in two short rows instead of six.
export default function VerifiedLegend() {
  const { t } = useLang()
  const v = t.verified
  return (
    <section className="section section--soft">
      <div className="container">
        <SectionHeading label={v.label} title={v.title} sub={v.sub} />
        <div className="legend">
          <div className="legend__row">
            <div className="legend__codes">{v.listed.codes.map((c) => <span className="code" key={c}>{c}</span>)}</div>
            <p><strong>{v.listed.title}</strong>: {v.listed.text}</p>
          </div>
          <div className="legend__row">
            <div className="legend__codes">{v.verified.codes.map((c) => <span className="code code--v" key={c}>{c}</span>)}</div>
            <p><strong>✓ {v.verified.title}</strong>: {v.verified.text}</p>
          </div>
        </div>
        <p className="legend__key">{v.key}</p>
      </div>
    </section>
  )
}
