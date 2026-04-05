# 📖 ЛЕКЦИЯ 2: WALLET INTEGRATION & TRANSACTION SIGNING

🎯 **Цель:** Изучить использование `@solana/wallet-adapter-react` для интеграции кошельков (Phantom, Solflare) и научиться подписывать транзакции через UI.

---

## 📊 Презентация (Google Slides Structure)
1. **Wallet Integration Intro**: Connecting users to dApp.
2. **Wallet Adapter Pattern**: Unified interface for 20+ wallets.
3. **Architecture Layers**: Provider -> Hook -> Component.
4. **Setup Code**: Wrapping app in `WalletProvider`.
5. **The `useWallet` Hook**: Accessing `publicKey`, `connected`, `sendTransaction`.
6. **The `WalletMultiButton`**: One-line beautiful UI button.
7. **Reading User State**: Conditional rendering.
8. **Sending Transactions**: Building, signing, broadcasting.
9. **Error Handling**: User rejections & insufficient funds.
10. **Transaction Confirmation States**: Building -> Signing -> Confirming.
11. **UX Best Practices**: Loading indicators & explorer links.
12. **Production Checklist**: Auto-reconnect & mobile-responsive.

---

## 💻 Starter Kit (Next.js + Wallet Adapter)
📦 [lecture-2-wallet-app](../../starter-kits/lecture-2-starter)

---

## 🔨 Практическое задание 2: "Portfolio Tracker dApp"
Создайте React приложение с интеграцией кошелька, которое:
1. Подключает Phantom кошелек.
2. Показывает текущий SOL баланс.
3. Отображает историю последних 10 транзакций.
4. Выполняет отправку SOL с анимацией загрузки.
5. Предоставляет ссылку на Explorer после успеха.

### Бонус (+20%):
- SPL Token балансы.
- Тёмная/светлая тема.
- Мобильный дизайн.

---

## 📝 Тест (Quiz)
1. Какой хук используется для кошелька? (`useWallet`)
2. Что вернёт `publicKey`, если кошелёк не подключён? (`null`)
3. Что такое `autoConnect`? (Reconnect on refresh)
...
