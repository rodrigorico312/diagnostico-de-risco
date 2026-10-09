# Portal do cliente — operação sem e-mail automático

Por orientação do proprietário em 09/10/2026, o cliente recupera o acesso falando com a Nacional pelo contato oficial. O portal não envia e-mails de recuperação ou convite. O botão Esqueci minha senha abre o WhatsApp; a operação pública recover é recusada.

## Configuração

Projeto Supabase: nacional-portal-cliente (cjqfurgqwlmfgyszcczk), separado dos outros sistemas. A migração 202610060001_client_portal.sql foi aplicada em 09/10/2026. As quatro tabelas públicas têm RLS habilitado; o bucket portal-documents é privado, PDF até 20 MB.

Cadastros públicos, vinculação manual pelo cliente e login anônimo estão desativados. E-mail precisa ser confirmado. A senha mínima é de 12 caracteres; alteração exige sessão recente. Site URL: https://www.nacionalcon.com. Retorno autorizado: https://www.nacionalcon.com/area-do-cliente/confirmar.

Variáveis somente no servidor: PORTAL_ENABLED, PORTAL_ORIGIN, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY e PORTAL_RATE_LIMIT_SECRET. As credenciais foram conectadas pela integração Vercel como variáveis sensíveis somente em produção. Não imprimir nem colocar em VITE_. Não é necessário SMTP para o fluxo manual.

## Administração

A equipe confere a identidade e a autorização de cada cliente antes de cadastrar ou vincular empresas. Saber o e-mail ou CNPJ não concede acesso. A administração inicial usa scripts em terminal seguro; não há painel administrativo pronto.

node scripts/manage-portal.mjs company empresa.json
node scripts/manage-portal.mjs invite acesso.json
node scripts/manage-portal.mjs recover recuperacao.json
node scripts/manage-portal.mjs link vinculo.json
node scripts/manage-portal.mjs revoke vinculo.json
node scripts/manage-portal.mjs document documento.json

invite e recover usam generateLink do provedor e NÃO enviam e-mail. A entrada exige companyId, email e outputFile (arquivo privado, fora do Git). recover também exige userId, confere o e-mail e o vínculo ativo. O proprietário recebe o link no arquivo privado e o compartilha individualmente após verificar a identidade. O cliente define a própria senha. Links expiram no provedor e são de uso único; não devem ser anexados a relatórios, logs, tickets públicos ou repositórios.

Acesso inicial exemplo: {"companyId":"UUID","email":"cliente@example.test","outputFile":"CAMINHO-PRIVADO"}
Recuperação exemplo: {"companyId":"UUID","userId":"UUID","email":"cliente@example.test","outputFile":"CAMINHO-PRIVADO"}
Empresa exemplo: {"legal_name":"Empresa","cnpj":"00000000000000","trade_name":"Nome"}
Vínculo exemplo: {"companyId":"UUID","userId":"UUID"}
Documento exemplo: {"companyId":"UUID","title":"Documento","period":"10/2026","file":"CAMINHO-PDF"}

Documento publicado fica visível aos membros ativos da empresa. Revogar vínculo bloqueia novas consultas imediatamente; uma URL assinada já emitida vale até 60 segundos. Solicitações são compartilhadas pelos membros da mesma empresa; notas internas devem ficar separadas.

## Verificação

npm run lint
npm test
npm run build

O build normalmente só compila. Com PORTAL_VERIFY_REAL=true, scripts/verify-portal-live.mjs faz verificação explícita no projeto Supabase identificado acima: cria duas contas/empresas fictícias, usa autenticação real pela API do portal, testa isolamento, solicitações, storage, revogação, recuperação manual, nova senha e logout. Não usa clientes reais nem envia e-mails. Ao terminar, remove apenas seus documentos/empresas sintéticos e desativa suas contas de teste. Segredos não são registrados.

Os 34 testes locais incluem fixtures e PostgreSQL/PGlite simulando schemas Supabase; não substituem a verificação real. Antes da promoção, validar também a API implantada, cookies, origem, cache e o botão de contato.

## Limitações

Nenhum cadastro real foi importado e nenhum cliente real recebeu acesso. É necessário informar a fonte oficial dos cadastros e conferir quais pessoas podem acessar cada empresa. O painel lista até 100 empresas, documentos e solicitações; paginação será necessária acima desses limites. Tokens JWT já emitidos podem valer até expirar; retirar vínculo é o mecanismo de revogação de dados.

Fontes: https://supabase.com/docs/reference/javascript/auth-admin-generatelink e https://supabase.com/docs/guides/database/postgres/row-level-security.
