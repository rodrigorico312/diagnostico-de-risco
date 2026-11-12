import { renderToString } from "react-dom/server";
import { PremiumPage } from "./PremiumSite";
export { premiumMetadata, premiumServices } from "./premium-content";
export function render(path: string) { return renderToString(<PremiumPage path={path}/>); }
