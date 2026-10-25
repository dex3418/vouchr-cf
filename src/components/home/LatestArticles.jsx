import { Link } from "react-router-dom"
import SectionHeading from "../ui/SectionHeading.jsx"
import ArticleCard from "../articles/ArticleCard.jsx"
import { useArticles } from "../../hooks/useArticles.js"
import { useLang } from "../../i18n/LanguageContext.jsx"

// The three newest articles in the visitor language. Hidden until there is something to show.
export default function LatestArticles() {
  const { t } = useLang()
  const { articles, fallback } = useArticles()
  if (articles.length === 0) return null
  const h = t.articles.home
  return (
    <section className="section">
      <div className="container">
        <SectionHeading label={h.label} title={h.title} />
        <div className="grid3">
          {articles.slice(0, 3).map((a) => <ArticleCard key={a.id} {...a} showLanguage={fallback} />)}
        </div>
        <p className="acard__all"><Link to="/articles">{h.all} →</Link></p>
      </div>
    </section>
  )
}
