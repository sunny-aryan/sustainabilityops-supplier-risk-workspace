import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { Toaster } from "@/components/ui/sonner"
import { ErrorBoundary } from "@/components/shared/error-boundary"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark">
      <ErrorBoundary>
        <App />
        <Toaster />
      </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>
)
