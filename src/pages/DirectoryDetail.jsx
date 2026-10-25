import { Link, useParams } from "react-router-dom"
import Seo from "../components/seo/Seo.jsx"
import NavBar from "../components/layout/NavBar.jsx"
import Footer from "../components/layout/Footer.jsx"
import { Badges, Logo } from "../components/directory/ListingCard.jsx"
import { useNotion } from "../hooks/useNotion.js"
import { useLang } from "../i18n/LanguageContext.jsx"
import { DISTRICTS, FEES, PROVIDERS, QUALS, TYPES, label } from "../data/directory.js"

export default function DirectoryDetail() {
  const { slug } = useParams()
  const { lang, t } = useLang()
  const d = t.directory
  const { data, loading, error } = useNotion(`/api/listing?slug=${encodeURIComponent(slug)}`)

  const facts = data && [
    ["provider", label(PROVIDERS, data.provider, lang)],
    ["district", label(DISTRICTS, data.district, lang)],
    ["location", data.location],
    ["type", label(TYPES, data.type, lang)],
    ["qual", data.qualification.map((q) => label(QUALS, q, lang)).join(", ")],
    ["subject", data.subject.join(", ")],
    ["fee", data.fee.map((f) => label(FEES, f, lang)).join(", ")],
  ].filter(([, v]) => v)

  const place = data && (data.location || data.district)
  const description = data ? `${data.name}${place ? ` in ${place}` : ""}. ${data.description}`.slice(0, 155) : undefined
  const jsonLd = data && {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.name,
    description: data.description || undefined,
    logo: data.logo || undefined,
    areaServed: data.district ? `${data.district}, Chhattisgarh, India` : undefined,
    address: place ? { "@type": "PostalAddress", addressLocality: place, addressRegion: "Chhattisgarh", addressCountry: "IN" } : undefined,
  }

  return (
    <>
      {/* While loading, leave the tags the server already sent. Only a missing or failed page is marked noindex. */}
      {data ? <Seo title={data.name} description={description} type="website" jsonLd={jsonLd} /> : error ? <Seo title="Directory listing" noindex /> : null}
      <NavBar />
      <main className="section">
        <article className="container article">
          <Link to="/directory" className="article__back">← {d.back}</Link>
          {loading && <p className="astate">{d.loading}</p>}
          {error && <p className="astate">{d.notFound}</p>}
          {data && (
            <>
              <div className="ddetail__top">
                <Logo logo={data.logo} name={data.name} big />
                <div>
                  <Badges type={data.type} verified={data.verified} provider="" />
                  <h1 className="article__title ddetail__title">{data.name}</h1>
                </div>
              </div>
              {data.description && (
                <>
                  <h2 className="ddetail__h">{d.about}</h2>
                  <p className="prose ddetail__about">{data.description}</p>
                </>
              )}
              <dl className="ldl dfact">
                {facts.map(([k, v]) => (
                  <div className="ldl__row" key={k}>
                    <dt>{d.facts[k]}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="ddetail__cta">
                {data.applyUrl && <a className="btn btn--magenta" href={data.applyUrl} target="_blank" rel="noopener noreferrer">{d.apply}</a>}
                <a className={`btn ${data.applyUrl ? "btn--outline" : "btn--magenta"}`} href="/#join">{d.register}</a>
              </div>
            </>
          )}
        </article>
      </main>
      <Footer />
    </>
  )
}
