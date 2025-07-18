'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestDB() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        // Test basic connection
        const { data: customers, error } = await supabase
          .from('customers')
          .select('*')
          .limit(1)
        
        if (error) {
          throw error
        }
        
        setData(customers)
        setStatus('success')
      } catch (err: any) {
        setError(err.message)
        setStatus('error')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      {status === 'loading' && (
        <div className="text-blue-600">Testing connection...</div>
      )}
      
      {status === 'success' && (
        <div className="text-green-600">
          <div className="font-semibold">✅ Connection successful!</div>
          <div className="mt-2">
            <strong>Customers found:</strong> {data?.length || 0}
          </div>
          {data && data.length > 0 && (
            <pre className="mt-4 p-4 bg-gray-100 rounded text-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      )}
      
      {status === 'error' && (
        <div className="text-red-600">
          <div className="font-semibold">❌ Connection failed</div>
          <div className="mt-2">Error: {error}</div>
        </div>
      )}
      
      <div className="mt-6">
        <a href="/" className="text-blue-600 hover:underline">
          ← Back to home
        </a>
      </div>
    </div>
  )
} 