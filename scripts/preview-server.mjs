/** Local review only: blocks lead writes and legacy client files. CNPJ lookup is opt-in and read-only. */
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
const root=path.resolve("dist"), port=Number(process.env.PORT||57193);
const allowedFiles = new Set(["/nacional-contabilidade-logo-topbar.png","/nacional-contabilidade-logo.png","/rodrigo-coelho.png","/favicon.ico","/favicon.png","/apple-touch-icon.png","/og.png","/preview-home-ledger.png","/portal.html"]);
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".ico":"image/x-icon",".woff2":"font/woff2"};
http.createServer(async(req,res)=>{
  const send=(status,body,type="text/plain; charset=utf-8")=>{res.writeHead(status,{"Content-Type":type,"X-Robots-Tag":"noindex, nofollow","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"});res.end(body)};
  try{
    const url=new URL(req.url,"http://127.0.0.1"), pathname=decodeURIComponent(url.pathname);
    if(pathname === "/api/consultar-cnpj" && process.env.PREVIEW_CNPJ_LOOKUP === "true") {
      if(req.method !== "POST") return send(405, "Método não permitido");
      let body = "";
      for await (const chunk of req) {
        body += chunk.toString();
        if(body.length > 2048) return send(413, "Corpo muito grande");
      }
      const {default: lookup} = await import("../api/consultar-cnpj.js");
      return lookup({method:"POST",body}, {
        code:200, setHeader(k,v){res.setHeader(k,v)}, status(code){this.code=code;return this},
        json(body){return send(this.code,JSON.stringify(body),"application/json; charset=utf-8")},
      });
    }
    if(pathname.startsWith("/api/"))return send(503,JSON.stringify({ok:false,error:"Prévia local: integrações de envio desativadas."}),"application/json");
    if(!["GET","HEAD"].includes(req.method))return send(405,"Método não permitido");
    if(/^\/(clientes|fluxo_fabricia|dashboard-setores)/i.test(pathname))return send(404,"Não disponível na prévia");
    if (/\.[a-z0-9]+$/i.test(pathname) && !pathname.startsWith("/assets/") && !pathname.startsWith("/fonts/") && !allowedFiles.has(pathname) && !/^\/(mei-em-crescimento|calculadora-mei|contabilidade-empresarial|desenquadramento-mei|consultoria-financeira-tributaria|conteudos-e-ferramentas)\/index\.html$/.test(pathname)) return send(404,"Não disponível na prévia");
    let file=path.resolve(root,"."+pathname);
    if(!file.startsWith(root+path.sep)&&file!==root)return send(403,"Não permitido");
    try{if((await stat(file)).isDirectory())file=path.join(file,"index.html");await stat(file);}catch{file=path.join(root,"index.html");}
    if(pathname.startsWith("/area-do-cliente"))file=path.join(root,"portal.html");
    send(200,req.method==="HEAD"?"":await readFile(file),mime[path.extname(file)]||"application/octet-stream");
  }catch{send(404,"Página não encontrada")}
}).listen(port,process.env.PREVIEW_HOST||"127.0.0.1",()=>console.log(`Prévia Nacional: http://127.0.0.1:${port}`));
