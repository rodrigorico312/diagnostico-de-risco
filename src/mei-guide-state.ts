export const MEI_DRAFT_KEY = "nacional.guia-mei.rascunho.v1";
export const noteLabels = {
  situacao: "Meu cenário, data do ato e data de efeitos",
  divida: "Canal consultado, períodos, vencimentos e componentes",
  pendencia: "Informação que falta, documento e canal onde vou buscar",
  proximo: "Próxima providência e data da conferência",
} as const;
export type NoteKey = keyof typeof noteLabels;
export type GuideProfile = "active" | "agreement" | "closed" | "unknown";
export type Draft = {
  version: 1;
  remember: boolean;
  profiles: GuideProfile[];
  checked: Record<string, boolean>;
  notes: Record<NoteKey, string>;
};
export function emptyDraft(): Draft {
  return { version: 1, remember: false, profiles: [], checked: {}, notes: { situacao: "", divida: "", pendencia: "", proximo: "" } };
}
export function decodeDraft(raw: string | null): Draft {
  const fallback = emptyDraft();
  if (!raw || raw.length > 40000) return fallback;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || !("version" in value) || value.version !== 1) return fallback;
    const source = value as Record<string, unknown>;
    const profiles = Array.isArray(source.profiles) ? source.profiles.filter((p): p is GuideProfile => ["active", "agreement", "closed", "unknown"].includes(p)) : [];
    const notes = { ...fallback.notes };
    if (source.notes && typeof source.notes === "object") {
      for (const key of Object.keys(noteLabels) as NoteKey[]) {
        const v = (source.notes as Record<string, unknown>)[key];
        if (typeof v === "string") notes[key] = v.slice(0,4000);
      }
    }
    const checked: Record<string, boolean> = {};
    if (source.checked && typeof source.checked === "object") {
      for (const [key, v] of Object.entries(source.checked)) {
        if (/^item-\d-\d{1,2}$/.test(key) && v === true) checked[key] = true;
      }
    }
    return { version: 1, remember: source.remember === true, profiles: [...new Set(profiles)], checked, notes };
  } catch { return fallback; }
}
export function recommendedSections(profiles: GuideProfile[]): string[] {
  const ids = new Set(["consultas"]);
  if (profiles.includes("active")) ids.add("ainda-mei");
  if (profiles.includes("agreement")) ids.add("parcelamento");
  if (profiles.includes("closed")) ids.add("baixado");
  return [...ids];
}
export function worksheetText(draft: Draft, checkedTitles: string[], date: string): string {
  const fields = (Object.keys(noteLabels) as NoteKey[]).map(key => `${noteLabels[key]}\n${draft.notes[key].trim() || "Não preenchido."}`);
  return ["MINHA FICHA - GUIA GRATUITO DO MEI", `Conferência: ${date}`, "Base do conteúdo: 26/10/2026", ...fields,
    "Itens que marquei como conferidos", ...(checkedTitles.length ? checkedTitles.map(t => `- ${t}`) : ["Nenhum item marcado."]),
    "Esta ficha organiza informações e providências. Não é aprovação de elegibilidade.", "Fontes e guia: https://www.nacionalcon.com/guia-mei",
  ].join("\n\n");
}
