// MySQL database connection utility
import mysql from "mysql2/promise"

// Database configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  port: Number.parseInt(process.env.MYSQL_PORT || "3306"),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "fire_expense_tracker",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+00:00",
}

// Create connection pool for better performance
const pool = mysql.createPool(dbConfig)

// Database utility functions
export class Database {
  static async query(sql: string, params?: any[]) {
    try {
      const [results] = await pool.execute(sql, params)
      return results
    } catch (error) {
      console.error("Database query error:", error)
      throw error
    }
  }

  static async transaction(queries: Array<{ sql: string; params?: any[] }>) {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      const results = []
      for (const query of queries) {
        const [result] = await connection.execute(query.sql, query.params)
        results.push(result)
      }

      await connection.commit()
      return results
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  static async getConnection() {
    return await pool.getConnection()
  }
}

// Type definitions for database entities
export interface User {
  id: number
  email: string
  full_name: string
  role: "admin" | "employee"
  created_at: Date
}

export interface Project {
  id: number
  name: string
  client_name: string
  client_contact?: string
  description?: string
  status: "planning" | "ongoing" | "completed" | "on-hold"
  start_date?: Date
  end_date?: Date
  estimated_budget?: number
  created_by: number
  created_at: Date
}

export interface Employee {
  id: number
  user_id?: number
  employee_code: string
  full_name: string
  position?: string
  daily_rate?: number
  monthly_salary?: number
  phone?: string
  address?: string
  hire_date?: Date
  is_active: boolean
}

export interface Expense {
  id: number
  project_id: number
  category_id?: number
  employee_id?: number
  description: string
  amount: number
  expense_date: Date
  receipt_url?: string
  notes?: string
  created_by: number
}

export interface Income {
  id: number
  project_id: number
  description: string
  amount: number
  payment_date: Date
  payment_method: "cash" | "bank_transfer" | "check" | "card"
  payment_status: "pending" | "received" | "partial"
  invoice_number?: string
  notes?: string
  created_by: number
}

export interface SalaryPayment {
  id: number
  employee_id: number
  project_id?: number
  amount: number
  payment_date: Date
  payment_month: number
  payment_year: number
  payment_type: "monthly_salary" | "project_bonus" | "overtime"
  notes?: string
  created_by: number
}
