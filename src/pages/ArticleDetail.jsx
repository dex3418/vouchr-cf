import { Link, useParams } from "react-router-dom"
import Seo from "../components/seo/Seo.jsx"
import NavBar from "../components/layout/NavBar.jsx"
import Footer from "../components/layout/Footer.jsx"
import BlockRenderer from "../components/articles/BlockRenderer.jsx"
import { useNotion } from "../hooks/useNotion.js"
import { useLang } from "../i18n/LanguageContext.jsx"
import { fullDate } from "../data/format.js"

export default function ArticleDetail() {
  const { slug } = useParams()
  const { lang, t } = useLang()
  const a = t.articles
  const { data, loading, error } = useNotion(`/api/article?slug=${encodeURIComponent(slug)}`)

  const description = data ? data.summary || (data.blocks.find((b) => b.type === "paragraph" && b.text.length)?.text.map((r) => r.t).join("") || "").slice(0, 155) || undefined : undefined
  const jsonLd = data && {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    datePublished: data.date || undefined,
    inLanguage: data.language === "hi" ? "hi" : "en-IN",
    author: { "@type": "Organization", name: "Vouchr" },
    publisher: { "@type": "Organization", name: "Vouchr" },
    articleSection: data.category || undefined,
  }

  return (
    <>
      {/* While loading, leave the tags the server already sent. Only a missing or failed page is marked noindex. */}
      {data ? <Seo title={data.title} description={description} type="article" jsonLd={jsonLd} /> : error ? <Seo title="Article" noindex /> : null}
      <NavBar />
      <main className="section">
        <article className="container article" lang={data ? data.language : undefined}>
          <Link to="/articles" className="article__back">← {a.back}</Link>
          {loading && <p className="astate">{a.loading}</p>}
          {error && <p className="astate">{a.error}</p>}
          {data && (
            <>
              <p className="acard__meta">
                {data.category && <span className="acard__tag">{a.categories[data.category] || data.category}</span>}
                {data.date && <span>{fullDate(data.date, lang)}</span>}
              </p>
              <h1 className="article__title">{data.title}</h1>
              {data.cover && <img className="article__cover" src={data.cover} alt="" />}
              <BlockRenderer blocks={data.blocks} />
            </>
          )}
        </article>
      </main>
      <Footer />
    </>
  )
}
