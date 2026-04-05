'use client';
import { BookOpen, GraduationCap, Package, Trophy, ExternalLink, ArrowRight, Zap, Target, Laptop, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EducationalPortal() {
    const lectures = [
        { id: 1, title: 'Solana Fundamentals', desc: 'Accounts, Transactions, web3.js basics', icon: <Zap className="w-6 h-6" />, color: 'from-amber-400 to-orange-500' },
        { id: 2, title: 'Wallet Integration', desc: 'Connecting Phantom & Signing UX', icon: <ShieldCheck className="w-6 h-6" />, color: 'from-blue-400 to-indigo-600' },
        { id: 3, title: 'On-Chain Data', desc: 'Metaplex SDK & Token Program', icon: <Package className="w-6 h-6" />, color: 'from-emerald-400 to-cyan-500' },
        { id: 4, title: 'Production Patterns', desc: 'Helius DAS, Simulation & Security', icon: <Laptop className="w-6 h-6" />, color: 'from-purple-400 to-pink-600' }
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-8 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center">
                        <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[3px] mb-8">
                            Superteam Ukraine Module
                        </span>
                        <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                            SOLANA <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">FRONTEND</span> <br />
                            BOOTCAMP
                        </h1>
                        <p className="max-w-2xl text-slate-500 text-lg md:text-xl font-medium leading-relaxed mb-12">
                            Develop a comprehensive educational module for developers to master building on Solana. Transition from Web2 UI/UX to high-performance, production-ready dApps for the Colosseum Hackathon.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <button
                                onClick={() => document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-xl shadow-indigo-600/20 group"
                            >
                                Start Learning <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats/Metrics */}
            <section className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                {[
                    { icon: <Target className="w-5 h-5" />, label: 'Objective', value: 'Zero-to-Hero in 4 Lectures' },
                    { icon: <Package className="w-5 h-5" />, label: 'Toolkit', value: '4 Play-and-Play Templates' },
                    { icon: <GraduationCap className="w-5 h-5" />, label: 'Evaluation', value: 'Quizzes & Coding Tasks' }
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 border border-white/5 p-8 rounded-3xl backdrop-blur-sm">
                        <div className="bg-indigo-500/10 w-10 h-10 rounded-xl flex items-center justify-center text-indigo-400 mb-4">{stat.icon}</div>
                        <p className="text-[10px] font-black uppercase tracking-[2px] text-slate-600 mb-1">{stat.label}</p>
                        <p className="text-lg font-bold text-slate-200">{stat.value}</p>
                    </div>
                ))}
            </section>

            {/* Lectures Grid */}
            <section id="curriculum" className="max-w-6xl mx-auto px-8 mb-32">
                <h2 className="text-sm font-black uppercase tracking-[5px] text-indigo-500 mb-12 text-center">Curriculum Roadmap</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {lectures.map((lecture, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="group relative bg-slate-900/50 border border-white/10 p-8 rounded-[40px] flex flex-col items-center text-center transition-all hover:bg-slate-900 hover:border-indigo-500/30 overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${lecture.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity`} />
                            <div className={`w-16 h-16 rounded-[24px] bg-gradient-to-br ${lecture.color} flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                                {lecture.icon}
                            </div>
                            <h3 className="text-xl font-black mb-4">L{lecture.id}: {lecture.title}</h3>
                            <p className="text-sm text-slate-500 mb-8">{lecture.desc}</p>
                            <button className="mt-auto text-xs font-black uppercase tracking-[2px] text-indigo-400 hover:text-white flex items-center gap-2">
                                Learn More <ArrowRight className="w-3 h-3" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Mission Section */}
            <section className="bg-indigo-600 py-32 px-8 overflow-hidden relative">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-12 text-white/95">
                        GROWING THE UKRAINIAN <br /> SOLANA ECOSYSTEM
                    </h2>
                    <p className="text-indigo-100 text-lg md:text-xl font-medium leading-relaxed mb-12 opacity-80">
                        Superteam Ukraine connects the best Ukrainian talent with opportunities. We help you find jobs, get grants, and launch your projects.
                    </p>
                    <div className="flex justify-center flex-wrap gap-8">
                        <div className="flex items-center gap-4 text-white font-bold group cursor-pointer">
                            <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-indigo-600 transition-all"><BookOpen className="w-5 h-5" /></span>
                            <span>View Full Syllabus</span>
                        </div>
                        <div className="flex items-center gap-4 text-white font-bold group cursor-pointer">
                            <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-indigo-600 transition-all"><ExternalLink className="w-5 h-5" /></span>
                            <span>Connect Community</span>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-400/20 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />
            </section>

            {/* Final Call to Action */}
            <footer className="py-20 px-8 text-center text-slate-600">
                <div className="max-w-6xl mx-auto border-t border-slate-900 pt-16 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">S</div>
                        <span className="text-white font-bold tracking-widest text-xs uppercase">Superteam Ukraine</span>
                    </div>
                    <div className="flex gap-8 text-xs font-bold uppercase tracking-[2px]">
                        <a href="#" className="hover:text-indigo-400">About</a>
                        <a href="#" className="hover:text-indigo-400">Toolkit</a>
                        <a href="#" className="hover:text-indigo-400">Hackathon</a>
                    </div>
                    <p className="text-[10px] uppercase font-black tracking-widest">Mastering Solana Frontend © 2026</p>
                </div>
            </footer>

        </div>
    );
}
