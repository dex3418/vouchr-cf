import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.jsx"
import { LanguageProvider } from "./i18n/LanguageContext.jsx"
import "./styles/theme.css"
import "./styles/base.css"
import "./styles/layout.css"
import "./styles/home.css"
import "./styles/articles.css"
import "./styles/legal.css"
import "./styles/directory.css"
import "./styles/glass.css"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
)
