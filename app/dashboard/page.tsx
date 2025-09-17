"use client";
import React, { useEffect, useState } from "react";

interface AnalyticsData {
  projectStats: any[];
  financialOverview: any[];
  monthlyTrends: any[];
  projectProfitability: any[];
  expenseCategories: any[];
  employeeSalaries: any[];
  recentExpenses: any[];
  recentIncomes: any[];
  recentSalaryPayments: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load dashboard data");
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="p-8 text-center">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!data) return null;

  const projectStats = Array.isArray(data.projectStats)
    ? data.projectStats
    : [];
  const financialOverview = Array.isArray(data.financialOverview)
    ? data.financialOverview
    : [];
  const recentExpenses = Array.isArray(data.recentExpenses)
    ? data.recentExpenses
    : [];
  const recentIncomes = Array.isArray(data.recentIncomes)
    ? data.recentIncomes
    : [];
  const recentSalaryPayments = Array.isArray(data.recentSalaryPayments)
    ? data.recentSalaryPayments
    : [];
  const expenseCategories = Array.isArray(data.expenseCategories)
    ? data.expenseCategories
    : [];
  const employeeSalaries = Array.isArray(data.employeeSalaries)
    ? data.employeeSalaries
    : [];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Project Stats</h2>
          <ul>
            {projectStats.map((stat, i) => (
              <li key={i} className="mb-2">
                {stat.status}: <b>{stat.count}</b> (Budget: Rs.
                {stat.total_budget})
              </li>
            ))}
            {projectStats.length === 0 && (
              <li className="text-gray-500">No data available</li>
            )}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
          <ul>
            {financialOverview.map((item, i) => (
              <li key={i} className="mb-2">
                {item.type}: <b>Rs.{item.total}</b> ({item.count} records)
              </li>
            ))}
            {financialOverview.length === 0 && (
              <li className="text-gray-500">No data available</li>
            )}
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
          <ul>
            {recentExpenses.map((exp, i) => (
              <li key={i} className="mb-4 border-b pb-2">
                <div>
                  <div className="font-bold text-blue-700">
                    {exp.description}
                  </div>
                  <div className="text-sm text-gray-600">
                    Amount:{" "}
                    <span className="font-semibold">Rs.{exp.amount}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Date: {exp.expense_date} | Category: {exp.category} |
                    Employee: {exp.employee} | Project: {exp.project}
                  </div>
                </div>
              </li>
            ))}
            {recentExpenses.length === 0 && (
              <li className="text-gray-500">No recent expenses</li>
            )}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Incomes</h2>
          <ul>
            {recentIncomes.map((inc, i) => (
              <li key={i} className="mb-4 border-b pb-2">
                <div>
                  <div className="font-bold text-green-700">
                    {inc.description}
                  </div>
                  <div className="text-sm text-gray-600">
                    Amount:{" "}
                    <span className="font-semibold">Rs.{inc.amount}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Date: {inc.payment_date} | Method: {inc.payment_method} |
                    Status: {inc.payment_status} | Project: {inc.project}
                  </div>
                </div>
              </li>
            ))}
            {recentIncomes.length === 0 && (
              <li className="text-gray-500">No recent incomes</li>
            )}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Salary Payments</h2>
          <ul>
            {recentSalaryPayments.map((sal, i) => (
              <li key={i} className="mb-4 border-b pb-2">
                <div>
                  <div className="font-bold text-indigo-700">
                    {sal.employee}
                  </div>
                  <div className="text-sm text-gray-600">
                    Amount:{" "}
                    <span className="font-semibold">Rs.{sal.amount}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Date: {sal.payment_date} | Type: {sal.payment_type} |
                    Project: {sal.project}
                  </div>
                </div>
              </li>
            ))}
            {recentSalaryPayments.length === 0 && (
              <li className="text-gray-500">No recent salary payments</li>
            )}
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Expense Categories</h2>
          <ul>
            {expenseCategories.map((cat, i) => (
              <li key={i} className="mb-2">
                {cat.category}: <b>Rs.{cat.total}</b> ({cat.count} expenses)
              </li>
            ))}
            {expenseCategories.length === 0 && (
              <li className="text-gray-500">No data available</li>
            )}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Employee Salaries</h2>
          <ul>
            {employeeSalaries.map((emp, i) => (
              <li key={i} className="mb-2">
                {emp.full_name} ({emp.employee_code}):{" "}
                <b>Rs.{emp.monthly_salary}</b> Paid: Rs.{emp.total_paid} (
                {emp.payment_count} payments)
              </li>
            ))}
            {employeeSalaries.length === 0 && (
              <li className="text-gray-500">No data available</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
