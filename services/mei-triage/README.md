# Nacional — consulta guiada MEI (29/10/2026)

Status: API e worker Python na VPS; consulta cadastral auxiliar real. NÃO há consulta automática operacional ao Simples, dívida ou parcelamento.

## Componentes
- Frontend /guia-mei: CNPJ, confirmação, perguntas, plano individual e download; guia anterior em ?material=1.
- api/mei.js: ponte Vercel para rotas fixas /v1/start, current, answer, delete. Variáveis somente servidor MEI_API_ORIGIN e MEI_PROXY_KEY (sensitive).
- FastAPI 127.0.0.1:8793; Traefik encaminha apenas /nacional-mei/ em api.ogestordolucro.site.
- PostgreSQL16 existente, banco e papel exclusivos nacional_mei; mei_cases e mei_events. Nenhum acesso aos clientes do portal.
- Worker separado, fila com SKIP LOCKED, lease de90s,3tentativas, cookie aleatório por sessão, retenção24h. Código não registra CNPJ/IP em logs de acesso; client_hash=HMAC(IP) para limite15consultas/h por origem e80jobs pendentes globais.
- Credenciais novas em /etc/nacional-mei/secrets.cred, criptografadas com systemd-creds/host; LoadCredentialEncrypted nas unidades. Não incluir valores no repositório.

## Fontes e limites
Teste normal com Chrome154, Playwright1.64.1, usuário Unix separado, contexto novo, sandbox ativo: Consulta Optantes devolveu explicitamente “Impedido por proteção Captcha. Comportamento de Robô”. Não repetir tentativas automáticas, resolver/burlar desafio nem usar sessão privada compartilhada. O conector oficial está suspenso. Desde a revisão de 30/10, o sistema usa o indicador auxiliar identificado para orientar as perguntas; não pede autodeclaração de enquadramento. A confirmação oficial permanece pendente.
BrasilAPI/Minha Receita preenche apenas CNPJ, razão social, abertura, situação e indicador auxiliar MEI. Data-base desconhecida é declarada, não substituída pela data da consulta. Só campos permitidos são gravados; sócios, CPF e telefone não são persistidos. Endereço cadastral estruturado foi incluído por pedido expresso do usuário em 30/10, limitado a logradouro/tipo, número, complemento, bairro, município, UF e CEP. Campos ausentes permanecem ausentes; endereço incompleto é identificado como parcial. CNPJ divergente descarta retorno. Falha ou404 não representa zero dívida nem empresa inexistente. Formato alfanumérico validado conforme documentação RFB; conector atual limitado a CNPJ numérico, demais casos seguem com perguntas e limite expresso.
Plano não avalia direito definitivo à remissão nem recomenda cancelar acordos. Não há apuração de saldos, emissão deDAS nem acesso aPGMEI/Regularize autenticado. Integração completa permanece pendente de canal permitido/autorizado para essas fontes.

## Operação
Código /opt/nacional-mei. Estado /var/lib/nacional-mei. Serviços nacional-mei-api e nacional-mei-worker; habilitados no boot. Unidades e configuraçãoTraefik versionadas aqui. Aplicar schema.sql via migrate.py com papel próprio; serviçoAPI faz migração idempotente ao iniciar. Instalar requirements no venv. Não recriar papel/credencial em atualização.
Atualização: copiar arquivos de fonte revisados, executar py_compile, reiniciar somente nacional-mei-api/worker. Verificar /nacional-mei/health e confirmação403 sem chave nas rotas privadas.
Rollback do site: reverter commit próprio ou promover deployment anterior documentado no dossiê. RollbackVPS: parar/desabilitar somente estes dois serviços e retirar somente nacional-mei.yml do diretório dinâmico; preservar banco/credenciais para recuperação. Não pararPostgres, Docker ouTraefik globais.
Não existe backup externo automatizado configurado por esta entrega. Dados são efêmeros; a pessoa pode baixar sua conferência. Não usar este banco para arquivo fiscal definitivo.

## Verificação
- tsc --noEmit; Vite build; tests/mei-proxy.test.mjs.
- test_sources.py: CNPJ errado e timeout não produzem dado/certidão/saldo.
- test_live.py: identificação real própria, duplicidade, cookie aleatório, fluxo, revisão, isolamento, exclusão e rejeição de lease antigo. Usa apenas consultas cadastrais públicas, sem pagamentos.
- test_persistence.py: tarefa persistente e recuperação delease expirado após reinício. Rodar apenas no fluxo controlado descrito no dossiê (worker parado durante seed), nunca parar outros serviços.

## Referências
- https://github.com/BrasilAPI/BrasilAPI/blob/main/pages/docs/doc/cnpj.json
- https://brasilapi.com.br/docs#tag/CNPJ
- https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj
- https://consopt.www8.receita.fazenda.gov.br/consultaoptantes

## Revisão de cadastro v004 — 30/10/2026
A confirmação exibe razão social, CNPJ, abertura e endereço disponível. O indicador MEI é recuperado da fonte auxiliar e qualificado como preliminar, com confirmação oficial pendente. A pergunta manual simei foi retirada; respostas antigas a ela são ignoradas. Nenhuma conclusão de “nunca foi MEI” é inferida por opção falsa/ausente.
Resultados carregam source.schema_version=2. GET current sinaliza needs_refresh em casos antigos; ao retomar, o frontend pede POST start para o mesmo CNPJ e o serviço renova somente uma vez o caso legado, invalida a revisão anterior e reinicia a confirmação. Trabalhos já na fila não são duplicados; o limite global de fila permanece respeitado.
Testes adicionais: test_registry_flow.py (normalização e precedência da fonte sobre autodeclaração) e test_registry_refresh.py (renovação de caso antigo com CNPJ fornecido pelo usuário, cobertura oficial pendente).
