import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
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
  Plus,
  Edit,
  Code,
  BarChart3,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  MoreHorizontal,
  ChevronRight,
  Shield,
  Zap,
  Brain,
  LogOut,
  Eye,
  Globe,
  Activity,
  TrendingUp,
  Filter,
  Menu,
  X
} from "lucide-react";

// Sample forms data
const formsData = [
  {
    id: 1,
    name: "Contact Form",
    description: "Main website contact form",
    url: "https://example.com/contact",
    status: "active",
    protection: "ai-powered",
    totalLeads: 127,
    passedLeads: 89,
    blockedLeads: 38,
    successRate: 72,
    lastActivity: "2 hours ago",
    crmIntegration: "hubspot"
  },
  {
    id: 2,
    name: "Quote Request",
    description: "Service quote form",
    url: "https://example.com/quote",
    status: "active",
    protection: "advanced",
    totalLeads: 89,
    passedLeads: 67,
    blockedLeads: 22,
    successRate: 75,
    lastActivity: "4 hours ago",
    crmIntegration: "salesforce"
  },
  {
    id: 3,
    name: "Newsletter Signup",
    description: "Email collection form",
    url: "https://example.com/newsletter",
    status: "inactive",
    protection: "basic",
    totalLeads: 45,
    passedLeads: 38,
    blockedLeads: 7,
    successRate: 84,
    lastActivity: "1 day ago",
    crmIntegration: "none"
  },
  {
    id: 4,
    name: "Free Consultation",
    description: "Lead magnet form",
    url: "https://example.com/consultation",
    status: "active",
    protection: "ai-powered",
    totalLeads: 203,
    passedLeads: 156,
    blockedLeads: 47,
    successRate: 77,
    lastActivity: "30 minutes ago",
    crmIntegration: "webhook"
  }
];

