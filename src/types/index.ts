export type EntryKind =
  | "critic_attack"
  | "thought"
  | "gratitude"
  | "feeling";

export interface Entry {
  id: string;
  kind: EntryKind;
  raw_text: string;
  rewritten_text: string | null;
  critic_attack_type: number | null;
  intensity_before: number | null;
  intensity_after: number | null;
  created_at: string;
}

export interface FlashbackSession {
  id: string;
  started_at: string;
  ended_at: string;
  triggers: string[];
  steps_completed: number[];
  intensity_before: number;
  intensity_after: number;
  grounded: boolean;
}

export interface Method {
  id: string;
  name: string;
  category: string;
  category_label: string;
  one_liner: string;
  problem_states: string[];
  when_to_use: string;
  trigger_signals: string[];
  steps: string[];
  page: string;
  tool: string;
  referral: boolean;
  confidence: string;
  source: string;
}

export interface MethodsFile {
  version: string;
  source: string;
  notes: Record<string, string>;
  methods: Method[];
}

export interface PersistedAppData {
  entries: Entry[];
  sessions: FlashbackSession[];
  strengths: string[];
  blockPhrase: string;
  fourFSelections: string[];
  recoverySelections: number[];
}
