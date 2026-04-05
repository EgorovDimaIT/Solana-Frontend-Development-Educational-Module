# Lecture 1: Solana Fundamentals for Frontend Developers

## 🎯 Learning Objectives

After this lecture, you will be able to:
- Explain the difference between Account, Program, and Transaction
- Work with RPC using `@solana/web3.js`
- Get balance, account info, and send SOL
- Use explorers and understand transaction status

---

## 🏗️ Solana Architecture: Base Concepts

Solana is not an EVM (unlike Ethereum). Here, data and logic are decoupled.

### 1. Accounts
In Solana, **everything is an account**. Accounts are similar to files in an operating system.
- **Data**: Byte-array with data.
- **Owner**: The program that has the right to modify account data.
- **Lamports**: SOL balance (in minimum units).
- **Executable**: A flag indicating if the account is a smart contract.

### 2. Programs (Smart Contracts)
Programs in Solana are *stateless* executable files. They do not store data inside themselves. They only read data from incoming accounts and write changes back.

### 3. Transactions
A transaction is an atomic set of instructions. Either all are executed, or none.
- Consists of a list of instructions.
- Requires signatures.
- Includes **Recent Blockhash** (replay protection).

---

## 💻 Working with @solana/web3.js

Install the library:
```bash
npm install @solana/web3.js
```

### Network Connection (Connection)

```typescript
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

// Connect to Devnet
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Or to your own RPC node
const customConn = new Connection('https://api.mainnet-beta.solana.com', {
  commitment: 'confirmed'
});
```

### Getting Balance

Balance is stored in lamports (1 SOL = 10^9 lamports).

```typescript
async function getBalance(address: string) {
  const publicKey = new PublicKey(address);
  const lamports = await connection.getBalance(publicKey);
  const sol = lamports / 1e9;
  return sol;
}

console.log(await getBalance('YOUR_ADDRESS'));
```

### Generating a New Wallet (Keypair)

```typescript
import { Keypair } from '@solana/web3.js';

const keypair = Keypair.generate();
console.log('Public Key:', keypair.publicKey.toBase58());
console.log('Secret Key:', keypair.secretKey);
```

---

## 💸 Creating and Sending a Transaction

Classic SOL transfer from one user to another.

```typescript
import { 
  SystemProgram, 
  Transaction, 
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';

async function transferSol(from: Keypair, to: PublicKey, amount: number) {
  // 1. Create instruction
  const instruction = SystemProgram.transfer({
    fromPubkey: from.publicKey,
    toPubkey: to,
    lamports: amount * LAMPORTS_PER_SOL,
  });

  // 2. Add it to transaction
  const transaction = new Transaction().add(instruction);

  // 3. Send and confirm
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [from] // Signers array
  );

  return signature;
}
```

---

## 🔬 Transaction Anatomy

A Solana transaction has a size limit (MTU = 1232 bytes). This limits the number of accounts and instructions.

**Main parts:**
1. **Signatures**: List of signatures (first one is Fee Payer).
2. **Message**:
   - Header (number of signatures).
   - Account Keys (list of all involved accounts).
   - Recent Blockhash.
   - Instructions (Program ID, account list, data in bytes).

---

## 🔍 Solana Explorer

Always use an explorer during development:
- [SolScan](https://solscan.io)
- [Solana Explorer](https://explorer.solana.com)

**What to look for:**
- **Signature**: Transaction ID.
- **Slot**: Block number.
- **Log Messages**: Program logs or errors (crucial for debugging!).
- **Instruction Data**: Exactly what was passed to the program.

---

## 🛠️ Practice Task

1. Create a script that generates a new Keypair.
2. Request a `requestAirdrop` to your new address on Devnet.
3. Send 0.1 SOL back to any other address.
4. Find your transaction in Explorer.

```typescript
// Airdrop hint
const airdropSignature = await connection.requestAirdrop(
  keypair.publicKey,
  LAMPORTS_PER_SOL
);
await connection.confirmTransaction(airdropSignature);
```

---

## 📚 Resources (Deep Dive)
- [Solana Cookbook](https://solanacookbook.com/)
- [Solana Docs](https://docs.solana.com/)
- [Web3.js API Reference](https://solana-labs.github.io/solana-web3.js/)
