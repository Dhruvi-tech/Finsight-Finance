<div align="center">

<img src="docs/finsight-readme.gif" alt="FinSight animated banner: see your money, understand your future" width="100%" />

# ✦ FinSight

### See your money. Understand your future.

**An elegant, motion-driven personal finance dashboard for modern money routines.**

[✦ Explore Live Demo ✦](https://finsight-personal-finance.onrender.com)

<br/>

[![Live Deployment](https://img.shields.io/badge/Render-Live%20Demo-46e3b7?style=for-the-badge&logo=render&logoColor=white)](https://finsight-personal-finance.onrender.com)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Finsight--Finance-6378d8?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Dhruvi-tech/Finsight-Finance)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

</div>

---

> **Live Preview:** Try the interactive dashboard instantly at **[finsight-personal-finance.onrender.com](https://finsight-personal-finance.onrender.com)** using the **Demo sign in** option on the welcome screen.

---

## ✦ Experience FinSight

FinSight is an intelligent personal finance platform built to make money management feel intuitive, calm, and insightful. It brings your everyday expenses, monthly budgets, long-term savings goals, and cash flow forecasts into one fluid, motion-aware workspace.

| 📊 See the Whole Picture | 🎯 Make a Confident Plan | ⚡ Stay on Track |
| :--- | :--- | :--- |
| **Real-Time Balance & Cash Flow**<br/>Track income, expenses, interactive monthly rhythm charts, and category mix. | **Smart Budgets & Goals**<br/>Set category limits, milestone-based savings goals, and forward projections. | **Insights & Fast Actions**<br/>Instant search (`⌘K`), Quick Add (`N`), CSV/PDF exports, and FinSight AI assistant. |

---

## ✨ Key Capabilities

- **Fluid Ledger & Transactions:** Log income and expenses with categories, payment methods, and notes. Filter activity, edit entries inline, and export to CSV.
- **Toggleable Desktop Sidebar:** Smoothly hide the entire navigation panel with a single click on the menu bars (`☰`) or close button (`✕`) for an expansive full-screen canvas.
- **Dynamic Cash Flow & Spending Mix:** Interactive monthly trend line/bar charts and category breakdown donut visualizations powered by Recharts.
- **Category Budgets & Pace Alerts:** Set monthly limits with animated progress bars, warning badges, and real-time pace tracking.
- **Savings Milestones & Rotating Orbit:** Celebrate savings achievements and watch goals approach with visual milestone badges and progress indicators.
- **30-Day Outlook & Recurring Expense Detection:** Automatically detect recurring subscriptions and project estimated end-of-month cash flow.
- **Interactive Calendar & Bill Reminders:** View scheduled upcoming payments on an intuitive calendar with quick paid/unpaid toggles.
- **FinSight AI Assistant:** Fast, rule-based answers and tips tailored to your ledger activity.
- **Period Financial PDF Reports:** Download neatly structured, professional PDF summary reports on demand.
- **Micro-Interactions & Dark Mode:** Silky-smooth hover lifts, shimmering progress bars, breathing status indicators, and keyboard shortcuts.

---

## 🚀 Quick Start

Requires **Node.js 24+** and **npm**.

```sh
# 1. Install dependencies
npm ci
npm ci --prefix client

# 2. Start development servers
npm run dev
```

The client starts at `http://localhost:5173` and the API service starts at `http://localhost:4000`.

### Quality Checks & Build

```sh
# Run test suite
npm test

# Build client production bundle
npm run build
```

---

## 🛠️ Tech Architecture

- **Frontend:** React 19, TypeScript 5, Vite, Recharts, Lucide Icons, jsPDF, and custom CSS motion system.
- **Backend:** Node.js, Express, MongoDB, Mongoose, bcrypt, signed HTTP-only JWT cookies, Zod validation, Helmet, and rate limiting.
- **Storage:** Client finance records persist in browser `localStorage`, scoped per account for zero-latency, private, client-side exploration without needing bank credentials.

---

## 🌐 Deployment & Repository

- **Live Application:** [https://finsight-personal-finance.onrender.com](https://finsight-personal-finance.onrender.com)
- **Source Code:** [https://github.com/Dhruvi-tech/Finsight-Finance](https://github.com/Dhruvi-tech/Finsight-Finance)

---

<div align="center">
  <sub>© 2026 FinSight · Crafted with care for your next money move.</sub>
</div>
