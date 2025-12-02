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
import type { Income, Project } from "@/lib/mysql";

interface IncomeFormProps {
  income?: Income;
  onSubmit: (incomeData: Partial<Income>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function IncomeForm({
  income,
  onSubmit,
  onCancel,
  isLoading,
}: IncomeFormProps) {
  const [formData, setFormData] = useState({
    project_id: income?.project_id?.toString() || "",
    description: income?.description || "",
    amount: income?.amount?.toString() || "",
    payment_date: income?.payment_date
      ? new Date(income.payment_date).toISOString().split("T")[0]
      : "",
    payment_method: income?.payment_method || "bank_transfer",
    payment_status: income?.payment_status || "pending",
    invoice_number: income?.invoice_number || "",
    notes: income?.notes || "",
  });

  const [projects, setProjects] = useState<Project[]>([]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      project_id:
        formData.project_id && formData.project_id !== "none"
          ? Number.parseInt(formData.project_id)
          : undefined,
      amount: Number.parseFloat(formData.amount),
      payment_date: new Date(formData.payment_date),
      invoice_number: formData.invoice_number || undefined,
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
          {income ? "Edit Income" : "Add New Income"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="project_id">Project (optional)</Label>
            <Select
              value={formData.project_id}
              onValueChange={(value) => handleChange("project_id", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select project or 'No Project'" />
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
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Project payment, advance payment, etc."
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
                placeholder="5000.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_date">Payment Date *</Label>
              <Input
                id="payment_date"
                type="date"
                value={formData.payment_date}
                onChange={(e) => handleChange("payment_date", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment Method</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) => handleChange("payment_method", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_status">Payment Status</Label>
              <Select
                value={formData.payment_status}
                onValueChange={(value) => handleChange("payment_status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoice_number">Invoice Number</Label>
            <Input
              id="invoice_number"
              value={formData.invoice_number}
              onChange={(e) => handleChange("invoice_number", e.target.value)}
              placeholder="INV-2024-001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Additional notes about this income..."
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading
                ? "Saving..."
                : income
                ? "Update Income"
                : "Add Income"}
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
