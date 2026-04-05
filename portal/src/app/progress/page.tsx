// src/app/progress/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getProgress,
  getTotalCompletionPercent,
  UserProgress,
} from '@/lib/progress-store';

export default function ProgressPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  if (!progress) {
    return (
      <div className="min-h-screen bg-[#080b12] flex items-center justify-center p-10">
        <div className="text-indigo-400 font-black text-xs tracking-[5px] uppercase animate-pulse">Loading mission data...</div>
      </div>
    );
  }

  const completionPercent = getTotalCompletionPercent(progress);

  const LECTURES = [
    { id: '1', title: 'Solana Fundamentals' },
    { id: '2', title: 'Wallet Integration' },
    { id: '3', title: 'On-Chain Data' },
    { id: '4', title: 'Production Patterns' },
  ];

  return (
    <div className="min-h-screen text-slate-100 p-8 font-sans relative overflow-x-hidden">
      <div className="fixed inset-0 bg-[#0b0e14] -z-20" />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[160px] -z-10 pointer-events-none" />
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-20 border-b border-white/5 pb-10">
          <div>
            <Link href="/" className="text-indigo-400/50 hover:text-indigo-300 transition uppercase font-black text-[10px] tracking-[5px] mb-4 block">
              ← Back to Command Center
            </Link>
            <h1 className="text-6xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-500">My Stats</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-4">
              Operations Started: {new Date(progress.startedAt).toLocaleDateString('en')}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black tracking-[4px] text-indigo-400 uppercase block mb-1">XP Power</span>
            <span className="text-6xl font-black text-white drop-shadow-2xl">{progress.totalScore}</span>
          </div>
        </header>

        {/* Overall Progress */}
        <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[48px] p-12 mb-16 border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white leading-none mb-2">Main Mission Status</h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Bootcamp Completion Timeline</p>
            </div>
            <span className="text-7xl font-black text-indigo-400 drop-shadow-[0_10px_20px_rgba(99,102,241,0.3)]">
              {completionPercent}%
            </span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-6 p-1.5 border border-white/10 relative z-10 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(79,70,229,0.5)]"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

        {/* Lectures & Quizzes */}
        <div className="mb-16">
          <h2 className="text-xs font-black uppercase tracking-[5px] text-slate-500 mb-8 border-b border-white/5 pb-4">Lecture Milestones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LECTURES.map(lecture => {
              const lp = progress?.lectures?.[lecture.id];
              const qp = progress?.quizzes?.[lecture.id];
              return (
                <div
                  key={lecture.id}
                  className={`rounded-[32px] p-8 border transition-all ${lp?.completed
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-white/2 border-white/5'
                    }`}
                >
                  <div className="flex justify-between mb-4">
                    <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Mod {lecture.id}</span>
                    {lp?.completed && (
                      <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">COMPLETED ✓</span>
                    )}
                  </div>
                  <h3 className="font-bold mb-4 uppercase tracking-tight text-sm h-10">{lecture.title}</h3>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Study</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${lp?.completed ? 'text-indigo-400' : 'text-slate-700'}`}>
                        {lp?.completed ? 'Done ✅' : 'Locked'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quiz</span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${qp?.passed
                          ? 'text-emerald-400'
                          : qp?.attempts
                            ? 'text-amber-500'
                            : 'text-slate-700'
                          }`}
                      >
                        {qp?.passed
                          ? `PASSED (${qp.bestScore}%)`
                          : qp?.attempts
                            ? `FAILED (${qp.attempts} tries)`
                            : 'Not Taken'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href={`/lectures/${lecture.id}`}
                      className="text-center bg-white/[0.05] border border-white/5 hover:bg-white/10 hover:border-white/10 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase transition"
                    >
                      READ
                    </Link>
                    <Link
                      href={`/quiz/${lecture.id}`}
                      className="text-center bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase transition shadow-lg shadow-indigo-600/20"
                    >
                      QUIZ
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Games Progress */}
        <div className="mb-20">
          <h2 className="text-xs font-black uppercase tracking-[5px] text-slate-500 mb-8 border-b border-white/5 pb-4">Special Quests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                id: 'wallet-simulator',
                title: 'Wallet Simulator',
                href: '/games/wallet-simulator',
                icon: '🔑',
                desc: 'Simulated Wallet Management CLI'
              },
              {
                id: 'transaction-builder',
                title: 'Transaction Builder',
                href: '/games/transaction-builder',
                icon: '🔨',
                desc: 'Visual Transaction Constructor'
              }
            ].map(game => {
              const gp = progress.games[game.id];
              return (
                <div
                  key={game.id}
                  className={`rounded-[40px] p-10 border transition-all flex justify-between items-center ${gp?.played
                    ? 'bg-amber-500/5 border-amber-500/20'
                    : 'bg-white/2 border-white/5'
                    }`}
                >
                  <div className="flex items-center gap-8">
                    <div className="text-6xl">{game.icon}</div>
                    <div>
                      <h3 className="font-black uppercase tracking-tight text-xl mb-1">{game.title}</h3>
                      <p className="text-slate-500 text-xs font-bold">{game.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {gp?.played ? (
                      <p className="text-amber-500 font-black text-2xl tracking-tighter mb-4">
                        ⭐ {gp.score} <span className="text-[10px] uppercase tracking-widest font-black text-amber-500/50">XP</span>
                      </p>
                    ) : (
                      <p className="text-slate-700 text-[10px] font-black uppercase tracking-widest mb-4">Quest Unplayed</p>
                    )}
                    <Link
                      href={game.href}
                      className="block bg-white/5 border border-white/10 px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-white/10 transition"
                    >
                      {gp?.played ? 'REPLAY QUEST' : 'START QUEST'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset Action */}
        <div className="text-center py-10">
          <button
            onClick={() => {
              if (confirm('Reset all progress? This action is irreversible.')) {
                localStorage.removeItem('solana-bootcamp-progress');
                localStorage.removeItem('quiz-progress');
                window.location.reload();
              }
            }}
            className="text-slate-700 hover:text-rose-500 transition font-black text-[10px] uppercase tracking-[4px]"
          >
            PURGE LOCAL DATA
          </button>
        </div>
      </div>
    </div>
  );
}
