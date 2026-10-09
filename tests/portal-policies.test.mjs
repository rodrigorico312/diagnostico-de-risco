import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

const A = "10000000-0000-4000-8000-000000000001";
const B = "10000000-0000-4000-8000-000000000002";
const C = "10000000-0000-4000-8000-000000000003";
const ALFA = "20000000-0000-4000-8000-000000000001";
const BETA = "20000000-0000-4000-8000-000000000002";
let db;
async function actor(user, role = "authenticated") {
  await db.exec("reset role;");
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [user || ""]);
  await db.exec(`set role ${role};`);
}
before(async () => {
  db = new PGlite();
  // Simulate Supabase-managed schemas, not the application policies under test.
  await db.exec(`
    create role anon;
    create role authenticated;
    create role service_role bypassrls;
    create schema auth;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
    $$;
    grant usage on schema auth, public to anon, authenticated, service_role;
    grant execute on function auth.uid() to anon, authenticated, service_role;
    create schema storage;
    create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text, name text);
    alter table storage.objects enable row level security;
    grant usage on schema storage to authenticated;
    grant select on storage.objects to authenticated;
    insert into auth.users values ('${A}'), ('${B}'), ('${C}');
  `);
  await db.exec(await readFile(new URL("../supabase/migrations/202610060001_client_portal.sql", import.meta.url), "utf8"));
  await db.exec(`
    insert into public.portal_companies(id,legal_name,cnpj) values
      ('${ALFA}','Empresa Alfa Teste','11111111111111'), ('${BETA}','Empresa Beta Teste','22222222222222');
    insert into public.portal_memberships(company_id,user_id) values ('${ALFA}','${A}'),('${BETA}','${B}');
    insert into public.portal_documents(company_id,title,storage_path,published) values
      ('${ALFA}','Alfa','${ALFA}/alfa.pdf',true),('${BETA}','Beta','${BETA}/beta.pdf',true),
      ('${ALFA}','Rascunho','${ALFA}/rascunho.pdf',false);
    insert into storage.objects(bucket_id,name) values ('portal-documents','${ALFA}/alfa.pdf'),
      ('portal-documents','${BETA}/beta.pdf'),('portal-documents','${ALFA}/rascunho.pdf'),
      ('portal-documents','${ALFA}/sem-cadastro.pdf');
  `);
});
after(async () => { await db?.close(); });

test("anônimo não lê as tabelas do portal nem executa o limitador privilegiado", async () => {
  await actor(null, "anon");
  await assert.rejects(db.query("select * from public.portal_companies"), /permission denied/);
  await assert.rejects(db.query("select public.portal_consume_rate_limit($1, 10)", ["a".repeat(64)]), /permission denied/);
});
test("A lê somente Alfa e seus documentos publicados; paths órfãos também ficam privados", async () => {
  await actor(A);
  assert.deepEqual((await db.query("select id from public.portal_companies")).rows, [{ id: ALFA }]);
  assert.equal((await db.query("select * from public.portal_companies where id=$1", [BETA])).rows.length, 0);
  assert.deepEqual((await db.query("select title from public.portal_documents")).rows, [{ title: "Alfa" }]);
  assert.deepEqual((await db.query("select name from storage.objects")).rows, [{ name: `${ALFA}/alfa.pdf` }]);
});
test("B e conta sem vínculo não herdam acesso de A", async () => {
  await actor(B);
  assert.deepEqual((await db.query("select id from public.portal_companies")).rows, [{ id: BETA }]);
  await actor(C);
  for (const table of ["portal_companies", "portal_memberships", "portal_documents", "portal_requests"]) {
    assert.equal((await db.query(`select * from public.${table}`)).rows.length, 0);
  }
});
test("cliente não pode conceder vínculos nem alterar cadastro/documentos", async () => {
  await actor(A);
  await assert.rejects(db.query("insert into public.portal_memberships(company_id,user_id) values ($1,$2)", [BETA,A]), /permission denied/);
  await assert.rejects(db.query("update public.portal_companies set legal_name='Invadida' where id=$1", [ALFA]), /permission denied/);
  await assert.rejects(db.query("update public.portal_documents set published=true"), /permission denied/);
});
test("solicitações validam empresa, autor, status e colunas permitidas", async () => {
  await actor(A);
  await db.query("insert into public.portal_requests(company_id,created_by,subject,message,status) values ($1,$2,'Cadastro','Conferir telefone','open')", [ALFA,A]);
  await assert.rejects(db.query("insert into public.portal_requests(company_id,created_by,subject,message) values ($1,$2,'Teste','Teste')", [BETA,A]), /row-level security/);
  await assert.rejects(db.query("insert into public.portal_requests(company_id,created_by,subject,message) values ($1,$2,'Teste','Teste')", [ALFA,B]), /row-level security/);
  await assert.rejects(db.query("insert into public.portal_requests(company_id,created_by,subject,message,status) values ($1,$2,'Teste','Teste','closed')", [ALFA,A]), /row-level security/);
  await assert.rejects(db.query("insert into public.portal_requests(company_id,created_by,subject,message,created_at) values ($1,$2,'Teste','Teste',now())", [ALFA,A]), /permission denied/);
  await actor(B);
  assert.equal((await db.query("select * from public.portal_requests")).rows.length, 0);
});
test("vínculos múltiplos e revogação são avaliados pelo banco a cada consulta", async () => {
  await actor(null, "service_role");
  await db.query("insert into public.portal_memberships(company_id,user_id) values ($1,$2)", [BETA,A]);
  await actor(A);
  assert.equal((await db.query("select * from public.portal_companies")).rows.length, 2);
  await actor(null, "service_role");
  await db.query("update public.portal_memberships set active=false where user_id=$1", [A]);
  await actor(A);
  for (const table of ["portal_companies", "portal_documents", "portal_requests", "portal_memberships"]) {
    assert.equal((await db.query(`select * from public.${table}`)).rows.length, 0);
  }
  assert.equal((await db.query("select * from storage.objects")).rows.length, 0);
  await actor(null, "service_role");
  assert.ok((await db.query("select * from portal_private.membership_events where user_id=$1 and operation='UPDATE'", [A])).rows.length >= 2);
});
test("limite persistente e concorrente não pode ser reiniciado pelo cliente", async () => {
  await actor(null, "service_role");
  const key = "b".repeat(64);
  const results = await Promise.all(Array.from({ length: 12 }, () => db.query("select public.portal_consume_rate_limit($1,10) as result", [key])));
  assert.equal(results.filter((item) => item.rows[0].result.allowed).length, 10);
  await actor(A);
  await assert.rejects(db.query("delete from portal_private.rate_limits"), /permission denied/);
  await assert.rejects(db.query("select public.portal_consume_rate_limit($1,10)", [key]), /permission denied/);
});
