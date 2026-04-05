'use client';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';
import { Search, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function NFTGallery() {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const [nfts, setNfts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const fetchNFTs = async () => {
        if (!publicKey) return;
        setLoading(true);
        setStatus('Scanning blockchain for NFTs...');

        try {
            const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(useWallet()));
            const userNfts = await metaplex.nfts().findAllByOwner({ owner: publicKey });

            // Filter only those with metadata
            setNfts(userNfts);
            setStatus(`Found ${userNfts.length} potential artifacts.`);
        } catch (err: any) {
            console.error(err);
            setStatus(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (publicKey) fetchNFTs();
        else setNfts([]);
    }, [publicKey]);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 p-8 pt-24 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 bg-slate-900/50 p-8 rounded-3xl ring-1 ring-white/5 border border-white/10 backdrop-blur-xl">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            NFT ARTIFACTS
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">Lecture 3: Reading On-Chain Metadata</p>
                        <p className="text-slate-400 mt-1 text-sm">{status}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-500 !rounded-xl !px-8 !py-4 !h-auto !font-bold !transition-all !shadow-lg !shadow-indigo-500/20" />
                        {publicKey && (
                            <button
                                onClick={fetchNFTs}
                                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                            >
                                <Search className="w-4 h-4" /> Rescan Assets
                            </button>
                        )}
                    </div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                        <p className="text-slate-500 animate-pulse font-medium">Syncing with Mainnet/Devnet...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {nfts.length > 0 ? nfts.map((nft, i) => (
                            <div key={i} className="group relative bg-slate-900 p-4 rounded-2xl ring-1 ring-white/5 hover:ring-indigo-500/50 transition-all cursor-pointer overflow-hidden backdrop-blur-md shadow-2xl hover:-translate-y-2">
                                <div className="aspect-square rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden relative">
                                    {nft.uri ? (
                                        <img src={nft.uri} alt={nft.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <ImageIcon className="w-12 h-12 text-slate-700" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <p className="text-xs text-indigo-300 font-mono font-bold tracking-widest uppercase">Verified Asset</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="font-bold text-lg truncate text-slate-200">{nft.name || 'Unknown Artifact'}</h3>
                                    <p className="text-xs text-slate-500 font-mono mt-1">{nft.mintAddress?.toBase58().slice(0, 8)}...{nft.mintAddress?.toBase58().slice(-8)}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-40 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-600">
                                <h2 className="text-xl font-bold mb-1 italic opacity-40">No Assets Discovered</h2>
                                <p className="text-sm">Connect a wallet with NFT assets to view collection.</p>
                            </div>
                        )}
                    </div>
                )}

                <footer className="mt-20 py-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-slate-600 gap-4">
                    <p className="text-sm">© 2026 SUPERTEAM UKRAINE</p>
                    <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
                        <a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a>
                        <a href="#" className="hover:text-indigo-400 transition-colors">Bounty Program</a>
                        <a href="#" className="hover:text-indigo-400 transition-colors">Ecosystem Tools</a>
                    </div>
                </footer>
            </div>
        </main>
    );
}
