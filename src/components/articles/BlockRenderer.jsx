import { Fragment } from "react"

function Rich({ parts }) {
  return parts.map((r, i) => {
    let node = r.t
    if (r.c) node = <code>{node}</code>
    if (r.b) node = <strong>{node}</strong>
    if (r.i) node = <em>{node}</em>
    if (r.href) node = <a href={r.href} target="_blank" rel="noreferrer">{node}</a>
    return <Fragment key={i}>{node}</Fragment>
  })
}

function Block({ b }) {
  switch (b.type) {
    case "paragraph": return <p><Rich parts={b.text} /></p>
    case "heading_1": return <h2><Rich parts={b.text} /></h2>
    case "heading_2": return <h3><Rich parts={b.text} /></h3>
    case "heading_3": return <h4><Rich parts={b.text} /></h4>
    case "quote": return <blockquote><Rich parts={b.text} /></blockquote>
    case "callout": return <aside><Rich parts={b.text} /></aside>
    case "code": return <pre><code>{b.text}</code></pre>
    case "divider": return <hr />
    case "image":
      return (
        <figure>
          <img src={b.url} alt={b.caption || ""} loading="lazy" />
          {b.caption && <figcaption>{b.caption}</figcaption>}
        </figure>
      )
    default: return null
  }
}

// Groups consecutive list items into one <ul> or <ol>.
export default function BlockRenderer({ blocks }) {
  const out = []
  let i = 0
  while (i < blocks.length) {
    const b = blocks[i]
    if (b.type === "bulleted_list_item" || b.type === "numbered_list_item") {
      const type = b.type
      const items = []
      while (i < blocks.length && blocks[i].type === type) items.push(blocks[i++])
      const List = type === "bulleted_list_item" ? "ul" : "ol"
      out.push(
        <List key={i}>
          {items.map((it, k) => <li key={k}><Rich parts={it.text} /></li>)}
        </List>
      )
    } else {
      out.push(<Block key={i} b={b} />)
      i++
    }
  }
  return <div className="prose">{out}</div>
}
