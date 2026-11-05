import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { MedsProvider } from "./context/MedsContext.jsx";
import { PrefsProvider } from "./context/PrefsContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PrefsProvider>
        <AuthProvider>
          <MedsProvider>
            <App />
          </MedsProvider>
        </AuthProvider>
      </PrefsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
