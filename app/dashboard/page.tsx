"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AnalyticsCharts } from "@/components/analytics-charts";
import DashboardStats from "@/components/dashboard-stats";
import { RecentActivities } from "@/components/recent-activities";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
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
    <div className="container p-responsive space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
            Welcome to Your Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Get a quick overview of your business performance and recent
            activities.
          </p>
        </div>
        <img
          src="/placeholder-logo.png"
          alt="Logo"
          className="h-16 w-16 object-contain rounded-full shadow"
        />
      </div>

      {/* Key Stats */}
      <DashboardStats
        projectStats={data.projectStats}
        financialOverview={data.financialOverview}
        employeeCount={data.employeeSalaries?.length || 0}
        totalProfit={
          (data.financialOverview?.find((item: any) => item.type === "incomes")
            ?.total || 0) -
          (data.financialOverview?.find((item: any) => item.type === "expenses")
            ?.total || 0)
        }
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4 text-blue-800">
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
          <CardContent>
            <h2 className="text-xl font-semibold mb-4 text-green-800">
              Recent Activities
            </h2>
            <RecentActivities activities={data.recentActivities} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
