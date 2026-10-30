import { createHmac } from 'node:crypto';
const routes = {start:['POST','start'],current:['GET','current'],answer:['POST','answer'],delete:['POST','delete'],pdf:['GET','pdf']};
const origins = new Set(['https://www.nacionalcon.com','https://nacionalcon.com']);
export default async function handler(req,res) {
 res.setHeader('Cache-Control','private, no-store');
 res.setHeader('X-Content-Type-Options','nosniff');
 const route=routes[typeof req.query.op==='string'?req.query.op:''];
 if(!route || req.method!==route[0]) return res.status(405).json({detail:'Operação não permitida.'});
 if(req.method!=='GET' && !origins.has(req.headers.origin)) return res.status(403).json({detail:'Origem não permitida.'});
 const origin=process.env.MEI_API_ORIGIN, key=process.env.MEI_PROXY_KEY;
 if(!origin||!key) return res.status(503).json({detail:'Consulta temporariamente indisponível. Tente novamente em instantes.'});
 try {
  let payload;
  if(req.method!=='GET') {
   const body=typeof req.body==='string'?JSON.parse(req.body):req.body;
   if(JSON.stringify(body??{}).length>2048) return res.status(413).json({detail:'Solicitação muito grande.'});
   payload=JSON.stringify(body??{});
  }
  // Vercel sets x-vercel-forwarded-for at the edge; never trust a client-supplied session ID.
  const ip=String(req.headers['x-vercel-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0];
  const sessionCookie=String(req.headers.cookie||'').split(';').map(value=>value.trim()).find(value=>/^__Host-mei-session=[A-Za-z0-9_-]{32,100}$/.test(value))||'';
  const response=await fetch((origin.endsWith('/')?origin.slice(0,-1):origin)+'/v1/'+route[1],{
   method:route[0],redirect:'error',signal:AbortSignal.timeout(12000),
   headers:{'content-type':'application/json','x-mei-service':key,'x-mei-client':createHmac('sha256',key).update(ip).digest('hex'),'cookie':sessionCookie},
   body:payload
  });
  const cookies=response.headers.getSetCookie();
  if(cookies.length)res.setHeader('Set-Cookie',cookies);
  if(route[1]==='pdf' && response.status===200){
   if(!(response.headers.get('content-type')||'').startsWith('application/pdf'))throw Error('Invalid PDF response');
   const bytes=Buffer.from(await response.arrayBuffer());
   if(bytes.length>4000000||bytes.subarray(0,5).toString()!=='%PDF-')throw Error('Invalid PDF data');
   res.setHeader('Content-Type','application/pdf');res.setHeader('Content-Disposition','attachment; filename="meu-plano-mei.pdf"');
   return res.status(200).send(bytes);
  }
  const result=await response.json();
  return res.status(response.status).json(result);
 } catch { return res.status(502).json({detail:'Não foi possível carregar agora. Tente novamente em instantes.'}); }
}
