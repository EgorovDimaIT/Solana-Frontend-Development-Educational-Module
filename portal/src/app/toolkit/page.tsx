// src/app/toolkit/page.tsx
'use client';

import { motion } from 'framer-motion';
import {
    Rocket,
    Terminal,
    BookOpen,
    ShieldCheck,
    Zap,
    FileText,
    Layout,
    Code,
    Code2,
    CheckCircle,
    Copy,
    ExternalLink,
    Terminal as GithubIcon
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const STARTER_KITS = [
    {
        title: 'create-solana-dapp',
        description: 'The industry standard. Scaffolds a full-stack Next.js dApp with Anchor and Wallet Adapter.',
        command: 'npx create-solana-dapp@latest',
        link: 'https://github.com/solana-developers/create-solana-dapp',
        tags: ['Official', 'Next.js', 'Anchor']
    },
    {
        title: 'Helius Starter Kit',
        description: 'Powerful webhooks, compression, and DAS API integration. Essential for high-performance apps.',
        command: 'git clone https://github.com/helius-labs/helius-nextjs-starter',
        link: 'https://github.com/helius-labs/helius-nextjs-starter',
        tags: ['RPC', 'Helius', 'Webhooks']
    },
    {
        title: 'Solana Mobile Stack (SMS)',
        description: 'Build native mobile apps on Solana using React Native and Mobile Wallet Adapter.',
        command: 'npx create-solana-mobile-app',
        link: 'https://github.com/solana-mobile/solana-mobile-stack-sdk',
        tags: ['Mobile', 'ReactNative', 'MWA']
    },
];

const CURRICULUM_SLIDES = [
    {
        id: 1,
        title: 'Module 1: Foundations',
        topics: ['Accounts vs Files', 'Rent on Solana', 'Transaction MTU (1232 bytes)', 'RPC JSON-RPC spec'],
        downloadLink: '#'
    },
    {
        id: 2,
        title: 'Module 2: The User Layer',
        topics: ['Wallet Security (BIP-39)', 'Provider Pattern', 'Signature UX', 'Atomic Signing'],
        downloadLink: '#'
    },
    {
        id: 3,
        title: 'Module 3: On-Chain Assets',
        topics: ['SPL Token Standard', 'NFT Metadata (Token Metadata)', 'PDA (Program Derived Addresses)', 'Anchor IDL Deserialization'],
        downloadLink: '#'
    },
    {
        id: 4,
        title: 'Module 4: Scaling & Reliability',
        topics: ['RPC Priority Fees (QUIC)', 'Transaction Simulation', 'Error Classification', 'Mainnet Checklists'],
        downloadLink: '#'
    },
];

export default function ToolkitPage() {
    const [copied, setCopied] = useState<string | null>(null);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="min-h-screen text-slate-100 selection:bg-indigo-500/40 selection:text-white relative overflow-hidden">
            <div className="fixed inset-0 bg-[#020617] -z-20" />
            <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

            {/* Navigation Header */}
            <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 p-6 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                            <Rocket className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black uppercase tracking-tighter text-white">Solana Hub</span>
                    </Link>

                    <div className="flex gap-8">
                        <Link href="/" className="text-sm font-black uppercase tracking-widest text-slate-400 hover:text-white transition">Academy</Link>
                        <Link href="/toolkit" className="text-sm font-black uppercase tracking-widest text-white border-b-2 border-indigo-500 pb-1">Toolkit</Link>
                        <Link href="/progress" className="text-sm font-black uppercase tracking-widest text-slate-400 hover:text-white transition">Progress</Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-8 py-20 relative z-10">
                {/* Hero Section */}
                <div className="mb-32 text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="text-xs font-black uppercase tracking-[6px] text-indigo-400 mb-6 block">Developer Armory</span>
                        <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tighter text-white mb-8 leading-[0.95]">Hackathon Ready toolkit</h1>
                        <p className="text-slate-400 text-xl font-medium leading-relaxed">
                            Skip the boilerplate. Use these battle-tested starter kits and cheat sheets to build your next winner on Solana.
                        </p>
                    </motion.div>
                </div>

                {/* Section 1: Starter Kits */}
                <section className="mb-32">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 font-black">
                            <Terminal className="text-indigo-400" />
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Starter Kits & Commands</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {STARTER_KITS.map((kit, idx) => (
                            <motion.div
                                key={kit.title}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <div className="bg-white/5 border border-white/10 rounded-[48px] p-10 hover:border-indigo-500/50 transition-all group flex flex-col h-full">
                                    <div className="flex gap-2 mb-6 flex-wrap">
                                        {kit.tags.map(tag => (
                                            <span key={tag} className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">{tag}</span>
                                        ))}
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-4 group-hover:text-indigo-400 transition-colors">{kit.title}</h3>
                                    <p className="text-slate-400 font-medium mb-10 flex-1">{kit.description}</p>

                                    <div className="bg-black/60 rounded-3xl p-6 mb-8 relative border border-white/5 font-mono text-sm text-indigo-300">
                                        <div className="break-all pr-10">{kit.command}</div>
                                        <button
                                            onClick={() => copyToClipboard(kit.command)}
                                            className="absolute top-1/2 -translate-y-1/2 right-4 text-white/40 hover:text-white transition"
                                        >
                                            {copied === kit.command ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    <a
                                        href={kit.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition active:scale-95"
                                    >
                                        <GithubIcon className="w-5 h-5" /> Source Code
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Section 2: Educational Outlines (The 'Slides' requirement) */}
                <section className="mb-32">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 bg-emerald-600/20 rounded-2xl flex items-center justify-center border border-emerald-500/30 font-black">
                            <Layout className="text-emerald-400" />
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Lecture Slide Structures</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {CURRICULUM_SLIDES.map(slide => (
                            <div key={slide.id} className="bg-white/5 border border-white/10 rounded-[32px] p-8 hover:bg-white/[0.08] transition-colors group">
                                <div className="text-emerald-500 font-black text-[10px] uppercase tracking-widest mb-6">Course Material</div>
                                <h3 className="font-black text-xl uppercase tracking-tighter mb-8 leading-tight text-white group-hover:text-emerald-400 transition-colors">{slide.title}</h3>
                                <ul className="space-y-3 mb-10">
                                    {slide.topics.map(topic => (
                                        <li key={topic} className="flex items-center gap-3 text-sm text-slate-400 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                            {topic}
                                        </li>
                                    ))}
                                </ul>
                                <button className="w-full bg-black/40 border border-white/10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition flex items-center justify-center gap-2 text-white">
                                    <FileText className="w-4 h-4" /> COMPANION GUIDE
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-3xl font-bold">🏫</div>
                            <div>
                                <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Teaching Package</h4>
                                <p className="text-indigo-200/60 font-medium">All MD lecture source files available for conversion to Slides (Canva/Marp).</p>
                            </div>
                        </div>
                        <Link href="/lectures/1" className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase tracking-widest text-white transition active:scale-95 shadow-xl shadow-indigo-600/20">
                            OPEN ACADEMY
                        </Link>
                    </div>
                </section>

                {/* Section 3: Cheat Sheet */}
                <section>
                    <div className="bg-gradient-to-br from-indigo-900/40 via-slate-900 to-indigo-900/20 border border-indigo-500/20 rounded-[56px] p-12 md:p-20 relative overflow-hidden">
                        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] pointer-events-none" />

                        <div className="flex flex-col md:flex-row gap-20">
                            <div className="flex-1">
                                <span className="text-xs font-black uppercase tracking-[5px] text-indigo-400 mb-6 block">Quick Reference</span>
                                <h2 className="text-5xl font-black uppercase tracking-tighter text-white mb-4">Solana Context Cheat Sheet</h2>
                                <p className="text-slate-400 text-lg font-medium leading-relaxed mb-12">
                                    Crucial data for high-pressure hackathon coding.
                                </p>

                                <div className="space-y-8">
                                    <div className="flex gap-6 items-start">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl border border-white/10 shrink-0">⚡</div>
                                        <div>
                                            <h4 className="font-bold text-white uppercase text-lg mb-1">Transaction Limits</h4>
                                            <p className="text-slate-500 text-sm">MTU: 1232 bytes. Max instructions count depends on accounts list length. Pack efficiently!</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl border border-white/10 shrink-0">💰</div>
                                        <div>
                                            <h4 className="font-bold text-white uppercase text-lg mb-1">Priority Fees</h4>
                                            <p className="text-slate-500 text-sm">Always implement ComputeBudgetProgram instructions to avoid dropped transactions during congestion.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl border border-white/10 shrink-0">🤝</div>
                                        <div>
                                            <h4 className="font-bold text-white uppercase text-lg mb-1">PDA Logic</h4>
                                            <p className="text-slate-500 text-sm">Seeds map logic to unique addresses. Use `findProgramAddressSync` for deterministic client-side address calculation.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 bg-black/40 backdrop-blur-3xl rounded-[40px] p-10 border border-white/5">
                                <h4 className="text-indigo-400 font-black text-xs uppercase tracking-[4px] mb-8 border-b border-white/5 pb-4">Essential Code Snippets</h4>
                                <div className="space-y-6">
                                    <div>
                                        <span className="text-[10px] font-black uppercase text-slate-500 block mb-3">Check if Account Exists</span>
                                        <pre className="bg-black/80 p-5 rounded-2xl text-emerald-400 text-xs font-mono border border-white/5">
                                            {`const info = await connection.getAccountInfo(pubkey);\nif (!info) throw new Error("404!");`}
                                        </pre>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase text-slate-500 block mb-3">Get PDA Address</span>
                                        <pre className="bg-black/80 p-5 rounded-2xl text-indigo-400 text-xs font-mono border border-white/5">
                                            {`const [pda] = PublicKey.findProgramAddressSync(\n  [Buffer.from("vault"), user.toBuffer()],\n  programId\n);`}
                                        </pre>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase text-slate-500 block mb-3">Transaction Confirmation</span>
                                        <pre className="bg-black/80 p-5 rounded-2xl text-amber-400 text-xs font-mono border border-white/5">
                                            {`const { blockhash, lastValidBlockHeight } = \n  await connection.getLatestBlockhash();\nawait connection.confirmTransaction({\n  signature, blockhash, lastValidBlockHeight\n});`}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-20 text-center border-t border-white/5 mt-20">
                <p className="text-slate-600 font-black text-[10px] uppercase tracking-[8px]">Open Source Educational Resource • Built for Hackathon Excellence</p>
            </footer>
        </div>
    );
}
