"use client";
import { requireAuth } from "@/lib/auth-client";
// Expenses management page

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Receipt,
  Calendar,
  DollarSign,
  Grid3X3,
  LayoutList,
} from "lucide-react";
import { ExpenseForm } from "@/components/expense-form";
import { VoiceHelpDialog } from "@/components/voice-help-dialog";
import type { Expense } from "@/lib/mysql";

export default function ExpensesPage() {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [sortBy, setSortBy] = useState<
    "date" | "amount" | "project" | "category" | "employee"
  >("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [filterEmployee, setFilterEmployee] = useState<string>("all");
  // Get the logged-in user
  const user = typeof window !== "undefined" ? requireAuth() : null;
  useEffect(() => {
    if (!user) return;
  }, [user]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/expenses");
      const data = await response.json();
      setExpenses(data.expenses || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter expenses based on search
  useEffect(() => {
    let filtered = expenses;
    if (filterCategory !== "all") {
      filtered = filtered.filter((e) => e.category_name === filterCategory);
    }
    if (filterProject !== "all") {
      filtered = filtered.filter((e) => e.project_name === filterProject);
    }
    if (filterEmployee !== "all") {
      filtered = filtered.filter((e) => e.employee_name === filterEmployee);
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (expense) =>
          expense.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          expense.project_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          expense.category_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          expense.employee_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "date":
          aValue = new Date(a.expense_date).getTime();
          bValue = new Date(b.expense_date).getTime();
          break;
        case "amount":
          aValue = Number(a.amount);
          bValue = Number(b.amount);
          break;
        case "project":
          aValue = a.project_name || "";
          bValue = b.project_name || "";
          break;
        case "category":
          aValue = a.category_name || "";
          bValue = b.category_name || "";
          break;
        case "employee":
          aValue = a.employee_name || "";
          bValue = b.employee_name || "";
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
    setFilteredExpenses(filtered);
  }, [
    expenses,
    searchTerm,
    sortBy,
    sortOrder,
    filterCategory,
    filterProject,
    filterEmployee,
  ]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleCreateExpense = async (expenseData: Partial<Expense>) => {
    if (!user) {
      alert("You must be logged in to add expenses.");
      return;
    }
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...expenseData, created_by: user.id }),
      });

      if (response.ok) {
        setShowForm(false);
        fetchExpenses();
      }
    } catch (error) {
      console.error("Error creating expense:", error);
    }
  };

  const handleUpdateExpense = async (expenseData: Partial<Expense>) => {
    if (!editingExpense) return;

    try {
      const response = await fetch(`/api/expenses/${editingExpense.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });

      if (response.ok) {
        setEditingExpense(null);
        fetchExpenses();
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const handleDeleteExpense = async (expenseId: number) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchExpenses();
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  if (showForm || editingExpense) {
    return (
      <div className="container p-responsive">
        <div className="flex justify-end mb-4">
          <VoiceHelpDialog />
        </div>
        <ExpenseForm
          expense={editingExpense || undefined}
          onSubmit={editingExpense ? handleUpdateExpense : handleCreateExpense}
          onCancel={() => {
            setShowForm(false);
            setEditingExpense(null);
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
          <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
          <p className="text-muted-foreground">
            Track project expenses and costs
          </p>
        </div>
        <div className="flex gap-2">
          <VoiceHelpDialog />
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-1 ml-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    Rs.
                    {filteredExpenses
                      .reduce((sum, expense) => sum + Number(expense.amount), 0)
                      .toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Expenses
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-1 ml-2">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-muted-foreground">
                  {filteredExpenses.length}
                </div>
                <div className="text-sm text-muted-foreground">Records</div>
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

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses, projects, categories, or employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          className="border rounded px-2 py-1"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {[
            ...new Set(expenses.map((e) => e.category_name).filter(Boolean)),
          ].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          className="border rounded px-2 py-1"
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
        >
          <option value="all">All Projects</option>
          {[
            ...new Set(expenses.map((e) => e.project_name).filter(Boolean)),
          ].map((proj) => (
            <option key={proj} value={proj}>
              {proj}
            </option>
          ))}
        </select>
        <select
          className="border rounded px-2 py-1"
          value={filterEmployee}
          onChange={(e) => setFilterEmployee(e.target.value)}
        >
          <option value="all">All Employees</option>
          {[
            ...new Set(expenses.map((e) => e.employee_name).filter(Boolean)),
          ].map((emp) => (
            <option key={emp} value={emp}>
              {emp}
            </option>
          ))}
        </select>
        {viewMode === "table" && (
          <select
            className="border rounded px-2 py-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="project">Project</option>
            <option value="category">Category</option>
            <option value="employee">Employee</option>
          </select>
        )}
      </div>

      {/* Expenses List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-muted-foreground">Loading expenses...</div>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-muted-foreground">No expenses found</div>
            <Button onClick={() => setShowForm(true)} className="mt-4">
              Add your first expense
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === "table" ? (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th
                    className="cursor-pointer px-4 py-2 border-r border-border/50"
                    onClick={() => {
                      setSortBy("date");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    Date
                  </th>
                  <th
                    className="cursor-pointer px-4 py-2 border-r border-border/50"
                    onClick={() => {
                      setSortBy("project");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    Project
                  </th>
                  <th
                    className="cursor-pointer px-4 py-2 border-r border-border/50"
                    onClick={() => {
                      setSortBy("category");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    Category
                  </th>
                  <th
                    className="cursor-pointer px-4 py-2 border-r border-border/50"
                    onClick={() => {
                      setSortBy("employee");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    Employee
                  </th>
                  <th className="px-4 py-2 border-r border-border/50">
                    Description
                  </th>
                  <th
                    className="cursor-pointer px-4 py-2 text-right border-r border-border/50"
                    onClick={() => {
                      setSortBy("amount");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    Amount
                  </th>
                  <th className="px-4 py-2 border-r border-border/50">
                    Receipt
                  </th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense, index) => (
                  <tr
                    key={expense.id}
                    className={
                      index % 2 === 0 ? "bg-background" : "bg-muted/20"
                    }
                  >
                    <td className="px-4 py-2 border-r border-border/50">
                      {new Date(expense.expense_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border-r border-border/50">
                      {expense.project_name || "N/A"}
                    </td>
                    <td className="px-4 py-2 border-r border-border/50">
                      {expense.category_name || "N/A"}
                    </td>
                    <td className="px-4 py-2 border-r border-border/50">
                      {expense.employee_name || "N/A"}
                    </td>
                    <td className="px-4 py-2 max-w-xs border-r border-border/50">
                      <span className="font-medium truncate">
                        {expense.description}
                      </span>
                      {expense.notes && (
                        <div className="text-xs text-muted-foreground truncate mt-1">
                          {expense.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right text-red-600 font-bold border-r border-border/50">
                      Rs.{Number(expense.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border-r border-border/50">
                      {expense.receipt_url ? (
                        <a
                          href={expense.receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <Receipt className="h-3 w-3" /> Receipt
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingExpense(expense)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Table Summary Row */}
            <div className="border-t bg-muted/30 p-4">
              <div className="flex justify-between items-center font-semibold">
                <span>Total ({filteredExpenses.length} records)</span>
                <div className="text-right text-red-600">
                  Rs.
                  {filteredExpenses
                    .reduce((sum, expense) => sum + Number(expense.amount), 0)
                    .toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredExpenses.map((expense) => (
            <Card
              key={expense.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">
                        {expense.description}
                      </h3>
                      {expense.category_name && (
                        <Badge variant="secondary" className="text-xs">
                          {expense.category_name}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(expense.expense_date).toLocaleDateString()}
                      </div>
                      {expense.project_name && (
                        <div>Project: {expense.project_name}</div>
                      )}
                      {expense.employee_name && (
                        <div>Employee: {expense.employee_name}</div>
                      )}
                    </div>
                    {expense.notes && (
                      <p className="text-sm text-muted-foreground">
                        {expense.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">
                        Rs.{Number(expense.amount).toLocaleString()}
                      </div>
                      {expense.receipt_url && (
                        <a
                          href={expense.receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <Receipt className="h-3 w-3" /> Receipt
                        </a>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingExpense(expense)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteExpense(expense.id)}
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
