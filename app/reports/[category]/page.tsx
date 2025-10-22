"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  useEffect(() => {
    // If URL contains query params, sync them
    const s = search?.get("start");
    const e = search?.get("end");
    if (s) setStartDate(s);
    if (e) setEndDate(e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search?.toString()]);

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

      switch (category) {
        case "incomes":
          url = `/api/incomes?${params.toString()}`;
          break;
        case "expenses":
          url = `/api/expenses?${params.toString()}`;
          break;
        case "projects":
          url = `/api/projects?${params.toString()}`;
          break;
        case "employees":
          url = `/api/employees?${params.toString()}`;
          break;
        case "salary-payments":
          url = `/api/salary-payments?start_date=${startDate}&end_date=${endDate}`;
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
      setHeaders(
        dataRows && dataRows.length > 0
          ? Object.keys(dataRows[0]).map((k) => k)
          : []
      );
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
                  setResult(null);
                }}
              >
                Reset
              </Button>
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
        {loading && <div className="text-sm">Loading...</div>}

        {!loading && rows && rows.length > 0 && (
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-muted-foreground">
                  Showing {rows.length} records
                  {startDate || endDate
                    ? ` for ${startDate || "-"} to ${endDate || "-"}`
                    : ""}
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
                      {headers.length === 0
                        ? Object.keys(rows[0] || {}).map((h) => (
                            <TableHead key={h}>{h}</TableHead>
                          ))
                        : headers.map((h) => (
                            <TableHead key={h}>{h}</TableHead>
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
