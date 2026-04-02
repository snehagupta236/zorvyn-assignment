# 💹 FinFlow — Personal Finance Dashboard

A modern, dark-themed personal finance tracker built with React + Vite. Track your income, expenses, and savings with beautiful charts and real-time insights.

🔗 **Live Demo:** [https://zorvyn-assignment-pi.vercel.app/](https://zorvyn-assignment-pi.vercel.app/)

---

## ✨ Features

- **Overview Dashboard** — Net balance, total income, expenses & savings rate with animated counters and sparklines
- **Monthly Charts** — Bar chart for income vs expenses, area chart for balance trend
- **Spending Breakdown** — Donut chart and horizontal bar chart by category
- **Transactions Table** — Search, filter by type/category, sort by any column
- **Add / Edit / Delete** — Full CRUD for transactions (Admin mode)
- **CSV Export** — Download all transactions as a CSV file
- **Insights Tab** — MoM spending delta, savings rate, monthly breakdown table, summary stats
- **Role Switching** — Toggle between Admin and Viewer mode
- **Persistent Storage** — Data saved in localStorage, survives page refresh
- **Fully Responsive** — Works on desktop and mobile

---

## 🛠️ Tech Stack

| Tech | Usage |
|------|-------|
| React 18 | UI Framework |
| Vite | Build Tool |
| JavaScript (JSX) | Language |
| CSS-in-JS | Styling (inline styles) |
| localStorage | Data Persistence |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Go into the project folder
cd my-finance-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## 📁 Project Structure

```
my-finance-app/
├── src/
│   ├── App.jsx        # Main dashboard component
│   └── main.jsx       # React entry point
├── public/
├── index.html
├── vite.config.js
└── package.json
```

---

## 📊 Dashboard Tabs

| Tab | Description |
|-----|-------------|
| Overview | KPI cards, charts, recent activity |
| Transactions | Full transaction list with filters |
| Insights | Detailed analytics and monthly breakdown |

---

## 🔐 Roles

| Role | Permissions |
|------|-------------|
| Admin | View + Add + Edit + Delete transactions |
| Viewer | View only |

---

## 📦 Deployment

Deployed on **Vercel** — auto deploys on every `git push` to main branch.

🔗 [https://zorvyn-assignment-pi.vercel.app/](https://zorvyn-assignment-pi.vercel.app/)

---

## 📄 License

MIT License — free to use and modify.
