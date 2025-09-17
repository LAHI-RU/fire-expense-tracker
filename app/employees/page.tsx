// Employees management page
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, UserX, DollarSign, Phone, Calendar } from "lucide-react"
import { EmployeeForm } from "@/components/employee-form"
import { SalaryPaymentForm } from "@/components/salary-payment-form"
import type { Employee, SalaryPayment } from "@/lib/mysql"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [salaryPayments, setSalaryPayments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showEmployeeForm, setShowEmployeeForm] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showActiveOnly, setShowActiveOnly] = useState(true)

  // Fetch employees and salary payments
  const fetchData = async () => {
    try {
      const [employeesRes, paymentsRes] = await Promise.all([
        fetch(`/api/employees?is_active=${showActiveOnly}`),
        fetch("/api/salary-payments"),
      ])

      const [employeesData, paymentsData] = await Promise.all([employeesRes.json(), paymentsRes.json()])

      setEmployees(employeesData.employees || [])
      setSalaryPayments(paymentsData.payments || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter employees based on search
  useEffect(() => {
    let filtered = employees

    if (searchTerm) {
      filtered = filtered.filter(
        (employee) =>
          employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.position?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredEmployees(filtered)
  }, [employees, searchTerm])

  useEffect(() => {
    fetchData()
  }, [showActiveOnly])

  const handleCreateEmployee = async (employeeData: Partial<Employee>) => {
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      })

      if (response.ok) {
        setShowEmployeeForm(false)
        fetchData()
      }
    } catch (error) {
      console.error("Error creating employee:", error)
    }
  }

  const handleUpdateEmployee = async (employeeData: Partial<Employee>) => {
    if (!editingEmployee) return

    try {
      const response = await fetch(`/api/employees/${editingEmployee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      })

      if (response.ok) {
        setEditingEmployee(null)
        fetchData()
      }
    } catch (error) {
      console.error("Error updating employee:", error)
    }
  }

  const handleDeactivateEmployee = async (employeeId: number) => {
    if (!confirm("Are you sure you want to deactivate this employee?")) return

    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error deactivating employee:", error)
    }
  }

  const handleRecordPayment = async (paymentData: Partial<SalaryPayment>) => {
    try {
      const response = await fetch("/api/salary-payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...paymentData, created_by: 1 }), // TODO: Get from auth
      })

      const result = await response.json()

      if (response.ok) {
        setShowPaymentForm(false)
        fetchData()
      } else {
        alert(result.message || "Failed to record payment")
      }
    } catch (error) {
      console.error("Error recording payment:", error)
    }
  }

  // Get recent payments for an employee
  const getRecentPayments = (employeeId: number) => {
    return salaryPayments
      .filter((payment) => payment.employee_id === employeeId)
      .slice(0, 3)
      .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())
  }

  if (showEmployeeForm || editingEmployee) {
    return (
      <div className="container mx-auto py-6">
        <EmployeeForm
          employee={editingEmployee || undefined}
          onSubmit={editingEmployee ? handleUpdateEmployee : handleCreateEmployee}
          onCancel={() => {
            setShowEmployeeForm(false)
            setEditingEmployee(null)
          }}
        />
      </div>
    )
  }

  if (showPaymentForm) {
    return (
      <div className="container mx-auto py-6">
        <SalaryPaymentForm onSubmit={handleRecordPayment} onCancel={() => setShowPaymentForm(false)} />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employees</h1>
          <p className="text-muted-foreground">Manage employees and salary payments</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowPaymentForm(true)} variant="outline" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Record Payment
          </Button>
          <Button onClick={() => setShowEmployeeForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary">{employees.filter((e) => e.is_active).length}</div>
            <div className="text-sm text-muted-foreground">Active Employees</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">
              ${salaryPayments.reduce((sum, payment) => sum + Number(payment.amount), 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Salary Paid</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-amber-600">
              {
                salaryPayments.filter((p) => {
                  const paymentDate = new Date(p.payment_date)
                  const currentMonth = new Date().getMonth()
                  const currentYear = new Date().getFullYear()
                  return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear
                }).length
              }
            </div>
            <div className="text-sm text-muted-foreground">Payments This Month</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant={showActiveOnly ? "default" : "outline"} onClick={() => setShowActiveOnly(!showActiveOnly)}>
          {showActiveOnly ? "Active Only" : "All Employees"}
        </Button>
      </div>

      {/* Employees List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-muted-foreground">Loading employees...</div>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEmployees.map((employee) => {
            const recentPayments = getRecentPayments(employee.id)
            return (
              <Card key={employee.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{employee.full_name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{employee.employee_code}</Badge>
                        <Badge variant={employee.is_active ? "default" : "secondary"}>
                          {employee.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingEmployee(employee)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {employee.is_active && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeactivateEmployee(employee.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {employee.position && <div className="text-sm text-muted-foreground">{employee.position}</div>}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {employee.monthly_salary && (
                      <div>
                        <div className="text-muted-foreground">Monthly Salary</div>
                        <div className="font-medium">${employee.monthly_salary.toLocaleString()}</div>
                      </div>
                    )}

                    {employee.hourly_rate && (
                      <div>
                        <div className="text-muted-foreground">Hourly Rate</div>
                        <div className="font-medium">${employee.hourly_rate}/hr</div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {employee.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {employee.phone}
                      </div>
                    )}

                    {employee.hire_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Hired {new Date(employee.hire_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {recentPayments.length > 0 && (
                    <div className="pt-2 border-t border-border">
                      <div className="text-xs text-muted-foreground mb-2">Recent Payments</div>
                      <div className="space-y-1">
                        {recentPayments.map((payment) => (
                          <div key={payment.id} className="flex justify-between text-xs">
                            <span>
                              {new Date(payment.payment_date).toLocaleDateString()} -{" "}
                              {payment.payment_type.replace("_", " ")}
                            </span>
                            <span className="font-medium">${Number(payment.amount).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
