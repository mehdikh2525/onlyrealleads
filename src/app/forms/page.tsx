"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/components/AuthProvider"
import { useIsMobile } from "@/hooks/use-mobile"
import { useTheme } from "@/components/theme-provider"
import { useToast } from "@/hooks/use-toast"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Brain,
  CheckCircle,
  ChevronRight,
  Code,
  Copy,
  Edit,
  FileText,
  Globe,
  Menu,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  Sun,
  Trash2,
  Zap,
  Home,
  Settings,
  CreditCard,
  HelpCircle,
  User,
  LogOut,
} from "lucide-react"
import { motion } from "framer-motion"

import { supabase, type Form } from "@/lib/supabase"

// Extra fields we render that are not (yet) in DB
interface UiForm extends Form {
  description: string | null
  url: string | null
  status: "active" | "inactive"
  protection: "basic" | "advanced" | "ai-powered"
  totalLeads: number
  passedLeads: number
  blockedLeads: number
  successRate: number
  lastActivity: string | null
  crmIntegration: "none" | "hubspot" | "salesforce" | "webhook"
}

export default function FormsPage() {
  // global helpers
  const { user, initialized } = useAuth()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  // state
  const [forms, setForms] = useState<UiForm[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isMobile = useIsMobile()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  // create-form modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createFormData, setCreateFormData] = useState({
    name: "",
    description: "",
    url: "",
    protection: "basic" as const,
    crmIntegration: "none" as const,
  })

  // code modal
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [selectedForm, setSelectedForm] = useState<UiForm | null>(null)
  const [copied, setCopied] = useState(false)

  // auth guard
  useEffect(() => {
    if (initialized && !user) router.push("/login")
  }, [initialized, user, router])

  // fetch forms once authenticated
  useEffect(() => {
    if (user) fetchForms()
  }, [user])

  async function fetchForms() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("forms")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) throw error
      // Map DB rows to UI fields with safe fallbacks
      const enriched: UiForm[] = (data || []).map((f) => ({
        ...f,
        description: f.name ?? "", // placeholder until description column is added
        url: "https://example.com", // placeholder
        status: "active",
        protection: "basic",
        totalLeads: 0,
        passedLeads: 0,
        blockedLeads: 0,
        successRate: 0,
        lastActivity: "just now",
        crmIntegration: "none",
      }))
      setForms(enriched)
    } catch (err) {
      console.error(err)
      toast({ title: "Error", description: "Unable to load forms", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // helper – create form
  async function handleCreateForm() {
    if (!createFormData.name || !createFormData.url) {
      toast({ title: "Required fields missing", variant: "destructive" })
      return
    }
    try {
      setCreating(true)

      // Ensure a customers row exists for the logged-in user (FK + RLS requirement)
      if (user) {
        await supabase
          .from("customers")
          .upsert({ id: user.id, email: user.email ?? "" }, { onConflict: "id" })
      }

      const { data, error } = await supabase
        .from("forms")
        .insert({
          customer_id: user?.id,
          name: createFormData.name.trim(),
        })
        .select()
        .single()
      if (error) {
        console.error('Supabase insert error:', error)
        throw error
      }
      // append
      const newForm: UiForm = {
        ...data,
        description: createFormData.description,
        url: createFormData.url,
        status: "active",
        protection: createFormData.protection,
        totalLeads: 0,
        passedLeads: 0,
        blockedLeads: 0,
        successRate: 0,
        lastActivity: "just created",
        crmIntegration: createFormData.crmIntegration,
      }
      setForms((prev) => [...prev, newForm])
      setShowCreateModal(false)
      setCreateFormData({ name: "", description: "", url: "", protection: "basic", crmIntegration: "none" })
      toast({ title: "Form created" })
    } catch (err) {
      console.error(err)
      toast({ title: "Error creating form", variant: "destructive" })
    } finally {
      setCreating(false)
    }
  }

  // toggle status (local only for now)
  const toggleFormStatus = (id: string) => {
    setForms((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: f.status === "active" ? "inactive" : "active" } : f))
    )
  }

  // search + filter
  const filteredForms = forms.filter((form) => {
    const matchSearch =
      form.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filterStatus === "all" || form.status === filterStatus
    return matchSearch && matchStatus
  })

  // util: embed code same as previous page
  // Generates the copy-paste snippet for the “Get Code” modal
  function generateSnippet(form: UiForm) {
    // Prefer build-time env vars but fall back to current origin on the client
    const baseUrl = process.env.NEXT_PUBLIC_SNIPPET_URL || (typeof window !== "undefined" ? window.location.origin : "")
    const validateUrl = process.env.NEXT_PUBLIC_VALIDATE_URL || ""
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON || ""

    const scriptSrc = `${baseUrl.replace(/\/$/, "")}/leadbouncer.js`

    return `<!-- LeadBouncer -->\n` +
      `<script src="${scriptSrc}" defer></script>\n` +
      `<script>\n` +
      `  document.addEventListener('DOMContentLoaded', function () {\n` +
      `    LeadBouncer.init('form', {\n` +
      `      formId: '${form.id}',\n` +
      `      customerId: '${(form as any).customer_id ?? ""}',\n` +
      `      apiUrl: '${validateUrl}',\n` +
      `      anonKey: '${anonKey}',\n` +
      `    });\n` +
      `  });\n` +
      `</script>`
  }

  // ui helpers
  const getProtectionIcon = (p: UiForm["protection"]) => {
    switch (p) {
      case "basic":
        return <Shield className="w-4 h-4" />
      case "advanced":
        return <Zap className="w-4 h-4" />
      case "ai-powered":
        return <Brain className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }
  const getProtectionColor = (p: UiForm["protection"]) => {
    switch (p) {
      case "basic":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "advanced":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "ai-powered":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  // ----- render -----
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>
    )
  }
  if (!user) return null

  return (
    <div className="min-h-screen bg-background flex">

      {/* Sidebar – desktop */}
      <aside className="hidden md:flex w-64 bg-muted/30 border-r border-border flex-col">
        <SidebarContent
          userName={user?.email?.split("@")[0] ?? "User"}
          userEmail={user?.email ?? ""}
          onNavigate={(path) => router.push(path)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Sidebar – mobile */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent
            userName={user?.email?.split("@")[0] ?? "User"}
            userEmail={user?.email ?? ""}
            onNavigate={(path) => {
              router.push(path)
              setSidebarOpen(false)
            }}
            onLogout={handleLogout}
          />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col">
      {/* header */}
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
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
              <span>Dashboard</span>
              <ChevronRight className="w-4 h-4" />
              <span>Forms</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold">Protected Forms</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Manage your forms and generate embedding code
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        {/* Controls */}
        <div className="flex flex-col gap-4 mb-6 md:mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <Tabs value={filterStatus} onValueChange={(val) => setFilterStatus(val as any)} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-3 sm:w-auto">
                <TabsTrigger value="all">All Forms</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
            </Tabs>
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" /> Add New Form
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Protected Form</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Form Name *</Label>
                    <Input id="name" value={createFormData.name} onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" rows={3} value={createFormData.description} onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="url">Website URL *</Label>
                    <Input id="url" value={createFormData.url} onChange={(e) => setCreateFormData({ ...createFormData, url: e.target.value })} />
                  </div>
                  <div>
                    <Label>Protection Level</Label>
                    <Select value={createFormData.protection} onValueChange={(v) => setCreateFormData({ ...createFormData, protection: v as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="ai-powered">AI-Powered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>CRM Integration</Label>
                    <Select value={createFormData.crmIntegration} onValueChange={(v) => setCreateFormData({ ...createFormData, crmIntegration: v as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="hubspot">HubSpot</SelectItem>
                        <SelectItem value="salesforce">Salesforce</SelectItem>
                        <SelectItem value="webhook">Webhook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateForm} disabled={creating}>
                      {creating ? "Creating..." : "Create Form"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          </div> {/* Close Controls wrapper */}

          {/* Forms Grid */}
          {filteredForms.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No forms yet</h3>
              <p className="text-muted-foreground mb-6">Create your first protected form to get started.</p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" /> Create Your First Form
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredForms.map((form) => (
                <motion.div key={form.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-lg">{form.name}</CardTitle>
                          <Switch checked={form.status === "active"} onCheckedChange={() => toggleFormStatus(form.id)} />
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedForm(form)
                              setShowCodeModal(true)
                            }}>
                              <Code className="w-4 h-4 mr-2" /> Get Code
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="w-4 h-4 mr-2" /> View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-sm text-muted-foreground">{form.description}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Globe className="w-4 h-4" />
                        <span>{form.url}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className={getProtectionColor(form.protection)}>
                          {getProtectionIcon(form.protection)}
                          <span className="ml-1 capitalize">{form.protection}</span>
                        </Badge>
                        <Badge variant={form.status === "active" ? "default" : "secondary"}>{form.status === "active" ? "Active" : "Inactive"}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Success Rate</span>
                          <span className="font-semibold">{form.successRate}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: `${form.successRate}%` }} />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold">{form.totalLeads}</div>
                          <div className="text-xs text-muted-foreground">Total</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-green-600">{form.passedLeads}</div>
                          <div className="text-xs text-muted-foreground">Passed</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-red-600">{form.blockedLeads}</div>
                          <div className="text-xs text-muted-foreground">Blocked</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-muted-foreground">{form.crmIntegration === "none" ? "No Integration" : `Connected to ${form.crmIntegration}`}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Activity className="w-4 h-4" />
                          <span>{form.lastActivity}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </main>

      {/* Code Generation Modal */}
      <Dialog open={showCodeModal} onOpenChange={setShowCodeModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Embed Code for {selectedForm?.name}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="javascript" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="wordpress">WordPress</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
            </TabsList>
            <TabsContent value="javascript" className="space-y-4">
              <Label>JavaScript Snippet</Label>
              <div className="relative w-full">
                <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto text-sm max-w-full">
                  <pre className="text-slate-100 whitespace-pre-wrap break-all">
                    <code>{selectedForm ? generateSnippet(selectedForm) : ""}</code>
                  </pre>
                </div>
                <Button size="sm" className="absolute top-3 right-3" onClick={() => {
                  if (!selectedForm) return
                  navigator.clipboard.writeText(generateSnippet(selectedForm))
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Add this snippet before the closing {"</head>"} tag.
                </AlertDescription>
              </Alert>
            </TabsContent>
            <TabsContent value="wordpress" className="space-y-4">
              <p className="text-sm text-muted-foreground">WordPress embed instructions coming soon.</p>
            </TabsContent>

            <TabsContent value="html" className="space-y-4">
              <p className="text-sm text-muted-foreground">HTML embed instructions coming soon.</p>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      </div> {/* End main container */}
    </div>
  )
}

// ---------- Sidebar helper ----------

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
        <Button variant="ghost" className="w-full justify-start" onClick={() => onNavigate("/forms")}> <FileText className="w-4 h-4 mr-3" /> Forms <Badge variant="secondary" className="ml-auto">3</Badge> </Button>
        <Button variant="ghost" className="w-full justify-start" disabled> <Settings className="w-4 h-4 mr-3" /> Settings </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => onNavigate("/billing")}> <CreditCard className="w-4 h-4 mr-3" /> Billing </Button>
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