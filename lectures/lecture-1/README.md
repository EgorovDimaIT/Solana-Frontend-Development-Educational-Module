# 📖 ЛЕКЦИЯ 1: SOLANA FUNDAMENTALS FOR FRONTEND DEVELOPERS

🎯 **Цель:** Понимать структуру Solana, аккаунты, транзакции и базовое подключение через `@solana/web3.js`.

---

## 📊 Презентация (Google Slides Structure)
1. **Title Slide**: Intro to Solana Frontend.
2. **Web2 vs. Web3**: API calls vs. Blockchain calls, trustless nature.
3. **Solana Speed**: Comparison (400ms finality).
4. **Account Model**: Address, Balance, Owner, Data (Account = Database Row).
5. **Transaction Structure**: Signatures, Blockhash, Instructions.
6. **Frontend Stack**: React, Wallet Adapter, web3.js, RPC.
7. **RPC Nodes**: Helius, QuickNode vs. Public RPC (Rate limits).
8. **Lamports**: 1 SOL = 1,000,000,000 lamports. Precision.
9. **Programs**: Smart Contracts (System Program, Token Program).
10. **Frontend Workflow**: Connect -> Read -> Sign -> Confirm -> UI Update.
11. **Dev Tools**: Explorer, Playground, Faucet.
12. **Code Preview**: simple connection + getBalance.

---

## 💻 Starter Kit
📦 [lecture-1-starter](../../starter-kits/lecture-1-starter)

---

## 🔨 Практическое задание: "Solana Wallet Manager CLI"
Создайте консольное приложение, которое:
1. Создаёт новый кошелёк.
2. Сохраняет его в файл `wallet.json`.
3. Запрашивает Airdrop (если баланс < 1 SOL).
4. Показывает текущий баланс.
5. Отправляет SOL на адрес получателя.

### Критерии оценки:
- Код работает на devnet (20%).
- Реализованы все 5 функций (40%).
- Корректная обработка ошибок (try/catch) (20%).
- Качество кода и комментарии (20%).

---

## 📝 Тест (Quiz)
1. Сколько lamports в 1 SOL? (1,000,000,000)
2. Что такое Account в Solana? (Data structure with address, balance, owner)
3. Какая скорость подтверждения? (0.4s)
... (Все 10 вопросов доступны в ресурсах)
