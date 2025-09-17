// Analytics charts components using Recharts
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "recharts"

interface AnalyticsChartsProps {
  monthlyTrends: any[]
  expenseCategories: any[]
  projectProfitability: any[]
}

const COLORS = ["#164e63", "#84cc16", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#10b981"]

export function AnalyticsCharts({ monthlyTrends, expenseCategories, projectProfitability }: AnalyticsChartsProps) {
  // Process monthly trends data for chart
  const processedTrends = monthlyTrends.reduce((acc: any[], item) => {
    const existingMonth = acc.find((m) => m.month === item.month)
    if (existingMonth) {
      existingMonth[item.type] = Number(item.amount)
    } else {
      acc.push({
        month: item.month,
        [item.type]: Number(item.amount),
      })
    }
    return acc
  }, [])

  // Process expense categories for pie chart
  const processedCategories = expenseCategories.map((cat) => ({
    name: cat.category || "Uncategorized",
    value: Number(cat.total),
    count: cat.count,
  }))

  // Process top profitable projects
  const topProjects = projectProfitability.slice(0, 8).map((project) => ({
    name: project.name.length > 20 ? project.name.substring(0, 20) + "..." : project.name,
    profit: Number(project.profit),
    expenses: Number(project.total_expenses),
    income: Number(project.total_income),
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Financial Trends */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Financial Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processedTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]} />
              <Line type="monotone" dataKey="income" stroke="#84cc16" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Expense Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={processedCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {processedCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Amount"]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Project Profitability */}
      <Card>
        <CardHeader>
          <CardTitle>Project Profitability</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProjects} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]} />
              <Bar dataKey="profit" fill="#164e63" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
