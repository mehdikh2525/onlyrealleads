import { createClient } from '@supabase/supabase-js'

// For now, we'll use hardcoded values from your existing setup
// In production, these should come from environment variables
const supabaseUrl = 'https://lhlunsadncrkntprznoz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobHVuc2FkbmNya250cHJ6bm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNDA1MDIsImV4cCI6MjA2NzgxNjUwMn0.l_oP_NY-Cy0u4UkMba0JaJiL6GQ1voVzIPEJGFSKU6U'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (based on our schema)
export interface Customer {
  id: string
  email: string
  plan: 'free' | 'starter' | 'growth' | 'agency'
  created_at: string
}

export interface Form {
  id: string
  customer_id: string
  name: string | null
  created_at: string
}

export interface Lead {
  id: string
  form_id: string
  email: string | null
  phone: string | null
  status: 'passed' | 'blocked' | 'review'
  score: number | null
  data: any | null
  elapsed_seconds: number | null
  reason: string | null
  created_at: string
} 