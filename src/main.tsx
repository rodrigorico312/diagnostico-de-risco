import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import MeasurementConsent from "./MeasurementConsent";
import "./index.css";
import "./premium-site.css";
const root = document.getElementById("root")!;
const content = <React.StrictMode><App/><MeasurementConsent/></React.StrictMode>;
const path = window.location.pathname.replace(/\/+$/, "") || "/";
if (root.hasChildNodes() && root.dataset.route === path) ReactDOM.hydrateRoot(root, content);
else { root.replaceChildren(); ReactDOM.createRoot(root).render(content); }
