// Incomes management page
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Calendar, DollarSign, FileText } from "lucide-react"
import { IncomeForm } from "@/components/income-form"
import { VoiceHelpDialog } from "@/components/voice-help-dialog"
import type { Income } from "@/lib/mysql"

export default function IncomesPage() {
  const [incomes, setIncomes] = useState<any[]>([])
  const [filteredIncomes, setFilteredIncomes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingIncome, setEditingIncome] = useState<Income | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch incomes
  const fetchIncomes = async () => {
    try {
      const response = await fetch("/api/incomes")
      const data = await response.json()
      setIncomes(data.incomes || [])
    } catch (error) {
      console.error("Error fetching incomes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter incomes based on search
  useEffect(() => {
    let filtered = incomes

    if (searchTerm) {
      filtered = filtered.filter(
        (income) =>
          income.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          income.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          income.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredIncomes(filtered)
  }, [incomes, searchTerm])

  useEffect(() => {
    fetchIncomes()
  }, [])

  const handleCreateIncome = async (incomeData: Partial<Income>) => {
    try {
      const response = await fetch("/api/incomes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...incomeData, created_by: 1 }), // TODO: Get from auth
      })

      if (response.ok) {
        setShowForm(false)
        fetchIncomes()
      }
    } catch (error) {
      console.error("Error creating income:", error)
    }
  }

  const handleUpdateIncome = async (incomeData: Partial<Income>) => {
    if (!editingIncome) return

    try {
      const response = await fetch(`/api/incomes/${editingIncome.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incomeData),
      })

      if (response.ok) {
        setEditingIncome(null)
        fetchIncomes()
      }
    } catch (error) {
      console.error("Error updating income:", error)
    }
  }

  const handleDeleteIncome = async (incomeId: number) => {
    if (!confirm("Are you sure you want to delete this income record?")) return

    try {
      const response = await fetch(`/api/incomes/${incomeId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchIncomes()
      }
    } catch (error) {
      console.error("Error deleting income:", error)
    }
  }

  const totalIncomes = incomes.reduce((sum, income) => sum + Number(income.amount), 0)
  const receivedIncomes = incomes
    .filter((income) => income.payment_status === "received")
    .reduce((sum, income) => sum + Number(income.amount), 0)

  const statusConfig = {
    pending: { label: "Pending", className: "bg-amber-100 text-amber-800" },
    received: { label: "Received", className: "bg-green-100 text-green-800" },
    partial: { label: "Partial", className: "bg-blue-100 text-blue-800" },
  }

  if (showForm || editingIncome) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-end mb-4">
          <VoiceHelpDialog />
        </div>
        <IncomeForm
          income={editingIncome || undefined}
          onSubmit={editingIncome ? handleUpdateIncome : handleCreateIncome}
          onCancel={() => {
            setShowForm(false)
            setEditingIncome(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Income</h1>
          <p className="text-muted-foreground">Track project payments and income</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">${totalIncomes.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Expected</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold text-primary">${receivedIncomes.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Actually Received</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search income records, projects, or invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
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
      ) : (
        <div className="space-y-4">
          {filteredIncomes.map((income) => (
            <Card key={income.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{income.description}</h3>
                      <Badge variant="secondary" className={statusConfig[income.payment_status]?.className}>
                        {statusConfig[income.payment_status]?.label}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(income.payment_date).toLocaleDateString()}
                      </div>
                      {income.project_name && <div>Project: {income.project_name}</div>}
                      <div className="capitalize">{income.payment_method.replace("_", " ")}</div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      {income.invoice_number && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          {income.invoice_number}
                        </div>
                      )}
                    </div>

                    {income.notes && <p className="text-sm text-muted-foreground">{income.notes}</p>}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">${Number(income.amount).toLocaleString()}</div>
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
  )
}
