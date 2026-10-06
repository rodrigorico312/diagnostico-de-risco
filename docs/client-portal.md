# Portal do cliente

Implementação inicial no projeto existente: login, convite e recuperação, definição de senha, cadastro somente leitura, múltiplas empresas, PDFs privados, solicitações e revogação de vínculos.

A administração desta etapa é pelo script seguro de operações; a área da equipe existente continua sem login integrado. Não se conecta o painel agregado de Google Sheets a cadastros individuais. Não foram importados dados reais.

## Arquitetura

O navegador só chama `/api/client-portal`. O cliente Supabase com chave pública roda no servidor com a sessão do usuário e RLS; os tokens ficam em cookies HttpOnly, Secure em HTTPS, SameSite=Lax e host-only. `getUser()` verifica a identidade no provedor. Não há tokens em localStorage nem secret key no bundle.

A chave administrativa tem dois usos distintos: limitador persistente de tentativas na API e script administrativo fora do site. Ela nunca consulta dados de cliente na API. O limitador usa HMAC do IP e e-mail, 30 tentativas por origem e 10 por conta em 15 minutos. Use também as proteções do Supabase e regras do WAF conforme o tráfego. Em Vercel, a origem do IP é `x-vercel-forwarded-for`; localmente usa o socket.

O portal tem HTML/entrada própria sem pixel de marketing. A página de confirmação é estática e sem rastreadores; o hash do e-mail é retirado da URL imediatamente e o aceite só acontece após clicar em Continuar. CSP, no-store e no-referrer protegem as rotas privadas.

RLS consulta vínculos ativos a cada operação. Dados cadastrais, vínculos, publicação e exclusão de PDFs não têm escrita para clientes. Solicitações são visíveis a todos os membros da mesma empresa; notas internas devem ficar em tabela separada. O bucket aceita PDFs de até 20 MB. Downloads usam URLs assinadas de 60 segundos; um link emitido antes de revogar o vínculo pode valer até expirar.

O painel exibe até 100 empresas, documentos e solicitações. Documentos e solicitações são os mais recentes; paginação é uma evolução necessária se esses limites forem atingidos.

## Preparar ambiente

1. Crie ou identifique um projeto Supabase separado para homologação. Aplique `supabase/migrations/202610060001_client_portal.sql` pelo fluxo de migrations/SQL Editor. O SQL adiciona apenas tabelas do portal, funções e bucket próprio. As tabelas devem ser novas; não execute sobre um schema parcial sem revisar.
2. Configure Node.js 22 ou superior na Vercel e as variáveis abaixo em ambiente seguro. Não use prefixo `VITE_`:

   ```env
   PORTAL_ENABLED=false
   PORTAL_ORIGIN=https://www.nacionalcon.com
   SUPABASE_URL=https://SEU-PROJETO.supabase.co
   SUPABASE_PUBLISHABLE_KEY=
   SUPABASE_SECRET_KEY=
   PORTAL_RATE_LIMIT_SECRET=
   ```

   A última variável deve ter pelo menos 32 caracteres aleatórios. Preview e homologação precisam de origem exata própria, sem barra final. Nunca copie segredos de produção para uma preview pública.
3. No Auth, desative novos cadastros públicos, habilite confirmação de e-mail e configure SMTP real. Use Site URL igual a `PORTAL_ORIGIN`; autorize o retorno `/area-do-cliente/confirmar` para cada ambiente exato. Configure política de senha de no mínimo 12 caracteres, proteção contra senhas vazadas quando disponível, limites de Auth e duração de access JWT curta (por exemplo, 10 minutos). Mantenha MFA nas contas de equipe que acessam a administração Supabase/Vercel e controle quem pode ler secret keys.
4. Ajuste os dois modelos de e-mail. A implementação usa `verifyOtp` com TokenHash; o modelo padrão com ConfirmationURL não é compatível com este fluxo somente servidor.

   Convite:

   ```html
   <a href="{{ .SiteURL }}/area-do-cliente/confirmar#token_hash={{ .TokenHash }}&amp;type=invite">Definir meu acesso</a>
   ```

   Recuperação:

   ```html
   <a href="{{ .SiteURL }}/area-do-cliente/confirmar#token_hash={{ .TokenHash }}&amp;type=recovery">Recuperar meu acesso</a>
   ```

   Verifique que o serviço de e-mail preserva o fragmento. Configure links expirados e de uso único no provedor. Use projetos separados se Site URL divergir entre homologação e produção.
