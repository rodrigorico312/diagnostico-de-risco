/** Run after publication; verifies the live ownership file before notifying engines. */
import { readFile } from "node:fs/promises";
const origin = "https://www.nacionalcon.com";
const key = (await readFile(new URL("../public/indexnow.txt", import.meta.url), "utf8")).trim();
if (!/^[a-f0-9]{32}$/.test(key)) throw new Error("Invalid IndexNow ownership key.");
const keyLocation = `${origin}/indexnow.txt`;
const verification = await fetch(keyLocation);
if (!verification.ok || (await verification.text()).trim() !== key) throw new Error("The ownership file is not published at the expected domain.");
const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]).filter(url => !url.endsWith("/blog/cnpj-para-psicologos"));
if (!urlList.length || urlList.some(url => new URL(url).origin !== origin)) throw new Error("Unexpected sitemap domain.");
const response = await fetch("https://api.indexnow.org/indexnow", { method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify({ host: "www.nacionalcon.com", key, keyLocation, urlList }) });
console.log(JSON.stringify({ httpStatus: response.status, submitted: urlList.length, received: [200,202].includes(response.status), indexingGuaranteed: false }));
if (![200,202].includes(response.status)) throw new Error(`IndexNow did not accept the request: ${response.status}`);
