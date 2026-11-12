/** Operational ordering only. Never reject a lead or send a message automatically. */
export function qualifyLead(lead) {
  const immediate = /quanto antes|30 dias|prÃ³ximas semanas|prazo|bloqueio/i.test(`${lead.momento} ${lead.urgencia}`);
  const recurring = /mensal|crescimento|desenquadramento|alterar|financeira|tributÃ¡ria/i.test(`${lead.interesse} ${lead.motivo}`);
  const revenueFit = /10 mil a|30 mil a|80 mil a|180 mil|10.000 a|30.000 a|Acima de R\$ 80 mil/.test(lead.faturamento || "");
  if (immediate && recurring && revenueFit) return "Prioridade de contato";
  if (immediate || recurring) return "Avaliar necessidade";
  return "Conversa exploratÃ³ria";
}
