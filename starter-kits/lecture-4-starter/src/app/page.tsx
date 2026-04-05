'use client';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';
import { Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { ShieldCheck, Activity, Terminal, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductionDashboard() {
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const [simulation, setSimulation] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('0.1');

    const simulateTx = async () => {
        if (!publicKey) return;
        setLoading(true);
        setSimulation(null);

        try {
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new PublicKey(recipient),
                    lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
                })
            );
            transaction.feePayer = publicKey;
            transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

            const response = await connection.simulateTransaction(transaction);
            setSimulation({
                success: !response.value.err,
                logs: response.value.logs,
                unitsConsumed: response.value.unitsConsumed,
                error: response.value.err
            });
        } catch (err: any) {
            setSimulation({ success: false, error: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] text-[#FAFAFA] p-6 lg:p-12 selection:bg-cyan-500/30">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">

                {/* Sidebar / Settings */}
                <aside className="lg:col-span-4 space-y-8">
                    <header className="mb-12">
                        <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-4">Production Ops</h1>
                        <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-transparent to-transparent opacity-20" />
                    </header>

                    <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-2xl ring-1 ring-white/5">
                        <h2 className="text-xs font-bold uppercase tracking-[2px] text-cyan-500 mb-6 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" /> Security Layer
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs text-slate-500 block mb-2 font-bold tracking-wider">NETWORK NODE</label>
                                <div className="bg-white/5 p-4 rounded-xl text-sm border border-white/5 font-mono text-cyan-200">api.devnet.solana.com</div>
                            </div>
                            <div className="space-y-4 pt-4">
                                <input
                                    className="w-full bg-[#0F0F0F] border border-white/10 p-4 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500 transition-all text-sm font-mono"
                                    placeholder="RECIPIENT ADDRESS"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                />
                                <input
                                    type="number"
                                    className="w-full bg-[#0F0F0F] border border-white/10 p-4 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500 transition-all text-sm font-mono"
                                    placeholder="AMOUNT (SOL)"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                                <div className="flex gap-4">
                                    <button
                                        onClick={simulateTx}
                                        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                                        disabled={loading || !publicKey || !recipient}
                                    >
                                        {loading ? 'Simulating...' : 'Run Simulation'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <WalletMultiButton className="!w-full !bg-white !text-black !rounded-xl !h-14 !font-black !uppercase !tracking-widest !text-xs hover:!bg-cyan-400 transition-all" />
                    </div>
                </aside>

                {/* Main Simulation View */}
                <div className="lg:col-span-8 flex flex-col gap-8">

                    <div className="flex-1 bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2">
                            <div className="flex items-center gap-3">
                                <Activity className="w-5 h-5 text-cyan-500" />
                                <span className="text-xs font-bold tracking-widest uppercase">Transaction Inspector</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="w-3 h-3 rounded-full bg-red-500/50" />
                                <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <span className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                        </div>

                        <div className="flex-1 p-8 font-mono text-sm overflow-y-auto max-h-[600px] custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {!simulation ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-slate-500/40 text-center uppercase tracking-tighter italic">
                                        <Terminal className="w-12 h-12 mb-4 opacity-20" />
                                        <div>Waiting for trigger event</div>
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                        <div className={`p-6 rounded-2xl flex items-center justify-between ${simulation.success ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                                            <div className="flex items-center gap-4">
                                                {simulation.success ? <CheckCircle2 className="w-8 h-8 text-cyan-500" /> : <AlertTriangle className="w-8 h-8 text-red-500" />}
                                                <div>
                                                    <div className={`font-black uppercase tracking-widest text-lg ${simulation.success ? 'text-cyan-400' : 'text-red-400'}`}>
                                                        {simulation.success ? 'PASSED CLEANLY' : 'ABORTED: EXECUTION ERROR'}
                                                    </div>
                                                    <div className="text-xs opacity-60">Compute Units: {simulation.unitsConsumed || 0} CU</div>
                                                </div>
                                            </div>
                                            {simulation.success && (
                                                <button className="bg-cyan-500 text-black px-6 py-2 rounded-lg font-black text-xs uppercase hover:bg-white transition-all">Submit to Network</button>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="text-[10px] font-bold text-slate-600 tracking-[3px] uppercase px-2 mb-4">Runtime Logs / Debug Stream</h4>
                                            {simulation.logs?.map((log: string, idx: number) => (
                                                <div key={idx} className="p-3 bg-white/[0.03] border-l-2 border-white/5 hover:border-cyan-500/50 transition-all text-xs text-slate-400 leading-relaxed font-light">
                                                    <span className="text-slate-600 mr-4 font-bold">[{idx.toString().padStart(2, '0')}]</span>
                                                    {log}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Latency', value: '42ms', color: 'text-emerald-500' },
                            { label: 'RPC Integrity', value: '99.9%', color: 'text-cyan-500' },
                            { label: 'Mainnet Load', value: 'Low', color: 'text-amber-500' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl flex justify-between items-center ring-1 ring-white/5">
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{stat.label}</p>
                                <p className={`font-black tracking-tight ${stat.color}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </main>
    );
}
