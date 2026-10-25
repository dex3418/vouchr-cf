import { Link } from "react-router-dom"
import Wordmark from "../ui/Wordmark.jsx"
import LanguageToggle from "./LanguageToggle.jsx"
import { useLang } from "../../i18n/LanguageContext.jsx"
import { SHOW_DIRECTORY } from "../../data/links.js"

export default function NavBar() {
  const { t } = useLang()
  return (
    <header className="nav">
      <div className="container nav__inner">
        <Link to="/" className="nav__brand" aria-label="Vouchr home">
          <Wordmark />
          <span className="nav__by">by Novaforge Labs</span>
        </Link>
        <div className="nav__right">
          {SHOW_DIRECTORY && <Link to="/directory" className="nav__link">{t.nav.directory}</Link>}
          <Link to="/articles" className="nav__link">{t.nav.articles}</Link>
          <LanguageToggle />
          <a href="/#join" className="btn btn--magenta nav__cta">{t.nav.register}</a>
        </div>
      </div>
    </header>
  )
}
