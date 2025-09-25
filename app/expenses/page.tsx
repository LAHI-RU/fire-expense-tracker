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
} from "lucide-react";
import { ExpenseForm } from "@/components/expense-form";
import { VoiceHelpDialog } from "@/components/voice-help-dialog";
import type { Expense } from "@/lib/mysql";

export default function ExpensesPage() {
  useEffect(() => {
    const user = typeof window !== "undefined" ? requireAuth() : null;
    if (!user) return;
  }, []);
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
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredExpenses(filtered);
  }, [expenses, searchTerm]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleCreateExpense = async (expenseData: Partial<Expense>) => {
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...expenseData, created_by: 1 }), // TODO: Get from auth
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
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  Rs.{totalExpenses.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Expenses
                </div>
              </div>
            </div>
            <div className="text-muted-foreground">•</div>
            <div className="text-sm text-muted-foreground">
              {expenses.length} expense records
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search expenses, projects, or categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
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
                          <Receipt className="h-3 w-3" />
                          Receipt
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
