import Seo from "../components/seo/Seo.jsx"
import NavBar from "../components/layout/NavBar.jsx"
import Footer from "../components/layout/Footer.jsx"
import { CONTACT_EMAIL } from "../data/links.js"

// Policy text. Edit the wording here; the layout and theme live in styles/legal.css and glass.css.
const SECTIONS = [
  {
    title: "Information We Collect",
    intro: "We collect the following through our registration forms:",
    list: ["Name, age, phone number, email, address, district and block", "Education, skills, and occupation details"],
    outro: "When you visit our website, Google Analytics also collects general usage information such as pages viewed and device type. This does not include the details you submit in our registration forms.",
  },
  {
    title: "How We Use Your Information",
    intro: "Your data is used strictly for:",
    list: [
      "Connecting you with skill learning platforms",
      "Connecting you with job recruitment platforms",
      "Connecting you with local businesses",
      "Internal record keeping",
    ],
    outro: "We do not sell, share, or distribute your data to any third party without your prior consent and confirmation via phone call.",
  },
  {
    title: "Data Sharing",
    intro: "Your information is only shared with verified platforms on Vouchr after:",
    list: ["Your explicit consent via phone call", "Platform verification by Vouchr team"],
  },
  {
    title: "Call Recording",
    body: "All calls between Vouchr and users are recorded for quality and verification purposes. Recording begins only after your verbal consent.",
  },
  {
    title: "Data Storage",
    body: "Your data is stored securely on encrypted systems. We do not retain unnecessary data.",
  },
  {
    title: "Your Rights",
    intro: "You have the right to:",
    list: ["Request your data be deleted", "Withdraw consent at any time", "Know where your data has been shared"],
    contact: "Contact us at {email} to exercise these rights.",
  },
  {
    title: "Changes to This Policy",
    body: "We may update this policy. Changes will be posted on this page.",
  },
  {
    title: "Data Retention",
    body: "We retain your data for a maximum of 2 years from the date of registration. After 2 years your data is permanently deleted unless you have an active connection through Vouchr. You can request deletion at any time by contacting us.",
  },
  {
    title: "Protection of Minors",
    body: "Vouchr strictly serves individuals aged 18 and above. We do not knowingly collect data from anyone below 18 years of age. If we discover underage data has been submitted it will be immediately deleted.",
  },
  {
    title: "Grievance Officer",
    intro: "For any data privacy concerns or complaints contact our Grievance Officer:",
    details: [
      ["Name", "Devashish Markam"],
      ["Designation", "Founder, Novaforge Labs"],
      ["Email", "{email}"],
      ["Response time", "Within 72 hours of receiving complaint."],
    ],
  },
]

const ACCENTS = ["m", "b", "g"]

const Email = () => <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>

// Replaces {email} in a line with a mailto link.
function WithEmail({ text }) {
  const [before, after] = text.split("{email}")
  if (after === undefined) return text
  return (
    <>
      {before}
      <Email />
      {after}
    </>
  )
}

export default function PrivacyPolicy() {
  return (
    <>
      <Seo title="Privacy Policy" description="How Vouchr collects, uses and protects your data." canonicalPath="/privacy" />
      <NavBar />
      <main className="section" lang="en-IN">
        <div className="container legal">
          <header className="legal__head fade-up">
            <p className="sh__label">Legal</p>
            <h1 className="sh__title">Privacy Policy</h1>
            <p className="sh__sub">How Vouchr collects, uses and protects your data.</p>
            <p className="legal__meta">By Novaforge Labs · Effective May 2026</p>
          </header>

          <nav className="ltoc" aria-label="Sections">
            <p className="ltoc__title">On this page</p>
            <ol className="ltoc__list">
              {SECTIONS.map((s, i) => (
                <li key={s.title}>
                  <a href={`#privacy-${i + 1}`}>
                    <span className="ltoc__n">{i + 1}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {SECTIONS.map((s, i) => (
            <section key={s.title} id={`privacy-${i + 1}`} className={`lcard lcard--${ACCENTS[i % 3]}`} aria-labelledby={`privacy-h-${i + 1}`}>
              <div className="lcard__head">
                <span className="lcard__n" aria-hidden="true">{i + 1}</span>
                <h2 className="lcard__t" id={`privacy-h-${i + 1}`}>{s.title}</h2>
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
                {s.details && (
                  <dl className="ldl">
                    {s.details.map(([k, v]) => (
                      <div key={k} className="ldl__row">
                        <dt>{k}</dt>
                        <dd><WithEmail text={v} /></dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
