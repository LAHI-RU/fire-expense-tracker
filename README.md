# 🔥 Fire Expense Tracker

> A professional web application for managing business expenses, incomes, employees, and projects with powerful analytics and insights.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![MySQL](https://img.shields.io/badge/MySQL-8-orange?style=flat&logo=mysql)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

### 📊 **Dashboard & Analytics**
- Real-time financial overview with interactive charts
- Monthly income and expense trends
- Top 5 expense categories with visual breakdown
- Top 5 most profitable projects
- Recent activities feed

### 💰 **Income Management**
- Track payments and income from projects
- Filter by status (Pending, Received, All)
- Professional table and card views
- Search and sort functionality
- Support for incomes without projects

### 💸 **Expense Management**
- Comprehensive expense tracking
- Filter by category, project, and employee
- Receipt attachment support
- Advanced search and sorting
- Visual category breakdown

### 👥 **Employee Management**
- Employee profiles and records
- Salary payment tracking
- Project assignments
- Employee performance insights

### 🏗️ **Project Management**
- Project creation and tracking
- Budget monitoring
- Profitability analysis
- Client information management

### 🎤 **Voice Input**
- Hands-free data entry for forms
- Voice-powered search functionality
- Accessibility-first design

---

## 🚀 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [MySQL](https://www.mysql.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Package Manager:** [pnpm](https://pnpm.io/)

---

## 📦 Getting Started

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** ([Install](https://pnpm.io/installation))
- **MySQL** 8+ ([Download](https://dev.mysql.com/downloads/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LAHI-RU/fire-expense-tracker.git
   cd fire-expense-tracker
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create `.env.local` in the root directory:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=fire_expense_tracker
   ```

4. **Set up the database**
   
   Run these SQL scripts in order:
   ```sql
   -- 1. Create database
   CREATE DATABASE fire_expense_tracker;
   
   -- 2. Run schema
   -- Execute: scripts/01-create-database-schema.sql
   
   -- 3. Run seeds (optional)
   -- Execute: scripts/02-seed-initial-data.sql
   
   -- 4. Make project_id nullable (if needed)
   -- Execute: scripts/04-make-incomes-project-id-nullable.sql
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
fire-expense-tracker/
├── app/                      # Next.js pages & API routes
│   ├── api/                  # RESTful API endpoints
│   ├── dashboard/            # Dashboard page
│   ├── expenses/             # Expenses management
│   ├── incomes/              # Incomes management
│   ├── employees/            # Employee management
│   ├── projects/             # Project management
│   └── analytics/            # Analytics & reports
├── components/               # Reusable React components
│   ├── ui/                   # shadcn/ui components
│   ├── analytics-charts.tsx  # Chart components
│   ├── expense-form.tsx      # Expense form
│   ├── income-form.tsx       # Income form
│   └── ...
├── lib/                      # Utility functions
│   ├── mysql.ts              # Database connection
│   ├── auth.ts               # Authentication
│   └── utils.ts              # Helpers
├── hooks/                    # Custom React hooks
├── scripts/                  # SQL setup scripts
├── public/                   # Static assets
└── types/                    # TypeScript definitions
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Add environment variables (DB credentials)
   - Click "Deploy"

3. **Set up production database**
   - Use [PlanetScale](https://planetscale.com/) (Free tier)
   - Or [Railway](https://railway.app/) (MySQL hosting)
   - Update environment variables in Vercel

### Environment Variables for Production

```env
DB_HOST=your-production-host
DB_USER=your-production-user
DB_PASSWORD=your-production-password
DB_NAME=fire_expense_tracker
```

---

## 🎯 Key Features Explained

### 1. **Smart Income Tracking**
- Track expected vs. actually received payments
- Optional project association
- Status-based filtering (Pending/Received)

### 2. **Professional Tables**
- Excel-like interface with sorting
- Search across all fields
- Light vertical column dividers
- Summary rows with totals

### 3. **Dashboard Analytics**
- Top 5 expense categories with legend
- Top 5 profitable projects
- Monthly trends with net profit calculation
- Recent activities summary

### 4. **View Toggle**
- Switch between Table and Card views
- Icon-only buttons for clean UI
- Positioned below summary cards

---

## 🛠️ Development

### Build for Production
```bash
pnpm build
```

### Run Production Build
```bash
pnpm start
```

### Lint Code
```bash
pnpm lint
```

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**LAHI-RU**
- GitHub: [@LAHI-RU](https://github.com/LAHI-RU)

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)

---

<div align="center">
  <p>Made with ❤️ for business management</p>
  <p>⭐ Star this repo if you find it useful!</p>
</div>
