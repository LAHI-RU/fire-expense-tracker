// Employee creation and editing form
"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Employee } from "@/lib/mysql";

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (employeeData: Partial<Employee>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EmployeeForm({
  employee,
  onSubmit,
  onCancel,
  isLoading,
}: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    full_name: employee?.full_name || "",
    position: employee?.position || "",
    hourly_rate: employee?.hourly_rate?.toString() || "",
    monthly_salary: employee?.monthly_salary?.toString() || "",
    phone: employee?.phone || "",
    address: employee?.address || "",
    hire_date: employee?.hire_date
      ? new Date(employee.hire_date).toISOString().split("T")[0]
      : "",
    is_active: employee?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      hourly_rate: formData.hourly_rate
        ? Number.parseFloat(formData.hourly_rate)
        : undefined,
      monthly_salary: formData.monthly_salary
        ? Number.parseFloat(formData.monthly_salary)
        : undefined,
      hire_date: formData.hire_date ? new Date(formData.hire_date) : undefined,
      address: formData.address || undefined,
      phone: formData.phone || undefined,
      position: formData.position || undefined,
    };
    // Only include employee_code if editing
    if (employee?.employee_code) {
      (dataToSend as any).employee_code = employee.employee_code;
    }
    onSubmit(dataToSend);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          {employee ? "Edit Employee" : "Add New Employee"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {employee?.employee_code && (
              <div className="space-y-2">
                <Label htmlFor="employee_code">Employee Code</Label>
                <Input
                  id="employee_code"
                  value={employee.employee_code}
                  readOnly
                  className="bg-gray-200 cursor-not-allowed text-gray-400"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                placeholder="John Smith"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => handleChange("position", e.target.value)}
              placeholder="Fire Installation Technician"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hourly_rate">Hourly Rate (Rs.)</Label>
              <Input
                id="hourly_rate"
                type="number"
                step="0.01"
                value={formData.hourly_rate}
                onChange={(e) => handleChange("hourly_rate", e.target.value)}
                placeholder="25.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly_salary">Monthly Salary (Rs.)</Label>
              <Input
                id="monthly_salary"
                type="number"
                step="0.01"
                value={formData.monthly_salary}
                onChange={(e) => handleChange("monthly_salary", e.target.value)}
                placeholder="4000.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+1234567890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hire_date">Hire Date</Label>
              <Input
                id="hire_date"
                type="date"
                value={formData.hire_date}
                onChange={(e) => handleChange("hire_date", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="123 Main Street, City, State, ZIP"
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleChange("is_active", checked)}
            />
            <Label htmlFor="is_active">Active Employee</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading
                ? "Saving..."
                : employee
                ? "Update Employee"
                : "Add Employee"}
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
