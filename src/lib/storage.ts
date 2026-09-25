import type { PersistedAppData } from "../types";

const STORAGE_KEY = "cptsd-self-help:v1";

export const EMPTY_APP_DATA: PersistedAppData = {
  entries: [],
  sessions: [],
  strengths: [],
  blockPhrase: "不。停下。闭嘴。",
  fourFSelections: [],
  recoverySelections: [],
};

interface StorageLoadResult {
  data: PersistedAppData;
  error: string | null;
}

function normalizeAppData(value: unknown): PersistedAppData | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<PersistedAppData>;

  if (
    !Array.isArray(candidate.entries) ||
    !Array.isArray(candidate.sessions) ||
    !Array.isArray(candidate.strengths) ||
    typeof candidate.blockPhrase !== "string"
  ) {
    return null;
  }

  return {
    entries: candidate.entries,
    sessions: candidate.sessions,
    strengths: candidate.strengths,
    blockPhrase: candidate.blockPhrase,
    fourFSelections: Array.isArray(candidate.fourFSelections)
      ? candidate.fourFSelections.filter(
          (item): item is string => typeof item === "string",
        )
      : [],
    recoverySelections: Array.isArray(candidate.recoverySelections)
      ? candidate.recoverySelections.filter(
          (item): item is number => Number.isInteger(item),
        )
      : [],
  };
}

export function loadAppData(): StorageLoadResult {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return { data: EMPTY_APP_DATA, error: null };
    }

    const parsed: unknown = JSON.parse(raw);

    const normalized = normalizeAppData(parsed);

    if (!normalized) {
      return {
        data: EMPTY_APP_DATA,
        error: "本机中的旧数据格式无法读取，已使用安全初始状态。",
      };
    }

    return { data: normalized, error: null };
  } catch {
    return {
      data: EMPTY_APP_DATA,
      error: "数据只存在本机，加载失败时可刷新后重试。",
    };
  }
}

export function saveAppData(data: PersistedAppData): string | null {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return null;
  } catch {
    return "本地存储暂时不可用，本次记录没有保存。";
  }
}
