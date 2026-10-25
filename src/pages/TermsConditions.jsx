import Seo from "../components/seo/Seo.jsx"
import NavBar from "../components/layout/NavBar.jsx"
import Footer from "../components/layout/Footer.jsx"
import { CONTACT_EMAIL } from "../data/links.js"

// Terms text. Edit the wording here; layout and theme live in styles/legal.css and glass.css.
const SECTIONS = [
  {
    title: "Platform Nature",
    body: "Vouchr is a connection platform. We connect individuals with skill learning platforms, job recruiters, and businesses. We are not a placement agency, recruiter, or employer.",
  },
  {
    title: "User Responsibilities",
    list: [
      "All information submitted must be accurate",
      "False information leads to immediate blacklisting",
      "Users must respond to Vouchr verification calls",
    ],
  },
  {
    title: "Platform Responsibilities",
    intro: "Registered platforms on Vouchr must:",
    list: [
      "Provide accurate business information",
      "Comply with Vouchr verification process",
      "Not misuse individual data shared by Vouchr",
      "Maintain ethical conduct with all individuals",
    ],
  },
  {
    title: "Verification",
    body: "Vouchr verifies platforms through physical visits and background checks. Verified status is valid for one year and subject to renewal.",
  },
  {
    title: "Complaint Policy",
    body: "One confirmed complaint against a platform results in immediate suspension. Confirmed complaints result in permanent ban with no re-registration.",
  },
  {
    title: "Refund Policy",
    list: [
      "₹500 posting fee is non-refundable",
      "50% refund applicable only if individual no-show within 15 days",
      "Commission charged only on confirmed joins",
    ],
  },
  {
    title: "Data Privacy",
    body: "All data collected is governed by our Privacy Policy. By using Vouchr you agree to our Privacy Policy.",
  },
  {
    title: "Limitation of Liability",
    intro: "Vouchr is not responsible for:",
    list: ["Actions of platforms after data handover", "Employment outcomes", "Course completion or results"],
  },
  {
    title: "Governing Law",
    body: "These terms are governed by the laws of India.",
  },
  {
    title: "Cookie Policy",
    intro: "The Vouchr website uses:",
    list: [
      "Basic browser storage that keeps the site working, such as remembering your language choice",
      "Google Analytics, which uses cookies to show us how visitors use the site, such as pages viewed and device type",
    ],
    outro: "We do not use this information to show you advertising or to identify you personally. You can block or delete cookies in your browser settings, and the site will still work.",
  },
  {
    title: "Dispute Resolution",
    body: "Any disputes arising from use of Vouchr will first be attempted to be resolved through mutual discussion. If unresolved, disputes will be governed by the courts of Chhattisgarh, India under applicable Indian law.",
  },
  {
    title: "Contact",
    contact: "For any queries contact us at {email}.",
  },
]

const ACCENTS = ["m", "b", "g"]

// Replaces {email} in a line with a mailto link.
function WithEmail({ text }) {
  const [before, after] = text.split("{email}")
  if (after === undefined) return text
  return (
    <>
      {before}
      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      {after}
    </>
  )
}

export default function TermsConditions() {
  return (
    <>
      <Seo title="Terms of Service" description="The terms for using Vouchr." canonicalPath="/terms" />
      <NavBar />
      <main className="section" lang="en-IN">
        <div className="container legal">
          <header className="legal__head fade-up">
            <p className="sh__label">Legal</p>
            <h1 className="sh__title">Terms &amp; Conditions</h1>
            <p className="sh__sub">The terms for using Vouchr.</p>
            <p className="legal__meta">By Novaforge Labs · Effective May 2026</p>
          </header>

          <nav className="ltoc" aria-label="Sections">
            <p className="ltoc__title">On this page</p>
            <ol className="ltoc__list">
              {SECTIONS.map((s, i) => (
                <li key={s.title}>
                  <a href={`#terms-${i + 1}`}>
                    <span className="ltoc__n">{i + 1}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {SECTIONS.map((s, i) => (
            <section key={s.title} id={`terms-${i + 1}`} className={`lcard lcard--${ACCENTS[i % 3]}`} aria-labelledby={`terms-h-${i + 1}`}>
              <div className="lcard__head">
                <span className="lcard__n" aria-hidden="true">{i + 1}</span>
                <h2 className="lcard__t" id={`terms-h-${i + 1}`}>{s.title}</h2>
              </div>
              <div className="lcard__body">
                {s.body && <p>{s.body}</p>}
                {s.intro && <p>{s.intro}</p>}
                {s.list && (
                  <ul className="llist">
                    {s.list.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                )}
                {s.outro && <p>{s.outro}</p>}
                {s.contact && <p><WithEmail text={s.contact} /></p>}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
