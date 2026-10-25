import { WHATSAPP_NUMBER, WHATSAPP_TEXT } from "../../data/links.js"

// Hidden until WHATSAPP_NUMBER is filled in src/data/links.js.
export default function WhatsAppButton({ label, className = "btn btn--ghost" }) {
  if (!WHATSAPP_NUMBER) return null
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
}
