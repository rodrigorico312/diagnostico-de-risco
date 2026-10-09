import React from "react";
import ReactDOM from "react-dom/client";
import ApprovedClientAccessPage from "./ApprovedClientAccessPage";
import ClientPortalPage from "./ClientPortalPage";
import ClientPasswordPage from "./ClientPasswordPage";
import "./index.css";

const path = window.location.pathname.replace(/\/+$/, "");
const Page = path === "/area-do-cliente/painel" ? ClientPortalPage :
  path === "/area-do-cliente/senha" ? ClientPasswordPage : ApprovedClientAccessPage;
ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><Page /></React.StrictMode>);
