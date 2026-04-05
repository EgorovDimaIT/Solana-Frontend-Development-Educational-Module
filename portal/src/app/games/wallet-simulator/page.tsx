// portal/app/games/wallet-simulator/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

// Wallet simulator without real blockchain interaction
interface WalletState {
  balance: number;          // in SOL
  transactions: Transaction[];
  address: string;
}

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'airdrop';
  amount: number;
  from: string;
  to: string;
  fee: number;
  timestamp: Date;
  status: 'confirmed' | 'failed';
}

const INITIAL_STATE: WalletState = {
  balance: 0,
  transactions: [],
  address: '7xKj9mNpABCDEF1234567890GHIJKL9876543210XYZ',
};

type GameStep =
  | 'intro'
  | 'create-wallet'
  | 'airdrop'
  | 'send'
  | 'complete';

export default function WalletSimulatorGame() {
  const [wallet, setWallet] = useState<WalletState>(INITIAL_STATE);
  const [step, setStep] = useState<GameStep>('intro');
  const [loading, setLoading] = useState(false);
  const [sendTo, setSendTo] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  // Simulate blockchain delay
  const simulateBlockchain = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

  const handleCreateWallet = async () => {
    setLoading(true);
    setMessage('🔑 Generating keypair...');
    await simulateBlockchain(800);

    setMessage('🔒 Encrypting private key...');
    await simulateBlockchain(600);

    setMessage('✅ Wallet created!');
    await simulateBlockchain(400);

    setScore(prev => prev + 10);
    setStep('airdrop');
    setLoading(false);
    setMessage('');
  };

  const handleAirdrop = async () => {
    setLoading(true);
    setMessage('📡 Sending request to devnet faucet...');
    await simulateBlockchain(1000);

    setMessage('⏳ Waiting for transaction confirmation...');
    await simulateBlockchain(1500);

    const airdropTx: Transaction = {
      id: Math.random().toString(36).slice(2, 10).toUpperCase(),
      type: 'airdrop',
      amount: 2,
      from: 'Devnet Faucet',
      to: wallet.address,
      fee: 0,
      timestamp: new Date(),
      status: 'confirmed',
    };

    setWallet(prev => ({
      ...prev,
      balance: prev.balance + 2,
      transactions: [airdropTx, ...prev.transactions],
    }));

    setMessage('🎉 Received 2 SOL from devnet faucet!');
    setScore(prev => prev + 20);
    await simulateBlockchain(1000);
    setStep('send');
    setLoading(false);
    setMessage('');
  };

  const handleSend = async () => {
    const amount = parseFloat(sendAmount);

    if (!sendTo || sendTo.length < 32) {
      setMessage('❌ Enter a valid recipient address (32+ characters)');
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      setMessage('❌ Enter a valid amount');
      return;
    }

    const fee = 0.000005; // 5000 lamports
    if (amount + fee > wallet.balance) {
      setMessage(`❌ Insufficient funds. Need: ${amount + fee} SOL, have: ${wallet.balance} SOL`);
      return;
    }

    setLoading(true);
    setMessage('🔨 Creating transaction...');
    await simulateBlockchain(500);

    setMessage('✍️ Signing transaction...');
    await simulateBlockchain(800);

    setMessage('📡 Sending to network...');
    await simulateBlockchain(1000);

    setMessage('⏳ Waiting for confirmation (400ms in reality)...');
    await simulateBlockchain(1200);

    const tx: Transaction = {
      id: Math.random().toString(36).slice(2, 10).toUpperCase(),
      type: 'send',
      amount,
      from: wallet.address,
      to: sendTo,
      fee,
      timestamp: new Date(),
      status: 'confirmed',
    };

    setWallet(prev => ({
      ...prev,
      balance: prev.balance - amount - fee,
      transactions: [tx, ...prev.transactions],
    }));

    setMessage(`✅ Sent ${amount} SOL! Fee: ${fee} SOL`);
    setScore(prev => prev + 30);
    await simulateBlockchain(1000);
    setStep('complete');
    setLoading(false);
  };

  // ══════════════════════════════════════════════
  // INTRO
  // ══════════════════════════════════════════════
  if (step === 'intro') {
    return (
      <div className="min-h-screen text-slate-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="fixed inset-0 bg-[#0c111d] -z-20" />
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px] -z-10 pointer-events-none" />
        <div className="max-w-2xl text-center relative z-10">
          <div className="text-8xl mb-6">🎮</div>
          <h1 className="text-4xl font-black mb-4 uppercase tracking-tight">
            Wallet Simulator
          </h1>
          <p className="text-slate-400 text-lg mb-8 font-medium">
            Learn how to use a Solana wallet in a safe simulation.
            Everything like in reality, but without real money!
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8 text-center">
            {[
              { icon: '🔑', step: '1', title: 'Create Wallet' },
              { icon: '💧', step: '2', title: 'Get SOL' },
              { icon: '💸', step: '3', title: 'Send Transaction' },
            ].map(item => (
              <div key={item.step} className="bg-white/[0.03] backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-2xl group hover:border-indigo-500/30 transition-all">
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">{item.icon}</div>
                <div className="text-indigo-400 font-black text-[10px] uppercase tracking-[4px] mb-2">Step {item.step}</div>
                <div className="text-white font-black text-lg uppercase tracking-tight">{item.title}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep('create-wallet')}
            className="px-12 py-5 bg-indigo-600 rounded-2xl font-black text-lg hover:bg-indigo-500 transition shadow-xl shadow-indigo-500/20"
          >
            🚀 START GAME
          </button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // MAIN GAME LAYOUT
  // ══════════════════════════════════════════════
  return (
    <div className="min-h-screen text-slate-100 p-8 font-sans relative overflow-x-hidden">
      <div className="fixed inset-0 bg-[#0b0e14] -z-20" />
      <div className="fixed top-0 left-1/4 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-6">
            <Link href="/" className="bg-white/5 p-3 rounded-2xl hover:bg-white/10 transition">
              <span className="text-slate-400 font-black text-[10px] uppercase tracking-[2px]">← Back</span>
            </Link>
            <h1 className="text-3xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Wallet Simulator</h1>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 px-8 py-4 rounded-[24px] backdrop-blur-md shadow-xl shadow-amber-500/5">
            <span className="text-amber-500 font-black tracking-[4px] uppercase text-sm">⭐ {score} XP POWER</span>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-4 mb-12">
          {(['create-wallet', 'airdrop', 'send', 'complete'] as GameStep[]).map((s, i) => (
            <div
              key={s}
              className={`flex-1 h-3 rounded-full transition-all duration-700 ${step === s
                ? 'bg-indigo-500 shadow-lg shadow-indigo-500/30'
                : ['complete'].includes(step) || i < ['create-wallet', 'airdrop', 'send', 'complete'].indexOf(step)
                  ? 'bg-emerald-500'
                  : 'bg-white/5'
                }`}
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Action Panel */}
          <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[48px] p-12 border border-white/10 shadow-2xl">
            {step === 'create-wallet' && (
              <div>
                <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">🔑 Step 1: Creation</h2>
                <p className="text-slate-400 mb-8 font-medium">
                  In reality, Solana uses Ed25519 cryptography to generate a key pair.
                  Click the button to simulate this process.
                </p>
                <div className="bg-black/40 p-8 rounded-3xl mb-8 font-mono text-sm border border-white/5">
                  <p className="text-slate-500 mb-2">// Generation code:</p>
                  <p className="text-emerald-400 mb-4 font-bold">
                    const keypair = Keypair.generate();
                  </p>
                  <p className="text-slate-500 mb-2">// Public Key (safe to share):</p>
                  <p className="text-indigo-300 text-xs break-all bg-indigo-500/5 p-3 rounded-lg border border-indigo-500/10">{wallet.address}</p>
                </div>
                {message && (
                  <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl mb-6 text-indigo-300 text-sm font-bold uppercase tracking-wider text-center">
                    {message}
                  </div>
                )}
                <button
                  onClick={handleCreateWallet}
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-5 rounded-2xl font-black text-xl transition shadow-xl shadow-indigo-500/20 uppercase"
                >
                  {loading ? 'Creating...' : 'Generate Key'}
                </button>
              </div>
            )}

            {step === 'airdrop' && (
              <div>
                <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">💧 Step 2: Airdrop</h2>
                <p className="text-slate-400 mb-8 font-medium">
                  In test networks (Devnet), you can request free tokens. On Mainnet, this doesn't exist — you must buy SOL.
                </p>
                <div className="bg-black/40 p-8 rounded-3xl mb-8 font-mono text-sm border border-white/5">
                  <p className="text-slate-500 mb-2">// Request SOL:</p>
                  <p className="text-emerald-400 font-bold">
                    await connection.requestAirdrop(
                  </p>
                  <p className="text-emerald-400 ml-4 font-bold">
                    publicKey, 2 * LAMPORTS_PER_SOL
                  </p>
                  <p className="text-emerald-400 font-bold">
                    );
                  </p>
                </div>
                {message && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl mb-6 text-emerald-400 text-sm font-bold uppercase tracking-wider text-center">
                    {message}
                  </div>
                )}
                <button
                  onClick={handleAirdrop}
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 py-5 rounded-2xl font-black text-xl transition shadow-xl shadow-emerald-500/20 uppercase"
                >
                  {loading ? 'Wait...' : 'Get 2 SOL'}
                </button>
              </div>
            )}

            {step === 'send' && (
              <div>
                <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">💸 Step 3: Transfer</h2>
                <p className="text-slate-400 mb-8 font-medium">
                  Send your received SOL to a test address. Pay attention to the transaction fee.
                </p>
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                      Recipient
                    </label>
                    <input
                      type="text"
                      placeholder="Solana address"
                      value={sendTo}
                      onChange={e => setSendTo(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white text-sm font-mono focus:border-indigo-500 outline-none transition"
                    />
                    <button
                      onClick={() => setSendTo('8xLj5mKpQRSTUV9876543210WXYZ1234567890abcdefg')}
                      className="text-indigo-400 text-xs mt-3 uppercase font-black tracking-widest hover:text-white transition"
                    >
                      🧪 Use test address
                    </button>
                  </div>
                  <div>
                    <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                      Amount (SOL)
                    </label>
                    <input
                      type="number"
                      placeholder="0.1"
                      step="0.1"
                      max={wallet.balance}
                      value={sendAmount}
                      onChange={e => setSendAmount(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white font-bold text-lg focus:border-indigo-500 outline-none transition"
                    />
                  </div>
                </div>
                {message && (
                  <div
                    className={`p-5 rounded-2xl mb-6 text-sm font-bold uppercase tracking-wider text-center ${message.includes('❌')
                      ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                      : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-300'
                      }`}
                  >
                    {message}
                  </div>
                )}
                <button
                  onClick={handleSend}
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-5 rounded-2xl font-black text-xl transition shadow-xl shadow-indigo-500/20 uppercase"
                >
                  {loading ? 'Sending...' : 'Sign and Send'}
                </button>
              </div>
            )}

            {step === 'complete' && (
              <div className="text-center py-10">
                <div className="text-7xl mb-6 animate-bounce">🎉</div>
                <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter text-emerald-400">
                  Mission Accomplished!
                </h2>
                <p className="text-slate-400 mb-10 font-medium">
                  You have successfully mastered the basic wallet operations in the simulator.
                </p>
                <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-[32px] mb-10 inline-block px-12">
                  <span className="text-amber-500 text-5xl font-black tracking-tight">{score}</span>
                  <span className="text-amber-500/50 text-xs font-black ml-2 uppercase tracking-widest">Score</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setWallet(INITIAL_STATE);
                      setStep('intro');
                      setScore(0);
                    }}
                    className="bg-white/5 py-4 rounded-2xl font-bold hover:bg-white/10 transition uppercase tracking-widest"
                  >
                    🔄 Restart
                  </button>
                  <Link
                    href="/"
                    className="bg-indigo-600 py-4 rounded-2xl font-black hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20 uppercase tracking-widest"
                  >
                    Home 🏠
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Device Panel */}
          <div className="flex flex-col gap-6">
            {/* Wallet Display */}
            <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-[40px] p-10 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-start mb-10">
                <div className="w-12 h-12 bg-white/20 rounded-xl backdrop-blur-xl flex items-center justify-center">
                  <span className="text-xl">💳</span>
                </div>
                <span className="text-[10px] font-black uppercase bg-white/10 px-2 py-1 rounded-md tracking-[2px]">Devnet</span>
              </div>
              <div className="font-mono text-[10px] text-white/50 mb-8 break-all leading-relaxed tracking-wider">
                {wallet.address}
              </div>
              <div className="text-5xl font-black text-white mb-2 tracking-tighter">
                {wallet.balance.toFixed(2)} <span className="text-2xl text-white/50">SOL</span>
              </div>
              <div className="text-indigo-300/60 text-sm font-bold tracking-widest uppercase">
                ≈ ${(wallet.balance * 180).toFixed(0)} USD
              </div>
            </div>

            {/* Activity History */}
            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[48px] p-10 border border-white/10 shadow-2xl flex-1">
              <h3 className="font-black text-xs uppercase tracking-[4px] text-slate-500 mb-6">Activity History</h3>
              {wallet.transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                  <div className="text-4xl mb-4">🧊</div>
                  <p className="text-xs font-black uppercase tracking-widest">No activity yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {wallet.transactions.map(tx => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${tx.type === 'airdrop' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                          {tx.type === 'airdrop' ? '💧' : '📤'}
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest">{tx.type}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{tx.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-black tracking-tight ${tx.type === 'send' ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {tx.type === 'send' ? '-' : '+'}{tx.amount} SOL
                        </p>
                        <p className="text-[9px] font-black uppercase text-slate-600">Confimed ✓</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
