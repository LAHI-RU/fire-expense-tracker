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
  const [showNewCategory, setShowNewCategory] = useState(false);

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
      project_id: formData.project_id
        ? Number.parseInt(formData.project_id)
        : undefined,
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
        <CardTitle className="text-xl text-center font-semibold">
          {expense ? "Edit Expense" : "Add New Expense"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project_id">Project (optional)</Label>
              <Select
                value={formData.project_id}
                onValueChange={(value) =>
                  handleChange("project_id", value === "none" ? "" : value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No Project" />
                </SelectTrigger>
                <SelectContent className="w-full max-w-none">
                  <SelectItem value="none">No Project</SelectItem>
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
              <div className="flex gap-2">
                <div className="flex-1">
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) =>
                      handleChange("category_id", value)
                    }
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
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowNewCategory(true)}
                >
                  New
                </Button>
              </div>
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
            <Label htmlFor="receipt_url">Receipt</Label>
            <div className="grid gap-2 md:grid-cols-2">
              <Input
                id="receipt_url"
                value={formData.receipt_url}
                onChange={(e) => handleChange("receipt_url", e.target.value)}
                placeholder="https://example.com/receipt.pdf"
              />
              <Input
                type="file"
                accept="application/pdf,image/png,image/jpeg,image/jpg,image/webp,image/heic,image/heif"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.append("file", file);
                  try {
                    const res = await fetch("/api/uploads/receipts", {
                      method: "POST",
                      body: fd,
                    });
                    const data = await res.json();
                    if (res.ok && data.url) {
                      handleChange("receipt_url", data.url);
                    } else {
                      alert(data.error || "Failed to upload receipt");
                    }
                  } catch (err) {
                    alert("Upload failed");
                  } finally {
                    // Reset input so re-selecting the same file doesn't trigger form closure in some browsers
                    e.target.value = "";
                  }
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Upload a PDF or image (max 5MB). Stored as URL only.
            </p>
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
      {/* New Category Dialog */}
      {showNewCategory && (
        <NewCategoryDialog
          onClose={() => setShowNewCategory(false)}
          onCreated={(cat) => {
            setCategories((prev) => [...prev, cat]);
            handleChange("category_id", cat.id.toString());
          }}
        />
      )}
    </Card>
  );
}

function NewCategoryDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (c: any) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-background rounded-md shadow-lg p-4 w-[90%] max-w-sm">
        <h3 className="font-semibold mb-3">New Category</h3>
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Fuel"
          />
          <Label>Description (optional)</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (!name.trim()) return;
              setSaving(true);
              try {
                const res = await fetch("/api/expense-categories", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name, description }),
                });
                const data = await res.json();
                if (res.ok && data.category) {
                  onCreated(data.category);
                  onClose();
                } else {
                  alert(data.error || "Failed to create category");
                }
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving}
          >
            {saving ? "Saving..." : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
