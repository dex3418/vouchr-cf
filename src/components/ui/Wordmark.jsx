// vouc.hr in the three brand colours from the favicon.
export default function Wordmark({ className = "" }) {
  return (
    <span className={`wm ${className}`} aria-label="Vouchr">
      <span className="wm__v">vouc</span><span className="wm__dot">.</span><span className="wm__h">hr</span>
    </span>
  )
}
