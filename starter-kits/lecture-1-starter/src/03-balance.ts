// 03-balance.ts
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

/**
 * Задача 3: Проверить баланс любого адреса
 */

async function checkBalance(address: string) {
    const connection = new Connection(clusterApiUrl('devnet'));
    const publicKey = new PublicKey(address);

    // TODO: Получите баланс в lamports
    const balanceLamports = await connection.getBalance(publicKey);

    // Конвертируем в SOL
    const balanceSOL = balanceLamports / LAMPORTS_PER_SOL;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Address:', address);
    console.log('Balance:', balanceSOL, 'SOL');
    console.log('Lamports:', balanceLamports);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━');

    return balanceSOL;
}

// ЗАДАНИЕ: Проверьте баланс своего кошелька
// checkBalance('YOUR_PUBLIC_KEY_HERE');

export { checkBalance };
