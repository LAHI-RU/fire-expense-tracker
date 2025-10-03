# 🔥 Fire Expense Tracker

A professional business management system for tracking expenses, incomes, employees, and projects. Built with modern web technologies for optimal performance and user experience.

---

## ⚠️ Important Notice

**This is a private project developed for a specific client.**  
**Unauthorized use, copying, or distribution is strictly prohibited.**  
**All rights reserved © 2025**

---

## 📋 About

Fire Expense Tracker is a comprehensive business management application that helps organizations:

- Track and manage expenses across projects
- Monitor income and payments
- Manage employee information and salaries
- Analyze financial data with interactive dashboards
- Generate reports and insights

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React, TypeScript
- **Backend:** Next.js API Routes
- **Database:** MySQL
- **UI Components:** Shadcn/ui, Tailwind CSS
- **Charts:** Recharts
- **Package Manager:** pnpm
- **Authentication:** Custom JWT-based auth

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- MySQL 8+ installed
- pnpm package manager

### Installation

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Setup environment variables:**
   Create `.env.local` file:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=fire_expense_tracker
   ```

3. **Setup database:**
   Run SQL scripts in order:

   - `scripts/01-create-database-schema.sql`
   - `scripts/02-seed-initial-data.sql`
   - `scripts/03-create-users-table.sql`
   - `scripts/04-make-incomes-project-id-nullable.sql`

4. **Start development server:**

   ```bash
   pnpm dev
   ```

5. **Open browser:**
   Navigate to `http://localhost:3000`

---

## 📁 Project Structure

```
fire-expense-tracker/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/               # Backend API endpoints
│   ├── dashboard/         # Dashboard page
│   ├── expenses/          # Expense management
│   ├── incomes/           # Income tracking
│   ├── employees/         # Employee management
│   └── projects/          # Project management
├── components/            # Reusable UI components
├── lib/                   # Utility functions & database
├── hooks/                 # Custom React hooks
├── public/                # Static assets
├── scripts/               # Database SQL scripts
└── types/                 # TypeScript type definitions
```

---

## ✨ Key Features

### 💼 Dashboard

- Real-time financial overview
- Monthly trends visualization
- Top expense categories
- Project profitability analysis
- Recent activities tracking

### 💰 Income Management

- Track project payments
- Filter by status (pending/received)
- Support for incomes without projects
- Excel-like table view with sorting
- Export and analysis tools

### 💸 Expense Management

- Categorized expense tracking
- Project-wise expense allocation
- Employee expense records
- Receipt management
- Advanced filtering and search

### 👥 Employee Management

- Employee profiles and details
- Salary management
- Project assignments
- Performance tracking

### 📊 Project Management

- Project creation and tracking
- Budget monitoring
- Income vs expense analysis
- Status management

### 🎤 Voice Input

- Voice-enabled form inputs
- Hands-free data entry
- Improved accessibility

---

## 🌐 Deployment

### Recommended: Vercel + PlanetScale

1. **Push to GitHub**
2. **Sign up at [Vercel](https://vercel.com)**
3. **Import your repository**
4. **Set up database at [PlanetScale](https://planetscale.com)**
5. **Add environment variables in Vercel**
6. **Deploy!**

Both platforms offer generous free tiers perfect for production use.

---

## 🔒 Security

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Input validation and sanitization
- SQL injection prevention

---

## 📞 Support

For support or questions about this project, contact the developer:

- **Developer:** LAHI-RU
- **Project Type:** Private Client Project

---

## 📄 License

**Proprietary License**

This software is privately developed for a specific client and is not open source. All rights are reserved.

**No part of this software may be:**

- Used without explicit authorization
- Copied or reproduced
- Modified or distributed
- Used for commercial purposes by unauthorized parties

© 2025 All Rights Reserved

---

<div align="center">
  <p><strong>Developed by LAHI-RU</strong></p>
  <p>Professional Business Management Solution</p>
  <p><em>Powered by Next.js, TypeScript & MySQL</em></p>
</div>
