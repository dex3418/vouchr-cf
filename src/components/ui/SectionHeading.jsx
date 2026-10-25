export default function SectionHeading({ label, title, sub, centered }) {
  return (
    <div className={`sh ${centered ? "sh--center" : ""}`}>
      <p className="sh__label">{label}</p>
      <h2 className="sh__title">{title}</h2>
      {sub && <p className="sh__sub">{sub}</p>}
    </div>
  )
}
