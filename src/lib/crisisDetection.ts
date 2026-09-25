export type CrisisCategory = "self_harm" | "current_danger";

export interface CrisisDetectionResult {
  matched: boolean;
  categories: CrisisCategory[];
  matches: string[];
}

const CRISIS_TERMS: Array<{
  category: CrisisCategory;
  terms: string[];
}> = [
  {
    category: "self_harm",
    terms: [
      "自杀",
      "轻生",
      "不想活",
      "不想继续活着",
      "不想继续活下去",
      "想死",
      "死了算了",
      "活不下去",
      "活着没意思",
      "结束生命",
      "结束自己",
      "伤害自己",
      "自残",
      "自伤",
      "割腕",
      "跳楼",
      "结束这一切",
    ],
  },
  {
    category: "current_danger",
    terms: [
      "正在被虐待",
      "正在被暴力",
      "正在被打",
      "需要立即逃离",
      "有人要杀我",
      "他要杀我",
      "她要杀我",
      "我现在有生命危险",
      "我现在处于危险中",
      "我被囚禁",
      "不让我离开",
    ],
  },
];

function normalizeText(text: string): string {
  return text
    .normalize("NFKC")
    .toLocaleLowerCase("zh-CN")
    .replace(/[\s，。！？、；：,.!?;:'"“”‘’（）()【】\[\]—…\-_/\\]/g, "");
}

export function detectCrisis(text: string): CrisisDetectionResult {
  const normalized = normalizeText(text);

  if (!normalized) {
    return { matched: false, categories: [], matches: [] };
  }

  const matches = new Set<string>();
  const categories = new Set<CrisisCategory>();

  for (const group of CRISIS_TERMS) {
    for (const term of group.terms) {
      if (normalized.includes(normalizeText(term))) {
        matches.add(term);
        categories.add(group.category);
      }
    }
  }

  return {
    matched: matches.size > 0,
    categories: Array.from(categories),
    matches: Array.from(matches),
  };
}
