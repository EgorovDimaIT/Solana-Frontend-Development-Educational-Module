// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Trophy, Zap, Target, Laptop, ShieldCheck, ArrowRight, Clock, Star, Layers, Terminal } from 'lucide-react';
import { getProgress, getTotalCompletionPercent, UserProgress } from '@/lib/progress-store';

const LECTURES = [
   {
      id: '1',
      title: 'Solana Fundamentals',
      description: 'Accounts, Transactions, Programs, and first transactions via CLI',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-blue-600 to-cyan-500',
      duration: '2h',
      topics: ['Accounts', 'Transactions', 'Programs', 'RPC Connection'],
   },
   {
      id: '2',
      title: 'Wallet Integration',
      description: 'Connecting wallets (Phantom) and signing transactions in React dApps',
      icon: <ShieldCheck className="w-8 h-8" />,
      color: 'from-indigo-600 to-purple-500',
      duration: '2h',
      topics: ['Wallet Adapter', 'React Hooks', 'UX Patterns', 'Error handling'],
   },
   {
      id: '3',
      title: 'On-Chain Data',
      description: 'Working with smart contracts, SPL tokens, NFT, and Metaplex SDK',
      icon: <Laptop className="w-8 h-8" />,
      color: 'from-emerald-600 to-teal-500',
      duration: '2h',
      topics: ['SPL Tokens', 'NFT Metadata', 'Metaplex SDK', 'Anchor IDL'],
   },
   {
      id: '4',
      title: 'Production Ready',
      description: 'RPC optimization, reliability, simulations, and mainnet deployment',
      icon: <Target className="w-8 h-8" />,
      color: 'from-orange-600 to-red-500',
      duration: '2h',
      topics: ['RPC Optimization', 'Transaction Simulation', 'Mainnet Deploy', 'Error Recovery'],
   },
];

const GAMES = [
   {
      id: 'wallet-simulator',
      title: 'Wallet Simulator',
      description: 'Sharpen your wallet skills in a safe CLI simulation.',
      icon: '💳',
      href: '/games/wallet-simulator',
      color: 'from-indigo-900/50 to-slate-900',
   },
   {
      id: 'transaction-builder',
      title: 'Transaction Builder',
      description: 'Visual transaction builder: add instructions, simulate, and broadcast.',
      icon: '🔨',
      href: '/games/transaction-builder',
      color: 'from-orange-900/50 to-red-900/50',
   },
];

