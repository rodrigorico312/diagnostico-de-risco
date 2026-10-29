import { createHmac } from 'node:crypto';
const routes = {start:['POST','start'],current:['GET','current'],answer:['POST','answer'],delete:['POST','delete']};
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
  const response=await fetch((origin.endsWith('/')?origin.slice(0,-1):origin)+'/v1/'+route[1],{
   method:route[0],redirect:'error',signal:AbortSignal.timeout(12000),
   headers:{'content-type':'application/json','x-mei-service':key,'x-mei-client':createHmac('sha256',key).update(ip).digest('hex'),'cookie':String(req.headers.cookie||'').slice(0,8192)},
   body:payload
  });
  const cookies=response.headers.getSetCookie();
  if(cookies.length)res.setHeader('Set-Cookie',cookies);
  const result=await response.json();
  return res.status(response.status).json(result);
 } catch { return res.status(502).json({detail:'Não foi possível consultar agora. Seus dados não foram considerados quitados. Tente novamente.'}); }
}
