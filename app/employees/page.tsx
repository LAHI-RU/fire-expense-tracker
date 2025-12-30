"use client";
import { requireAuth } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash, Phone, Calendar } from "lucide-react";
import { EmployeeForm } from "@/components/employee-form";
import { SalaryPaymentForm } from "@/components/salary-payment-form";
import type { Employee, SalaryPayment } from "@/lib/mysql";

export default function EmployeesPage() {
  useEffect(() => {
    const user = typeof window !== "undefined" ? requireAuth() : null;
    if (!user) return;
  }, []);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [salaryPayments, setSalaryPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPaymentEmployeeId, setSelectedPaymentEmployeeId] = useState<
    number | null
  >(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  // Fetch data
  const fetchData = async () => {
    try {
      const [employeesRes, paymentsRes] = await Promise.all([
        fetch(`/api/employees?is_active=${showActiveOnly}`),
        fetch("/api/salary-payments"),
      ]);

      const [employeesData, paymentsData] = await Promise.all([
        employeesRes.json(),
        paymentsRes.json(),
      ]);

      setEmployees(employeesData.employees || []);
      setSalaryPayments(paymentsData.payments || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Search filter
  useEffect(() => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(
        (employee) =>
          employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.employee_code
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          employee.position?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEmployees(filtered);
  }, [employees, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [showActiveOnly]);

  // Quick-action from dashboard
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("openPayment") === "1") {
      const empId = params.get("employeeId");
      if (empId) setSelectedPaymentEmployeeId(Number(empId));
      setShowPaymentForm(true);
    }
  }, []);

  const handleCreateEmployee = async (employeeData: Partial<Employee>) => {
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        setShowEmployeeForm(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  const handleUpdateEmployee = async (employeeData: Partial<Employee>) => {
    if (!editingEmployee) return;

    try {
      const response = await fetch(`/api/employees/${editingEmployee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        setEditingEmployee(null);
        fetchData();
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleDeleteEmployee = async (employeeId: number) => {
    if (!confirm("This will permanently delete the employee. Continue?"))
      return;

    try {
      const response = await fetch(`/api/employees/${employeeId}?force=true`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleRecordPayment = async (paymentData: Partial<SalaryPayment>) => {
    try {
      const response = await fetch("/api/salary-payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...paymentData, created_by: 1 }),
      });

      if (response.ok) {
        setShowPaymentForm(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error recording payment:", error);
    }
  };

  const getRecentPayments = (employeeId: number) => {
    return salaryPayments
      .filter((payment) => payment.employee_id === employeeId)
      .slice(0, 5)
      .sort(
        (a, b) =>
          new Date(b.payment_date).getTime() -
          new Date(a.payment_date).getTime()
      );
  };

  // FORMS
  if (showEmployeeForm || editingEmployee) {
    return (
      <div className="container p-responsive">
        <EmployeeForm
          employee={editingEmployee || undefined}
          onSubmit={
            editingEmployee ? handleUpdateEmployee : handleCreateEmployee
          }
          onCancel={() => {
            setShowEmployeeForm(false);
            setEditingEmployee(null);
          }}
        />
      </div>
    );
  }

  if (showPaymentForm) {
    return (
      <div className="container p-responsive">
        <SalaryPaymentForm
          onSubmit={(data) => {
            handleRecordPayment(data);
            setSelectedPaymentEmployeeId(null);
          }}
          onCancel={() => {
            setShowPaymentForm(false);
            setSelectedPaymentEmployeeId(null);
          }}
          initialEmployeeId={selectedPaymentEmployeeId || undefined}
        />
      </div>
    );
  }

  return (
    <div className="container p-responsive space-y-6 mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Employees
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage employees and salary payments
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onClick={() => setShowEmployeeForm(true)}
            className="gap-2 flex-1 sm:flex-initial"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
          <CardContent className="pt-6 px-4">
            <div className="text-xl sm:text-2xl font-semibold text-primary">
              {employees.filter((e) => e.is_active).length}
            </div>
            <div className="text-sm text-muted-foreground">
              Active Employees
            </div>
          </CardContent>
        </Card>

        <Card className="transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
          <CardContent className="pt-6 px-4">
            <div className="text-xl sm:text-2xl font-semibold text-green-600">
              Rs.
              {salaryPayments
                .reduce((sum, payment) => sum + Number(payment.amount), 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Salary Paid
            </div>
          </CardContent>
        </Card>

        <Card className="transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
          <CardContent className="pt-6 px-4">
            <div className="text-xl sm:text-2xl font-semibold text-amber-600">
              {
                salaryPayments.filter((p) => {
                  const paymentDate = new Date(p.payment_date);
                  const currentMonth = new Date().getMonth();
                  const currentYear = new Date().getFullYear();
                  return (
                    paymentDate.getMonth() === currentMonth &&
                    paymentDate.getFullYear() === currentYear
                  );
                }).length
              }
            </div>
            <div className="text-sm text-muted-foreground">
              Payments This Month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search / Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          variant={showActiveOnly ? "default" : "outline"}
          onClick={() => setShowActiveOnly(!showActiveOnly)}
          className="w-full sm:w-auto"
        >
          {showActiveOnly ? "Active Only" : "All Employees"}
        </Button>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <span className="animate-spin text-4xl text-blue-700 mb-4">⏳</span>
          <h2 className="text-lg sm:text-xl font-semibold text-muted-foreground">
            Loading employees...
          </h2>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-muted-foreground">No employees found</div>
            <Button onClick={() => setShowEmployeeForm(true)} className="mt-4">
              Add your first employee
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {filteredEmployees.map((employee) => {
            const recentPayments = getRecentPayments(employee.id);

            return (
              <Card
                key={employee.id}
                className="transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">
                        {employee.full_name}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="secondary">
                          {employee.employee_code}
                        </Badge>
                        <Badge
                          variant={employee.is_active ? "default" : "secondary"}
                        >
                          {employee.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPaymentEmployeeId(employee.id);
                          setShowPaymentForm(true);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingEmployee(employee)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="h-8 w-8 p-0 text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {employee.position && (
                    <div className="text-sm text-muted-foreground">
                      {employee.position}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {employee.monthly_salary && (
                      <div>
                        <div className="text-muted-foreground">
                          Monthly Salary
                        </div>
                        <div className="font-medium">
                          Rs.{employee.monthly_salary.toLocaleString()}
                        </div>
                      </div>
                    )}

                    {employee.daily_rate && (
                      <div>
                        <div className="text-muted-foreground">Daily Rate</div>
                        <div className="font-medium">
                          Rs.{employee.daily_rate.toLocaleString()}/day
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {employee.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {employee.phone}
                      </div>
                    )}

                    {employee.hire_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Hired{" "}
                        {new Date(employee.hire_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {recentPayments.length > 0 && (
                    <div className="pt-2 border-t border-border">
                      <div className="text-xs text-muted-foreground mb-2">
                        Recent Payments
                      </div>

                      <div className="space-y-1">
                        {recentPayments.map((payment) => {
                          const notes =
                            typeof payment.notes === "string"
                              ? payment.notes.trim()
                              : ""
                          const paymentLabel =
                            payment.payment_type === "other" && notes
                              ? `other (${notes})`
                              : String(payment.payment_type).replace(/_/g, " ")

                          return (
                            <div
                              key={payment.id}
                              className="flex justify-between text-xs"
                            >
                              <span>
                                {new Date(
                                  payment.payment_date
                                ).toLocaleDateString()}{" "}
                                - {paymentLabel}
                              </span>

                              <span className="font-medium">
                                Rs.{Number(payment.amount).toLocaleString()}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
