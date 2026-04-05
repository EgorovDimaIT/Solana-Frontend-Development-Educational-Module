# 🎓 ЛЕКЦИЯ 2: WALLET INTEGRATION & TRANSACTION SIGNING

### 📊 Слайды (Струкура презентации)

```markdown
СЛАЙД 1: Wallet Integration
━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 Connecting Users to Your dApp

Today's Goal:
Build a React app where users can:
• Connect their Phantom wallet
• See their balance
• Send SOL
• All in beautiful UI!

СЛАЙД 2: The Wallet Adapter Pattern
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Problem: 20+ Solana wallets
Solution: Unified adapter interface

@solana/wallet-adapter-react
├─ Phantom
├─ Solflare  
├─ Backpack
├─ Ledger
└─ ... all through same API!

СЛАЙД 3: Architecture
━━━━━━━━━━━━━━━━━━━━
┌──────────────────────────────┐
│ Your React Component         │
│  ↓ uses                      │
│ useWallet() hook             │
│  ↓ connects to               │
│ WalletProvider               │
│  ↓ manages                   │
│ Multiple wallet adapters     │
│  ↓ talk to                   │
│ User's wallet extension      │
└──────────────────────────────┘

СЛАЙД 4: Setup Code
━━━━━━━━━━━━━━━━━━
npm install @solana/wallet-adapter-react \
            @solana/wallet-adapter-react-ui \
            @solana/wallet-adapter-wallets

// Wrap your app:
<WalletProvider wallets={wallets}>
  <WalletModalProvider>
    <App />
  </WalletModalProvider>
</WalletProvider>

СЛАЙД 5: The useWallet Hook
━━━━━━━━━━━━━━━━━━━━━━━━
const {
  publicKey,      // User's address
  connected,      // Boolean
  connecting,     // Boolean
  connect,        // Function
  disconnect,     // Function
  sendTransaction // Function
} = useWallet();

Your new best friend! 🤝

СЛАЙД 6: Connect Button
━━━━━━━━━━━━━━━━━━━━━━━
import { WalletMultiButton } from 
  '@solana/wallet-adapter-react-ui';

// That's it! One line:
<WalletMultiButton />

✨ Auto-detects installed wallets
✨ Beautiful UI out of the box
✨ Handles connect/disconnect

СЛАЙД 7: Reading User State
━━━━━━━━━━━━━━━━━━━━━━━━
function MyComponent() {
  const { publicKey, connected } = useWallet();

  if (!connected) {
    return <p>Please connect wallet</p>;
  }

  return (
    <p>Hello {publicKey.toBase58()}</p>
  );
}

СЛАЙД 8: Sending Transactions
━━━━━━━━━━━━━━━━━━━━━━━━━━
const { sendTransaction } = useWallet();
const { connection } = useConnection();

// 1. Build transaction
const tx = new Transaction().add(
  SystemProgram.transfer({...})
);

// 2. Send (wallet will prompt user)
const signature = await sendTransaction(
  tx, 
  connection
);

// 3. Confirm
await connection.confirmTransaction(signature);

СЛАЙД 9: Error Handling
━━━━━━━━━━━━━━━━━━━━━━
try {
  await sendTransaction(tx, connection);
} catch (error) {
  if (error.message.includes('User rejected')) {
    // User clicked "Cancel" in wallet
  } else if (error.message.includes('insufficient')) {
    // Not enough SOL for fees
  }
}

Always handle user rejection!

СЛАЙД 10: Transaction Confirmation States
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1️⃣ Building    → Creating tx object
2️⃣ Signing     → User approves in wallet
3️⃣ Sending     → Broadcast to network
4️⃣ Confirming  → Wait for finality
5️⃣ Finalized   → Immutable on chain!

Show these states in your UI! 🎯

СЛАЙД 11: UX Best Practices
━━━━━━━━━━━━━━━━━━━━━━━━
✅ Show loading states
✅ Clear error messages
✅ Transaction links to Explorer
✅ Success animations
✅ Disable buttons during tx
❌ Don't leave users guessing!

СЛАЙД 12: Production Checklist
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Auto-reconnect on page reload
✅ Handle network switching (devnet/mainnet)
✅ Responsive mobile design
✅ Keyboard accessibility
✅ Error boundaries
✅ Rate limiting protection

Ready to build? 🚀
```

### 💻 Стартовый набор кода
Находится в `starter-kits/lecture-2-starter`

### 🔨 Практическое задание
**"Portfolio Tracker dApp"**
Создайте React приложение с wallet integration, которое:

1. ✅ Подключает кошелёк Phantom
2. ✅ Показывает баланс SOL
3. ✅ Показывает историю последних 10 транзакций
4. ✅ Позволяет отправить SOL с красивой анимацией загрузки

### 📝 Тест
Находится в `quizzes/quiz-2.md`
