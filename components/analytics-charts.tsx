"use client";

import { memo, useMemo } from "react";
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

interface MonthlyTrendItem {
  month: string;
  type: "income" | "expense";
  amount: number;
}

interface AnalyticsChartsProps {
  monthlyTrends: MonthlyTrendItem[];
  expenseCategories?: any[];
  projectProfitability?: any[];
}

export const AnalyticsCharts = memo(function AnalyticsCharts({
  monthlyTrends,
}: AnalyticsChartsProps) {
  const safeMonthlyTrends = Array.isArray(monthlyTrends) ? monthlyTrends : [];

  // Generate last 12 months labels
  const monthLabels = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return d.toLocaleString(undefined, {
        month: "short",
        year: "numeric",
      });
    });
  }, []);

  // Map and normalize incoming trends
  const processedTrends = useMemo(() => {
    const trendsMap: Record<string, { income: number; expense: number }> = {};

    safeMonthlyTrends.forEach((item) => {
      let label = item.month;

      // Convert "YYYY-MM" → "Jan 2025"
      if (/^\d{4}-\d{1,2}$/.test(String(item.month))) {
        const [y, m] = String(item.month).split("-");
        const d = new Date(Number(y), Number(m) - 1, 1);
        label = d.toLocaleString(undefined, {
          month: "short",
          year: "numeric",
        });
      }

      if (!trendsMap[label]) trendsMap[label] = { income: 0, expense: 0 };

      const amount = Number(item.amount) || 0;
      if (item.type === "income") trendsMap[label].income += amount;
      if (item.type === "expense") trendsMap[label].expense += amount;
    });

    return monthLabels.map((label) => ({
      month: label,
      income: trendsMap[label]?.income ?? 0,
      expense: trendsMap[label]?.expense ?? 0,
    }));
  }, [safeMonthlyTrends, monthLabels]);

  // Summary metrics
  const totals = useMemo(() => {
    const income = processedTrends.reduce((sum, m) => sum + m.income, 0);
    const expense = processedTrends.reduce((sum, m) => sum + m.expense, 0);
    return { income, expense, net: income - expense };
  }, [processedTrends]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends (Last 12 months)</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Income */}
            <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
              <span className="text-xs text-muted-foreground">
                Total Income
              </span>
              <span className="text-xl font-bold text-green-600">
                Rs.{totals.income.toLocaleString()}
              </span>
            </div>

            {/* Expenses */}
            <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg">
              <span className="text-xs text-muted-foreground">
                Total Expenses
              </span>
              <span className="text-xl font-bold text-red-600">
                Rs.{totals.expense.toLocaleString()}
              </span>
            </div>

            {/* Net */}
            <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-xs text-muted-foreground">Net Profit</span>
              <span
                className={`text-xl font-bold ${
                  totals.net >= 0 ? "text-blue-600" : "text-red-600"
                }`}
              >
                Rs.{totals.net.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Chart */}
          <div style={{ width: "100%", height: 380 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processedTrends}
                margin={{ top: 10, right: 20, left: 60, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />

                <YAxis
                  width={80}
                  tickFormatter={(v) => `Rs.${v.toLocaleString()}`}
                />

                <Tooltip
                  formatter={(value: any, name: any) => {
                    const label =
                      String(name).toLowerCase() === "income"
                        ? "Income"
                        : String(name).toLowerCase() === "expense"
                        ? "Expenses"
                        : String(name);
                    return [`Rs.${Number(value).toLocaleString()}`, label];
                  }}
                />

                <Legend
                  formatter={(value) => {
                    const v = String(value);
                    if (v.toLowerCase() === "income") return "Income";
                    if (v.toLowerCase() === "expense") return "Expenses";
                    return v;
                  }}
                />

                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#22c55e"
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
    </div>
  );
});

export default AnalyticsCharts;
