import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function UserGuidePage() {
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card className="shadow-lg border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 text-2xl">
            📖 User Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-base text-muted-foreground">
          <p>
            Welcome to the Fire Installation Business Manager! This guide will
            help you get started and make the most of the system.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Dashboard:</strong> View a summary of your business,
              including profit analytics, project stats, and recent activities.
            </li>
            <li>
              <strong>Projects:</strong> Add and manage fire installation
              projects. Track progress, expenses, and profitability for each
              project.
            </li>
            <li>
              <strong>Expenses:</strong> Record and categorize expenses for
              better financial tracking and analysis.
            </li>
            <li>
              <strong>Employees:</strong> Manage employee details and salary
              payments. The system prevents duplicate salary payments
              automatically.
            </li>
            <li>
              <strong>Incomes:</strong> Log all income sources to monitor your
              business growth and profitability.
            </li>
            <li>
              <strong>Analytics:</strong> Use charts and trends to visualize
              your business performance over time.
            </li>
          </ul>
          <div className="mt-4 p-4 bg-blue-50 rounded">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              Getting Started
            </h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Set up your MySQL database using the provided scripts.</li>
              <li>
                Configure your database connection in the environment variables.
              </li>
              <li>Add your first project and employees.</li>
              <li>Start tracking expenses and incomes.</li>
              <li>Visit the dashboard for a business summary.</li>
            </ol>
          </div>
          <p className="mt-4 text-sm text-blue-600">
            For more help, see the README or contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
