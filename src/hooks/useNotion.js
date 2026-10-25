import { useEffect, useState } from "react"

// Loads data from one of the /api endpoints. Reused by every page.
// It also refreshes quietly when the visitor comes back to the tab, so edits made in Notion show up without a manual reload.
const REFRESH_AFTER_MS = 15000

export function useNotion(endpoint) {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    let alive = true
    let last = 0
    setState({ data: null, loading: true, error: null })

    const load = () => {
      last = Date.now()
      fetch(endpoint)
        .then((r) => {
          if (!r.ok) throw new Error("Could not load content")
          return r.json()
        })
        .then((data) => alive && setState({ data, loading: false, error: null }))
        // A failed refresh keeps what is already on screen. Only a failed first load shows an error.
        .catch((e) => alive && setState((s) => (s.data ? s : { data: null, loading: false, error: e.message })))
    }

    const onReturn = () => {
      if (document.visibilityState === "visible" && Date.now() - last > REFRESH_AFTER_MS) load()
    }

    load()
    document.addEventListener("visibilitychange", onReturn)
    window.addEventListener("focus", onReturn)
    return () => {
      alive = false
      document.removeEventListener("visibilitychange", onReturn)
      window.removeEventListener("focus", onReturn)
    }
  }, [endpoint])

  return state
}
