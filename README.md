<div align="center">

<img src="docs/finsight-readme.gif" alt="FinSight animated banner: see your money, understand your future" width="100%" />

# FinSight

### See your money. Understand your future.

**A calmer, clearer view of your income, spending, savings, and plans.**

[Open the live demo](https://finsight-personal-finance.onrender.com)

[![React](https://img.shields.io/badge/React-19-173B3A?logo=react&logoColor=9ddcba)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-173B3A?logo=typescript&logoColor=9ddcba)](https://www.typescriptlang.org)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

</div>

> **Live Demo:** The public site is live at [finsight-personal-finance.onrender.com](https://finsight-personal-finance.onrender.com). Explore the interactive finance workspace using the **Demo sign in** option on the welcome screen.

---

## Overview

FinSight is a modern personal finance dashboard designed to build a steady, confident money routine. It brings daily transactions, monthly budgets, savings goals, recurring bill reminders, and intelligent financial insights into a single fluid workspace.

| See the Whole Picture | Make a Plan | Stay on Track |
| :--- | :--- | :--- |
| Real-time balance, income & expense tracking, cash flow charts, and recent activity | Category budgets, milestone-based savings goals, and a 30-day forward outlook | Instant search, category filters, CSV/PDF export, notifications, and rule-based insights |

---

## Features

- **Fluid Ledger & Transactions:** Record income and expenses with descriptions, categories, payment methods, and notes. Filter activity, edit entries in place, and export to CSV.
- **Visual Cash Flow & Spending Mix:** Interactive monthly rhythm charts and category breakdown donut charts powered by Recharts.
- **Category Budgets:** Set spending limits with visual progress bars, warning thresholds, and real-time pace tracking.
- **Goal Tracking & Milestones:** Track progress toward targets, calculate estimated monthly contributions, and celebrate savings milestones.
- **30-Day Outlook & Recurring Spend:** Automatically detect repeating expenses across months and project net cash flow after upcoming bills.
- **Calendar & Bill Reminders:** Never miss a due date with a calendar view and quick paid/unpaid toggles.
- **FinSight AI Assistant:** Fast, rule-based answers and spending tips tailored to your current ledger.
- **Comprehensive Reports:** Generate period summaries and download clean, professional PDF reports on demand.
- **Responsive Motion Design:** Fully responsive desktop panel navigation with smooth scrolling, collapsible rail, micro-interactions, dark mode, and keyboard shortcuts (`⌘K` to search, `N` for quick add).

---

## Run Locally

Requires **Node.js 24+** and **npm**.

```sh
# Install root and client dependencies
npm ci
npm ci --prefix client

# Start development servers (Client on :5173, API on :4000)
npm run dev
```

### Build & Test

```sh
# Run test suite
npm test

# Build client production bundle
npm run build
```

---

## Built With

- **Frontend:** React 19, TypeScript, Vite, Recharts, Lucide Icons, jsPDF, and custom CSS motion design system.
- **Backend:** Node.js, Express, MongoDB, Mongoose, bcrypt, JWT cookies, Zod validation, Helmet, and rate limiting.
- **Storage:** Client finance records persist in browser `localStorage`, scoped per account for instant, zero-latency feedback without banking credentials required.

---

## Live Deployment

FinSight is hosted on Render:

- **Live Application:** [https://finsight-personal-finance.onrender.com](https://finsight-personal-finance.onrender.com)
- **GitHub Repository:** [https://github.com/Dhruvi-tech/Finsight-Finance](https://github.com/Dhruvi-tech/Finsight-Finance)

---

## Security & Privacy

FinSight does not connect to bank accounts or process money transfers. All personal finance entries stay private to your session.
