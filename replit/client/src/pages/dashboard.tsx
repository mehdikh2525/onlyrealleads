import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Home,
  FileText,
  Settings,
  CreditCard,
  HelpCircle,
  User,
  Bell,
  Moon,
  Sun,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Clock,
  Shield,
  Users2,
  ChevronDown,
  LogOut,
  Menu,
  X
} from "lucide-react";

// Sample data
const leadsData = [
  { id: 1, name: "John Smith", email: "john@example.com", phone: "(555) 123-4567", form: "Contact Form", status: "passed", score: 85, date: "2024-01-12", message: "Need roofing quote for 2-story home" },
  { id: 2, name: "spam_bot_123", email: "test@disposable.com", phone: "1234567890", form: "Quote Request", status: "blocked", score: 15, date: "2024-01-12", message: "ArE yOu UsInG AI for your business?" },
  { id: 3, name: "Sarah Johnson", email: "sarah.j@gmail.com", phone: "(555) 987-6543", form: "Service Request", status: "passed", score: 92, date: "2024-01-11", message: "HVAC system not working, need emergency repair" },
  { id: 4, name: "Mike Davis", email: "mike@company.com", phone: "(555) 456-7890", form: "Contact Form", status: "passed", score: 78, date: "2024-01-11", message: "Looking for commercial plumbing services" },
  { id: 5, name: "bot_user", email: "noreply@spam.com", phone: "0000000000", form: "Contact Form", status: "blocked", score: 8, date: "2024-01-10", message: "Free SEO audit click here now!!!" },
  { id: 6, name: "Lisa Wilson", email: "lisa.wilson@email.com", phone: "(555) 321-9876", form: "Quote Request", status: "review", score: 65, date: "2024-01-10", message: "Need quote for kitchen renovation" },
  { id: 7, name: "autobot", email: "auto@test.org", phone: "1111111111", form: "Service Request", status: "blocked", score: 12, date: "2024-01-09", message: "asdf asdf asdf test message" },
  { id: 8, name: "Tom Anderson", email: "tom.anderson@outlook.com", phone: "(555) 654-3210", form: "Contact Form", status: "passed", score: 88, date: "2024-01-09", message: "Interested in monthly cleaning service" }
];

const chartData = [
  { name: 'Jan 8', passed: 12, blocked: 8 },
  { name: 'Jan 9', passed: 15, blocked: 6 },
  { name: 'Jan 10', passed: 18, blocked: 9 },
  { name: 'Jan 11', passed: 22, blocked: 7 },
  { name: 'Jan 12', passed: 25, blocked: 11 }
];

const blockingReasons = [
  { name: 'Honeypot triggered', value: 34, color: '#ef4444' },
  { name: 'Timing too fast', value: 28, color: '#f97316' },
  { name: 'Disposable email', value: 23, color: '#eab308' },
  { name: 'AI flagged', value: 15, color: '#8b5cf6' }
];

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check authentication
    const authData = localStorage.getItem('leadbouncer_auth');
    if (!authData) {
      setLocation("/login");
      return;
    }
    
    const parsed = JSON.parse(authData);
    if (!parsed.authenticated) {
      setLocation("/login");
      return;
    }
    
    setUser(parsed);
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem('leadbouncer_auth');
    setLocation("/");
  };

  const toggleLeadStatus = (id: number) => {
    // Toggle lead status logic would go here
    console.log("Toggle lead status for:", id);
  };

  // Filter leads based on search and status
  const filteredLeads = leadsData.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + itemsPerPage);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "blocked": return <XCircle className="w-4 h-4 text-red-500" />;
      case "review": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed": return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Passed</Badge>;
      case "blocked": return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Blocked</Badge>;
      case "review": return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Review</Badge>;
      default: return null;
    }
  };

  // Sidebar content component
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold text-primary">LeadBouncer</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        <Button variant="secondary" className="w-full justify-start">
          <Home className="w-4 h-4 mr-3" />
          Dashboard
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start"
          onClick={() => {
            setLocation("/forms");
            setSidebarOpen(false);
          }}
        >
          <FileText className="w-4 h-4 mr-3" />
          Forms
          <Badge className="ml-auto">3</Badge>
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="w-4 h-4 mr-3" />
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <CreditCard className="w-4 h-4 mr-3" />
          Billing
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <HelpCircle className="w-4 h-4 mr-3" />
          Help & Support
        </Button>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="font-medium text-sm">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-64 bg-muted/30 border-r border-border flex-col">
          <SidebarContent />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-background border-b border-border p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
              </Sheet>
              <div>
                <h2 className="text-xl md:text-2xl font-bold">Dashboard</h2>
                <p className="text-muted-foreground text-sm md:text-base">Welcome back, {user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="flex-1 p-4 md:p-6 overflow-auto">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Leads</p>
                      <p className="text-2xl font-bold">247</p>
                      <p className="text-sm text-green-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +12%
                      </p>
                    </div>
                    <Users2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Blocked Leads</p>
                      <p className="text-2xl font-bold">89</p>
                      <p className="text-sm text-muted-foreground">36% blocked</p>
                    </div>
                    <Shield className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Passed Leads</p>
                      <p className="text-2xl font-bold">158</p>
                      <p className="text-sm text-muted-foreground">64% passed</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Time Saved</p>
                      <p className="text-2xl font-bold">8.2h</p>
                      <p className="text-sm text-muted-foreground">This month</p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="passed" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="blocked" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Blocking Reasons</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={blockingReasons}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {blockingReasons.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Lead Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle>Recent Leads</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="passed">Passed</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search leads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Mobile Card Layout */}
                <div className="md:hidden space-y-4">
                  {paginatedLeads.map((lead) => (
                    <Card key={lead.id} className={`${
                      lead.status === 'passed' ? 'bg-green-50/50 dark:bg-green-950/20' :
                      lead.status === 'blocked' ? 'bg-red-50/50 dark:bg-red-950/20' :
                      'bg-yellow-50/50 dark:bg-yellow-950/20'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(lead.status)}
                            {getStatusBadge(lead.status)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLeadStatus(lead.id)}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{lead.name}</span>
                            <span className="text-sm text-muted-foreground">{lead.date}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">{lead.email}</div>
                          <div className="text-sm text-muted-foreground">{lead.phone}</div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{lead.form}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-12 bg-muted rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    lead.score >= 70 ? 'bg-green-500' : 
                                    lead.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${lead.score}%` }}
                                />
                              </div>
                              <span className="text-sm">{lead.score}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Form</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedLeads.map((lead) => (
                        <TableRow key={lead.id} className={`cursor-pointer ${
                          lead.status === 'passed' ? 'bg-green-50/50 dark:bg-green-950/20' :
                          lead.status === 'blocked' ? 'bg-red-50/50 dark:bg-red-950/20' :
                          'bg-yellow-50/50 dark:bg-yellow-950/20'
                        }`}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(lead.status)}
                              {getStatusBadge(lead.status)}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{lead.name}</TableCell>
                          <TableCell>{lead.email}</TableCell>
                          <TableCell>{lead.phone}</TableCell>
                          <TableCell>{lead.form}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-12 bg-muted rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    lead.score >= 70 ? 'bg-green-500' : 
                                    lead.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${lead.score}%` }}
                                />
                              </div>
                              <span className="text-sm">{lead.score}</span>
                            </div>
                          </TableCell>
                          <TableCell>{lead.date}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleLeadStatus(lead.id)}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLeads.length)} of {filteredLeads.length} results
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}