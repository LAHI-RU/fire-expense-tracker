"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AnalyticsCharts } from "@/components/analytics-charts";
import DashboardStats from "@/components/dashboard-stats";
import { requireAuth } from "@/lib/auth-client";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = typeof window !== "undefined" ? requireAuth() : null;
    if (!user) return;

    fetch("/api/analytics")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load dashboard data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container p-4 flex flex-col items-center justify-center min-h-screen text-center">
        <span className="animate-spin text-4xl sm:text-5xl text-blue-700 mb-4">
          ⏳
        </span>
        <h2 className="text-lg sm:text-xl font-semibold text-muted-foreground">
          Loading dashboard...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container p-4 flex flex-col items-center justify-center min-h-[50vh] text-center">
        <span className="text-4xl text-red-600 mb-4">⚠️</span>
        <h2 className="text-lg sm:text-xl font-semibold text-red-600">
          {error}
        </h2>
      </div>
    );
  }

  if (!data) return null;

  return (
    <>
      <div className="container p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 mt-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-2">
              Welcome to Your Dashboard
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
              Get a quick overview of your business performance and recent
              activities.
            </p>
          </div>
        </div>

        {/* Key Stats + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <DashboardStats
              projectStats={data.projectStats}
              financialOverview={data.financialOverview}
              employeeCount={data.employeeSalaries?.length || 0}
              totalProfit={
                Number(
                  data.financialOverview?.find(
                    (item: any) => item.type === "incomes"
                  )?.total || 0
                ) -
                (Number(
                  data.financialOverview?.find(
                    (item: any) => item.type === "expenses"
                  )?.total || 0
                ) +
                  Number(
                    data.financialOverview?.find(
                      (item: any) => item.type === "salary_payments"
                    )?.total || 0
                  ))
              }
            />
          </div>

          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col h-full">
                  <h3 className="text-base md:text-lg font-medium mb-4">
                    Quick Actions
                  </h3>

                  <div className="flex flex-col gap-3 flex-1">
                    <a
                      href="/employees?openPayment=1"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white text-sm md:text-base rounded shadow hover:bg-blue-700 transition"
                    >
                      Record Payment
                    </a>

                    <a
                      href="/incomes"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white text-sm md:text-base rounded shadow hover:bg-green-700 transition"
                    >
                      Incomes
                    </a>

                    <a
                      href="/expenses"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white text-sm md:text-base rounded shadow hover:bg-amber-700 transition"
                    >
                      Expenses
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <AnalyticsCharts
              monthlyTrends={data.monthlyTrends}
              expenseCategories={data.expenseCategories}
              projectProfitability={data.projectProfitability}
            />
          </div>
        </div>
      </div>

      {/* Floating Help Button */}
      <a
        href="/user-guide"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full shadow-xl px-4 py-3 sm:px-5 sm:py-3 flex items-center gap-2 hover:from-blue-700 hover:to-cyan-600 transition text-base sm:text-lg font-semibold"
        aria-label="Help & Guide"
        style={{ pointerEvents: "auto" }}
      >
        <span>💡Help</span>
      </a>
    </>
  );
}
