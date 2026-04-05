'use client';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';
import { LAMPORTS_PER_SOL, SystemProgram, Transaction, PublicKey } from '@solana/web3.js';

export default function Home() {
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const [balance, setBalance] = useState<number | null>(null);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('');

    const getBalance = async () => {
        if (!publicKey) return;
        const bal = await connection.getBalance(publicKey);
        setBalance(bal / LAMPORTS_PER_SOL);
    };

    const sendSOL = async () => {
        if (!publicKey) return;

        try {
            setStatus('Building transaction...');

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new PublicKey(recipient),
                    lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
                })
            );

            setStatus('Waiting for approval...');
            const signature = await sendTransaction(transaction, connection);

            setStatus('Confirming...');
            await connection.confirmTransaction(signature);

            setStatus(`✅ Success! Signature: ${signature}`);
            getBalance();
        } catch (error: any) {
            setStatus(`❌ Error: ${error.message}`);
        }
    };

    return (
        <main className="min-h-screen p-8 bg-gray-900 text-white flex flex-col items-center pt-20">
            <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-xl shadow-2xl transition-all border border-gray-700">
                <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">
                    Solana Portfolio Tracker
                </h1>
                <p className="text-gray-400 mb-8 border-b border-gray-700 pb-6">Lecture 2 Sandbox</p>

                <div className="flex items-center justify-between mb-8">
                    <p className="text-lg font-semibold">Wallet Status:</p>
                    <WalletMultiButton />
                </div>

                {publicKey && (
                    <div className="animate-fade-in space-y-6">
                        <div className="bg-gray-900/50 p-6 rounded-lg ring-1 ring-white/10 hover:ring-white/20 transition-all">
                            <h2 className="text-xl font-semibold mb-4 text-emerald-400">Your Balance</h2>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Total Available</p>
                                    <p className="text-3xl font-bold tracking-tight">
                                        {balance !== null ? `${balance.toFixed(4)} SOL` : '---'}
                                    </p>
                                </div>
                                <button
                                    onClick={getBalance}
                                    className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>

                        <div className="bg-gray-900/50 p-6 rounded-lg ring-1 ring-white/10 hover:ring-white/20 transition-all">
                            <h2 className="text-xl font-semibold mb-4 text-purple-400">Send SOL</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Recipient Address</label>
                                    <input
                                        type="text"
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value)}
                                        className="w-full p-3 bg-gray-800 ring-1 ring-gray-700 focus:ring-purple-500 rounded-lg outline-none transition-all placeholder-gray-600"
                                        placeholder="Enter public key (e.g. 7o...Ab)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Amount (SOL)</label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full p-3 bg-gray-800 ring-1 ring-gray-700 focus:ring-purple-500 rounded-lg outline-none transition-all placeholder-gray-600"
                                        placeholder="1.0"
                                    />
                                </div>
                                <button
                                    onClick={sendSOL}
                                    className="bg-purple-600 hover:bg-purple-500 active:bg-purple-700 px-6 py-3 rounded-lg w-full font-bold shadow-lg shadow-purple-500/30 transition-all transform active:scale-[0.98]"
                                >
                                    Confirm Quick Transfer
                                </button>
                            </div>

                            {status && (
                                <div className={`mt-6 p-4 rounded-lg font-medium ${status.includes('Error')
                                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                        : status.includes('Success')
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse'
                                    }`}>
                                    {status}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
