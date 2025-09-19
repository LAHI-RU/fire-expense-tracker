// Analytics dashboard page
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/components/dashboard-stats";
import { AnalyticsCharts } from "@/components/analytics-charts";
import { RecentActivities } from "@/components/recent-activities";

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics");
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="container p-responsive">
        <div className="text-center py-8">
          <div className="text-muted-foreground">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="container p-responsive">
        <div className="text-center py-8">
          <div className="text-muted-foreground">
            Failed to load analytics data
          </div>
        </div>
      </div>
    );
  }

  const totalIncome =
    analyticsData.financialOverview.find((item: any) => item.type === "incomes")
      ?.total || 0;
  const totalExpenses =
    analyticsData.financialOverview.find(
      (item: any) => item.type === "expenses"
    )?.total || 0;
  const totalProfit = Number(totalIncome) - Number(totalExpenses);
  const employeeCount = analyticsData.employeeSalaries.length;

  return (
    <div className="container p-responsive space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">
          Business insights and performance metrics
        </p>
      </div>

      {/* Key Statistics */}
      <DashboardStats
        projectStats={analyticsData.projectStats}
        financialOverview={analyticsData.financialOverview}
        employeeCount={employeeCount}
        totalProfit={totalProfit}
      />

      {/* Charts */}
      <AnalyticsCharts
        monthlyTrends={analyticsData.monthlyTrends}
        expenseCategories={analyticsData.expenseCategories}
        projectProfitability={analyticsData.projectProfitability}
      />

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Profitable Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Most Profitable Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.projectProfitability
                .slice(0, 5)
                .map((project: any, index: number) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {project.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {project.client_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold ${
                          Number(project.profit) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ${Math.abs(Number(project.profit)).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {project.status}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <RecentActivities activities={analyticsData.recentActivities} />
      </div>

      {/* Employee Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Salary Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyticsData.employeeSalaries.map((employee: any) => (
              <div
                key={employee.employee_code}
                className="p-4 rounded-lg border border-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">
                    {employee.full_name}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {employee.employee_code}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Monthly Salary:
                    </span>
                    <span className="font-medium">
                      ${Number(employee.monthly_salary || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Total Paid (12m):
                    </span>
                    <span className="font-medium text-green-600">
                      ${Number(employee.total_paid || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payments:</span>
                    <span className="font-medium">
                      {employee.payment_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
