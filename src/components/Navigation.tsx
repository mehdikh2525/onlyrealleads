import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from './AuthProvider'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const { user } = useAuth()
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }
  
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            🛡️ Lead Bouncer
          </Link>
          
          <div className="flex space-x-2 items-center">
            {user && (
              <>
            <Link 
              href="/dashboard" 
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              Dashboard
            </Link>
            <Link 
              href="/forms" 
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              Forms
            </Link>
                <Button onClick={handleLogout} size="sm" variant="outline">
                  Logout
                </Button>
              </>
            )}
            {!user && (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 