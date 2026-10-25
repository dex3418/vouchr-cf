import { useEffect } from "react"
import { useLocation } from "react-router-dom"

const DEFAULT_TITLE = "Vouchr | Local jobs and skills in Dantewada, Sukma and Bijapur"
const DEFAULT_DESC = "Vouchr connects job seekers, skill learners and local businesses in Dantewada, Sukma and Bijapur (Bastar, Chhattisgarh). Register with a short form."

function meta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute("content", value)
}

// Sets the tab title and meta tags for the current page. With no props it restores the Home defaults.
export default function Seo({ title, description, canonicalPath, type = "website", noindex = false, jsonLd }) {
  const { pathname } = useLocation()
  const ld = jsonLd ? JSON.stringify(jsonLd) : ""
  useEffect(() => {
    const full = title ? `${title} | Vouchr` : DEFAULT_TITLE
    const desc = description || DEFAULT_DESC
    const url = window.location.origin + (canonicalPath || pathname)
    document.title = full
    meta("name", "description", desc)
    meta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large")
    meta("property", "og:title", full)
    meta("property", "og:description", desc)
    meta("property", "og:type", type)
    meta("property", "og:url", url)
    meta("name", "twitter:title", full)
    meta("name", "twitter:description", desc)
    let c = document.head.querySelector("link[rel=canonical]")
    if (!c) {
      c = document.createElement("link")
      c.setAttribute("rel", "canonical")
      document.head.appendChild(c)
    }
    c.setAttribute("href", url)
    let script = document.getElementById("page-jsonld")
    if (ld) {
      if (!script) {
        script = document.createElement("script")
        script.id = "page-jsonld"
        script.type = "application/ld+json"
        document.head.appendChild(script)
      }
      script.textContent = ld
    } else if (script) {
      script.remove()
    }
    return () => document.getElementById("page-jsonld")?.remove()
  }, [title, description, canonicalPath, type, noindex, pathname, ld])
  return null
}
