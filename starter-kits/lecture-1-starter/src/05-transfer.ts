// 05-transfer.ts
import {
    Connection,
    Keypair,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
    PublicKey,
    LAMPORTS_PER_SOL,
    clusterApiUrl,
} from '@solana/web3.js';
import * as fs from 'fs';

/**
 * Задача 5: Отправить SOL другому адресу
 */

async function transferSOL(recipientAddress: string, amountSOL: number) {
    const connection = new Connection(clusterApiUrl('devnet'));

    // Загружаем свой кошелёк
    const secretKey = Uint8Array.from(
        JSON.parse(fs.readFileSync('wallet.json', 'utf-8'))
    );
    const sender = Keypair.fromSecretKey(secretKey);
    const recipient = new PublicKey(recipientAddress);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('From:', sender.publicKey.toBase58());
    console.log('To:  ', recipient.toBase58());
    console.log('Amount:', amountSOL, 'SOL');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━');

    // TODO: Создайте транзакцию
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: sender.publicKey,
            toPubkey: recipient,
            lamports: amountSOL * LAMPORTS_PER_SOL,
        })
    );

    // Отправляем и ждём подтверждения
    console.log('⏳ Sending transaction...');
    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [sender]
    );

    console.log('✅ Transfer successful!');
    console.log('Signature:', signature);
    console.log('Explorer:', `https://explorer.solana.com/tx/${signature}?cluster=devnet`);

    return signature;
}

// ЗАДАНИЕ: Отправьте 0.1 SOL кому-нибудь
// transferSOL('RECIPIENT_PUBLIC_KEY', 0.1);

export { transferSOL };
