"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  CalendarRange,
  Wallet,
  CreditCard,
  Sigma,
  Layers3,
} from "lucide-react";
import { requireAuth } from "@/lib/auth-client";

type ReportTotals = {
  income: number;
  incomeCount: number;
  expense: number;
  expenseCount: number;
  net: number;
};

export default function ReportsPage() {
  // Enforce auth on client route
  const user = typeof window !== "undefined" ? requireAuth() : null;
  useEffect(() => {
    if (!user) return;
  }, [user]);

  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(1); // first day of month
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [projectId, setProjectId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<any>({
    totals: { income: 0, expense: 0, net: 0, incomeCount: 0, expenseCount: 0 },
    incomes: [],
    expenses: [],
    byProject: [],
  });

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (startDate) params.set("start_date", startDate);
      if (endDate) params.set("end_date", endDate);
      if (projectId) params.set("project_id", projectId);
      const res = await fetch(`/api/reports?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load report");
      setData(json);
    } catch (e: any) {
      setError(e.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totals: ReportTotals = data.totals || {
    income: 0,
    expense: 0,
    net: 0,
    incomeCount: 0,
    expenseCount: 0,
  };

  const exportCsv = (type: "incomes" | "expenses") => {
    const rows = (data?.[type] || []).map((r: any) => {
      if (type === "incomes") {
        return {
          id: r.id,
          date: r.payment_date?.slice(0, 10),
          project: r.project_name || "",
          description: r.description || "",
          amount: r.amount,
          method: r.payment_method,
          status: r.payment_status,
          invoice: r.invoice_number || "",
        };
      } else {
        return {
          id: r.id,
          date: r.expense_date?.slice(0, 10),
          project: r.project_name || "",
          category: r.category_name || "",
          employee: r.employee_name || "",
          description: r.description || "",
          amount: r.amount,
        };
      }
    });
    const headers = Object.keys(rows[0] || {});
    const csv = [headers.join(",")]
      .concat(
        rows.map((r: any) =>
          headers.map((h) => JSON.stringify(r[h] ?? "")).join(",")
        )
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}-report-${startDate}-to-${endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container p-responsive space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Generate incomes and expenses reports for a specific period
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6 px-4 pb-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground">
                Start date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-muted-foreground">End date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-muted-foreground">
                Project (optional ID)
              </label>
              <Input
                placeholder="Project ID"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={fetchReports}
              disabled={loading}
              className="flex-1 sm:flex-initial"
            >
              <CalendarRange className="h-4 w-4 mr-2" /> Apply
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setProjectId("");
                setStartDate(
                  new Date(new Date().setDate(1)).toISOString().slice(0, 10)
                );
                setEndDate(new Date().toISOString().slice(0, 10));
              }}
              className="flex-1 sm:flex-initial"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 px-4 pb-4 flex items-center gap-3">
            <Wallet className="text-emerald-600 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Total Incomes</div>
              <div className="text-lg sm:text-xl font-semibold text-emerald-700 truncate">
                Rs.{Number(totals.income).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 px-4 pb-4 flex items-center gap-3">
            <CreditCard className="text-red-600 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">
                Total Expenses
              </div>
              <div className="text-lg sm:text-xl font-semibold text-red-700 truncate">
                Rs.{Number(totals.expense).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 px-4 pb-4 flex items-center gap-3">
            <Sigma className="text-blue-600 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Net</div>
              <div
                className={`text-lg sm:text-xl font-semibold truncate ${
                  totals.net >= 0 ? "text-emerald-700" : "text-red-700"
                }`}
              >
                Rs.{Number(totals.net).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 px-4 pb-4 flex items-center gap-3">
            <Layers3 className="text-violet-600 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Records</div>
              <div className="text-lg sm:text-xl font-semibold">
                {totals.incomeCount + totals.expenseCount}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project breakdown */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <div className="p-4 font-semibold">By Project</div>
          <div className="min-w-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead className="text-right">Incomes</TableHead>
                  <TableHead className="text-right">Expenses</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data.byProject || []).length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      No data
                    </TableCell>
                  </TableRow>
                ) : (
                  (data.byProject || []).map((row: any) => (
                    <TableRow key={row.project_id}>
                      <TableCell className="font-medium">
                        {row.project_name}
                      </TableCell>
                      <TableCell className="text-right">
                        Rs.{Number(row.total_income || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        Rs.{Number(row.total_expense || 0).toLocaleString()}
                      </TableCell>
                      <TableCell
                        className={`text-right ${
                          Number(row.net) >= 0
                            ? "text-emerald-700"
                            : "text-red-700"
                        }`}
                      >
                        Rs.{Number(row.net || 0).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed tabs */}
      <Tabs defaultValue="incomes">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
          <TabsList>
            <TabsTrigger value="incomes">
              Incomes ({data?.incomes?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="expenses">
              Expenses ({data?.expenses?.length || 0})
            </TabsTrigger>
          </TabsList>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => exportCsv("incomes")}
              className="text-sm"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" /> Export incomes
            </Button>
            <Button
              variant="outline"
              onClick={() => exportCsv("expenses")}
              className="text-sm"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" /> Export expenses
            </Button>
          </div>
        </div>
        <TabsContent value="incomes">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <div className="min-w-[800px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(data.incomes || []).length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-muted-foreground"
                        >
                          No incomes
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.incomes.map((r: any) => (
                        <TableRow key={r.id}>
                          <TableCell>
                            {r.payment_date
                              ? new Date(r.payment_date).toLocaleDateString()
                              : ""}
                          </TableCell>
                          <TableCell>{r.project_name || ""}</TableCell>
                          <TableCell
                            className="max-w-[400px] truncate"
                            title={r.description}
                          >
                            {r.description}
                          </TableCell>
                          <TableCell className="text-right">
                            Rs.{Number(r.amount).toLocaleString()}
                          </TableCell>
                          <TableCell>{r.payment_method}</TableCell>
                          <TableCell>{r.payment_status}</TableCell>
                          <TableCell>{r.invoice_number || "-"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expenses">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <div className="min-w-[800px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(data.expenses || []).length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-muted-foreground"
                        >
                          No expenses
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.expenses.map((r: any) => (
                        <TableRow key={r.id}>
                          <TableCell>
                            {r.expense_date
                              ? new Date(r.expense_date).toLocaleDateString()
                              : ""}
                          </TableCell>
                          <TableCell>{r.project_name || ""}</TableCell>
                          <TableCell>{r.category_name || ""}</TableCell>
                          <TableCell>{r.employee_name || ""}</TableCell>
                          <TableCell
                            className="max-w-[400px] truncate"
                            title={r.description}
                          >
                            {r.description}
                          </TableCell>
                          <TableCell className="text-right">
                            Rs.{Number(r.amount).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
