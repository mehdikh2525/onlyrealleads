import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Trash2, 
  DollarSign, 
  Zap, 
  Brain, 
  Heart,
  CheckCircle2,
  Shield,
  Users,
  Star,
  Menu,
  X
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">LeadBouncer</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('demo')}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Demo
              </button>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-muted-foreground hover:text-primary"
                onClick={() => setLocation("/login")}
              >
                Sign In
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={() => setLocation("/signup")}
              >
                Start Free Trial
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-border"
            >
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="text-left text-muted-foreground hover:text-primary transition-colors"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="text-left text-muted-foreground hover:text-primary transition-colors"
                >
                  Pricing
                </button>
                <button 
                  onClick={() => scrollToSection('demo')}
                  className="text-left text-muted-foreground hover:text-primary transition-colors"
                >
                  Demo
                </button>
                <div className="flex flex-col space-y-2 pt-4">
                  <Button 
                    variant="ghost" 
                    className="justify-start"
                    onClick={() => setLocation("/login")}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => setLocation("/signup")}
                  >
                    Start Free Trial
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden hero-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <Badge className="mb-6 bg-accent/10 text-accent hover:bg-accent/20">
                Trusted by 500+ service businesses
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Stop Wasting Hours on{" "}
                <span className="text-primary">Fake Leads</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                LeadBouncer automatically filters out spam, bots, and fake inquiries before they hit your CRM. 
                Save 5+ hours weekly and protect your ad spend.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg"
                  onClick={() => setLocation("/signup")}
                >
                  Start Free Trial - $49/month
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-lg"
                  onClick={() => scrollToSection('demo')}
                >
                  Book a Demo
                </Button>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                14-day free trial, cancel anytime
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-4">
                      Before LeadBouncer
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded text-sm">
                        <strong>ArE yOu UsInG AI?</strong> - Obvious spam
                      </div>
                      <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded text-sm">
                        <strong>Free SEO audit</strong> - Bot submission
                      </div>
                      <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded text-sm">
                        <strong>asdf@test.com</strong> - Fake email
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-4">
                      After LeadBouncer
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded text-sm">
                        <strong>Mike Johnson</strong> - Need HVAC repair
                      </div>
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded text-sm">
                        <strong>Sarah Williams</strong> - Roofing quote
                      </div>
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded text-sm">
                        <strong>Tom Davis</strong> - Plumbing emergency
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Every Service Business Faces This Problem
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              You're not alone. Thousands of service businesses waste countless hours dealing with fake leads every single day.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeIn}>
              <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <Clock className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Time Wasted on Spam</h3>
                  <p className="text-muted-foreground">
                    Sorting through "ArE yOu UsInG AI?" spam and obvious bot submissions wastes 10+ hours weekly that could be spent on real customers.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Polluted CRM Data</h3>
                  <p className="text-muted-foreground">
                    Fake leads contaminate your CRM and follow-up sequences, reducing the effectiveness of your sales process and automation.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <DollarSign className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Wasted Ad Spend</h3>
                  <p className="text-muted-foreground">
                    You're paying $30+ per lead from ads, then wasting time and money on fakes. That's money down the drain every single day.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Your Invisible Lead Bouncer
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Automatically blocks fake submissions before they waste your time. It's like having a security guard for your lead forms.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid lg:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeIn}>
              <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="bg-primary w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <Zap className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Instant Bot Detection</h3>
                  <p className="text-muted-foreground mb-4">
                    Advanced honeypots, timing analysis, and behavioral patterns catch bots before they submit.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Honeypot form fields invisible to humans</li>
                    <li>• Submission timing analysis</li>
                    <li>• Mouse movement tracking</li>
                    <li>• IP reputation checking</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="p-8 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="bg-accent w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <Brain className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">AI-Powered Filtering</h3>
                  <p className="text-muted-foreground mb-4">
                    GPT-4 powered content analysis detects spam patterns humans miss.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Natural language processing</li>
                    <li>• Spam pattern recognition</li>
                    <li>• Context-aware filtering</li>
                    <li>• Continuous learning</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="bg-green-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">CRM Integration</h3>
                  <p className="text-muted-foreground mb-4">
                    Only clean leads reach HubSpot, Salesforce, or any system you use.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Direct CRM integration</li>
                    <li>• Webhook support</li>
                    <li>• Real-time filtering</li>
                    <li>• Custom field mapping</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">Set Up in 5 Minutes</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Getting started is incredibly simple. No complex setup, no technical expertise required.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeIn} className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-primary-foreground font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Add Code Snippet</h3>
              <p className="text-muted-foreground mb-6">
                Copy and paste our simple code snippet into your forms. Works with any HTML form.
              </p>
              <Card className="bg-gray-900 dark:bg-gray-800 p-4">
                <code className="text-green-400 text-sm">
                  &lt;script src="leadbouncer.js"&gt;&lt;/script&gt;
                </code>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn} className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-primary-foreground font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Connect Your CRM</h3>
              <p className="text-muted-foreground mb-6">
                Link your CRM or webhook endpoint. We support all major platforms.
              </p>
              <Card className="p-4">
                <div className="flex justify-center items-center space-x-4 text-sm text-muted-foreground">
                  <span>HubSpot</span>
                  <span>•</span>
                  <span>Salesforce</span>
                  <span>•</span>
                  <span>Zapier</span>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn} className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-primary-foreground font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Watch Magic Happen</h3>
              <p className="text-muted-foreground mb-6">
                Fake leads get blocked automatically. Only real prospects reach your CRM.
              </p>
              <Card className="bg-green-100 dark:bg-green-900/30 p-6">
                <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <p className="text-green-800 dark:text-green-400 font-semibold">
                  Blocked 47 fake leads today
                </p>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mt-12"
          >
            <Button 
              id="demo" 
              size="lg" 
              className="bg-primary hover:bg-primary/90 font-semibold text-lg"
            >
              See Live Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Trusted by Service Businesses
            </h2>
            <p className="text-xl text-muted-foreground">
              Join hundreds of contractors, agencies, and service providers who've reclaimed their time.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            <motion.div variants={fadeIn}>
              <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "LeadBouncer saved me 8 hours weekly that I was spending sorting through spam leads. Now I only get real customers in my CRM."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                    <div>
                      <p className="font-semibold">Mike Johnson</p>
                      <p className="text-sm text-muted-foreground">HVAC Contractor</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "We blocked 67% of fake submissions in the first month. Our team can now focus on qualified leads instead of sorting through spam."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                    <div>
                      <p className="font-semibold">Sarah Williams</p>
                      <p className="text-sm text-muted-foreground">Digital Agency Owner</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "ROI positive from day one. The time savings alone paid for itself, but we're also converting more leads since our CRM is cleaner."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                    <div>
                      <p className="font-semibold">Tom Davis</p>
                      <p className="text-sm text-muted-foreground">Roofing Company Owner</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center"
          >
            <p className="text-muted-foreground mb-8">Integrates with all major CRMs and platforms</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-muted-foreground">HubSpot</div>
              <div className="text-2xl font-bold text-muted-foreground">Salesforce</div>
              <div className="text-2xl font-bold text-muted-foreground">WordPress</div>
              <div className="text-2xl font-bold text-muted-foreground">Webflow</div>
              <div className="text-2xl font-bold text-muted-foreground">Zapier</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that's right for your business. All plans include 14-day free trial.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeIn}>
              <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0 text-center">
                  <h3 className="text-2xl font-bold mb-4">Starter</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">$49</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="text-left space-y-4 mb-8">
                    <li className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                      Up to 5 forms protected
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                      Basic spam filtering
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                      Email support
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                      14-day free trial
                    </li>
                  </ul>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setLocation("/signup")}
                  >
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="p-8 border-2 border-accent relative hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-accent text-accent-foreground">Most Popular</Badge>
                </div>
                <CardContent className="p-0 text-center">
                  <h3 className="text-2xl font-bold mb-4">Professional</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">$149</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="text-left space-y-4 mb-8">
                    <li className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                      Unlimited forms
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                      AI-powered analysis
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                      CRM integrations
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                      Priority support
                    </li>
                  </ul>
                  <Button 
                    className="w-full bg-accent hover:bg-accent/90"
                    onClick={() => setLocation("/signup")}
                  >
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0 text-center">
                  <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">$499</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="text-left space-y-4 mb-8">
                    <li className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                      Multi-client management
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                      Advanced analytics
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                      Custom integrations
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                      Dedicated support
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mt-12"
          >
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-green-500 mr-2" />
                <span className="text-muted-foreground">30-day money-back guarantee</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="w-8 h-8 text-green-500 mr-2" />
                <span className="text-muted-foreground">Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Got questions? We've got answers.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-8"
          >
            <motion.div variants={fadeIn} className="border-b border-border pb-8">
              <h3 className="text-xl font-semibold mb-4">How accurate is the filtering?</h3>
              <p className="text-muted-foreground">
                Our system maintains 95%+ accuracy with a human review option for edge cases. We continuously improve our AI models to minimize false positives while catching more spam.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="border-b border-border pb-8">
              <h3 className="text-xl font-semibold mb-4">Will it block real customers?</h3>
              <p className="text-muted-foreground">
                Our AI is specifically trained to avoid false positives. We use multiple validation layers and behavioral analysis to ensure legitimate customers always get through.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="border-b border-border pb-8">
              <h3 className="text-xl font-semibold mb-4">What forms does it work with?</h3>
              <p className="text-muted-foreground">
                LeadBouncer works with any HTML form including WordPress, Webflow, custom forms, and popular form builders. No matter what platform you use, we can protect it.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="border-b border-border pb-8">
              <h3 className="text-xl font-semibold mb-4">How fast is setup?</h3>
              <p className="text-muted-foreground">
                Setup takes just 5 minutes. Copy our code snippet, paste it into your forms, connect your CRM, and you're protected. Our team can help if you need assistance.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-4xl font-bold text-primary-foreground mb-6">
              Ready to Stop Wasting Time on Fake Leads?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join 500+ service businesses who've reclaimed their time and improved their lead quality with LeadBouncer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg"
                onClick={() => setLocation("/signup")}
              >
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white hover:bg-gray-100 text-primary border-white font-semibold text-lg"
                onClick={() => scrollToSection('demo')}
              >
                Book a Demo
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-blue-100">
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                No setup fees
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Cancel anytime
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                14-day free trial
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">LeadBouncer</h3>
              <p className="text-gray-300">
                Stop wasting time on fake leads. Protect your forms with AI-powered spam filtering.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LeadBouncer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
