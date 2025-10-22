"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AnalyticsCharts } from "@/components/analytics-charts";
import DashboardStats from "@/components/dashboard-stats";
import { RecentActivities } from "@/components/recent-activities";
import { requireAuth } from "@/lib/auth-client";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    const user = typeof window !== "undefined" ? requireAuth() : null;
    if (!user) return; // requireAuth will redirect if not logged in

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

  if (loading) {
    return (
      <div className="container p-responsive flex flex-col items-center justify-center min-h-[60vh]">
        <span className="animate-spin text-4xl text-blue-700 mb-4">⏳</span>
        <h2 className="text-xl font-semibold text-muted-foreground">
          Loading dashboard...
        </h2>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container p-responsive flex flex-col items-center justify-center min-h-[60vh]">
        <span className="text-4xl text-red-600 mb-4">⚠️</span>
        <h2 className="text-xl font-semibold text-red-600">{error}</h2>
      </div>
    );
  }
  if (!data) return null;

  // Welcome Section
  // Key Stats
  // Charts and Recent Activities
  return (
    <>
      <div className="container p-responsive space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-2">
              Welcome to Your Dashboard
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Get a quick overview of your business performance and recent
              activities.
            </p>
          </div>
          <img
            src="/logo.jpg"
            alt="Logo"
            className="h-16 w-16 object-contain rounded-full shadow"
          />
        </div>

        {/* Key Stats + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
          <div className="lg:col-span-3">
            <DashboardStats
              projectStats={data.projectStats}
              financialOverview={data.financialOverview}
              employeeCount={data.employeeSalaries?.length || 0}
              totalProfit={
                (data.financialOverview?.find(
                  (item: any) => item.type === "incomes"
                )?.total || 0) -
                (data.financialOverview?.find(
                  (item: any) => item.type === "expenses"
                )?.total || 0)
              }
            />
          </div>

          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardContent className="pt-6">
                <div className="h-full flex flex-col">
                  <h3 className="text-base md:text-lg font-medium mb-4">
                    Quick Actions
                  </h3>
                  <div className="flex flex-col gap-3 flex-1">
                    <a
                      href="/employees?openPayment=1"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white text-sm md:text-base rounded shadow hover:bg-blue-700 transition"
                    >
                      Record Payment
                    </a>
                    <a
                      href="/incomes"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white text-sm md:text-base rounded shadow hover:bg-green-700 transition"
                    >
                      Incomes
                    </a>
                    <a
                      href="/expenses"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white text-sm md:text-base rounded shadow hover:bg-amber-700 transition"
                    >
                      Expenses
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4 text-blue-800">
                Monthly Trends
              </h2>
              <AnalyticsCharts
                monthlyTrends={data.monthlyTrends}
                expenseCategories={data.expenseCategories}
                projectProfitability={data.projectProfitability}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4 text-green-800">
                Recent Activities
              </h2>
              <RecentActivities activities={data.recentActivities} />
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Floating Help & Guide Button */}
      <a
        href="/user-guide"
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full shadow-xl px-5 py-3 flex items-center gap-2 hover:from-blue-700 hover:to-cyan-600 transition text-lg font-semibold"
        aria-label="Help & Guide"
        style={{ pointerEvents: "auto" }}
      >
        <span>💡Help</span>
      </a>
    </>
  );
}
