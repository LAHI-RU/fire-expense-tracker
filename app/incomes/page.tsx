"use client";
import { requireAuth } from "@/lib/auth-client";
// Incomes management page

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  FileText,
  Grid3X3,
  LayoutList,
  ArrowUpDown,
  Download,
} from "lucide-react";
import { IncomeForm } from "@/components/income-form";
import { VoiceHelpDialog } from "@/components/voice-help-dialog";
import type { Income } from "@/lib/mysql";

export default function IncomesPage() {
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "received"
  >("all");
  // Get the logged-in user
  const user = typeof window !== "undefined" ? requireAuth() : null;
  useEffect(() => {
    if (!user) return;
  }, [user]);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [filteredIncomes, setFilteredIncomes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [sortBy, setSortBy] = useState<
    "date" | "amount" | "project" | "status"
  >("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch incomes
  const fetchIncomes = async () => {
    try {
      const response = await fetch("/api/incomes");
      const data = await response.json();
      setIncomes(data.incomes || []);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort incomes
  useEffect(() => {
    let filtered = incomes;

    // Filter by status
    if (filterStatus === "pending") {
      filtered = filtered.filter(
        (income) => income.payment_status === "pending"
      );
    } else if (filterStatus === "received") {
      filtered = filtered.filter(
        (income) => income.payment_status === "received"
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (income) =>
          income.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          income.project_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          income.invoice_number
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Sort incomes
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "date":
          aValue = new Date(a.payment_date).getTime();
          bValue = new Date(b.payment_date).getTime();
          break;
        case "amount":
          aValue = Number(a.amount);
          bValue = Number(b.amount);
          break;
        case "project":
          aValue = a.project_name || "";
          bValue = b.project_name || "";
          break;
        case "status":
          aValue = a.payment_status;
          bValue = b.payment_status;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    setFilteredIncomes(filtered);
  }, [incomes, searchTerm, sortBy, sortOrder, filterStatus]);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleCreateIncome = async (incomeData: Partial<Income>) => {
    if (!user) {
      alert("You must be logged in to add income records.");
      return;
    }
    try {
      const response = await fetch("/api/incomes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...incomeData, created_by: user.id }),
      });

      if (response.ok) {
        setShowForm(false);
        fetchIncomes();
      }
    } catch (error) {
      console.error("Error creating income:", error);
    }
  };

  const handleUpdateIncome = async (incomeData: Partial<Income>) => {
    if (!editingIncome) return;

    try {
      const response = await fetch(`/api/incomes/${editingIncome.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incomeData),
      });

      if (response.ok) {
        setEditingIncome(null);
        fetchIncomes();
      }
    } catch (error) {
      console.error("Error updating income:", error);
    }
  };

  const handleDeleteIncome = async (incomeId: number) => {
    if (!confirm("Are you sure you want to delete this income record?")) return;

    try {
      const response = await fetch(`/api/incomes/${incomeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchIncomes();
      }
    } catch (error) {
      console.error("Error deleting income:", error);
    }
  };

  const totalIncomes = incomes.reduce(
    (sum, income) =>
      income.payment_status === "pending" ? sum + Number(income.amount) : sum,
    0
  );
  const receivedIncomes = incomes
    .filter((income) => income.payment_status === "received")
    .reduce((sum, income) => sum + Number(income.amount), 0);

  const statusConfig = {
    pending: { label: "Pending", className: "bg-amber-100 text-amber-800" },
    received: { label: "Received", className: "bg-green-100 text-green-800" },
    partial: { label: "Partial", className: "bg-blue-100 text-blue-800" },
  };

  function getStatusConfig(payment_status: string) {
    return (
      statusConfig[payment_status as keyof typeof statusConfig] ||
      statusConfig["pending"]
    );
  }

  const handleSort = (column: "date" | "amount" | "project" | "status") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const paymentMethodConfig = {
    cash: { label: "Cash", className: "bg-green-100 text-green-800" },
    bank_transfer: {
      label: "Bank Transfer",
      className: "bg-blue-100 text-blue-800",
    },
    check: { label: "Check", className: "bg-purple-100 text-purple-800" },
    card: { label: "Card", className: "bg-orange-100 text-orange-800" },
  };

  const getPaymentMethodConfig = (method: string) => {
    return (
      paymentMethodConfig[method as keyof typeof paymentMethodConfig] || {
        label: method.replace("_", " "),
        className: "bg-gray-100 text-gray-800",
      }
    );
  };

  if (showForm || editingIncome) {
    return (
      <div className="container p-responsive">
        <div className="flex justify-end mb-4">
          <VoiceHelpDialog />
        </div>
        <IncomeForm
          income={editingIncome || undefined}
          onSubmit={editingIncome ? handleUpdateIncome : handleCreateIncome}
          onCancel={() => {
            setShowForm(false);
            setEditingIncome(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="container p-responsive space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Income</h1>
          <p className="text-muted-foreground">
            Track project payments and income
          </p>
        </div>
        <div className="flex gap-2">
          <VoiceHelpDialog />
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Income
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-1 ml-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold text-primary">
                    Rs.{receivedIncomes.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Actually Received
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-1 ml-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    Rs.{totalIncomes.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Expected
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Toggle */}
        <div className="flex justify-end">
          <div className="inline-flex rounded-lg border p-1 bg-muted/50">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="h-8 w-8 p-0"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search income records, projects, or invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {viewMode === "table" && (
          <>
            <Select
              value={filterStatus}
              onValueChange={(value) =>
                setFilterStatus(value as "all" | "pending" | "received")
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Show" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="received">Received</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={(value: any) => setSortBy(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
      </div>

      {/* Income List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-muted-foreground">Loading income records...</div>
        </div>
      ) : filteredIncomes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-muted-foreground">No income records found</div>
            <Button onClick={() => setShowForm(true)} className="mt-4">
              Add your first income record
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === "table" ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead
                    className="cursor-pointer hover:bg-muted/80 transition-colors border-r border-border/50"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1 font-bold">
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/80 transition-colors border-r border-border/50"
                    onClick={() => handleSort("project")}
                  >
                    <div className="flex items-center gap-1 font-bold">
                      Project
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="font-bold border-r border-border/50">
                    Description
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/80 transition-colors text-right border-r border-border/50"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center gap-1 justify-end font-bold">
                      Amount
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="font-bold border-r border-border/50">
                    Payment Method
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/80 transition-colors border-r border-border/50"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-1 font-bold">
                      Status
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="font-bold border-r border-border/50">
                    Invoice
                  </TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncomes.map((income, index) => (
                  <TableRow
                    key={income.id}
                    className={`hover:bg-muted/50 transition-colors ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/20"
                    }`}
                  >
                    <TableCell className="font-medium border-r border-border/50">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(income.payment_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-border/50 max-w-[200px]">
                      <div
                        className="font-medium text-sm truncate"
                        title={income.project_name || "N/A"}
                      >
                        {income.project_name || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-border/50">
                      <div className="max-w-xs">
                        <div
                          className="font-medium break-words line-clamp-2"
                          title={income.description}
                        >
                          {income.description}
                        </div>
                        {income.notes && (
                          <div
                            className="text-xs text-muted-foreground break-words line-clamp-1 mt-1"
                            title={income.notes}
                          >
                            {income.notes}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right border-r border-border/50">
                      <div className="font-bold text-green-600">
                        Rs.{Number(income.amount).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-border/50">
                      <Badge
                        variant="secondary"
                        className={
                          getPaymentMethodConfig(income.payment_method)
                            .className
                        }
                      >
                        {getPaymentMethodConfig(income.payment_method).label}
                      </Badge>
                    </TableCell>
                    <TableCell className="border-r border-border/50">
                      <Badge
                        variant="secondary"
                        className={
                          getStatusConfig(income.payment_status).className
                        }
                      >
                        {getStatusConfig(income.payment_status).label}
                      </Badge>
                    </TableCell>
                    <TableCell className="border-r border-border/50">
                      {income.invoice_number ? (
                        <div className="flex items-center gap-1 text-sm">
                          <FileText className="h-3 w-3 text-muted-foreground" />
                          {income.invoice_number}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingIncome(income)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteIncome(income.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Table Summary Row */}
            <div className="border-t bg-muted/30 p-4">
              <div className="flex justify-between items-center font-semibold">
                <span>Total ({filteredIncomes.length} records)</span>
                <div className="flex gap-8">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      Expected
                    </div>
                    <div className="text-green-600">
                      Rs.
                      {filteredIncomes
                        .filter((income) => income.payment_status === "pending")
                        .reduce((sum, income) => sum + Number(income.amount), 0)
                        .toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      Received
                    </div>
                    <div className="text-primary">
                      Rs.
                      {filteredIncomes
                        .filter(
                          (income) => income.payment_status === "received"
                        )
                        .reduce((sum, income) => sum + Number(income.amount), 0)
                        .toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredIncomes.map((income) => (
            <Card key={income.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">
                        {income.description}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={
                          getStatusConfig(income.payment_status).className
                        }
                      >
                        {getStatusConfig(income.payment_status).label}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(income.payment_date).toLocaleDateString()}
                      </div>
                      {income.project_name && (
                        <div>Project: {income.project_name}</div>
                      )}
                      <div className="capitalize">
                        {income.payment_method.replace("_", " ")}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      {income.invoice_number && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          {income.invoice_number}
                        </div>
                      )}
                    </div>

                    {income.notes && (
                      <p className="text-sm text-muted-foreground">
                        {income.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        Rs.{Number(income.amount).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingIncome(income)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteIncome(income.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
