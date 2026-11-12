import { renderToString } from "react-dom/server";
import App from "./App";
import { PageSeoCaptureContext } from "./usePageSeo";
import { premiumMetadata } from "./premium-content";
import { solutionPages } from "./SolutionDetailPage";
import { searchLandingPages } from "./SearchLandingPage";
export { premiumMetadata, premiumServices } from "./premium-content";
export const additionalPublicPaths = [
  ...Object.keys(solutionPages).map(slug => `/solucoes/${slug}`),
  ...Object.keys(searchLandingPages),
];
export function render(path: string) {
  let metadata: { title: string; description: string; path: string; image?: string } | undefined = premiumMetadata[path] ? { ...premiumMetadata[path], path } : undefined;
  const html = renderToString(<PageSeoCaptureContext.Provider value={value => { metadata = value; }}><App initialPath={path}/></PageSeoCaptureContext.Provider>);
  if (!metadata || metadata.path !== path) throw new Error(`Missing or mismatched page metadata: ${path}`);
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) throw new Error(`Expected one H1 on ${path}`);
  return { html, metadata };
}
