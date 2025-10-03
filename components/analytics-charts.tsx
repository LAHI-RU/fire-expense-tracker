"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface AnalyticsChartsProps {
  monthlyTrends: any[];
  expenseCategories: any[];
  projectProfitability: any[];
}

const COLORS = [
  "#164e63",
  "#84cc16",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
];

export function AnalyticsCharts({
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

  // Process monthly trends data for chart
  const processedTrends = safeMonthlyTrends.reduce((acc: any[], item) => {
    const existingMonth = acc.find((m) => m.month === item.month);
    if (existingMonth) {
      existingMonth[item.type] = Number(item.amount);
    } else {
      acc.push({
        month: item.month,
        [item.type]: Number(item.amount),
      });
    }
    return acc;
  }, []);

  // Process expense categories for pie chart - top 5 only
  const processedCategories = safeExpenseCategories
    .map((cat) => ({
      name: cat.category || "Uncategorized",
      value: Number(cat.total),
      count: cat.count,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Process top 5 profitable projects
  const topProjects = safeProjectProfitability.slice(0, 5).map((project) => ({
    name:
      project.name && project.name.length > 25
        ? project.name.substring(0, 25) + "..."
        : project.name,
    profit: Number(project.profit),
    expenses: Number(project.total_expenses),
    income: Number(project.total_income),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Financial Trends */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
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
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processedTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  `Rs.${Number(value).toLocaleString()}`,
                  name === "income" ? "Income" : "Expenses",
                ]}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#84cc16"
                strokeWidth={2}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                strokeWidth={2}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Expense Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Expense Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={processedCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={false}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {processedCategories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`Rs.${Number(value).toLocaleString()}`]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Category Legend */}
          <div className="mt-4 space-y-2">
            {processedCategories.map((cat, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted/30 rounded"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="font-medium text-sm">{cat.name}</span>
                </div>
                <span className="font-bold text-sm">
                  Rs.{cat.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Project Profitability */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Most Profitable Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topProjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No projects
              </div>
            ) : (
              topProjects.map((project, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition"
                >
                  <div className="font-medium text-sm truncate">
                    {project.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold text-lg ${
                        project.profit >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {project.profit >= 0 ? "+" : ""}Rs.
                      {project.profit.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AnalyticsCharts;
