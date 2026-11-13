export const normalizeCnpj = value => typeof value === "string" ? value.toUpperCase().replace(/[^A-Z0-9]/g, "") : "";

export function isValidCnpj(value) {
  const cnpj = normalizeCnpj(value);
  if (!/^[A-Z0-9]{12}\d{2}$/.test(cnpj) || /^(.)\1+$/.test(cnpj)) return false;
  const digit = (base, weights) => {
    const remainder = [...base].reduce((sum, char, i) => sum + (char.charCodeAt(0) - 48) * weights[i], 0) % 11;
    return remainder < 2 ? "0" : String(11 - remainder);
  };
  const first = digit(cnpj.slice(0, 12), [5,4,3,2,9,8,7,6,5,4,3,2]);
  const second = digit(cnpj.slice(0, 12) + first, [6,5,4,3,2,9,8,7,6,5,4,3,2]);
  return cnpj.endsWith(first + second);
}

export function formatCnpj(value) {
  return normalizeCnpj(value).slice(0, 14).replace(/^(.{2})(.)/, "$1.$2").replace(/^(.{6})(.)/, "$1.$2")
    .replace(/^(.{10})(.)/, "$1/$2").replace(/^(.{15})(.)/, "$1-$2");
}

const clean = value => typeof value === "string" ? value.trim().slice(0, 180) : "";

// Return only the business fields needed by the form, never QSA/CPF/contact data.
export function pickCompanyRegistry(data, requestedCnpj) {
  if (!data || normalizeCnpj(data.cnpj) !== normalizeCnpj(requestedCnpj) || !clean(data.razao_social)) return null;
  return {
    cnpj: normalizeCnpj(data.cnpj), razaoSocial: clean(data.razao_social),
    nomeFantasia: clean(data.nome_fantasia), municipio: clean(data.municipio), uf: clean(data.uf),
    situacao: clean(data.descricao_situacao_cadastral), atividade: clean(data.cnae_fiscal_descricao),
  };
}
