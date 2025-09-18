<div align="center">
  <img src="./public/placeholder-logo.png" alt="Fire Expense Tracker Logo" width="120" />
  <h1>Fire Expense Tracker</h1>
  <p>A modern web application for tracking expenses, incomes, employees, and projects. Built with Next.js, TypeScript, and MySQL.</p>
</div>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Running the App](#running-the-app)
- [Folder Structure](#folder-structure)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

- Dashboard with analytics and charts
- Employee, expense, income, and project management
- Voice input for forms
- Recent activities tracking
- Responsive UI

## Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Backend:** Next.js API routes
- **Database:** MySQL
- **Styling:** CSS, PostCSS
- **Package Manager:** pnpm

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- [MySQL](https://dev.mysql.com/downloads/installer/)
- [VS Code](https://code.visualstudio.com/) (recommended)

### Installation

1. **Clone the repository:**
   ```powershell
   git clone <your-repo-url>
   cd fire-expense-tracker
   ```
2. **Install dependencies:**
   ```powershell
   pnpm install
   ```
3. **Configure environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=fire_expense_tracker
   ```

## Database Setup

1. **Create the database:**
   - Open MySQL Workbench or MySQL Shell.
   - Run:
     ```sql
     CREATE DATABASE fire_expense_tracker;
     ```
2. **Run schema and seed scripts:**
   - Execute the following scripts in order:
     - `scripts/01-create-database-schema.sql`
     - `scripts/02-seed-initial-data.sql`

## Running the App

Start the development server:

```powershell
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Folder Structure

```
fire-expense-tracker/
├── app/                # Next.js pages & API routes
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries (auth, MySQL, etc.)
├── public/             # Static assets
├── scripts/            # SQL scripts for DB setup
├── styles/             # Global CSS
├── types/              # TypeScript type definitions
├── package.json        # Project metadata & dependencies
└── README.md           # Project documentation
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub.
2. Sign up at [vercel.com](https://vercel.com) and import your repo.
3. Set environment variables in Vercel dashboard.
4. Connect to a production MySQL database.

## Troubleshooting

- **Build errors:** Check terminal output for missing dependencies or TypeScript errors.
- **Database errors:** Verify `.env.local` and MySQL connection settings.
- **UI bugs:** Use browser dev tools and check React error messages.
- **Need help?** Ask for help with specific errors or issues.

## License

This project is licensed under the MIT License.

---

<div align="center">
  <sub>Created by LAHI-RU for client projects. Powered by Next.js & MySQL.</sub>
</div>
