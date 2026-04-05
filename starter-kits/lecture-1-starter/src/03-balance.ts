import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

export async function checkBalance(address: string) {
    const connection = new Connection(clusterApiUrl('devnet'));
    const publicKey = new PublicKey(address);

    const balanceLamports = await connection.getBalance(publicKey);
    const balanceSOL = balanceLamports / LAMPORTS_PER_SOL;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Address:', address);
    console.log('Balance:', balanceSOL, 'SOL');
    console.log('Lamports:', balanceLamports);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━');

    return balanceSOL;
}
