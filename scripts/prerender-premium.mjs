import { build } from "vite";
import { readFile, writeFile, mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
const temporary = await mkdtemp(path.join(tmpdir(), "nacional-prerender-"));
const domain = "https://www.nacionalcon.com";
try {
  await build({ configFile: "vite.config.ts", build: { ssr: "src/premium-prerender.tsx", outDir: temporary, emptyOutDir: false, rollupOptions: { input: "src/premium-prerender.tsx", output: { entryFileNames: "render.mjs" } } }, ssr: { noExternal: ["react", "react-dom", "scheduler"] }, logLevel: "error" });
  const { render, premiumMetadata, additionalPublicPaths } = await import(pathToFileURL(path.join(temporary,"render.mjs")));
  const sitemap = await readFile("public/sitemap.xml", "utf8");
  // Preserve original indexed pages, including articles and local service pages.
  const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
  const paths = [...new Set([...Object.keys(premiumMetadata), ...additionalPublicPaths, ...sitemapPaths])];
  const template = await readFile("dist/index.html", "utf8");
  const escape = v => v.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
  const accounting = { "@context":"https://schema.org", "@type":"AccountingService", "@id":domain+"/#organization", name:"Nacional Contabilidade", legalName:"O Gestor do Lucro Consultoria Ltda.", url:domain+"/", telephone:"+55 93 99210-1980", email:"rodrigorico312@gmail.com", taxID:"62.560.654/0001-27", logo:domain+"/nacional-contabilidade-logo-topbar.png", areaServed:{"@type":"Country",name:"Brasil"}, address:{"@type":"PostalAddress",addressLocality:"Santarém",addressRegion:"PA",addressCountry:"BR"}, founder:{"@type":"Person",name:"Rodrigo Coelho",jobTitle:"Contador",identifier:"CRC/PA 024335"}, sameAs:["https://www.instagram.com/rodrigospcoelho"] };
  for (const route of paths) {
    // This article is an existing independent static application with its own rewrite.
    if (route === "/blog/cnpj-para-psicologos") continue;
    const rendered = render(route), meta = rendered.metadata;
    let html=template.replace(/<title>.*?<\/title>/s,`<title>${escape(meta.title)}</title>`).replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/s,`<meta name="description" content="${escape(meta.description)}" />`).replace(/<link rel="canonical" href="[^"]*"\s*\/>/,`<link rel="canonical" href="${domain}${route}" />`);
    for (const [key,value] of Object.entries({"og:title":meta.title,"og:description":meta.description,"og:url":domain+route,"twitter:title":meta.title,"twitter:description":meta.description})) html=html.replace(new RegExp(`(<meta (?:name|property)="${key}" content=")[^"]*("\\s*/>)`),`$1${escape(value)}$2`);
    const structured = [accounting, { "@context":"https://schema.org", "@type":route==="/calculadora-mei" ? "WebApplication" : "WebPage", name:meta.title, description:meta.description, url:domain+route, inLanguage:"pt-BR", ...(route==="/calculadora-mei" ? { applicationCategory:"FinanceApplication",operatingSystem:"Any",isAccessibleForFree:true } : {}) }];
    html=html.replace(/<script type="application\/ld\+json">.*?<\/script>/s,`<script type="application/ld+json">${JSON.stringify(structured).replace(/</g,"\\u003c")}</script>`).replace('<div id="root"></div>',`<div id="root" data-route="${route}">${rendered.html}</div>`);
    // A private/local preview must not be indexed even if a static copy is shared.
    if (process.env.VITE_PREVIEW_MODE === "true") html=html.replace("</head>",'<meta name="robots" content="noindex,nofollow" /></head>');
    const destination=route==="/" ? "dist/index.html" : path.join("dist",route.slice(1),"index.html");
    await mkdir(path.dirname(destination),{recursive:true});await writeFile(destination,html);
  }
  console.log(`Prerendered ${paths.length - 1} public pages, preserving the independent psychology article.`);
} finally {
  const absolute=path.resolve(temporary);
  if (!absolute.startsWith(path.resolve(tmpdir())+path.sep) || !path.basename(absolute).startsWith("nacional-prerender-")) throw new Error("Unexpected temporary directory");
  await rm(absolute,{recursive:true,force:true});
}
