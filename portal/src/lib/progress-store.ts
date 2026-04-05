// src/lib/progress-store.ts
'use client';

export interface LectureProgress {
  completed: boolean;
  completedAt?: string;
}

export interface QuizProgress {
  score: number;
  passed: boolean;
  attempts: number;
  bestScore: number;
  completedAt?: string;
}

export interface GameProgress {
  played: boolean;
  score: number;
  completedAt?: string;
}

export interface UserProgress {
  lectures: Record<string, LectureProgress>;
  quizzes: Record<string, QuizProgress>;
  games: Record<string, GameProgress>;
  totalScore: number;
  startedAt: string;
}

const STORAGE_KEY = 'solana-bootcamp-progress';

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') {
    return getDefaultProgress();
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : getDefaultProgress();
  } catch {
    return getDefaultProgress();
  }
}

function getDefaultProgress(): UserProgress {
  return {
    lectures: {},
    quizzes: {},
    games: {},
    totalScore: 0,
    startedAt: new Date().toISOString(),
  };
}

export function saveProgress(progress: UserProgress) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function markLectureComplete(lectureId: string) {
  const progress = getProgress();
  progress.lectures[lectureId] = {
    completed: true,
    completedAt: new Date().toISOString(),
  };
  saveProgress(progress);
}

export function saveQuizResult(
  quizId: string,
  score: number,
  passed: boolean
) {
  const progress = getProgress();
  const existing = progress.quizzes[quizId];
  progress.quizzes[quizId] = {
    score,
    passed,
    attempts: (existing?.attempts || 0) + 1,
    bestScore: Math.max(score, existing?.bestScore || 0),
    completedAt: passed ? new Date().toISOString() : existing?.completedAt,
  };
  if (passed && !existing?.passed) {
    progress.totalScore += score;
  }
  saveProgress(progress);
}

export function getTotalCompletionPercent(progress: UserProgress): number {
  if (!progress) return 0;
  const total = 4 + 4 + 2; // 4 lectures + 4 quizzes + 2 games
  let completed = 0;

  completed += Object.values(progress.lectures || {}).filter(l => l.completed).length;
  completed += Object.values(progress.quizzes || {}).filter(q => q.passed).length;
  completed += Object.values(progress.games || {}).filter(g => g?.played).length;

  return Math.round((completed / total) * 100);
}
