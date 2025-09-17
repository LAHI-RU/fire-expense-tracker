// API routes for analytics and dashboard data
import { NextResponse } from "next/server"
import { Database } from "@/lib/mysql"

export async function GET() {
  try {
    // Get project statistics
    const projectStats = await Database.query(`
      SELECT 
        status,
        COUNT(*) as count,
        SUM(estimated_budget) as total_budget
      FROM projects 
      GROUP BY status
    `)

    // Get financial overview
    const financialOverview = await Database.query(`
      SELECT 
        'expenses' as type,
        SUM(amount) as total,
        COUNT(*) as count
      FROM expenses
      UNION ALL
      SELECT 
        'incomes' as type,
        SUM(amount) as total,
        COUNT(*) as count
      FROM incomes
    `)

    // Get monthly financial trends (last 12 months)
    const monthlyTrends = await Database.query(`
      SELECT 
        DATE_FORMAT(expense_date, '%Y-%m') as month,
        'expense' as type,
        SUM(amount) as amount
      FROM expenses 
      WHERE expense_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(expense_date, '%Y-%m')
      
      UNION ALL
      
      SELECT 
        DATE_FORMAT(payment_date, '%Y-%m') as month,
        'income' as type,
        SUM(amount) as amount
      FROM incomes 
      WHERE payment_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(payment_date, '%Y-%m')
      
      ORDER BY month
    `)

    // Get project profitability
    const projectProfitability = await Database.query(`
      SELECT 
        p.id,
        p.name,
        p.client_name,
        p.status,
        p.estimated_budget,
        COALESCE(expenses.total_expenses, 0) as total_expenses,
        COALESCE(incomes.total_income, 0) as total_income,
        (COALESCE(incomes.total_income, 0) - COALESCE(expenses.total_expenses, 0)) as profit
      FROM projects p
      LEFT JOIN (
        SELECT project_id, SUM(amount) as total_expenses
        FROM expenses
        GROUP BY project_id
      ) expenses ON p.id = expenses.project_id
      LEFT JOIN (
        SELECT project_id, SUM(amount) as total_income
        FROM incomes
        GROUP BY project_id
      ) incomes ON p.id = incomes.project_id
      ORDER BY profit DESC
    `)

    // Get expense categories breakdown
    const expenseCategories = await Database.query(`
      SELECT 
        ec.name as category,
        SUM(e.amount) as total,
        COUNT(e.id) as count
      FROM expenses e
      LEFT JOIN expense_categories ec ON e.category_id = ec.id
      GROUP BY ec.id, ec.name
      ORDER BY total DESC
    `)

    // Get employee salary overview
    const employeeSalaries = await Database.query(`
      SELECT 
        e.full_name,
        e.employee_code,
        e.monthly_salary,
        COALESCE(payments.total_paid, 0) as total_paid,
        COALESCE(payments.payment_count, 0) as payment_count
      FROM employees e
      LEFT JOIN (
        SELECT 
          employee_id,
          SUM(amount) as total_paid,
          COUNT(*) as payment_count
        FROM salary_payments
        WHERE payment_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        GROUP BY employee_id
      ) payments ON e.id = payments.employee_id
      WHERE e.is_active = TRUE
      ORDER BY total_paid DESC
    `)

    // Get recent expenses
    const recentExpenses = await Database.query(`
      SELECT e.id, e.description, e.amount, e.expense_date, ec.name as category, emp.full_name as employee, p.name as project
      FROM expenses e
      LEFT JOIN expense_categories ec ON e.category_id = ec.id
      LEFT JOIN employees emp ON e.employee_id = emp.id
      LEFT JOIN projects p ON e.project_id = p.id
      ORDER BY e.expense_date DESC, e.created_at DESC
      LIMIT 5
    `);

    // Get recent incomes
    const recentIncomes = await Database.query(`
      SELECT i.id, i.description, i.amount, i.payment_date, i.payment_method, i.payment_status, p.name as project
      FROM incomes i
      LEFT JOIN projects p ON i.project_id = p.id
      ORDER BY i.payment_date DESC, i.created_at DESC
      LIMIT 5
    `);

    // Get recent salary payments
    const recentSalaryPayments = await Database.query(`
      SELECT sp.id, emp.full_name as employee, sp.amount, sp.payment_date, sp.payment_type, p.name as project
      FROM salary_payments sp
      LEFT JOIN employees emp ON sp.employee_id = emp.id
      LEFT JOIN projects p ON sp.project_id = p.id
      ORDER BY sp.payment_date DESC, sp.created_at DESC
      LIMIT 5
    `);

    return NextResponse.json({
      projectStats,
      financialOverview,
      monthlyTrends,
      projectProfitability,
      expenseCategories,
      employeeSalaries,
      recentExpenses,
      recentIncomes,
      recentSalaryPayments,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}
