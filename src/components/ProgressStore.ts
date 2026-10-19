const STORAGE_KEY = 'xiuanyan_progress_v1';

export interface QuizResult {
  score: number;
  completedAt: string;
  attempts: number;
}

export interface SubjectProgress {
  completedPaths: string[];
  quizResults: Record<string, QuizResult>;
  lastAccessedAt: string;
}

export interface ProgressStore {
  version: 1;
  subjects: Record<string, SubjectProgress>;
  updatedAt: string;
}

export function getProgress(): ProgressStore {
  if (typeof window === 'undefined') {
    return defaultStore();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStore();
    return JSON.parse(raw) as ProgressStore;
  } catch {
    return defaultStore();
  }
}

export function saveProgress(store: ProgressStore): void {
  if (typeof window === 'undefined') return;
  store.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function updatePathComplete(subjectId: string, pathId: string): void {
  const store = getProgress();
  if (!store.subjects[subjectId]) {
    store.subjects[subjectId] = defaultSubjectProgress();
  }
  const subject = store.subjects[subjectId];
  if (!subject.completedPaths.includes(pathId)) {
    subject.completedPaths.push(pathId);
  }
  subject.lastAccessedAt = new Date().toISOString();
  saveProgress(store);
}

export function saveQuizResult(subjectId: string, quizId: string, score: number): void {
  const store = getProgress();
  if (!store.subjects[subjectId]) {
    store.subjects[subjectId] = defaultSubjectProgress();
  }
  const subject = store.subjects[subjectId];
  const existing = subject.quizResults[quizId];
  subject.quizResults[quizId] = {
    score,
    completedAt: new Date().toISOString(),
    attempts: (existing?.attempts ?? 0) + 1,
  };
  subject.lastAccessedAt = new Date().toISOString();
  saveProgress(store);
}

export function getSubjectProgress(subjectId: string): SubjectProgress {
  return getProgress().subjects[subjectId] ?? defaultSubjectProgress();
}

export function getSubjectCompletionPercent(subjectId: string, totalPaths: number): number {
  if (totalPaths === 0) return 0;
  const progress = getSubjectProgress(subjectId);
  return Math.round((progress.completedPaths.length / totalPaths) * 100);
}

function defaultStore(): ProgressStore {
  return {
    version: 1,
    subjects: {},
    updatedAt: new Date().toISOString(),
  };
}

function defaultSubjectProgress(): SubjectProgress {
  return {
    completedPaths: [],
    quizResults: {},
    lastAccessedAt: new Date().toISOString(),
  };
}
