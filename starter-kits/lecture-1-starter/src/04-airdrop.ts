// 04-airdrop.ts
import { Connection, Keypair, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';
import * as fs from 'fs';

/**
 * Задача 4: Получить тестовые SOL из faucet
 */

async function requestAirdrop() {
    const connection = new Connection(clusterApiUrl('devnet'));

    // Загружаем кошелёк из файла
    const secretKey = Uint8Array.from(
        JSON.parse(fs.readFileSync('wallet.json', 'utf-8'))
    );
    const keypair = Keypair.fromSecretKey(secretKey);

    console.log('Requesting airdrop for:', keypair.publicKey.toBase58());

    // TODO: Запросите 2 SOL
    const signature = await connection.requestAirdrop(
        keypair.publicKey,
        2 * LAMPORTS_PER_SOL
    );

    // Ждём подтверждения
    console.log('⏳ Waiting for confirmation...');
    await connection.confirmTransaction(signature);

    console.log('✅ Airdrop successful!');
    console.log('Signature:', signature);
    console.log('Explorer:', `https://explorer.solana.com/tx/${signature}?cluster=devnet`);

    return signature;
}

// ЗАДАНИЕ: Получите тестовые SOL
// requestAirdrop();

export { requestAirdrop };
