// Combined reports API for incomes and expenses within a date range
import { NextResponse, type NextRequest } from "next/server";
import { Database } from "@/lib/mysql";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const projectId = searchParams.get("project_id");

  const incomeParams: any[] = [];
  const expenseParams: any[] = [];
  const incomeWhere: string[] = ["1=1"]; 
  const expenseWhere: string[] = ["1=1"]; 

    if (startDate) {
      incomeWhere.push("i.payment_date >= ?");
      expenseWhere.push("e.expense_date >= ?");
      incomeParams.push(startDate);
      expenseParams.push(startDate);
    }
    if (endDate) {
      incomeWhere.push("i.payment_date <= ?");
      expenseWhere.push("e.expense_date <= ?");
      incomeParams.push(endDate);
      expenseParams.push(endDate);
    }
    if (projectId) {
      incomeWhere.push("i.project_id = ?");
      expenseWhere.push("e.project_id = ?");
      incomeParams.push(projectId);
      expenseParams.push(projectId);
    }

    // Fetch incomes list
    const incomesQuery = `
      SELECT i.*, p.name as project_name
      FROM incomes i
      LEFT JOIN projects p ON i.project_id = p.id
      WHERE ${incomeWhere.join(" AND ")}
      ORDER BY i.payment_date DESC, i.created_at DESC
    `;

    // Fetch expenses list
    const expensesQuery = `
      SELECT e.*, ec.name as category_name, emp.full_name as employee_name, p.name as project_name
      FROM expenses e
      LEFT JOIN expense_categories ec ON e.category_id = ec.id
      LEFT JOIN employees emp ON e.employee_id = emp.id
      LEFT JOIN projects p ON e.project_id = p.id
      WHERE ${expenseWhere.join(" AND ")}
      ORDER BY e.expense_date DESC, e.created_at DESC
    `;

    // Aggregates
    const totalsQuery = `
      SELECT 'income' as type, COALESCE(SUM(i.amount), 0) as total, COUNT(*) as count
      FROM incomes i
      WHERE ${incomeWhere.join(" AND ")}
      UNION ALL
      SELECT 'expense' as type, COALESCE(SUM(e.amount), 0) as total, COUNT(*) as count
      FROM expenses e
      WHERE ${expenseWhere.join(" AND ")}
    `;

    // Breakdown by project
    const byProjectQuery = `
      SELECT p.id as project_id, p.name as project_name,
             COALESCE(inc.total_income, 0) as total_income,
             COALESCE(exp.total_expense, 0) as total_expense,
             (COALESCE(inc.total_income, 0) - COALESCE(exp.total_expense, 0)) as net
      FROM projects p
      LEFT JOIN (
        SELECT i.project_id, SUM(i.amount) as total_income
        FROM incomes i
        WHERE ${incomeWhere.join(" AND ")}
        GROUP BY i.project_id
      ) inc ON p.id = inc.project_id
      LEFT JOIN (
        SELECT e.project_id, SUM(e.amount) as total_expense
        FROM expenses e
        WHERE ${expenseWhere.join(" AND ")}
        GROUP BY e.project_id
      ) exp ON p.id = exp.project_id
      WHERE inc.total_income IS NOT NULL OR exp.total_expense IS NOT NULL
      ORDER BY net DESC
    `;

    // Run queries
    const combinedParams = [...incomeParams, ...expenseParams];

    const [incomes, expenses, totals, byProject] = await Promise.all([
      Database.query(incomesQuery, incomeParams),
      Database.query(expensesQuery, expenseParams),
      Database.query(totalsQuery, combinedParams),
      Database.query(byProjectQuery, combinedParams),
    ]);

    const incomeAgg = (totals as any[]).find((t) => t.type === "income") || { total: 0, count: 0 };
    const expenseAgg = (totals as any[]).find((t) => t.type === "expense") || { total: 0, count: 0 };

    return NextResponse.json({
      filters: { startDate, endDate, projectId },
      totals: {
        income: Number(incomeAgg.total || 0),
        incomeCount: Number(incomeAgg.count || 0),
        expense: Number(expenseAgg.total || 0),
        expenseCount: Number(expenseAgg.count || 0),
        net: Number((incomeAgg.total || 0) - (expenseAgg.total || 0)),
      },
      byProject,
      incomes,
      expenses,
    });
  } catch (error) {
    console.error("Error generating reports:", error);
    return NextResponse.json({ error: "Failed to generate reports" }, { status: 500 });
  }
}