export default function HomePage() {
   const [completionPercent, setCompletionPercent] = useState(0);
   const [progress, setProgress] = useState<UserProgress | null>(null);

   useEffect(() => {
      const p = getProgress();
      setProgress(p);
      setCompletionPercent(getTotalCompletionPercent(p));
   }, []);

   return (
      <div className="min-h-screen text-slate-100 selection:bg-indigo-500/40 selection:text-white overflow-x-hidden relative">
         {/* Overall Ambient Glows */}
         <div className="fixed inset-0 bg-[#080a0f] -z-20" />
         <div className="fixed top-0 left-1/4 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
         <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
         {/* Dynamic Hero Section */}
         <section className="relative pt-32 pb-32 px-8 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-5%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
               <div className="flex flex-col items-center text-center">
                  <motion.div
                     initial={{ opacity: 0, scale: 0.8 }}
                     animate={{ opacity: 1, scale: 1 }}
                  >
                     <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full mb-10 shadow-2xl backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-[4px] text-indigo-400">Next-Gen Solana Education</span>
                     </div>
                  </motion.div>

                  <motion.div
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                  >
                     <h1 className="text-6xl md:text-[100px] font-black mb-8 uppercase tracking-[-0.05em] leading-[0.85] text-white drop-shadow-[0_20px_50px_rgba(79,70,229,0.3)]">
                        Solana Frontend <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500">Mastery Hub</span>
                     </h1>
                  </motion.div>

                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 0.2 }}
                  >
                     <div className="text-lg md:text-xl text-slate-300 max-w-2xl mb-16 font-medium leading-relaxed drop-shadow-sm">
                        Comprehensive journey from Web2 to Solana dApp architecture. <br />
                        Lectures, simulators, and quests in one portal.
                     </div>
                  </motion.div>

                  {/* Quick Actions & Progress */}
                  <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
                     <div className="flex-1 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[48px] p-10 flex flex-col items-start text-left relative overflow-hidden group">
                        <div className="flex justify-between w-full items-center mb-10 relative z-10">
                           <div className="flex flex-col">
                              <span className="font-black text-[10px] uppercase tracking-widest text-indigo-400/80 mb-1">Your Growth</span>
                              <h3 className="text-2xl font-black text-white">Overall Progress</h3>
                           </div>
                           <span className="text-4xl font-black text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.3)]">{completionPercent}%</span>
                        </div>

                        <div className="w-full bg-white/5 rounded-full h-4 mb-10 relative z-10 border border-white/10 p-1">
                           <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${completionPercent}%` }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                           >
                              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 h-full rounded-full shadow-[0_0_25px_rgba(99,102,241,0.5)]" style={{ width: '100%' }} />
                           </motion.div>
                        </div>

                        <Link href="/progress" className="mt-auto px-8 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-300 hover:bg-indigo-500/20 transition-all flex items-center gap-3 relative z-10">
                           View Breakdown <ArrowRight className="w-4 h-4" />
                        </Link>
                     </div>

                     <div className="flex-1 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[48px] p-10 flex flex-col items-start text-left shadow-[0_30px_60px_-15px_rgba(79,70,229,0.4)] relative overflow-hidden group hover:scale-[1.02] transition-all transform-gpu">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -translate-y-1/2 translate-x-1/2" />

                        <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-2xl border border-white/20">
                           <Zap className="w-8 h-8 text-white" />
                        </div>

                        <h3 className="font-black text-3xl uppercase tracking-tighter text-white mb-2 leading-none">Next Mission</h3>
                        <p className="text-indigo-100/70 text-sm font-bold mb-10">Lecture 01: The Fundamentals</p>

                        <div className="mt-auto w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                           <Link href="/lectures/1" className="py-5 bg-white text-indigo-700 rounded-3xl font-black text-sm uppercase tracking-[3px] text-center shadow-2xl hover:shadow-white/20 transition-all active:scale-95">
                              START LEARNING
                           </Link>
                           <Link href="/toolkit" className="py-5 bg-black/40 text-white border border-white/10 backdrop-blur-xl rounded-3xl font-black text-sm uppercase tracking-[3px] text-center shadow-2xl hover:bg-white/10 transition-all active:scale-95">
                              HACKER TOOLKIT
                           </Link>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Curriculum Grid */}
         <section className="max-w-6xl mx-auto px-8 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-20 text-center md:text-left gap-6">
               <div>
                  <h2 className="text-[10px] font-black uppercase tracking-[6px] text-indigo-400 mb-3">Path to Mastery</h2>
                  <h3 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-white">Course Modules</h3>
               </div>
               <div className="bg-white/5 border border-white/5 px-8 py-4 rounded-3xl backdrop-blur-md">
                  <p className="text-slate-400 font-bold text-xs tracking-[2px] uppercase">4 Lectures • 4 Quizzes • 2 Games</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {LECTURES.map((lecture, idx) => {
                  const lp = progress?.lectures?.[lecture.id];
                  const qp = progress?.quizzes?.[lecture.id];
                  return (
                     <motion.div
                        key={lecture.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                     >
                        <div className="group bg-white/[0.02] border border-white/10 rounded-[56px] overflow-hidden flex flex-col hover:border-indigo-500/40 transition-all shadow-2xl relative backdrop-blur-sm">
                           <div className={`bg-gradient-to-r ${lecture.color} p-12 h-56 flex flex-col justify-between relative`}>
                              <div className="absolute inset-0 bg-black/10 opacity-10" />
                              <div className="flex justify-between items-start relative z-10">
                                 <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center text-white backdrop-blur-xl border border-white/20 shadow-lg group-hover:scale-110 transition-transform">
                                    {lecture.icon}
                                 </div>
                                 <div className="flex gap-2">
                                    {lp?.completed && (
                                       <span className="bg-emerald-400 text-emerald-950 font-black text-[9px] uppercase px-4 py-2 rounded-full tracking-widest shadow-lg">Completed</span>
                                    )}
                                    <span className="bg-white/20 text-white font-black text-[9px] uppercase px-4 py-2 rounded-full tracking-widest backdrop-blur-xl flex items-center gap-2 border border-white/10">
                                       <Clock className="w-3 h-3" /> {lecture.duration}
                                    </span>
                                 </div>
                              </div>
                              <h4 className="text-4xl font-black text-white uppercase tracking-tighter leading-none relative z-10 drop-shadow-md">
                                 {lecture.title}
                              </h4>
                           </div>

                           <div className="p-12 flex-1 flex flex-col">
                              <p className="text-slate-200 font-medium leading-relaxed mb-10 text-lg">
                                 {lecture.description}
                              </p>

                              <div className="flex flex-wrap gap-2 mb-12">
                                 {lecture.topics.map(topic => (
                                    <span key={topic} className="bg-white/[0.05] border border-white/10 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-indigo-300 transition-colors">
                                       {topic}
                                    </span>
                                 ))}
                              </div>

                              <div className="grid grid-cols-2 gap-4 mt-auto">
                                 <Link href={`/lectures/${lecture.id}`} className="bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 py-5 rounded-3xl text-center text-[11px] font-black uppercase tracking-[3px] transition active:scale-95 text-white">
                                    MODULE
                                 </Link>
                                 <Link href={`/quiz/${lecture.id}`} className="bg-indigo-500 hover:bg-indigo-400 py-5 rounded-3xl text-center text-white text-[11px] font-black uppercase tracking-[3px] transition shadow-xl shadow-indigo-500/20 active:scale-95">
                                    QUIZ {qp?.passed && '✓'}
                                 </Link>
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  );
               })}
            </div>
         </section>

         {/* Interactive Quests */}
         <section className="bg-slate-900/40 border-y border-white/5 py-40 px-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full" />
            <div className="max-w-6xl mx-auto">
               <div className="text-center mb-20">
                  <h2 className="text-[11px] font-black uppercase tracking-[6px] text-indigo-400 mb-4">Simulations</h2>
                  <h3 className="text-5xl font-black uppercase tracking-tighter text-white font-sans">Interactive Quests</h3>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {GAMES.map((game) => (
                     <motion.div
                        key={game.id}
                        whileHover={{ y: -10 }}
                     >
                        <div className={`bg-gradient-to-br ${game.color} rounded-[64px] p-16 border border-white/10 shadow-2xl relative overflow-hidden group`}>
                           <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 blur-[60px] rounded-full translate-y-1/2 translate-x-1/2" />
                           <div className="text-7xl mb-10 transform group-hover:scale-110 transition-transform">{game.icon}</div>
                           <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 text-white">{game.title}</h3>
                           <p className="text-indigo-100/70 text-lg font-bold mb-12 max-w-sm leading-relaxed">{game.description}</p>
                           <Link href={game.href} className="px-12 py-5 bg-white text-indigo-900 rounded-[32px] font-black text-xs uppercase tracking-[3px] hover:shadow-white/20 transition-all shadow-2xl inline-block active:scale-95">
                              START QUEST
                           </Link>
                        </div>
                     </motion.div>
                  ))}
               </div>
            </div>
         </section>

         <footer className="py-32 text-center relative">
            <div className="flex flex-col items-center">
               <div className="w-20 h-20 bg-indigo-600/10 rounded-[32px] flex items-center justify-center mb-10 border border-white/10 backdrop-blur-xl">
                  <GraduationCap className="w-10 h-10 text-indigo-500" />
               </div>
               <p className="text-[12px] font-black uppercase tracking-[8px] text-slate-700 hover:text-indigo-500 transition-colors cursor-default">Building the Future of Solana</p>
            </div>
         </footer>
      </div>
   );
}
