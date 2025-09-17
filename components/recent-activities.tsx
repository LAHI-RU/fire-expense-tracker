// Recent activities component
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, TrendingDown, Users } from "lucide-react"

interface RecentActivitiesProps {
  activities: any[]
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "income":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "expense":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "salary":
        return <Users className="h-4 w-4 text-blue-600" />
      default:
        return <DollarSign className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "income":
        return "bg-green-100 text-green-800"
      case "expense":
        return "bg-red-100 text-red-800"
      case "salary":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No recent activities</div>
          ) : (
            activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                    <Badge variant="secondary" className={getActivityColor(activity.type)}>
                      {activity.type}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">{new Date(activity.date).toLocaleDateString()}</p>
                    {activity.project_name && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <p className="text-xs text-muted-foreground">{activity.project_name}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <p
                    className={`text-sm font-semibold ${activity.type === "income" ? "text-green-600" : activity.type === "expense" ? "text-red-600" : "text-blue-600"}`}
                  >
                    ${Number(activity.amount).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
