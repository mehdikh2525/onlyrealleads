import { NextRequest, NextResponse } from 'next/server'

// This API route acts as a proxy to our Supabase Edge Function
// It allows the JavaScript snippet to work from any domain
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Forward the request to our Supabase Edge Function
    const supabaseUrl = 'https://lhlunsadncrkntprznoz.supabase.co'
    const response = await fetch(`${supabaseUrl}/functions/v1/validate-lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobHVuc2FkbmNya250cHJ6bm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNDA1MDIsImV4cCI6MjA2NzgxNjUwMn0.l_oP_NY-Cy0u4UkMba0JaJiL6GQ1voVzIPEJGFSKU6U`
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    })
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
} 