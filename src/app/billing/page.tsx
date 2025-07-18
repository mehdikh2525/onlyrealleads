"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/AuthProvider"
import { useTheme } from "@/components/theme-provider"
import { useIsMobile } from "@/hooks/use-mobile"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import {
  Home,
  FileText,
  CreditCard,
  Settings,
  HelpCircle,
  Menu,
  Bell,
  RefreshCcw,
  Sun,
  Moon,
  User,
  LogOut,
} from "lucide-react"

interface Customer {
  plan: string | null
  billing_status: "active" | "past_due" | "canceled" | null
  stripe_customer_id: string | null
}

export default function BillingPage() {
  const { user, initialized } = useAuth()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const isMobile = useIsMobile()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)

  // redirect unauth
  useEffect(() => {
    if (initialized && user === null) router.push("/login")
  }, [initialized, user, router])

  useEffect(() => {
    if (user) fetchCustomer()
  }, [user])

  async function fetchCustomer() {
    setLoading(true)
    const { data, error } = await supabase
      .from("customers")
      .select("plan,billing_status,stripe_customer_id")
      .eq("id", user?.id)
      .single()

    if (!error) setCustomer(data as Customer)
    setLoading(false)
  }

  async function handleManageSubscription() {
    try {
      if (!customer?.stripe_customer_id) {
        alert("No Stripe customer ID found")
        return
      }
      setPortalLoading(true)
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customer.stripe_customer_id }),
      })
      const { url } = await res.json()
      window.location.href = url
    } finally {
      setPortalLoading(false)
    }
  }

  if (!initialized || loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>
  }
  if (!user) return null

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar – desktop */}
      <aside className="hidden md:flex w-64 bg-muted/30 border-r border-border flex-col">
        <SidebarContent
          userName={user.email?.split("@")[0] ?? "User"}
          userEmail={user.email ?? ""}
          onNavigate={(path) => router.push(path)}
          onLogout={async () => {
            await supabase.auth.signOut()
            router.push("/")
          }}
        />
      </aside>

      {/* Sidebar – mobile */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent
            userName={user.email?.split("@")[0] ?? "User"}
            userEmail={user.email ?? ""}
            onNavigate={(path) => {
              router.push(path)
              setSidebarOpen(false)
            }}
            onLogout={async () => {
              await supabase.auth.signOut()
              router.push("/")
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-background border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
            )}
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Billing</h2>
              <p className="text-muted-foreground text-sm md:text-base">Manage your subscription</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
              <RefreshCcw className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}> {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />} </Button>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-w-3xl mx-auto w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer?.plan ? (
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium capitalize">{customer.plan}</p>
                    <Badge variant={customer.billing_status === "active" ? "success" : "warning"}>{customer.billing_status}</Badge>
                  </div>
                  <Button onClick={handleManageSubscription} disabled={portalLoading}>
                    {portalLoading ? "Loading…" : "Manage Subscription"}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">You don’t have an active plan.</p>
                  <Button onClick={() => router.push("/pricing#plans")}>Upgrade</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Starter", price: "$49/mo", id: "price_1Rm9gPHdsYOfy35uOTiKeWQ1" },
              { name: "Pro", price: "$149/mo", id: "price_1Rm9jwHdsYOfy35uS6V920j3" },
              { name: "Agency", price: "$499/mo", id: "price_1Rm9kQHdsYOfy35ueSycgBTC" },
            ].map((p) => (
              <Card key={p.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{p.name}</CardTitle>
                  <p className="text-3xl font-bold mt-2">{p.price}</p>
                </CardHeader>
                <CardContent className="mt-auto pb-6">
                  <Button className="w-full" onClick={() => handleCheckout(p.id)}>
                    Choose {p.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )

  async function handleCheckout(priceId: string) {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      })
      const { url } = await res.json()
      window.location.href = url
    } catch (err) {
      console.error(err)
      alert("Unable to start checkout")
    }
  }
}

// -------- Sidebar component (duplicated for now, can be extracted) --------
interface SidebarProps {
  userName: string
  userEmail: string
  onNavigate: (path: string) => void
  onLogout: () => void
}

function SidebarContent({ userName, userEmail, onNavigate, onLogout }: SidebarProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">LeadBouncer</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start" onClick={() => onNavigate("/dashboard")}> <Home className="w-4 h-4 mr-3" /> Dashboard </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => onNavigate("/forms")}> <FileText className="w-4 h-4 mr-3" /> Forms </Button>
        <Button variant="secondary" className="w-full justify-start"> <CreditCard className="w-4 h-4 mr-3" /> Billing </Button>
        <Button variant="ghost" className="w-full justify-start" disabled> <Settings className="w-4 h-4 mr-3" /> Settings </Button>
        <Button variant="ghost" className="w-full justify-start" disabled> <HelpCircle className="w-4 h-4 mr-3" /> Help </Button>
      </nav>
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="font-medium text-sm">{userName}</p>
            <p className="text-xs text-muted-foreground">{userEmail}</p>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={onLogout}> <LogOut className="w-4 h-4 mr-3" /> Sign Out </Button>
      </div>
    </div>
  )
} 