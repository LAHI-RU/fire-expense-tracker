import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function UserGuidePage() {
  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900 text-3xl font-extrabold">
            <span className="inline-block text-2xl">📘</span> User Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-base text-blue-900 max-h-[70vh] overflow-y-auto pr-2">
          <section>
            <h2 className="text-xl font-bold mb-2 text-blue-800">Welcome!</h2>
            <p>
              This guide is here to help you use your Fire Installation Business
              Manager with confidence. If you ever get stuck, check here for
              answers and tips!
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-2 text-indigo-700">
              How to Use the System
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Dashboard:</strong> Instantly see your business summary,
                profits, and recent activities.
              </li>
              <li>
                <strong>Projects:</strong> Add/manage projects, track progress,
                and see which ones are most profitable.
              </li>
              <li>
                <strong>Expenses:</strong> Record and categorize expenses for
                clear financial tracking.
              </li>
              <li>
                <strong>Employees:</strong> Manage staff and salary payments.
                Duplicate payments are automatically prevented.
              </li>
              <li>
                <strong>Incomes:</strong> Log all income sources to monitor
                growth and profitability.
              </li>
              <li>
                <strong>Charts & Analytics:</strong> Visualize your business
                performance with easy-to-read charts.
              </li>
            </ul>
          </section>
          <section className="bg-blue-100 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">
              Troubleshooting & Tips
            </h2>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>If something doesn't look right, try refreshing the page.</li>
              <li>Double-check your data entries for typos or missing info.</li>
              <li>
                Use the Dashboard for a quick health check of your business.
              </li>
              <li>
                For salary payments, the system will alert you if a duplicate is
                detected.
              </li>
              <li>
                Need to start fresh? Use the database reset option in the admin
                panel (if available).
              </li>
            </ul>
          </section>
          <section className="bg-cyan-100 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-cyan-700 mb-2">
              Need More Help?
            </h2>
            <p>
              If you have any questions or run into problems, our support team
              is here for you.
            </p>
            <ul className="list-disc list-inside space-y-1 text-cyan-800">
              <li>
                Email:{" "}
                <a
                  href="mailto:support@ldbsolutions.com"
                  className="underline text-blue-700"
                >
                  lahiiru.dananjaya@gmail.com
                </a>
              </li>
              <li>
                Phone:{" "}
                <a href="tel:+94772376081" className="underline text-blue-700">
                  +94 77 2376 081
                </a>
              </li>
            </ul>
          </section>
          <div className="pt-4 text-center text-sm text-blue-600">
            Thank you for choosing LDB Solutions. We’re committed to your
            success!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
