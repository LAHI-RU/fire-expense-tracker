"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsChartsProps {
  monthlyTrends: any[];
  expenseCategories: any[];
  projectProfitability: any[];
}

// (Removed unused COLORS array — categories and projects cards were removed.)

export const AnalyticsCharts = memo(function AnalyticsCharts({
  monthlyTrends,
  expenseCategories,
  projectProfitability,
}: AnalyticsChartsProps) {
  // Always use safe arrays for all props
  const safeMonthlyTrends = Array.isArray(monthlyTrends) ? monthlyTrends : [];
  const safeExpenseCategories = Array.isArray(expenseCategories)
    ? expenseCategories
    : [];
  const safeProjectProfitability = Array.isArray(projectProfitability)
    ? projectProfitability
    : [];

  // Build last 12 months (labels) and ensure both income & expense present for each month
  const getLast12Months = () => {
    const months: string[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString(undefined, {
        month: "short",
        year: "numeric",
      });
      months.push(label);
    }
    return months;
  };

  const monthLabels = getLast12Months();

  // Normalize incoming monthly trends into a map keyed by "Mon YYYY" label
  const trendsMap: Record<string, any> = {};
  safeMonthlyTrends.forEach((item) => {
    // item.month might be stored as '2025-10' or a label; try to parse
    let label = item.month;
    try {
      // if month looks like YYYY-MM, convert to our short label
      if (/^\d{4}-\d{1,2}$/.test(String(item.month))) {
        const [y, m] = String(item.month).split("-");
        const d = new Date(Number(y), Number(m) - 1, 1);
        label = d.toLocaleString(undefined, {
          month: "short",
          year: "numeric",
        });
      }
    } catch (e) {
      // fallback: keep original
    }

    if (!trendsMap[label]) trendsMap[label] = { income: 0, expense: 0 };
    const t = Number(item.amount) || 0;
    if (item.type === "income")
      trendsMap[label].income = (trendsMap[label].income || 0) + t;
    else if (item.type === "expense")
      trendsMap[label].expense = (trendsMap[label].expense || 0) + t;
    else {
      // unknown type, ignore
    }
  });

  const processedTrends = monthLabels.map((label) => ({
    month: label,
    income: Number(trendsMap[label]?.income || 0),
    expense: Number(trendsMap[label]?.expense || 0),
  }));

  // Note: expense categories and project processing removed from UI, keep raw data available if needed.

  return (
    <div className="space-y-6">
      {/* Monthly Financial Trends - full width */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends (Last 12 months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
              <span className="text-xs text-muted-foreground mb-1">
                Total Income
              </span>
              <span className="text-xl font-bold text-green-600">
                Rs.
                {processedTrends
                  .reduce((sum, m) => sum + (m.income || 0), 0)
                  .toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg">
              <span className="text-xs text-muted-foreground mb-1">
                Total Expenses
              </span>
              <span className="text-xl font-bold text-red-600">
                Rs.
                {processedTrends
                  .reduce((sum, m) => sum + (m.expense || 0), 0)
                  .toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-xs text-muted-foreground mb-1">
                Net Profit
              </span>
              <span
                className={`text-xl font-bold ${
                  processedTrends.reduce((sum, m) => sum + (m.income || 0), 0) -
                    processedTrends.reduce(
                      (sum, m) => sum + (m.expense || 0),
                      0
                    ) >=
                  0
                    ? "text-blue-600"
                    : "text-red-600"
                }`}
              >
                Rs.
                {(
                  processedTrends.reduce((sum, m) => sum + (m.income || 0), 0) -
                  processedTrends.reduce((sum, m) => sum + (m.expense || 0), 0)
                ).toLocaleString()}
              </span>
            </div>
          </div>

          <div style={{ width: "100%", height: 380 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processedTrends}
                margin={{ top: 10, right: 20, left: 80, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  width={92}
                  tickFormatter={(value) => `Rs.${Number(value).toLocaleString()}`}
                  tickCount={6}
                  domain={[0, "dataMax"]}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: any, name: any) => {
                    const key = String(name || "").toLowerCase();
                    const label = key.includes("income")
                      ? "Income"
                      : key.includes("expense")
                      ? "Expenses"
                      : String(name);
                    return [`Rs.${Number(value).toLocaleString()}`, label];
                  }}
                />
                <Legend
                  formatter={(value: any, entry: any) => {
                    const key = entry?.dataKey || String(value || "");
                    return key === "income"
                      ? "Income"
                      : key === "expense"
                      ? "Expenses"
                      : value;
                  }}
                />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#84cc16"
                  barSize={18}
                />
                <Bar
                  dataKey="expense"
                  name="Expenses"
                  fill="#ef4444"
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Removed: Top 5 Expense Categories and Top 5 Most Profitable Projects
          These sections were removed from the dashboard per request so the
          Monthly Trends chart is the primary focus. The data processing for
          categories and projects is left intact in case you want to reintroduce
          these cards elsewhere. */}
    </div>
  );
});

export default AnalyticsCharts;
