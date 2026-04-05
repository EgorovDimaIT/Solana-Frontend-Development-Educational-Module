// portal/app/games/transaction-builder/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUp, ArrowDown, Trash2, Plus, Play, Send, RotateCcw, Code, Terminal, Layers, Star, ShieldCheck, Zap } from 'lucide-react';

// ═══════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════

interface Instruction {
  id: string;
  type: 'transfer' | 'createAccount' | 'mintTo' | 'burn' | 'closeAccount';
  icon: string;
  label: string;
  color: string;
  description: string;
  accounts: InstructionAccount[];
  data: InstructionData[];
  computeUnits: number;
  fee: number;
}

interface InstructionAccount {
  name: string;
  role: 'signer' | 'writable' | 'readonly';
  value: string;
  placeholder: string;
}

interface InstructionData {
  name: string;
  type: 'number' | 'text' | 'select';
  value: string;
  placeholder: string;
  options?: string[];
}

interface TransactionState {
  instructions: Instruction[];
  feePayer: string;
  recentBlockhash: string;
  totalFee: number;
  totalComputeUnits: number;
  status: 'building' | 'simulating' | 'ready' | 'sending' | 'confirmed' | 'failed';
  logs: string[];
  signature?: string;
}

// ═══════════════════════════════════════════════
//  AVAILABLE INSTRUCTIONS
// ═══════════════════════════════════════════════

const AVAILABLE_INSTRUCTIONS: Omit<Instruction, 'id'>[] = [
  {
    type: 'transfer',
    icon: '💸',
    label: 'SOL Transfer',
    color: 'from-blue-600 to-cyan-600',
    description: 'Send SOL from one address to another',
    computeUnits: 300,
    fee: 5000,
    accounts: [
      {
        name: 'from',
        role: 'signer',
        value: '7xKj9mNpABC...sender',
        placeholder: 'Sender address',
      },
      {
        name: 'to',
        role: 'writable',
        value: '8yLk0nOpDEF...receiver',
        placeholder: 'Receiver address',
      },
    ],
    data: [
      {
        name: 'amount',
        type: 'number',
        value: '100000000',
        placeholder: 'Amount in lamports',
      },
    ],
  },
  {
    type: 'createAccount',
    icon: '🆕',
    label: 'Create Account',
    color: 'from-green-600 to-teal-600',
    description: 'Create a new account on the blockchain',
    computeUnits: 800,
    fee: 5000,
    accounts: [
      {
        name: 'payer',
        role: 'signer',
        value: '7xKj9mNpABC...payer',
        placeholder: 'Rent payer',
      },
      {
        name: 'newAccount',
        role: 'signer',
        value: 'NewAcc1234...key',
        placeholder: 'New account address',
      },
    ],
    data: [
      {
        name: 'lamports',
        type: 'number',
        value: '2039280',
        placeholder: 'Rent-exempt balance',
      },
      {
        name: 'space',
        type: 'number',
        value: '165',
        placeholder: 'Data size (bytes)',
      },
      {
        name: 'owner',
        type: 'text',
        value: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        placeholder: 'Owner program',
      },
    ],
  },
  {
    type: 'mintTo',
    icon: '🪙',
    label: 'Mint Tokens',
    color: 'from-purple-600 to-pink-600',
    description: 'Issue SPL tokens to an address',
    computeUnits: 4000,
    fee: 5000,
    accounts: [
      {
        name: 'mint',
        role: 'writable',
        value: 'MintAddr...xyz',
        placeholder: 'Token mint address',
      },
      {
        name: 'destination',
        role: 'writable',
        value: 'TokenAcc...dest',
        placeholder: 'Receiver Token Account',
      },
      {
        name: 'authority',
        role: 'signer',
        value: 'Authority...key',
        placeholder: 'Mint Authority',
      },
    ],
    data: [
      {
        name: 'amount',
        type: 'number',
        value: '1000000000',
        placeholder: 'Amount (with decimals)',
      },
    ],
  },
  {
    type: 'burn',
    icon: '🔥',
    label: 'Burn Tokens',
    color: 'from-red-600 to-orange-600',
    description: 'Permanently destroy SPL tokens',
    computeUnits: 4000,
    fee: 5000,
    accounts: [
      {
        name: 'account',
        role: 'writable',
        value: 'TokenAcc...burn',
        placeholder: 'Token Account to burn from',
      },
      {
        name: 'mint',
        role: 'writable',
        value: 'MintAddr...xyz',
        placeholder: 'Mint address',
      },
      {
        name: 'owner',
        role: 'signer',
        value: 'Owner...key',
        placeholder: 'Account owner',
      },
    ],
    data: [
      {
        name: 'amount',
        type: 'number',
        value: '500000000',
        placeholder: 'Amount to burn',
      },
    ],
  },
  {
    type: 'closeAccount',
    icon: '🗑️',
    label: 'Close Account',
    color: 'from-gray-600 to-gray-700',
    description: 'Close token account and recover rent SOL',
    computeUnits: 3000,
    fee: 5000,
    accounts: [
      {
        name: 'account',
        role: 'writable',
        value: 'TokenAcc...close',
        placeholder: 'Account to close',
      },
      {
        name: 'destination',
        role: 'writable',
        value: 'Recv...sol',
        placeholder: 'SOL recipient',
      },
      {
        name: 'owner',
        role: 'signer',
        value: 'Owner...key',
        placeholder: 'Owner',
      },
    ],
    data: [],
  },
];

