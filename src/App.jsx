import { Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home.jsx"
import Articles from "./pages/Articles.jsx"
import ArticleDetail from "./pages/ArticleDetail.jsx"
import Directory from "./pages/Directory.jsx"
import DirectoryDetail from "./pages/DirectoryDetail.jsx"
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx"
import TermsConditions from "./pages/TermsConditions.jsx"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/articles/:slug" element={<ArticleDetail />} />
      <Route path="/directory" element={<Directory />} />
      <Route path="/directory/:slug" element={<DirectoryDetail />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
      <Route path="/terms" element={<TermsConditions />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
