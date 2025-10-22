"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const categories = [
  {
    key: "incomes",
    title: "Incomes",
    desc: "Generate income reports and exports",
    color: "text-emerald-600",
  },
  {
    key: "expenses",
    title: "Expenses",
    desc: "Track expenses by project, category and employee",
    color: "text-red-600",
  },
  {
    key: "projects",
    title: "Projects",
    desc: "Project-wise performance and net summaries",
    color: "text-violet-600",
  },
  {
    key: "employees",
    title: "Employees",
    desc: "Salary & activity reports for employees",
    color: "text-sky-600",
  },
  {
    key: "salary-payments",
    title: "Salary Payments",
    desc: "Monthly salary disbursements and summaries",
    color: "text-amber-600",
  },
];

export default function ReportsPage() {
  // simple landing with category cards
  return (
    <div className="container p-responsive space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Select a report category to generate custom reports over any date
            range.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Calendar className="mr-2" /> Custom ranges
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <Card key={c.key}>
            <CardContent className="p-5 flex flex-col justify-between h-40">
              <div>
                <div className={`text-sm font-semibold ${c.color}`}>
                  {c.title}
                </div>
                <div className="text-muted-foreground mt-1 text-sm">
                  {c.desc}
                </div>
              </div>
              <div className="flex justify-end">
                <Link href={`/reports/${c.key}`}>
                  <Button size="sm">Open</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
