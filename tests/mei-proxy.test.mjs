import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/mei.js';
function response(){return {headers:{},setHeader(k,v){this.headers[k]=v;},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};}
test('MEI bridge validates origin and operation, forwards server secret and private cookies only to fixed backend',async()=>{
 const prior={fetch:globalThis.fetch,origin:process.env.MEI_API_ORIGIN,key:process.env.MEI_PROXY_KEY};
 try{
  process.env.MEI_API_ORIGIN='https://example.test/nacional-mei';process.env.MEI_PROXY_KEY='fixture-server-key';
  let captured;globalThis.fetch=async(url,init)=>{captured={url,init};return {status:202,headers:{getSetCookie:()=>['__Host-mei-session=fixture; Secure; HttpOnly; SameSite=Lax; Path=/']},json:async()=>({state:'queued'})};};
  let res=response();await handler({query:{op:'start'},method:'POST',headers:{origin:'https://evil.test'},body:{cnpj:'fixture'}},res);assert.equal(res.code,403);assert.equal(captured,undefined);
  res=response();await handler({query:{op:'https://evil.test'},method:'POST',headers:{}},res);assert.equal(res.code,405);
  res=response();await handler({query:{op:'start'},method:'POST',headers:{origin:'https://www.nacionalcon.com','x-vercel-forwarded-for':'192.0.2.1','cookie':'sb-private=private-fixture; __Host-mei-session=abcdefghijklmnopqrstuvwxyz1234567890'},body:{cnpj:'fixture'}},res);
  assert.equal(res.code,202);assert.equal(captured.init.headers.cookie,'__Host-mei-session=abcdefghijklmnopqrstuvwxyz1234567890');assert.equal(captured.url,'https://example.test/nacional-mei/v1/start');assert.equal(captured.init.headers['x-mei-service'],'fixture-server-key');assert.equal(captured.init.headers['x-mei-client'].length,64);assert.match(res.headers['Cache-Control'],/no-store/);assert.match(res.headers['Set-Cookie'][0],/HttpOnly/);assert.equal(JSON.stringify(res.body).includes('fixture-server-key'),false);
  globalThis.fetch=async()=>{throw Error('sensitive upstream message');};res=response();await handler({query:{op:'current'},method:'GET',headers:{}},res);assert.equal(res.code,502);assert.equal(JSON.stringify(res.body).includes('sensitive'),false);
 }finally{globalThis.fetch=prior.fetch;if(prior.origin===undefined)delete process.env.MEI_API_ORIGIN;else process.env.MEI_API_ORIGIN=prior.origin;if(prior.key===undefined)delete process.env.MEI_PROXY_KEY;else process.env.MEI_PROXY_KEY=prior.key;}
});

test('PDF bridge keeps the session boundary and returns only validated PDF bytes',async()=>{
 const prior={fetch:globalThis.fetch,origin:process.env.MEI_API_ORIGIN,key:process.env.MEI_PROXY_KEY};
 try{
  process.env.MEI_API_ORIGIN='https://example.test/nacional-mei';process.env.MEI_PROXY_KEY='fixture-server-key';
  let captured;
  globalThis.fetch=async(url,init)=>{captured={url,init};return {status:200,headers:{getSetCookie:()=>[],get:()=> 'application/pdf'},arrayBuffer:async()=>Buffer.from('%PDF-1.4\nfixture')}};
  let res={...response(),send(body){this.body=body;return this;}};
  await handler({query:{op:'pdf'},method:'GET',headers:{cookie:'portal=private; __Host-mei-session=abcdefghijklmnopqrstuvwxyz1234567890'}},res);
  assert.equal(res.code,200);assert.equal(captured.url,'https://example.test/nacional-mei/v1/pdf');
  assert.equal(captured.init.headers.cookie,'__Host-mei-session=abcdefghijklmnopqrstuvwxyz1234567890');
  assert.equal(res.headers['Content-Type'],'application/pdf');assert.match(res.headers['Content-Disposition'],/meu-plano-mei.pdf/);
  assert.equal(res.body.subarray(0,5).toString(),'%PDF-');
  globalThis.fetch=async()=>({status:200,headers:{getSetCookie:()=>[],get:()=> 'text/html'}});
  res=response();await handler({query:{op:'pdf'},method:'GET',headers:{}},res);assert.equal(res.code,502);
 }finally{globalThis.fetch=prior.fetch;if(prior.origin===undefined)delete process.env.MEI_API_ORIGIN;else process.env.MEI_API_ORIGIN=prior.origin;if(prior.key===undefined)delete process.env.MEI_PROXY_KEY;else process.env.MEI_PROXY_KEY=prior.key;}
});
