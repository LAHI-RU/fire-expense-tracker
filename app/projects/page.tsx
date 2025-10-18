"use client";
import { requireAuth } from "@/lib/auth-client";
// Projects management page with professional layout

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { ProjectForm } from "@/components/project-form";
import type { Project } from "@/lib/mysql";

export default function ProjectsPage() {
  // Get the logged-in user
  const user = typeof window !== "undefined" ? requireAuth() : null;
  useEffect(() => {
    if (!user) return;
  }, [user]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch ALL projects (without status filter)
  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects"); // Remove status filter from API call
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter projects based on search and status (CLIENT-SIDE FILTERING)
  useEffect(() => {
    let filtered = projects;

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.client_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter]); // Add statusFilter to dependency array

  useEffect(() => {
    fetchProjects(); // Fetch projects only once on component mount
  }, []); // Remove statusFilter dependency

  const handleCreateProject = async (projectData: Partial<Project>) => {
    if (!user) {
      alert("You must be logged in to create a project.");
      return;
    }
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...projectData, created_by: user.id }),
      });

      if (response.ok) {
        setShowForm(false);
        fetchProjects();
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleUpdateProject = async (projectData: Partial<Project>) => {
    if (!editingProject) return;

    try {
      const response = await fetch(`/api/projects/${editingProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        setEditingProject(null);
        fetchProjects();
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const statusCounts = {
    all: projects.length, // Total count of all projects
    planning: projects.filter((p) => p.status === "planning").length,
    ongoing: projects.filter((p) => p.status === "ongoing").length,
    completed: projects.filter((p) => p.status === "completed").length,
    "on-hold": projects.filter((p) => p.status === "on-hold").length,
  };

  if (showForm || editingProject) {
    return (
      <div className="container p-responsive">
        <ProjectForm
          project={editingProject || undefined}
          onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
          onCancel={() => {
            setShowForm(false);
            setEditingProject(null);
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
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">
            Manage your fire installation projects
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card
            key={status}
            className={`cursor-pointer transition-colors ${
              statusFilter === status ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setStatusFilter(status)}
          >
            <CardContent className="p-1 text-center">
              <div className="text-2xl font-bold text-primary">{count}</div>
              <div className="text-sm text-muted-foreground capitalize">
                {status === "on-hold" ? "On Hold" : status}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects or clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-muted-foreground">Loading projects...</div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-muted-foreground">No projects found</div>
            <Button onClick={() => setShowForm(true)} className="mt-4">
              Create your first project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={setEditingProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
