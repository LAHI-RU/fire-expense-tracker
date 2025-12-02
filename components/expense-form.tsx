"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Expense, Project } from "@/lib/mysql";

interface ExpenseFormProps {
  expense?: Expense;
  onSubmit: (expenseData: Partial<Expense>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ExpenseForm({
  expense,
  onSubmit,
  onCancel,
  isLoading,
}: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    project_id: expense?.project_id?.toString() || "",
    category_id: expense?.category_id?.toString() || "",
    employee_id: expense?.employee_id?.toString() || "",
    description: expense?.description || "",
    amount: expense?.amount?.toString() || "",
    expense_date: expense?.expense_date
      ? new Date(expense.expense_date).toISOString().split("T")[0]
      : "",
    receipt_url: expense?.receipt_url || "",
    notes: expense?.notes || "",
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, categoriesRes, employeesRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/expense-categories"),
          fetch("/api/employees"),
        ]);

        const [projectsData, categoriesData, employeesData] = await Promise.all(
          [projectsRes.json(), categoriesRes.json(), employeesRes.json()]
        );

        setProjects(projectsData.projects || []);
        setCategories(categoriesData.categories || []);
        setEmployees(employeesData.employees || []);
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      project_id: Number.parseInt(formData.project_id),
      category_id: formData.category_id
        ? Number.parseInt(formData.category_id)
        : undefined,
      employee_id: formData.employee_id
        ? Number.parseInt(formData.employee_id)
        : undefined,
      amount: Number.parseFloat(formData.amount),
      expense_date: new Date(formData.expense_date),
      receipt_url: formData.receipt_url || undefined,
      notes: formData.notes || undefined,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {expense ? "Edit Expense" : "Add New Expense"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Fill out expense details
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project_id">Project *</Label>
              <Select
                value={formData.project_id}
                onValueChange={(value) => handleChange("project_id", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent className="w-full max-w-none">
                  {projects.map((project) => (
                    <SelectItem
                      key={project.id}
                      value={project.id.toString()}
                      className="w-full"
                    >
                      <div className="flex flex-col items-start w-full max-w-[300px]">
                        <div className="font-medium truncate w-full text-left">
                          {project.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate w-full text-left">
                          Client: {project.client_name}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => handleChange("category_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Fire extinguisher purchase, labor cost, etc."
              required
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (Rs.) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                placeholder="150.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense_date">Expense Date *</Label>
              <Input
                id="expense_date"
                type="date"
                value={formData.expense_date}
                onChange={(e) => handleChange("expense_date", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee_id">Employee (if applicable)</Label>
            <Select
              value={formData.employee_id}
              onValueChange={(value) => handleChange("employee_id", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent className="w-full max-w-none">
                {employees.map((employee) => (
                  <SelectItem
                    key={employee.id}
                    value={employee.id.toString()}
                    className="w-full"
                  >
                    <div className="flex flex-col items-start w-full max-w-[300px]">
                      <div className="font-medium truncate w-full text-left">
                        {employee.full_name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate w-full text-left">
                        Code: {employee.employee_code}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receipt_url">Receipt URL</Label>
            <Input
              id="receipt_url"
              value={formData.receipt_url}
              onChange={(e) => handleChange("receipt_url", e.target.value)}
              placeholder="https://example.com/receipt.pdf"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Additional notes about this expense..."
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading
                ? "Saving..."
                : expense
                ? "Update Expense"
                : "Add Expense"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
