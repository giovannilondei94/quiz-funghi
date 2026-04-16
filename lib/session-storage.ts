import {
  IMAGE_RESULT_STORAGE_KEY,
  normalizeImageName,
} from "@/lib/image-quiz-core";
import type { ImageSessionKind } from "@/lib/image-types";
import { QUIZ_RESULT_STORAGE_KEY } from "@/lib/quiz-core";
import type { ExamMode, QuizSessionState } from "@/lib/types";
import type { ImageSessionState } from "@/lib/image-types";

export const QUIZ_SESSION_STORAGE_KEY = "quiz-funghi:quiz-session";
export const IMAGE_SESSION_STORAGE_KEY = "quiz-funghi:image-session";

function isBrowserReady() {
  return typeof window !== "undefined";
}

function readStorageItem<T>(storageKey: string): T | null {
  if (!isBrowserReady()) {
    return null;
  }

  const rawValue = window.localStorage.getItem(storageKey);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    window.localStorage.removeItem(storageKey);
    return null;
  }
}

export function loadQuizSession(mode: ExamMode): QuizSessionState | null {
  const session = readStorageItem<QuizSessionState>(QUIZ_SESSION_STORAGE_KEY);

  if (!session || session.mode !== mode || !Array.isArray(session.questions)) {
    return null;
  }

  return {
    ...session,
    currentIndex:
      typeof session.currentIndex === "number" &&
      session.currentIndex >= 0 &&
      session.currentIndex < session.questions.length
        ? session.currentIndex
        : 0,
    answers:
      session.answers && typeof session.answers === "object" ? session.answers : {},
    completed: session.completed === true,
  };
}

export function saveQuizSession(session: QuizSessionState) {
  if (!isBrowserReady()) {
    return;
  }

  window.localStorage.setItem(QUIZ_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearQuizSession() {
  if (!isBrowserReady()) {
    return;
  }

  window.localStorage.removeItem(QUIZ_SESSION_STORAGE_KEY);
}

export function clearQuizResult() {
  if (!isBrowserReady()) {
    return;
  }

  window.sessionStorage.removeItem(QUIZ_RESULT_STORAGE_KEY);
}

export function loadImageSession(kind: ImageSessionKind): ImageSessionState | null {
  const session = readStorageItem<ImageSessionState>(IMAGE_SESSION_STORAGE_KEY);

  if (!session || session.kind !== kind || !Array.isArray(session.questions)) {
    return null;
  }

  return {
    ...session,
    currentIndex:
      typeof session.currentIndex === "number" &&
      session.currentIndex >= 0 &&
      session.currentIndex < session.questions.length
        ? session.currentIndex
        : 0,
    answers:
      session.answers && typeof session.answers === "object" ? session.answers : {},
    completed: session.completed === true,
    usedNames:
      Array.isArray(session.usedNames) && session.usedNames.length > 0
        ? session.usedNames
        : session.questions.map((question) => normalizeImageName(question.name)),
  };
}

export function saveImageSession(session: ImageSessionState) {
  if (!isBrowserReady()) {
    return;
  }

  window.localStorage.setItem(IMAGE_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearImageSession() {
  if (!isBrowserReady()) {
    return;
  }

  window.localStorage.removeItem(IMAGE_SESSION_STORAGE_KEY);
}

export function clearImageResult() {
  if (!isBrowserReady()) {
    return;
  }

  window.sessionStorage.removeItem(IMAGE_RESULT_STORAGE_KEY);
}

export function clearStoredSessions(scope: "all" | "quiz" | "image" = "all") {
  if (scope === "all" || scope === "quiz") {
    clearQuizSession();
    clearQuizResult();
  }

  if (scope === "all" || scope === "image") {
    clearImageSession();
    clearImageResult();
  }
}