5. Cadastre duas empresas fictícias e contas de teste. Habilite `PORTAL_ENABLED=true` somente no ambiente preparado para testar. O fluxo fica indisponível com configuração ausente; não retorna exemplos ou dados públicos.

## Administração

Execute somente em terminal seguro, com credenciais administrativas no ambiente ou `.env.local` ignorado pelo Git. Os comandos abaixo são exemplos e não foram executados contra serviços reais. Confira a identidade e autorização do destinatário antes de vincular empresas. O comando invite envia e-mail; publicar documento dá acesso aos membros da empresa.

```sh
node scripts/manage-portal.mjs company empresa.json
node scripts/manage-portal.mjs invite convite.json
node scripts/manage-portal.mjs link vinculo.json
node scripts/manage-portal.mjs revoke vinculo.json
node scripts/manage-portal.mjs document documento.json
```

Entradas:

```json
{"legal_name":"Empresa de Teste","cnpj":"00000000000000","trade_name":"Teste","tax_regime":"Simples Nacional","contact_email":"cliente@example.test"}
```

```json
{"companyId":"UUID-DA-EMPRESA","email":"cliente@example.test"}
```

```json
{"companyId":"UUID-DA-EMPRESA","userId":"UUID-DO-USUARIO"}
```

```json
{"companyId":"UUID-DA-EMPRESA","title":"Documento de teste","period":"10/2026","file":"CAMINHO-DO-PDF"}
```

O primeiro cadastro valida formato, não situação cadastral ou titularidade de CNPJ. Uma conta já existente deve ser vinculada pelo ID conferido, usando link; invite pode recusar e-mail existente. Se o envio de convite funcionar mas a vinculação falhar, o comando informa o ID para retomar a vinculação; não dá acesso automaticamente. A concessão, alteração e revogação geram eventos em `portal_private.membership_events`.

## Verificação e publicação

```sh
npm ci
npm run lint
npm test
npm run build
npm run dev:portal
```

Para desenvolvimento, `PORTAL_ORIGIN=http://localhost:3000`. O servidor escuta somente loopback e reproduz a API. Não o use em produção. Os testes de RLS executam a migration em PostgreSQL/PGlite com schemas Supabase simulados; a autenticação/e-mail real, armazenamento remoto, Vercel e comportamento de sessão do provedor exigem homologação.

Antes de publicar, valide com dois clientes fictícios:

- Convite, aceite, senha nova, login e recuperação, incluindo links vencidos/reutilizados.
- Conta sem vínculo não recebe empresa automaticamente.
- Alfa não lê cadastro, solicitações ou PDFs da Beta por URL/API nem pela Data API do Supabase.
- Cliente não modifica cadastro, vínculos ou papéis; não faz upload pelo bucket.
- Revogação bloqueia novas consultas e novos links mesmo com sessão aberta.
- Logout e troca de senha; voltar/recarregar não restabelece dados privados.
- No navegador, cookies têm os atributos descritos; os bundles não contêm secret keys e as rotas privadas não enviam dados a rastreadores.
- SMTP, limite de tentativas e cache/CDN no ambiente final.

Logout local revoga a sessão pertinente; troca de senha pede logout global. Os access JWTs já emitidos podem valer até sua expiração. Por isso, revogar acesso à empresa exige desativar o vínculo, não apenas encerrar refresh tokens. O painel reconsulta ao receber foco e a cada minuto; conteúdo já entregue não pode ser desentregue.

Não faça merge/publicação de produção como se o login estivesse ativo antes desses testes e da configuração. O código não substitui a fonte oficial de cadastro nem prova uma integração contábil.

## Fontes verificadas em 06/10/2026

- [Supabase server-side](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [verifyOtp](https://supabase.com/docs/reference/javascript/auth-verifyotp)
- [Modelos de e-mail](https://supabase.com/docs/guides/auth/auth-email-templates)
- [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Storage privado](https://supabase.com/docs/guides/storage/security/access-control)
- [Headers Vercel](https://vercel.com/docs/headers/request-headers)