export default function Forms() {
  const [, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [user, setUser] = useState<any>(null);
  const [forms, setForms] = useState(formsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: "",
    description: "",
    url: "",
    protection: "basic",
    crmIntegration: "none"
  });

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

  const handleCreateForm = () => {
    if (!createFormData.name || !createFormData.url) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newForm = {
      id: forms.length + 1,
      name: createFormData.name,
      description: createFormData.description,
      url: createFormData.url,
      status: "active",
      protection: createFormData.protection,
      totalLeads: 0,
      passedLeads: 0,
      blockedLeads: 0,
      successRate: 0,
      lastActivity: "Just created",
      crmIntegration: createFormData.crmIntegration
    };

    setForms([...forms, newForm]);
    setCreateFormData({
      name: "",
      description: "",
      url: "",
      protection: "basic",
      crmIntegration: "none"
    });
    setShowCreateModal(false);
    
    toast({
      title: "Form created successfully",
      description: `${newForm.name} has been created and is now active.`
    });
  };

  const toggleFormStatus = (id: number) => {
    setForms(forms.map(form => 
      form.id === id 
        ? { ...form, status: form.status === "active" ? "inactive" : "active" }
        : form
    ));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Code snippet has been copied to your clipboard."
    });
  };

  const getProtectionIcon = (protection: string) => {
    switch (protection) {
      case "basic": return <Shield className="w-4 h-4" />;
      case "advanced": return <Zap className="w-4 h-4" />;
      case "ai-powered": return <Brain className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getProtectionColor = (protection: string) => {
    switch (protection) {
      case "basic": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "advanced": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "ai-powered": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getCRMStatus = (integration: string) => {
    switch (integration) {
      case "hubspot": return { text: "Connected to HubSpot", color: "text-green-600", icon: <CheckCircle className="w-4 h-4" /> };
      case "salesforce": return { text: "Connected to Salesforce", color: "text-green-600", icon: <CheckCircle className="w-4 h-4" /> };
      case "webhook": return { text: "Webhook Configured", color: "text-green-600", icon: <CheckCircle className="w-4 h-4" /> };
      case "none": return { text: "No Integration", color: "text-gray-500", icon: <AlertTriangle className="w-4 h-4" /> };
      default: return { text: "Setup Required", color: "text-yellow-600", icon: <AlertTriangle className="w-4 h-4" /> };
    }
  };

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || form.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const generateEmbedCode = (formId: number) => {
    return `<script>
(function(){
  var script = document.createElement('script');
  script.src = 'https://leadbouncer.com/js/leadbouncer.js';
  script.onload = function(){
    LeadBouncer.init('form_${formId}_${Math.random().toString(36).substr(2, 9)}');
  };
  document.head.appendChild(script);
})();
</script>`;
  };

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

  // Sidebar content component
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold text-primary">LeadBouncer</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start"
          onClick={() => {
            setLocation("/dashboard");
            setSidebarOpen(false);
          }}
        >
          <Home className="w-4 h-4 mr-3" />
          Dashboard
        </Button>
        <Button variant="secondary" className="w-full justify-start">
          <FileText className="w-4 h-4 mr-3" />
          Forms
          <Badge className="ml-auto">{forms.length}</Badge>
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
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                  <span>Dashboard</span>
                  <ChevronRight className="w-4 h-4" />
                  <span>Forms</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold">Protected Forms</h2>
                <p className="text-muted-foreground text-sm md:text-base">Manage your forms and generate embedding code</p>
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

          {/* Forms Content */}
          <div className="flex-1 p-4 md:p-6 overflow-auto">
            {/* Controls */}
            <div className="flex flex-col gap-4 mb-6 md:mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search forms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full sm:w-auto">
                  <TabsList className="grid w-full grid-cols-3 sm:w-auto">
                    <TabsTrigger value="all">All Forms</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="inactive">Inactive</TabsTrigger>
                  </TabsList>
                </Tabs>

                <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Form
                    </Button>
                  </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Protected Form</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Form Name *</Label>
                      <Input
                        id="name"
                        value={createFormData.name}
                        onChange={(e) => setCreateFormData({...createFormData, name: e.target.value})}
                        placeholder="Contact Form"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={createFormData.description}
                        onChange={(e) => setCreateFormData({...createFormData, description: e.target.value})}
                        placeholder="Main website contact form"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="url">Website URL *</Label>
                      <Input
                        id="url"
                        value={createFormData.url}
                        onChange={(e) => setCreateFormData({...createFormData, url: e.target.value})}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="protection">Protection Level</Label>
                      <Select value={createFormData.protection} onValueChange={(value) => setCreateFormData({...createFormData, protection: value})}>
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
                      <Label htmlFor="crm">CRM Integration</Label>
                      <Select value={createFormData.crmIntegration} onValueChange={(value) => setCreateFormData({...createFormData, crmIntegration: value})}>
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
                      <Button onClick={handleCreateForm}>
                        Create Form
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Forms Grid */}
            {filteredForms.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No forms yet</h3>
                <p className="text-muted-foreground mb-6">Create your first protected form to get started.</p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Form
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredForms.map((form) => (
                  <motion.div
                    key={form.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <CardTitle className="text-lg">{form.name}</CardTitle>
                            <Switch
                              checked={form.status === "active"}
                              onCheckedChange={() => toggleFormStatus(form.id)}
                            />
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSelectedForm(form);
                                setShowCodeModal(true);
                              }}>
                                <Code className="w-4 h-4 mr-2" />
                                Get Code
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BarChart3 className="w-4 h-4 mr-2" />
                                View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
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
                          <Badge variant={form.status === "active" ? "default" : "secondary"}>
                            {form.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Success Rate</span>
                            <span className="font-semibold">{form.successRate}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${form.successRate}%` }}
                            />
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
                            {getCRMStatus(form.crmIntegration).icon}
                            <span className={`text-sm ${getCRMStatus(form.crmIntegration).color}`}>
                              {getCRMStatus(form.crmIntegration).text}
                            </span>
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
          </div>
        </div>
      </div>

      {/* Code Generation Modal */}
      <Dialog open={showCodeModal} onOpenChange={setShowCodeModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Embed Code for {selectedForm?.name}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="javascript" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="javascript">JavaScript Snippet</TabsTrigger>
              <TabsTrigger value="wordpress">WordPress</TabsTrigger>
              <TabsTrigger value="html">HTML Form</TabsTrigger>
            </TabsList>
            
            <TabsContent value="javascript" className="space-y-4">
              <div className="space-y-2">
                <Label>JavaScript Snippet</Label>
                <div className="relative">
                  <div className="bg-slate-900 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto text-sm">
                    <pre className="text-slate-100">
                      <code className="language-html">{selectedForm ? generateEmbedCode(selectedForm.id) : ''}</code>
                    </pre>
                  </div>
                  <Button
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(selectedForm ? generateEmbedCode(selectedForm.id) : '')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Add this code to your website's HTML head section, just before the closing &lt;/head&gt; tag.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Installation Steps:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Copy the JavaScript snippet above</li>
                  <li>Paste it into your website's HTML head section</li>
                  <li>Test your form to ensure protection is working</li>
                  <li>Monitor your dashboard for blocked submissions</li>
                </ol>
              </div>
            </TabsContent>
            
            <TabsContent value="wordpress" className="space-y-4">
              <div className="space-y-2">
                <Label>WordPress Plugin</Label>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">Install the LeadBouncer WordPress plugin from your admin dashboard.</p>
                  <div className="mt-2 p-2 bg-slate-900 dark:bg-slate-800 rounded text-sm">
                    <code className="text-slate-100">[leadbouncer form_id="{selectedForm?.id}"]</code>
                  </div>
                </div>
              </div>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Download the plugin from your LeadBouncer account and upload it to your WordPress site.
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="html" className="space-y-4">
              <div className="space-y-2">
                <Label>HTML Form Integration</Label>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm mb-2">Add these attributes to your existing form:</p>
                  <div className="bg-slate-900 dark:bg-slate-800 p-3 rounded text-sm">
                    <pre className="text-slate-100">
{`<form data-leadbouncer="form_${selectedForm?.id}" method="post">
  <!-- Your form fields -->
</form>`}
                    </pre>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}