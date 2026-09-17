import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "./components/ui/toast.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
