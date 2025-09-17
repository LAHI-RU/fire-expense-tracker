// Project creation and editing form
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Project } from "@/lib/mysql"

interface ProjectFormProps {
  project?: Project
  onSubmit: (projectData: Partial<Project>) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ProjectForm({ project, onSubmit, onCancel, isLoading }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: project?.name || "",
    client_name: project?.client_name || "",
    client_contact: project?.client_contact || "",
    description: project?.description || "",
    status: project?.status || "planning",
    start_date: project?.start_date ? new Date(project.start_date).toISOString().split("T")[0] : "",
    end_date: project?.end_date ? new Date(project.end_date).toISOString().split("T")[0] : "",
    estimated_budget: project?.estimated_budget?.toString() || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      estimated_budget: formData.estimated_budget ? Number.parseFloat(formData.estimated_budget) : undefined,
      start_date: formData.start_date || undefined,
      end_date: formData.end_date || undefined,
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{project ? "Edit Project" : "Create New Project"}</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Fire extinguisher installation"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_name">Client Name *</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => handleChange("client_name", e.target.value)}
                placeholder="MAS Holdings"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="client_contact">Client Contact</Label>
            <Input
              id="client_contact"
              value={formData.client_contact}
              onChange={(e) => handleChange("client_contact", e.target.value)}
              placeholder="john@masholdings.com or +1234567890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Installation of new fire extinguishers in office building..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange("end_date", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated_budget">Estimated Budget ($)</Label>
            <Input
              id="estimated_budget"
              type="number"
              step="0.01"
              value={formData.estimated_budget}
              onChange={(e) => handleChange("estimated_budget", e.target.value)}
              placeholder="15000.00"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : project ? "Update Project" : "Create Project"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
