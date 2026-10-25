import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import Seo from "../components/seo/Seo.jsx"
import NavBar from "../components/layout/NavBar.jsx"
import Footer from "../components/layout/Footer.jsx"
import SectionHeading from "../components/ui/SectionHeading.jsx"
import ListingCard from "../components/directory/ListingCard.jsx"
import { useNotion } from "../hooks/useNotion.js"
import { useLang } from "../i18n/LanguageContext.jsx"
import { GROUPS, applyFilters, optionsFor, readSelected } from "../data/directory.js"

export default function Directory() {
  const { lang, t } = useLang()
  const d = t.directory
  const { data, loading, error } = useNotion("/api/directory")
  const [params, setParams] = useSearchParams()
  // Open by default on wide screens, closed on phones so the list comes first.
  const [open, setOpen] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 861px)").matches)

  const all = Array.isArray(data) ? data : []
  const selected = readSelected(params)
  const shown = applyFilters(all, selected)
  const active = GROUPS.reduce((n, g) => n + selected[g.id].length, 0)

  // Filters live in the address, so a filtered view can be shared on WhatsApp.
  const toggle = (g, key) => {
    const now = selected[g.id]
    const next = now.includes(key) ? now.filter((k) => k !== key) : [...now, key]
    const copy = new URLSearchParams(params)
    next.length ? copy.set(g.param, next.join(",")) : copy.delete(g.param)
    setParams(copy, { replace: true })
  }
  const clear = () => setParams({}, { replace: true })

  return (
    <>
      <Seo title="Directory" description="Skill training, job and business listings in Dantewada, Sukma and Bijapur. Filter by district, qualification, subject and fee." />
      <NavBar />
      <main className="section">
        <div className="container">
          <SectionHeading label={d.label} title={d.title} sub={d.sub} />
          {loading && <p className="astate">{d.loading}</p>}
          {error && <p className="astate">{d.error}</p>}
          {Array.isArray(data) && all.length === 0 && <p className="astate">{d.empty}</p>}

          {all.length > 0 && (
            <>
              <details className="dfilters" open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
                <summary>
                  {d.filters}
                  {active > 0 && <span className="dfilters__n">{active}</span>}
                </summary>
                <div className="dfilters__body">
                  {GROUPS.map((g) => {
                    const options = optionsFor(g, all)
                    if (options.length === 0) return null
                    return (
                      <fieldset key={g.id} className="dgroup">
                        <legend>{d.groups[g.id]}</legend>
                        <div className="dgroup__chips">
                          {options.map((o) => (
                            <button key={o.key} type="button" className="chip" aria-pressed={selected[g.id].includes(o.key)} onClick={() => toggle(g, o.key)}>
                              {o[lang]}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                    )
                  })}
                  {active > 0 && <button type="button" className="dclear" onClick={clear}>{d.clear}</button>}
                </div>
              </details>

              <p className="dcount" aria-live="polite">{d.count.replace("{n}", shown.length)}</p>
              {shown.length === 0 && <p className="astate">{d.noMatch}</p>}
              {shown.length > 0 && (
                <div className="grid3">
                  {shown.map((x) => <ListingCard key={x.id} {...x} />)}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
