import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen, DollarSign, Users, BarChart3, TrendingUp, AlertCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Fire Installation Business Manager</h1>
        <p className="text-xl text-muted-foreground">Professional project and expense tracking system</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/projects">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FolderOpen className="h-5 w-5 text-primary" />
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage fire installation projects and track their progress
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/expenses">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-primary" />
                Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Track project expenses and manage financial records</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/employees">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage employee information and salary payments</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/analytics">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View profit analytics and business insights</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Key Features Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <TrendingUp className="h-5 w-5" />
              Profit Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-700">
              Monitor project profitability in real-time with comprehensive income and expense tracking. Get detailed
              insights into which projects are most profitable.
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-5 w-5" />
              Duplicate Payment Prevention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-700">
              Never pay employee salaries twice again! Our system automatically detects and prevents duplicate monthly
              salary payments with smart alerts.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Welcome to your fire installation business management system. Here's how to get started:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Set up your MySQL database using the provided SQL scripts</li>
            <li>Configure your database connection in the environment variables</li>
            <li>Create your first project to start tracking expenses and income</li>
            <li>Add employees to manage salary payments and prevent duplicates</li>
            <li>Use the analytics dashboard to monitor your business performance</li>
          </ol>
          <div className="pt-4 flex gap-3">
            <Link href="/projects">
              <Button>Start with Projects</Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline">View Analytics</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
