# 🚀 SOLANA FRONTEND CHEATSHEET

### 1. Connection (web3.js)
```typescript
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
```

### 2. Wallet Hooks
```typescript
const { publicKey, sendTransaction } = useWallet();
const { connection } = useConnection();
```

### 3. Basic Operations
| Task | Code Snippet |
|------|--------------|
| Get Balance | `await connection.getBalance(pubkey)` |
| Airdrop | `await connection.requestAirdrop(pubkey, 1e9)` |
| Transfer SOL | `SystemProgram.transfer({ from, to, lamports })` |

### 4. Common Error Handling
```typescript
try {
  await sendTransaction(tx, connection);
} catch (e: any) {
  if (e.message.includes('User rejected')) // Handle cancel
}
```

### 5. Useful Links
- **Explorer**: [explorer.solana.com](https://explorer.solana.com)
- **Solana CookBook**: [solanacookbook.com](https://solanacookbook.com)
- **Anchor Docs**: [anchor-lang.com](https://www.anchor-lang.com)
