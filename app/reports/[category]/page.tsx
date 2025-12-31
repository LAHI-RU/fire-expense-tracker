"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";

type CategoryProps = {
  params: { category: string };
};

const presets = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "This month", preset: "month" },
];

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function CategoryReports({ params }: CategoryProps) {
  const category = params.category;
  const router = useRouter();
  const search = useSearchParams();

  const [startDate, setStartDate] = useState(() => {
    const s = search?.get("start") || "";
    if (s) return s;
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return formatDate(d);
  });
  const [endDate, setEndDate] = useState(
    () => search?.get("end") || formatDate(new Date())
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [colOrder, setColOrder] = useState<string[]>([]);
  const [friendlyMap, setFriendlyMap] = useState<Record<string, string>>({});
  const [totalsSummary, setTotalsSummary] = useState<{ amount?: number }>({});
  const [employees, setEmployees] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    // If URL contains query params, sync them
    const s = search?.get("start");
    const e = search?.get("end");
    if (s) setStartDate(s);
    if (e) setEndDate(e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search?.toString()]);

  // fetch dropdown lists
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [pRes, eRes, cRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/employees"),
          fetch("/api/expense-categories"),
        ]);
        const pJson = await pRes.json();
        const eJson = await eRes.json();
        const cJson = await cRes.json();
        setProjects(pJson.projects || []);
        setEmployees(eJson.employees || []);
        setCategoriesList(cJson.categories || []);
      } catch (err) {
        // ignore list errors for now
      }
    };
    fetchLists();
  }, []);

  const applyPreset = (p: any) => {
    if (p.preset === "month") {
      const d = new Date();
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      setStartDate(formatDate(start));
      setEndDate(formatDate(new Date()));
    } else {
      const d = new Date();
      setStartDate(
        formatDate(new Date(d.getTime() - (p.days || 0) * 24 * 3600 * 1000))
      );
      setEndDate(formatDate(new Date()));
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      let url = "";
      const params = new URLSearchParams();
      if (startDate) params.set("start_date", startDate);
      if (endDate) params.set("end_date", endDate);
      if (selectedEmployee && selectedEmployee !== "all")
        params.set("employee_id", selectedEmployee);
      if (selectedProject && selectedProject !== "all")
        params.set("project_id", selectedProject);
      if (selectedCategory && selectedCategory !== "all")
        params.set("category_id", selectedCategory);

      switch (category) {
        case "incomes":
          // incomes can be filtered by project
          url = `/api/incomes?${params.toString()}`;
          break;
        case "expenses":
          // expenses can be filtered by project, category, employee
          url = `/api/expenses?${params.toString()}`;
          break;
        case "projects":
          url = `/api/projects?${params.toString()}`;
          break;
        case "employees":
          // employee page: show payments for selected employee
          // we'll call salary-payments endpoint with employee_id
          url = `/api/salary-payments?${params.toString()}`;
          break;
        case "salary-payments":
          url = `/api/salary-payments?${params.toString()}`;
          break;
        default:
          throw new Error("Unknown report category");
      }

      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load data");
      setResult(json);
      // normalize rows depending on category
      let dataRows: any[] = [];
      if (category === "incomes" && Array.isArray(json.incomes))
        dataRows = json.incomes;
      else if (category === "expenses" && Array.isArray(json.expenses))
        dataRows = json.expenses;
      else if (category === "projects" && Array.isArray(json.projects))
        dataRows = json.projects;
      else if (category === "employees" && Array.isArray(json.employees))
        dataRows = json.employees;
      else if (category === "salary-payments" && Array.isArray(json.payments))
        dataRows = json.payments;
      else {
        // fallback: if json has a top-level array, pick it
        const firstArr = Object.values(json).find((v) => Array.isArray(v)) as
          | any[]
          | undefined;
        if (firstArr) dataRows = firstArr as any[];
      }

      setRows(dataRows || []);
      const keys =
        dataRows && dataRows.length > 0 ? Object.keys(dataRows[0]) : [];
      // choose column order and friendly labels depending on category
      let order: string[] = [];
      const map: Record<string, string> = {};
      if (category === "incomes") {
        order = [
          "payment_date",
          "project_name",
          "description",
          "amount",
          "payment_method",
          "payment_status",
          "invoice_number",
        ];
        Object.assign(map, {
          payment_date: "Date",
          project_name: "Project",
          description: "Description",
          amount: "Amount",
          payment_method: "Method",
          payment_status: "Status",
          invoice_number: "Invoice",
        });
      } else if (category === "expenses") {
        order = [
          "expense_date",
          "project_name",
          "category_name",
          "employee_name",
          "description",
          "amount",
        ];
        Object.assign(map, {
          expense_date: "Date",
          project_name: "Project",
          category_name: "Category",
          employee_name: "Employee",
          description: "Description",
          amount: "Amount",
        });
      } else if (category === "projects") {
        order = [
          "id",
          "name",
          "client_name",
          "status",
          "start_date",
          "end_date",
          "estimated_budget",
        ];
        Object.assign(map, {
          id: "ID",
          name: "Project",
          client_name: "Client",
          status: "Status",
          start_date: "Start",
          end_date: "End",
          estimated_budget: "Est. Budget",
        });
      } else if (category === "employees") {
        // employees view uses salary payments endpoint results
        order = [
          "payment_date",
          "employee_name",
          "employee_code",
          "project_name",
          "amount",
          "payment_type",
          "notes",
        ];
        Object.assign(map, {
          payment_date: "Date",
          employee_name: "Employee",
          employee_code: "Employee Code",
          project_name: "Project",
          amount: "Amount",
          payment_type: "Payment Type",
          notes: "Notes",
        });
      } else if (category === "salary-payments") {
        order = [
          "payment_date",
          "employee_name",
          "employee_code",
          "project_name",
          "amount",
          "payment_type",
          "notes",
        ];
        Object.assign(map, {
          payment_date: "Date",
          employee_name: "Employee",
          employee_code: "Employee Code",
          project_name: "Project",
          amount: "Amount",
          payment_type: "Payment Type",
          notes: "Notes",
        });
      }

      // final headers: use order intersect keys, else fallback to keys
      const finalOrder = order
        .filter((k) => keys.includes(k))
        .concat(keys.filter((k) => !order.includes(k)));
      setColOrder(finalOrder);
      setFriendlyMap(map);
      setHeaders(finalOrder.length ? finalOrder : keys);

      // compute totals for amount-like column
      const amountKey =
        finalOrder.find((k) =>
          ["amount", "total", "estimated_budget"].includes(k)
        ) || (keys.includes("amount") ? "amount" : undefined);
      if (amountKey) {
        const total = dataRows.reduce(
          (acc: number, r: any) => acc + (Number(r[amountKey]) || 0),
          0
        );
        setTotalsSummary({ amount: total });
      } else {
        setTotalsSummary({});
      }
    } catch (e: any) {
      setError(e.message || "Failed to load report data");
      setResult(null);
      setRows([]);
      setHeaders([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = () => {
    if (!rows || rows.length === 0) return;
    const _headers = headers.length ? headers : Object.keys(rows[0] || {});
    const csvRows = [
      _headers.join(","),
      ...rows.map((r) =>
        _headers
          .map((h) => {
            const v = r[h] ?? "";
            if (v === null || v === undefined) return "";
            // format dates (YYYY-MM-DD or ISO)
            if (typeof v === "string" && /\d{4}-\d{2}-\d{2}/.test(v))
              return `"${v}"`;
            if (typeof v === "string")
              return `"${String(v).replace(/"/g, '""')}"`;
            return String(v);
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const s = startDate || "all";
    const e = endDate || "all";
    a.download = `${category}-report-${s}-to-${e}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container p-responsive space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{category.replace(/-/g, " ")}</h1>
          <p className="text-muted-foreground text-sm">
            Generate {category} reports with custom date ranges.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/reports">
            <Button size="sm" variant="ghost">
              Back
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-muted-foreground">
                Start date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e: any) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">End date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e: any) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={fetchData} disabled={loading}>
                Generate
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setSelectedEmployee("");
                  setSelectedProject("");
                  setSelectedCategory("");
                  setResult(null);
                }}
              >
                Reset
              </Button>
            </div>
          </div>

          {/* filters row: project / category / employee based on category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Project filter for incomes/expenses/projects */}
            <div>
              <label className="text-sm text-muted-foreground">Project</label>
              <Select
                onValueChange={(v) => setSelectedProject(v)}
                value={selectedProject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category filter for expenses */}
            <div>
              <label className="text-sm text-muted-foreground">
                Expense Category
              </label>
              <Select
                onValueChange={(v) => setSelectedCategory(v)}
                value={selectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {categoriesList.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Employee filter - for employee-specific reports and expenses/payments */}
            <div>
              <label className="text-sm text-muted-foreground">Employee</label>
              <Select
                onValueChange={(v) => setSelectedEmployee(v)}
                value={selectedEmployee}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={String(emp.id)}>
                      {emp.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            {presets.map((p) => (
              <Button
                key={p.label}
                variant="ghost"
                size="sm"
                onClick={() => applyPreset(p)}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div>
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <span className="animate-spin text-4xl text-blue-700 mb-4">⏳</span>
            <h2 className="text-lg sm:text-xl font-semibold text-muted-foreground">
              Loading report...
            </h2>
          </div>
        )}

        {!loading && rows && rows.length > 0 && (
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Showing {rows.length} records
                    {startDate || endDate
                      ? ` for ${startDate || "-"} to ${endDate || "-"}`
                      : ""}
                  </div>
                  {totalsSummary.amount !== undefined && (
                    <div className="text-lg font-semibold mt-1">
                      Total: Rs.{Number(totalsSummary.amount).toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={downloadCsv}>
                    <Download className="mr-2" /> Download CSV
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {(headers.length === 0
                        ? Object.keys(rows[0] || {})
                        : headers
                      ).map((h) => (
                        <TableHead key={h}>{friendlyMap[h] || h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.slice(0, 100).map((r, idx) => (
                      <TableRow key={idx}>
                        {(headers.length ? headers : Object.keys(r)).map(
                          (k) => (
                            <TableCell
                              key={k}
                              className="max-w-[240px] truncate"
                            >
                              {renderCell(r[k])}
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && rows && rows.length === 0 && result && (
          <Card>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                No records found for the selected range.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function renderCell(value: any) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "string") {
    // ISO date
    if (/^\d{4}-\d{2}-\d{2}T/.test(value))
      return new Date(value).toLocaleString();
    if (/^\d{4}-\d{2}-\d{2}$/.test(value))
      return new Date(value).toLocaleDateString();
    return value;
  }
  return String(value);
}
