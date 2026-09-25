import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { detectCrisis } from "../lib/crisisDetection";
import {
  EMPTY_APP_DATA,
  loadAppData,
  saveAppData,
} from "../lib/storage";
import type { Entry, FlashbackSession, PersistedAppData } from "../types";

interface GroundingRequest {
  purpose: string;
  required: boolean;
  onComplete?: () => void;
}

interface AppContextValue {
  entries: Entry[];
  sessions: FlashbackSession[];
  strengths: string[];
  blockPhrase: string;
  fourFSelections: string[];
  recoverySelections: number[];
  storageError: string | null;
  crisisActive: boolean;
  groundingRequest: GroundingRequest | null;
  addEntry: (entry: Entry) => void;
  addSession: (session: FlashbackSession) => void;
  addStrength: (strength: string) => void;
  removeStrength: (index: number) => void;
  setBlockPhrase: (phrase: string) => void;
  toggleFourFSelection: (id: string) => void;
  toggleRecoverySelection: (id: number) => void;
  inspectText: (text: string) => boolean;
  triggerCrisis: () => void;
  returnHomeFromCrisis: () => void;
  openGrounding: (
    purpose?: string,
    required?: boolean,
    onComplete?: () => void,
  ) => void;
  closeGrounding: () => void;
  completeGrounding: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(loadAppData);
  const [data, setData] = useState<PersistedAppData>(initial.data);
  const [storageError, setStorageError] = useState<string | null>(initial.error);
  const [crisisActive, setCrisisActive] = useState(false);
  const [groundingRequest, setGroundingRequest] =
    useState<GroundingRequest | null>(null);

  const updateData = useCallback(
    (updater: (current: PersistedAppData) => PersistedAppData) => {
      setData((current) => {
        const next = updater(current);
        const error = saveAppData(next);
        setStorageError(error);
        return next;
      });
    },
    [],
  );

  const addEntry = useCallback(
    (entry: Entry) => {
      updateData((current) => ({
        ...current,
        entries: [entry, ...current.entries],
      }));
    },
    [updateData],
  );

  const addSession = useCallback(
    (session: FlashbackSession) => {
      updateData((current) => ({
        ...current,
        sessions: [session, ...current.sessions],
      }));
    },
    [updateData],
  );

  const addStrength = useCallback(
    (strength: string) => {
      const trimmed = strength.trim();

      if (!trimmed) {
        return;
      }

      updateData((current) => ({
        ...current,
        strengths: [trimmed, ...current.strengths],
      }));
    },
    [updateData],
  );

  const removeStrength = useCallback(
    (index: number) => {
      updateData((current) => ({
        ...current,
        strengths: current.strengths.filter((_, itemIndex) => itemIndex !== index),
      }));
    },
    [updateData],
  );

  const setBlockPhrase = useCallback(
    (phrase: string) => {
      updateData((current) => ({
        ...current,
        blockPhrase: phrase.trim() || EMPTY_APP_DATA.blockPhrase,
      }));
    },
    [updateData],
  );

  const toggleFourFSelection = useCallback(
    (id: string) => {
      updateData((current) => ({
        ...current,
        fourFSelections: current.fourFSelections.includes(id)
          ? current.fourFSelections.filter((item) => item !== id)
          : [...current.fourFSelections, id],
      }));
    },
    [updateData],
  );

  const toggleRecoverySelection = useCallback(
    (id: number) => {
      updateData((current) => ({
        ...current,
        recoverySelections: current.recoverySelections.includes(id)
          ? current.recoverySelections.filter((item) => item !== id)
          : [...current.recoverySelections, id],
      }));
    },
    [updateData],
  );

  const triggerCrisis = useCallback(() => {
    setGroundingRequest(null);
    setCrisisActive(true);
  }, []);

  const inspectText = useCallback(
    (text: string) => {
      if (!detectCrisis(text).matched) {
        return false;
      }

      triggerCrisis();
      return true;
    },
    [triggerCrisis],
  );

  const returnHomeFromCrisis = useCallback(() => {
    setCrisisActive(false);
  }, []);

  const openGrounding = useCallback(
    (
      purpose = "回到当下",
      required = false,
      onComplete?: () => void,
    ) => {
      setGroundingRequest({ purpose, required, onComplete });
    },
    [],
  );

  const closeGrounding = useCallback(() => {
    setGroundingRequest(null);
  }, []);

  const completeGrounding = useCallback(() => {
    const callback = groundingRequest?.onComplete;
    setGroundingRequest(null);
    callback?.();
  }, [groundingRequest]);

  const value = useMemo<AppContextValue>(
    () => ({
      entries: data.entries,
      sessions: data.sessions,
      strengths: data.strengths,
      blockPhrase: data.blockPhrase,
      fourFSelections: data.fourFSelections,
      recoverySelections: data.recoverySelections,
      storageError,
      crisisActive,
      groundingRequest,
      addEntry,
      addSession,
      addStrength,
      removeStrength,
      setBlockPhrase,
      toggleFourFSelection,
      toggleRecoverySelection,
      inspectText,
      triggerCrisis,
      returnHomeFromCrisis,
      openGrounding,
      closeGrounding,
      completeGrounding,
    }),
    [
      addEntry,
      addSession,
      addStrength,
      closeGrounding,
      completeGrounding,
      crisisActive,
      data.blockPhrase,
      data.entries,
      data.fourFSelections,
      data.recoverySelections,
      data.sessions,
      data.strengths,
      groundingRequest,
      inspectText,
      openGrounding,
      removeStrength,
      returnHomeFromCrisis,
      setBlockPhrase,
      storageError,
      toggleFourFSelection,
      toggleRecoverySelection,
      triggerCrisis,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp 必须在 AppProvider 内使用");
  }

  return context;
}
