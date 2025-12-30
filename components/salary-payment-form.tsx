// Salary payment form with duplicate prevention
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import type { SalaryPayment, Employee, Project } from "@/lib/mysql";

interface SalaryPaymentFormProps {
  onSubmit: (paymentData: Partial<SalaryPayment>) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialEmployeeId?: number;
  initialData?: Partial<SalaryPayment>;
  mode?: "create" | "edit";
}

export function SalaryPaymentForm({
  onSubmit,
  onCancel,
  isLoading,
  initialEmployeeId,
  initialData,
  mode = "create",
}: SalaryPaymentFormProps) {
  const [formData, setFormData] = useState({
    employee_id: "",
    project_id: "",
    amount: "",
    payment_date: new Date().toISOString().split("T")[0],
    payment_type: "monthly_salary",
    notes: "",
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [duplicateWarning, setDuplicateWarning] = useState("");
  const PAYMENT_TYPES = [
    "monthly_salary",
    "project_bonus",
    "overtime",
    "other",
  ] as const;
  const isEditMode = mode === "edit" || Boolean(initialData?.id);
  const editingPaymentId = initialData?.id ? Number(initialData.id) : null;

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesRes, projectsRes] = await Promise.all([
          fetch("/api/employees?is_active=true"),
          fetch("/api/projects"),
        ]);

        const [employeesData, projectsData] = await Promise.all([
          employeesRes.json(),
          projectsRes.json(),
        ]);

        setEmployees(employeesData.employees || []);
        setProjects(projectsData.projects || []);
        // If form was opened for a specific employee, preselect them
        if (initialEmployeeId && (employeesData.employees || []).length > 0) {
          const exists = (employeesData.employees || []).some(
            (e: Employee) => e.id === initialEmployeeId
          );
          if (exists) {
            setFormData((prev) => ({
              ...prev,
              employee_id: initialEmployeeId.toString(),
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchData();
  }, []);

  // Pre-fill form when editing a payment
  useEffect(() => {
    if (!initialData) return;

    setFormData({
      employee_id: initialData.employee_id
        ? initialData.employee_id.toString()
        : "",
      project_id: initialData.project_id
        ? initialData.project_id.toString()
        : "",
      amount: initialData.amount ? initialData.amount.toString() : "",
      payment_date: initialData.payment_date
        ? new Date(initialData.payment_date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      payment_type: initialData.payment_type || "monthly_salary",
      notes: initialData.notes || "",
    });
  }, [initialData]);

  // Check for duplicate payments when employee or date changes
  useEffect(() => {
    const checkDuplicatePayment = async () => {
      if (
        !formData.employee_id ||
        !formData.payment_date ||
        formData.payment_type !== "monthly_salary"
      ) {
        setDuplicateWarning("");
        return;
      }

      const paymentDate = new Date(formData.payment_date);
      const month = paymentDate.getMonth() + 1;
      const year = paymentDate.getFullYear();

      try {
        const response = await fetch(
          `/api/salary-payments?employee_id=${formData.employee_id}&month=${month}&year=${year}`
        );
        const data = await response.json();

        const monthlyPayments =
          data.payments?.filter(
            (p: any) =>
              p.payment_type === "monthly_salary" &&
              (!editingPaymentId || p.id !== editingPaymentId)
          ) || [];

        if (monthlyPayments.length > 0) {
          setDuplicateWarning(
            `Warning: Monthly salary for ${paymentDate.toLocaleString(
              "default",
              {
                month: "long",
                year: "numeric",
              }
            )} has already been paid to this employee.`
          );
        } else {
          setDuplicateWarning("");
        }
      } catch (error) {
        console.error("Error checking duplicate payment:", error);
      }
    };

    checkDuplicatePayment();
  }, [
    formData.employee_id,
    formData.payment_date,
    formData.payment_type,
    editingPaymentId,
  ]);

  // Update selected employee and auto-fill amount
  useEffect(() => {
    const employee = employees.find(
      (e) => e.id.toString() === formData.employee_id
    );
    setSelectedEmployee(employee || null);

    if (
      employee &&
      formData.payment_type === "monthly_salary" &&
      employee.monthly_salary !== undefined &&
      employee.monthly_salary !== null &&
      (!isEditMode || formData.amount === "")
    ) {
      setFormData((prev) => ({
        ...prev,
        amount: employee.monthly_salary!.toString(),
      }));
    }
  }, [formData.employee_id, formData.payment_type, employees]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      duplicateWarning &&
      !confirm(`${duplicateWarning}\n\nDo you want to proceed anyway?`)
    ) {
      return;
    }

    onSubmit({
      ...formData,
      id: editingPaymentId || undefined,
      employee_id: Number.parseInt(formData.employee_id),
      project_id: formData.project_id
        ? Number.parseInt(formData.project_id)
        : undefined,
      amount: Number.parseFloat(formData.amount),
      payment_date: new Date(formData.payment_date),
      notes: formData.notes || undefined,
    } as any);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          {isEditMode ? "Update Salary Payment" : "Record Salary Payment"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {duplicateWarning && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                {duplicateWarning}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee_id">Employee *</Label>
              {initialEmployeeId ? (
                <div className="p-2 rounded border border-border bg-muted text-sm">
                  {selectedEmployee ? (
                    <div>
                      {selectedEmployee.full_name} (
                      {selectedEmployee.employee_code})
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      Loading employee...
                    </div>
                  )}
                </div>
              ) : (
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
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_type">Payment Type</Label>
              <Select
                value={formData.payment_type}
                onValueChange={(value) => handleChange("payment_type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_TYPES.map((pt) => (
                    <SelectItem key={pt} value={pt}>
                      {pt.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Restrict to DB enum only; no custom types */}
            </div>
          </div>

          {selectedEmployee && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm space-y-1">
                <div>
                  <strong>Employee:</strong> {selectedEmployee.full_name}
                </div>
                {selectedEmployee.position && (
                  <div>
                    <strong>Position:</strong> {selectedEmployee.position}
                  </div>
                )}
                {selectedEmployee.monthly_salary && (
                  <div>
                    <strong>Monthly Salary:</strong> Rs.
                    {selectedEmployee.monthly_salary.toLocaleString()}
                  </div>
                )}
                {selectedEmployee.daily_rate && (
                  <div>
                    <strong>Daily Rate:</strong> Rs.
                    {selectedEmployee.daily_rate.toLocaleString()}/day
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (Rs.) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                placeholder="4000.00"
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

          <div className="space-y-2">
            <Label htmlFor="project_id">Project (if applicable)</Label>
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
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Additional notes about this payment..."
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isEditMode
                ? isLoading
                  ? "Saving..."
                  : "Update Payment"
                : isLoading
                ? "Recording..."
                : "Record Payment"}
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
