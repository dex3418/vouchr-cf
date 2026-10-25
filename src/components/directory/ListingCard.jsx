import { useState } from "react"
import { Link } from "react-router-dom"
import { useLang } from "../../i18n/LanguageContext.jsx"
import { FEES, PROVIDERS, QUALS, label, typeCode } from "../../data/directory.js"

const MAX_TAGS = 3

// Logo from Notion, or the first letter of the name when there is no logo or the file is not an image.
export function Logo({ logo, name, big }) {
  const [broken, setBroken] = useState(false)
  const size = big ? "dlogo--big" : ""
  return logo && !broken ? (
    <img className={`dlogo ${size}`} src={logo} alt="" loading="lazy" onError={() => setBroken(true)} />
  ) : (
    <span className={`dlogo dlogo--letter ${size}`} aria-hidden="true">{(name || "?").trim().charAt(0).toUpperCase()}</span>
  )
}

// Platform code (V in front when verified) and the provider.
export function Badges({ type, verified, provider }) {
  const { lang, t } = useLang()
  const code = typeCode(type, verified)
  return (
    <p className="acard__meta">
      {code && <span className={`code ${verified ? "code--v" : ""}`}>{code}</span>}
      {verified && <span className="dverified">✓ {t.directory.verified}</span>}
      {provider && <span className="acard__tag">{label(PROVIDERS, provider, lang)}</span>}
    </p>
  )
}

export default function ListingCard({ slug, name, type, verified, provider, district, location, qualification, subject, fee, logo }) {
  const { lang, t } = useLang()
  const d = t.directory
  const place = [location, district].filter(Boolean).join(", ")
  const tags = [...subject, ...qualification.map((q) => label(QUALS, q, lang))]
  return (
    <Link to={`/directory/${slug}`} className="acard dcard">
      <div className="acard__body">
        <div className="dcard__top">
          <Logo logo={logo} name={name} />
          <div>
            <h3 className="acard__title">{name}</h3>
            {place && <p className="dcard__place">{place}</p>}
          </div>
        </div>
        <Badges type={type} verified={verified} provider={provider} />
        {fee.length > 0 && (
          <p className="acard__meta">
            {fee.map((f) => <span key={f} className="acard__tag acard__tag--lang">{label(FEES, f, lang)}</span>)}
          </p>
        )}
        {tags.length > 0 && (
          <p className="dcard__tags">
            {tags.slice(0, MAX_TAGS).join(" · ")}
            {tags.length > MAX_TAGS ? ` +${tags.length - MAX_TAGS}` : ""}
          </p>
        )}
        <span className="acard__read">{d.view} →</span>
      </div>
    </Link>
  )
}
