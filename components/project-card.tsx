"use client";

// Project card component with professional status indicators
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, User, Edit, Trash2 } from "lucide-react";
import type { Project } from "@/lib/mysql";

interface ProjectCardProps {
  project: Project & {
    total_expenses?: number;
    total_income?: number;
    profit?: number;
  };
  onEdit: (project: Project) => void;
  onDelete: (projectId: number) => void;
}

const statusConfig = {
  planning: {
    label: "Planning",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    dotColor: "bg-blue-500",
  },
  ongoing: {
    label: "Ongoing",
    className: "bg-amber-100 text-amber-800 hover:bg-amber-200",
    dotColor: "bg-amber-500",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800 hover:bg-green-200",
    dotColor: "bg-green-500",
  },
  "on-hold": {
    label: "On Hold",
    className: "bg-red-100 text-red-800 hover:bg-red-200",
    dotColor: "bg-red-500",
  },
};

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const status = statusConfig[project.status] || statusConfig.planning;
  const profit = (project.total_income || 0) - (project.total_expenses || 0);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-card-foreground">
              {project.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status.dotColor}`} />
              <Badge variant="secondary" className={status.className}>
                {status.label}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(project)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(project.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{project.client_name}</span>
        </div>

        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          {project.start_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {new Date(project.start_date).toLocaleDateString()}
              </span>
            </div>
          )}

          {project.estimated_budget && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                Rs.{project.estimated_budget.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {(project.total_expenses || project.total_income) && (
          <div className="pt-2 border-t border-border">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-muted-foreground">Expenses</div>
                <div className="font-medium text-red-600">
                  Rs.{(project.total_expenses || 0).toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">Income</div>
                <div className="font-medium text-green-600">
                  Rs.{(project.total_income || 0).toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">Profit</div>
                <div
                  className={`font-medium ${
                    profit >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Rs.{profit.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
