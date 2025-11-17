"use client";

import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FolderOpen,
  Users,
  AlertTriangle,
} from "lucide-react";

interface DashboardStatsProps {
  projectStats: any[];
  financialOverview: any[];
  employeeCount: number;
  totalProfit: number;
}

export const DashboardStats = memo(function DashboardStats({
  projectStats,
  financialOverview,
  employeeCount,
  totalProfit,
}: DashboardStatsProps) {
  const totalProjects = projectStats.reduce(
    (sum, stat) => sum + Number(stat.count),
    0
  );
  const ongoingProjects =
    projectStats.find((stat) => stat.status === "ongoing")?.count || 0;
  const completedProjects =
    projectStats.find((stat) => stat.status === "completed")?.count || 0;

  const totalExpenses =
    financialOverview.find((item) => item.type === "expenses")?.total || 0;
  const totalIncome =
    financialOverview.find((item) => item.type === "incomes")?.total || 0;

  const profitMargin =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Projects */}
      <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <CardContent className="p-2 sm:p-3">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap min-w-0">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FolderOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-semibold text-foreground">
                {totalProjects}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Total Projects
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">
                {ongoingProjects} ongoing • {completedProjects} completed
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card>
        <CardContent className="p-2 sm:p-3">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap min-w-0">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-semibold text-green-600 truncate">
                Rs.{Number(totalIncome).toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Total Income
              </div>
              <div className="text-[10px] sm:text-xs text-green-600 mt-1">
                Revenue generated
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Expenses */}
      <Card>
        <CardContent className="p-2 sm:p-3">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap min-w-0">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-semibold text-red-600 truncate">
                Rs.{Number(totalExpenses).toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Total Expenses
              </div>
              <div className="text-[10px] sm:text-xs text-red-600 mt-1">
                Business costs
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Net Profit */}
      <Card>
        <CardContent className="p-2 sm:p-3">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap min-w-0">
            <div
              className={`p-2 rounded-lg ${
                totalProfit >= 0 ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {totalProfit >= 0 ? (
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              )}
            </div>
            <div className="min-w-0">
              <div
                className={`text-lg sm:text-xl font-semibold truncate ${
                  totalProfit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                Rs.{Math.abs(totalProfit).toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Net Profit
              </div>
              <div
                className={`text-[10px] sm:text-xs mt-1 ${
                  profitMargin >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {profitMargin.toFixed(1)}% margin
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Employees */}
      <Card>
        <CardContent className="p-2 sm:p-3">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap min-w-0">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-semibold text-blue-600">
                {employeeCount}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Active Employees
              </div>
              <div className="text-[10px] sm:text-xs text-blue-600 mt-1">
                Team members
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project On-Hold */}
      <Card>
        <CardContent className="p-2 sm:p-3">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap min-w-0">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-semibold text-amber-600">
                {projectStats.find((stat) => stat.status === "on-hold")
                  ?.count || 0}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                On Hold Projects
              </div>
              <div className="text-[10px] sm:text-xs text-amber-600 mt-1">
                Need attention
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profit Margin */}
      <Card>
        <CardContent className="p-2 sm:p-3">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap min-w-0">
            <div
              className={`p-2 rounded-lg ${
                profitMargin >= 20
                  ? "bg-green-100"
                  : profitMargin >= 10
                  ? "bg-amber-100"
                  : "bg-red-100"
              }`}
            >
              <TrendingUp
                className={`h-5 w-5 sm:h-6 sm:w-6 ${
                  profitMargin >= 20
                    ? "text-green-600"
                    : profitMargin >= 10
                    ? "text-amber-600"
                    : "text-red-600"
                }`}
              />
            </div>
            <div className="min-w-0">
              <div
                className={`text-lg sm:text-xl font-semibold truncate ${
                  profitMargin >= 20
                    ? "text-green-600"
                    : profitMargin >= 10
                    ? "text-amber-600"
                    : "text-red-600"
                }`}
              >
                {profitMargin.toFixed(1)}%
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Profit Margin
              </div>
              <div
                className={`text-[10px] sm:text-xs mt-1 ${
                  profitMargin >= 20
                    ? "text-green-600"
                    : profitMargin >= 10
                    ? "text-amber-600"
                    : "text-red-600"
                }`}
              >
                {profitMargin >= 20
                  ? "Excellent"
                  : profitMargin >= 10
                  ? "Good"
                  : "Needs improvement"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Planning Projects */}
      <Card>
        <CardContent className="p-2 sm:p-3">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap min-w-0">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FolderOpen className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-semibold text-purple-600">
                {projectStats.find((stat) => stat.status === "planning")
                  ?.count || 0}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Planning Projects
              </div>
              <div className="text-[10px] sm:text-xs text-purple-600 mt-1">
                Ready to start
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

export default DashboardStats;