// ═══════════════════════════════════════════════
//  COMPONENT
// ═══════════════════════════════════════════════

export default function TransactionBuilderGame() {
  const [tx, setTx] = useState<TransactionState>({
    instructions: [],
    feePayer: '7xKj9mNpABCDEFGHIJKLMNOPQRSTUVWXYZ123456',
    recentBlockhash: 'EkSnNWid2cvwEVnVx9aBqawnmiCNiDgp3gUdkDPTKN1N',
    totalFee: 0,
    totalComputeUnits: 0,
    status: 'building',
    logs: [],
  });

  const [activeTab, setActiveTab] = useState<'builder' | 'json' | 'logs'>('builder');
  const [score, setScore] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  // Add instruction
  const addInstruction = (template: Omit<Instruction, 'id'>) => {
    const newInstruction: Instruction = {
      ...template,
      id: `ix-${Date.now()}`,
      accounts: template.accounts.map(a => ({ ...a })),
      data: template.data.map(d => ({ ...d })),
    };

    setTx(prev => ({
      ...prev,
      instructions: [...prev.instructions, newInstruction],
      totalFee: prev.totalFee + template.fee,
      totalComputeUnits: prev.totalComputeUnits + template.computeUnits,
      status: 'building',
      logs: [
        ...prev.logs,
        `[${new Date().toLocaleTimeString()}] ➕ Added instruction: ${template.label}`,
      ],
    }));

    setScore(prev => prev + 5);
  };

  // Remove instruction
  const removeInstruction = (id: string) => {
    const ix = tx.instructions.find(i => i.id === id);
    if (!ix) return;

    setTx(prev => ({
      ...prev,
      instructions: prev.instructions.filter(i => i.id !== id),
      totalFee: prev.totalFee - ix.fee,
      totalComputeUnits: prev.totalComputeUnits - ix.computeUnits,
      logs: [
        ...prev.logs,
        `[${new Date().toLocaleTimeString()}] ❌ Removed: ${ix.label}`,
      ],
    }));
  };

  // Move instruction
  const moveInstruction = (id: string, direction: 'up' | 'down') => {
    const idx = tx.instructions.findIndex(i => i.id === id);
    if (
      (direction === 'up' && idx === 0) ||
      (direction === 'down' && idx === tx.instructions.length - 1)
    ) return;

    const newInstructions = [...tx.instructions];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newInstructions[idx], newInstructions[swapIdx]] = [
      newInstructions[swapIdx],
      newInstructions[idx],
    ];

    setTx(prev => ({
      ...prev,
      instructions: newInstructions,
      logs: [
        ...prev.logs,
        `[${new Date().toLocaleTimeString()}] 🔄 Reordered instructions`,
      ],
    }));
  };

  // Simulate transaction
  const simulateTransaction = async () => {
    if (tx.instructions.length === 0) return;

    setTx(prev => ({ ...prev, status: 'simulating' }));
    setScore(prev => prev + 10);

    const newLogs = [
      `[${new Date().toLocaleTimeString()}] 🔍 Starting simulation...`,
    ];

    await new Promise(r => setTimeout(r, 500));
    newLogs.push(`[${new Date().toLocaleTimeString()}] ✅ Fee payer: ${tx.feePayer.slice(0, 8)}...`);

    await new Promise(r => setTimeout(r, 400));
    newLogs.push(`[${new Date().toLocaleTimeString()}] ✅ Blockhash valid: ${tx.recentBlockhash.slice(0, 8)}...`);

    for (const ix of tx.instructions) {
      await new Promise(r => setTimeout(r, 300));
      newLogs.push(`[${new Date().toLocaleTimeString()}] ▶ Processing: ${ix.label}`);

      for (const acc of ix.accounts) {
        newLogs.push(
          `[${new Date().toLocaleTimeString()}]   └─ ${acc.name} [${acc.role}]: ${acc.value.slice(0, 12)}...`
        );
      }
    }

    await new Promise(r => setTimeout(r, 400));
    newLogs.push(`[${new Date().toLocaleTimeString()}] 💰 Total fee: ${tx.totalFee} lamports`);
    newLogs.push(`[${new Date().toLocaleTimeString()}] ⚡ Compute units: ${tx.totalComputeUnits}`);
    newLogs.push(`[${new Date().toLocaleTimeString()}] ✅ Simulation PASSED`);

    setTx(prev => ({
      ...prev,
      status: 'ready',
      logs: [...prev.logs, ...newLogs],
    }));

    setActiveTab('logs');
  };

  // Send transaction (simulation)
  const sendTransaction = async () => {
    if (tx.status !== 'ready') return;

    setTx(prev => ({ ...prev, status: 'sending' }));
    setScore(prev => prev + 20);

    const fakeSig = Array.from({ length: 64 }, () =>
      '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('');

    const newLogs = [
      `[${new Date().toLocaleTimeString()}] 📡 Broadcasting to network...`,
    ];

    await new Promise(r => setTimeout(r, 800));
    newLogs.push(`[${new Date().toLocaleTimeString()}] ⏳ Waiting for confirmation...`);

    await new Promise(r => setTimeout(r, 1200));
    newLogs.push(`[${new Date().toLocaleTimeString()}] ✅ CONFIRMED!`);
    newLogs.push(`[${new Date().toLocaleTimeString()}] 🔗 Signature: ${fakeSig.slice(0, 20)}...`);
    newLogs.push(
      `[${new Date().toLocaleTimeString()}] 🌐 Explorer: https://explorer.solana.com/tx/${fakeSig.slice(0, 12)}...?cluster=devnet`
    );

    setTx(prev => ({
      ...prev,
      status: 'confirmed',
      signature: fakeSig,
      logs: [...prev.logs, ...newLogs],
    }));

    setActiveTab('logs');
  };

  // Reset
  const reset = () => {
    setTx({
      instructions: [],
      feePayer: '7xKj9mNpABCDEFGHIJKLMNOPQRSTUVWXYZ123456',
      recentBlockhash: 'EkSnNWid2cvwEVnVx9aBqawnmiCNiDgp3gUdkDPTKN1N',
      totalFee: 0,
      totalComputeUnits: 0,
      status: 'building',
      logs: [`[${new Date().toLocaleTimeString()}] 🔄 Transaction reset`],
    });
    setScore(prev => prev + 2);
  };

  // JSON representation of transaction
  const txJSON = {
    feePayer: tx.feePayer,
    recentBlockhash: tx.recentBlockhash,
    instructions: tx.instructions.map(ix => ({
      programId:
        ix.type === 'transfer'
          ? '11111111111111111111111111111111'
          : 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
      keys: ix.accounts.map(a => ({
        pubkey: a.value,
        isSigner: a.role === 'signer',
        isWritable: a.role === 'writable',
      })),
      data: Object.fromEntries(ix.data.map(d => [d.name, d.value])),
    })),
    estimatedFee: `${tx.totalFee} lamports`,
    computeUnits: tx.totalComputeUnits,
  };

  const statusColors: Record<TransactionState['status'], string> = {
    building: 'text-yellow-400',
    simulating: 'text-blue-400',
    ready: 'text-green-400',
    sending: 'text-purple-400',
    confirmed: 'text-green-500',
    failed: 'text-red-400',
  };

  const statusLabels: Record<TransactionState['status'], string> = {
    building: '🔨 Building',
    simulating: '🔍 Simulating...',
    ready: '✅ Ready to Send',
    sending: '📡 Sending...',
    confirmed: '🎉 Confirmed!',
    failed: '❌ Failed',
  };

  // ══════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════

  return (
    <div className="min-h-screen text-slate-100 p-6 font-sans relative overflow-x-hidden">
      <div className="fixed inset-0 bg-[#0b0e14] -z-20" />
      <div className="fixed top-0 left-1/4 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="bg-white/5 p-3 rounded-2xl hover:bg-white/10 transition">
              <RotateCcw className="w-5 h-5 text-slate-400" />
            </Link>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Transaction Builder</h1>
              <p className="text-slate-400 font-medium">Build and simulate complex Solana transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-amber-500/10 border border-amber-500/20 px-6 py-3 rounded-2xl flex items-center gap-3">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="text-amber-500 font-black text-lg tracking-tight">{score}</span>
            </div>
            <div className={`font-black px-6 py-3 rounded-2xl bg-white/5 border border-white/10 uppercase tracking-widest text-xs flex items-center gap-2 ${statusColors[tx.status]}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              {statusLabels[tx.status]}
            </div>
          </div>
        </div>

        <div className="grid xl:grid-cols-12 gap-8">

          {/* LEFT: Instruction Palette */}
          <div className="xl:col-span-4">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <h2 className="text-xs font-black uppercase tracking-[4px] text-indigo-400/70">Instruction Palette</h2>
              <Layers className="w-4 h-4 text-indigo-500/50" />
            </div>
            <div className="space-y-4">
              {AVAILABLE_INSTRUCTIONS.map((ix, i) => (
                <div
                  key={i}
                  className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 cursor-pointer hover:border-indigo-500/50 transition-all group relative overflow-hidden active:scale-95"
                  onClick={() => addInstruction(ix)}
                >
                  <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-600 transition-colors">
                      {ix.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-black uppercase tracking-tighter text-lg leading-tight group-hover:text-indigo-400 transition text-white">
                        {ix.label}
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 group-hover:text-indigo-300/70 transition">
                        {ix.computeUnits} CU • {ix.fee} lamports
                      </div>
                    </div>
                    <Plus className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition" />
                  </div>
                  <p className="text-slate-300 text-sm font-medium leading-relaxed relative z-10">{ix.description}</p>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-8 p-6 bg-slate-900/30 border border-white/5 rounded-3xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Account Roles
              </h3>
              <div className="space-y-3 text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-slate-500">Signer — <span className="text-slate-300">Authority needed</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-slate-500">Writable — <span className="text-slate-300">State mutated</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-slate-700" />
                  <span className="text-slate-500">Readonly — <span className="text-slate-300">Reference only</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Transaction Builder */}
          <div className="xl:col-span-8">

            {/* Tabs */}
            <div className="flex gap-2 mb-6 bg-white/[0.05] p-2 rounded-2xl w-fit border border-white/10 backdrop-blur-md">
              {(['builder', 'json', 'logs'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 ring-1 ring-white/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {tab === 'builder' ? <Plus className="w-3 h-3" /> : tab === 'json' ? <Code className="w-3 h-3" /> : <Terminal className="w-3 h-3" />}
                  {tab}
                  {tab === 'logs' && tx.logs.length > 0 && (
                    <span className="bg-white/20 text-white px-2 rounded-md tabular-nums">
                      {tx.logs.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* BUILDER TAB */}
            {activeTab === 'builder' && (
              <div className="space-y-6">
                {/* Fee Payer */}
                <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden group">
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">
                        Fee Payer Account
                      </div>
                      <div className="font-mono text-sm text-indigo-200">
                        {tx.feePayer}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructions List */}
                {tx.instructions.length === 0 ? (
                  <div
                    className={`border-4 border-dashed rounded-[48px] p-24 text-center transition-all ${dragOver
                      ? 'border-indigo-500 bg-indigo-500/5'
                      : 'border-white/5 bg-slate-900/20'
                      }`}
                    onDragOver={e => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                  >
                    <div className="text-6xl mb-6 opacity-20">🔨</div>
                    <p className="text-slate-400 text-xl font-black uppercase tracking-tight mb-2">
                      Build your sequence
                    </p>
                    <p className="text-slate-600 font-medium max-w-xs mx-auto">
                      Select instructions from the left to build your transaction. Order matters!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tx.instructions.map((ix, idx) => (
                      <div
                        key={ix.id}
                        className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl transition-all hover:border-white/20"
                      >
                        {/* Instruction Header */}
                        <div
                          className={`bg-gradient-to-r ${ix.color} p-6 flex items-center gap-4`}
                        >
                          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-md">
                            {ix.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-black uppercase tracking-tight text-lg">
                              {idx + 1}. {ix.label}
                            </div>
                            <div className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                              {ix.computeUnits} CU • {ix.fee} lamports
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => moveInstruction(ix.id, 'up')}
                              disabled={idx === 0}
                              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 transition"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => moveInstruction(ix.id, 'down')}
                              disabled={idx === tx.instructions.length - 1}
                              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 transition"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeInstruction(ix.id)}
                              className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 transition text-rose-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Instruction Body */}
                        <div className="p-8">
                          <div className="grid md:grid-cols-2 gap-10">
                            {/* Accounts */}
                            <div>
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 border-b border-white/5 pb-2">
                                Account Keys
                              </h4>
                              <div className="space-y-4">
                                {ix.accounts.map(acc => (
                                  <div key={acc.name}>
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                        {acc.name}
                                      </span>
                                      <span
                                        className={`text-[8px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest ${acc.role === 'signer'
                                          ? 'bg-amber-500/10 text-amber-500'
                                          : acc.role === 'writable'
                                            ? 'bg-blue-500/10 text-blue-500'
                                            : 'bg-slate-800 text-slate-500'
                                          }`}
                                      >
                                        {acc.role}
                                      </span>
                                    </div>
                                    <input
                                      type="text"
                                      value={acc.value}
                                      onChange={e => {
                                        const newInstructions = [...tx.instructions];
                                        const ixIdx = newInstructions.findIndex(
                                          i => i.id === ix.id
                                        );
                                        const accIdx = newInstructions[
                                          ixIdx
                                        ].accounts.findIndex(a => a.name === acc.name);
                                        newInstructions[ixIdx].accounts[accIdx].value =
                                          e.target.value;
                                        setTx(prev => ({ ...prev, instructions: newInstructions }));
                                      }}
                                      className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs font-mono text-indigo-200 focus:border-indigo-500 outline-none transition"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Data */}
                            {ix.data.length > 0 && (
                              <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 border-b border-white/5 pb-2">
                                  Instruction Data
                                </h4>
                                <div className="space-y-4">
                                  {ix.data.map(field => (
                                    <div key={field.name}>
                                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                                        {field.name}
                                      </label>
                                      <input
                                        type={field.type === 'number' ? 'number' : 'text'}
                                        value={field.value}
                                        onChange={e => {
                                          const newInstructions = [...tx.instructions];
                                          const ixIdx = newInstructions.findIndex(
                                            i => i.id === ix.id
                                          );
                                          const fIdx = newInstructions[
                                            ixIdx
                                          ].data.findIndex(d => d.name === field.name);
                                          newInstructions[ixIdx].data[fIdx].value =
                                            e.target.value;
                                          setTx(prev => ({
                                            ...prev,
                                            instructions: newInstructions,
                                          }));
                                        }}
                                        className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs font-mono text-emerald-400 focus:border-emerald-500 outline-none transition"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Summary & Actions */}
                {tx.instructions.length > 0 && (
                  <div className="bg-slate-900 border border-white/10 rounded-[32px] p-8 shadow-2xl">
                    <div className="grid grid-cols-3 gap-6 mb-8">
                      <div className="bg-white/2 p-4 rounded-2xl text-center">
                        <div className="text-3xl font-black text-indigo-400 tracking-tighter">
                          {tx.instructions.length}
                        </div>
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Instructions</div>
                      </div>
                      <div className="bg-white/2 p-4 rounded-2xl text-center">
                        <div className="text-3xl font-black text-amber-500 tracking-tighter">
                          {tx.totalFee}
                        </div>
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Total Fee</div>
                      </div>
                      <div className="bg-white/2 p-4 rounded-2xl text-center">
                        <div className="text-3xl font-black text-purple-400 tracking-tighter">
                          {tx.totalComputeUnits}
                        </div>
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Units (CU)</div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={reset}
                        className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition flex items-center gap-2"
                      >
                        <RotateCcw className="w-3 h-3" /> RESET
                      </button>
                      <button
                        onClick={simulateTransaction}
                        disabled={['simulating', 'sending'].includes(tx.status)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                      >
                        {tx.status === 'simulating' ? <Zap className="w-3 h-3 animate-pulse" /> : <Play className="w-3 h-3" />}
                        {tx.status === 'simulating' ? 'SIMULATING...' : 'SIMULATE'}
                      </button>
                      <button
                        onClick={sendTransaction}
                        disabled={tx.status !== 'ready'}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                      >
                        {tx.status === 'sending' ? <Zap className="w-3 h-3 animate-pulse" /> : <Send className="w-3 h-3" />}
                        {tx.status === 'sending' ? 'SENDING...' : 'BROADCAST TX'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Success Banner */}
                {tx.status === 'confirmed' && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-[40px] p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[80px] rounded-full" />
                    <div className="text-6xl mb-6 scale-125">🎈</div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-emerald-400 mb-4">
                      Transaction Finalized
                    </h3>
                    <p className="text-emerald-200/60 text-xs font-mono break-all mb-8 max-w-lg mx-auto leading-relaxed">
                      {tx.signature}
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={reset}
                        className="bg-emerald-600 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition shadow-xl shadow-emerald-600/20"
                      >
                        NEW BUILD
                      </button>
                      <Link
                        href="/quiz/2"
                        className="bg-white/5 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition border border-white/5"
                      >
                        COMPLETE TEST
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* JSON TAB */}
            {activeTab === 'json' && (
              <div className="bg-slate-900 border border-white/10 rounded-[40px] p-10 shadow-2xl relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <Code className="w-12 h-12 text-white/5" />
                </div>
                <div className="flex justify-between items-center mb-8 relative z-10">
                  <h3 className="font-black uppercase tracking-tighter text-2xl">Raw Transaction Data</h3>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        JSON.stringify(txJSON, null, 2)
                      );
                    }}
                    className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-indigo-400 transition"
                  >
                    COPY TO CLIPBOARD
                  </button>
                </div>
                <div className="bg-black/40 rounded-3xl p-8 border border-white/5">
                  <pre className="text-emerald-400 text-xs font-mono overflow-auto max-h-[600px] leading-relaxed scrollbar-hide">
                    {JSON.stringify(txJSON, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* LOGS TAB */}
            {activeTab === 'logs' && (
              <div className="bg-slate-950 border border-white/10 rounded-[40px] p-10 shadow-2xl relative font-mono">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-black uppercase tracking-tighter text-2xl text-slate-400">System Logs</h3>
                  <button
                    onClick={() => setTx(prev => ({ ...prev, logs: [] }))}
                    className="text-[9px] font-black uppercase tracking-widest text-slate-700 hover:text-rose-400 transition"
                  >
                    PURGE LOGS
                  </button>
                </div>
                <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide">
                  {tx.logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 opacity-20">
                      <Terminal className="w-12 h-12 mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest">No activity reported</p>
                    </div>
                  ) : (
                    tx.logs.map((log, i) => (
                      <div
                        key={i}
                        className={`text-[11px] p-3 rounded-xl border border-white/5 leading-relaxed ${log.includes('✅')
                          ? 'bg-emerald-500/5 text-emerald-400/80'
                          : log.includes('❌')
                            ? 'bg-rose-500/5 text-rose-400/80'
                            : log.includes('⏳') || log.includes('🔍')
                              ? 'bg-indigo-500/5 text-indigo-300'
                              : 'bg-white/2 text-slate-500 font-medium'
                          }`}
                      >
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

