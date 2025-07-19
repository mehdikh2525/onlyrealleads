"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

import { supabase, Lead as LeadDB } from "@/lib/supabase"
import { useAuth } from "@/components/AuthProvider"

// UI components
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { useTheme } from "@/components/theme-provider"

// Icons
import {
  Menu,
  Home,
  FileText,
  Settings,
  CreditCard,
  HelpCircle,
  User,
  LogOut,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  Users,
  Shield,
  Clock,
  Bell,
  RefreshCcw,
  Sun,
  Moon,
} from "lucide-react"

// Charts
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts"

interface Lead extends LeadDB {
  name: string
  company: string
  source: string
  timestamp: string
  score: number
}

const sampleChartData = [
  { name: "7d ago", passed: 10, blocked: 4 },
  { name: "6d ago", passed: 12, blocked: 5 },
  { name: "5d ago", passed: 14, blocked: 5 },
  { name: "4d ago", passed: 16, blocked: 6 },
  { name: "3d ago", passed: 18, blocked: 7 },
  { name: "2d ago", passed: 22, blocked: 9 },
  { name: "1d ago", passed: 25, blocked: 11 },
]

const blockingReasons = [
  { name: "Honeypot", value: 34, color: "#ef4444" },
  { name: "Timing", value: 28, color: "#f97316" },
  { name: "Disposable", value: 23, color: "#eab308" },
  { name: "AI", value: 15, color: "#8b5cf6" },
]

export default function DashboardPage() {
  const router = useRouter()
  const { user, initialized } = useAuth()
  const isMobile = useIsMobile()
  const { theme, setTheme } = useTheme()

  // lead state
  const [leads, setLeads] = useState<Lead[]>([])
  const [loadingLeads, setLoadingLeads] = useState(true)

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  // redirect if not authed
  useEffect(() => {
    if (initialized && user === null) {
      router.push("/login")
    }
  }, [initialized, user, router])

  // fetch leads
  useEffect(() => {
    async function fetchLeads() {
      setLoadingLeads(true)
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000)

      if (error) {
        console.error("Error fetching leads", error)
      } else {
        const mapped: Lead[] = (data as LeadDB[]).map((l) => ({
          ...l,
          name: l.email ? l.email.split("@")[0] : "Lead",
          company: l.form_id?.slice(0, 6) ?? "-",
          source: "Website",
          timestamp: l.created_at ?? new Date().toISOString(),
          score: l.score ?? 0,
        }))
        setLeads(mapped)
      }
      setLoadingLeads(false)
    }

    fetchLeads()
  }, [])

  // filtered + paginated leads
  const filteredLeads = leads.filter((lead) => {
    const matchSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === "all" || lead.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage)
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalLeads = leads.length
  const blockedLeads = leads.filter((l) => l.status === "blocked").length
  const passedLeads = leads.filter((l) => l.status === "passed").length
  const blockedPercent = totalLeads === 0 ? 0 : Math.round((blockedLeads / totalLeads) * 100)
  const passedPercent = totalLeads === 0 ? 0 : Math.round((passedLeads / totalLeads) * 100)
  const timeSavedHours = (blockedLeads * 0.05).toFixed(1)

  // helper UI functions
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return <Badge variant="success">Passed</Badge>
      case "blocked":
        return <Badge variant="danger">Blocked</Badge>
      case "review":
        return <Badge variant="warning">Review</Badge>
      default:
        return null
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (!initialized || (initialized && user === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex w-64 bg-muted/30 border-r border-border flex-col">
        <SidebarContent userName={user?.email?.split("@")[0] ?? "User"} userEmail={user?.email ?? ""} onNavigate={(path) => router.push(path)} onLogout={handleLogout} />
      </aside>

      {/* Sidebar - mobile */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent userName={user?.email?.split("@")[0] ?? "User"} userEmail={user?.email ?? ""} onNavigate={(path) => { router.push(path); setSidebarOpen(false) }} onLogout={handleLogout} />
        </SheetContent>
      </Sheet>

      {/* Main Area */}
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
              <h2 className="text-xl md:text-2xl font-bold">Dashboard</h2>
              <p className="text-muted-foreground text-sm md:text-base">Welcome back, {user?.email ?? ""}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
              <RefreshCcw className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                  <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Leads</p>
                  <p className="text-3xl font-bold">{totalLeads}</p>
                </div>
                <Users className="w-8 h-8 text-muted-foreground" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                  <div>
                  <p className="text-sm text-muted-foreground mb-1">Blocked Leads</p>
                  <p className="text-3xl font-bold">{blockedLeads}</p>
                  <p className="text-xs text-muted-foreground">{blockedPercent}% blocked</p>
                </div>
                <Shield className="w-8 h-8 text-rose-500" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                  <div>
                  <p className="text-sm text-muted-foreground mb-1">Passed Leads</p>
                  <p className="text-3xl font-bold">{passedLeads}</p>
                  <p className="text-xs text-muted-foreground">{passedPercent}% passed</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                  <div>
                  <p className="text-sm text-muted-foreground mb-1">Time Saved</p>
                  <p className="text-3xl font-bold">{timeSavedHours}h</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </CardContent>
            </Card>
          </div>

          {/* Charts section - hidden on small screens */}
          <div className="hidden lg:grid grid-cols-3 gap-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Lead Activity</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sampleChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="passed" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="blocked" stroke="#ef4444" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Blocking Reasons</CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={blockingReasons} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {blockingReasons.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                  placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]"><Filter className="w-4 h-4 mr-2" /> <SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                    <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Export CSV</Button>
            </div>
              </div>

          {/* Leads Table */}
          <Card className="mt-2">
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingLeads ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">Loading leads...</TableCell>
                    </TableRow>
                  ) : paginatedLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No leads found</TableCell>
                    </TableRow>
                  ) : (
                    paginatedLeads.map((lead) => (
                      <TableRow key={lead.id} className="hover:bg-muted/30">
                        <TableCell className="space-y-0.5 py-4">
                          <div className="font-medium text-foreground">{lead.name}</div>
                          <div className="text-sm text-muted-foreground">{lead.email}</div>
                        </TableCell>
                        <TableCell>{getStatusBadge(lead.status)}</TableCell>
                        <TableCell>{lead.score}</TableCell>
                        <TableCell>{new Date(lead.timestamp).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                          )}
                </TableBody>
              </Table>
            </CardContent>

            {totalPages > 1 && (
              <div className="p-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                    Prev
                                </Button>
                  <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                    Next
                            </Button>
                          </div>
              </div>
              )}
          </Card>
        </div>
      </main>
    </div>
  )
}

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
        <Button variant="secondary" className="w-full justify-start" onClick={() => onNavigate("/dashboard")}> <Home className="w-4 h-4 mr-3" /> Dashboard </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => onNavigate("/forms")}>
          <FileText className="w-4 h-4 mr-3" /> Forms
          <Badge variant="secondary" className="ml-auto">3</Badge>
        </Button>
        <Button variant="ghost" className="w-full justify-start" disabled>
          <Settings className="w-4 h-4 mr-3" /> Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => onNavigate("/billing")}> 
          <CreditCard className="w-4 h-4 mr-3" /> Billing
        </Button>
        <Button variant="ghost" className="w-full justify-start" disabled>
          <HelpCircle className="w-4 h-4 mr-3" /> Help
        </Button>
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
        <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={onLogout}>
          <LogOut className="w-4 h-4 mr-3" /> Sign Out
        </Button>
      </div>
    </div>
  )
} 