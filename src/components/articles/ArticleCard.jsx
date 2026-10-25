import { Link } from "react-router-dom"
import { useLang } from "../../i18n/LanguageContext.jsx"
import { fullDate } from "../../data/format.js"

// A card for one article. Shows the language when the list is mixed.
export default function ArticleCard({ title, slug, language, summary, category, cover, date, showLanguage }) {
  const { lang, t } = useLang()
  const a = t.articles
  const card = (
    <>
      {cover && <img className="acard__img" src={cover} alt="" loading="lazy" />}
      <div className="acard__body">
        <p className="acard__meta">
          {category && <span className="acard__tag">{a.categories[category] || category}</span>}
          {showLanguage && <span className="acard__tag acard__tag--lang">{a.languages[language]}</span>}
          {date && <span>{fullDate(date, lang)}</span>}
        </p>
        <h3 className="acard__title" lang={language}>{title}</h3>
        {summary && <p className="acard__text" lang={language}>{summary}</p>}
        <span className="acard__read">{a.read} →</span>
      </div>
    </>
  )
  return slug ? <Link to={`/articles/${slug}`} className="acard">{card}</Link> : <article className="acard">{card}</article>
}
