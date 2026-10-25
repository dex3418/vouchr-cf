import { useState } from "react"
import Seo from "../components/seo/Seo.jsx"
import NavBar from "../components/layout/NavBar.jsx"
import Footer from "../components/layout/Footer.jsx"
import SectionHeading from "../components/ui/SectionHeading.jsx"
import ArticleCard from "../components/articles/ArticleCard.jsx"
import { useArticles } from "../hooks/useArticles.js"
import { useLang } from "../i18n/LanguageContext.jsx"

export default function Articles() {
  const { t } = useLang()
  const a = t.articles
  const { articles, fallback, loading, error, empty } = useArticles()
  const [cat, setCat] = useState("All")

  const cats = [...new Set(articles.map((x) => x.category).filter(Boolean))]
  const shown = articles.filter((x) => cat === "All" || x.category === cat)

  return (
    <>
      <Seo title="Guides and articles" description="Practical guides on jobs, skills and local business in Dantewada, Sukma and Bijapur, from Vouchr." />
      <NavBar />
      <main className="section">
        <div className="container">
          <SectionHeading label={a.label} title={a.title} sub={a.sub} />
          {loading && <p className="astate">{a.loading}</p>}
          {error && <p className="astate">{a.error}</p>}
          {empty && <p className="astate">{a.empty}</p>}
          {fallback && <p className="astate astate--note">{a.fallback}</p>}
          {cats.length > 1 && (
            <div className="chips" role="group" aria-label={a.title}>
              {["All", ...cats].map((c) => (
                <button key={c} type="button" aria-pressed={cat === c} className="chip" onClick={() => setCat(c)}>
                  {c === "All" ? a.all : a.categories[c] || c}
                </button>
              ))}
            </div>
          )}
          {shown.length > 0 && (
            <div className="grid3">
              {shown.map((x) => <ArticleCard key={x.id} {...x} showLanguage={fallback} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
