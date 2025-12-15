import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SectionBackground } from "@/components/section-background"
import { 
  Phone, Mail, MapPin, Clock, MessageSquare, 
  Building2, Users, Headphones, ArrowRight
} from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <SectionBackground image="healthcare-16.jpg" overlay="dark" className="min-h-[70vh] flex items-center">
        <div className="container space-y-8 pb-16 pt-16 md:pb-24 md:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl text-white">
              Get in Touch with
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Healthcare Experts
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-200 sm:text-xl">
              Connect with our team of healthcare distribution specialists to discover 
              how Opulon can transform your operations and improve patient outcomes.
            </p>
          </div>
        </div>
      </SectionBackground>

      {/* Contact Options */}
      <SectionBackground image="healthcare-17.jpg" overlay="light">
        <div className="container py-16 md:py-24">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Sales Contact */}
            <Card className="text-center hover:shadow-lg transition-shadow backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              <CardHeader>
                <div className="mx-auto mb-4 rounded-full bg-blue-100 p-4 dark:bg-blue-900">
                  <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl">Sales & Business Development</CardTitle>
                <CardDescription>
                  Explore business solutions and partnership opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>1-800-OPULON-1</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>sales@opulon.com</span>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Contact Sales Team
                </Button>
              </CardContent>
            </Card>

            {/* Customer Support */}
            <Card className="text-center hover:shadow-lg transition-shadow backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              <CardHeader>
                <div className="mx-auto mb-4 rounded-full bg-green-100 p-4 dark:bg-green-900">
                  <Headphones className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl">Customer Support</CardTitle>
                <CardDescription>
                  Get help with orders, products, and technical assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>1-800-SUPPORT</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>support@opulon.com</span>
                  </div>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Get Support
                </Button>
              </CardContent>
            </Card>

            {/* Partnership */}
            <Card className="text-center hover:shadow-lg transition-shadow backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              <CardHeader>
                <div className="mx-auto mb-4 rounded-full bg-purple-100 p-4 dark:bg-purple-900">
                  <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">Partnership Opportunities</CardTitle>
                <CardDescription>
                  Explore strategic partnerships and collaboration opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>1-800-PARTNER</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>partnerships@opulon.com</span>
                  </div>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Explore Partnerships
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionBackground>

      {/* Contact Form & Info */}
      <SectionBackground image="healthcare-18.jpg" overlay="blue">
        <div className="container py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">Send Us a Message</h2>
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardContent className="p-6">
                  <form className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">First Name</label>
                        <Input placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <Input placeholder="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input type="email" placeholder="john.doe@company.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company</label>
                      <Input placeholder="Your Healthcare Organization" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <Input placeholder="+1 (555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject</label>
                      <Input placeholder="How can we help you?" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <textarea 
                        className="w-full min-h-[120px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                        placeholder="Tell us about your healthcare distribution needs..."
                      />
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-white">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 backdrop-blur-sm bg-white/20 dark:bg-gray-900/20 rounded-lg p-4">
                    <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                      <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Headquarters</h3>
                      <p className="text-gray-200">
                        6555 State Hwy 161<br />
                        Irving, TX 75039<br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 backdrop-blur-sm bg-white/20 dark:bg-gray-900/20 rounded-lg p-4">
                    <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                      <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Phone Support</h3>
                      <p className="text-gray-200">
                        Sales: 1-800-OPULON-1<br />
                        Support: 1-800-SUPPORT<br />
                        International: +1-469-335-8000
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 backdrop-blur-sm bg-white/20 dark:bg-gray-900/20 rounded-lg p-4">
                    <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                      <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Business Hours</h3>
                      <p className="text-gray-200">
                        Monday - Friday: 8:00 AM - 6:00 PM CST<br />
                        Saturday: 9:00 AM - 2:00 PM CST<br />
                        Emergency Support: 24/7
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle>Quick Access</CardTitle>
                  <CardDescription>
                    Fast track to common resources and services
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Customer Portal Login
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Order Status & Tracking
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Technical Documentation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Request Product Catalog
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SectionBackground>

      {/* Regional Offices */}
      <SectionBackground image="healthcare-19.jpg" overlay="green">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl text-white">
              Global Presence, Local Service
            </h2>
            <p className="mt-4 text-lg text-gray-200">
              With distribution centers and offices worldwide, we're always close to our customers
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              <CardHeader>
                <CardTitle className="text-lg">North America</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  25+ Distribution Centers
                </p>
                <p className="text-xs text-muted-foreground">
                  USA, Canada, Mexico
                </p>
              </CardContent>
            </Card>

            <Card className="text-center backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              <CardHeader>
                <CardTitle className="text-lg">Europe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  15+ Distribution Centers
                </p>
                <p className="text-xs text-muted-foreground">
                  UK, Germany, France, Netherlands
                </p>
              </CardContent>
            </Card>

            <Card className="text-center backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              <CardHeader>
                <CardTitle className="text-lg">Asia Pacific</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  10+ Distribution Centers
                </p>
                <p className="text-xs text-muted-foreground">
                  Australia, Japan, Singapore
                </p>
              </CardContent>
            </Card>

            <Card className="text-center backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              <CardHeader>
                <CardTitle className="text-lg">Latin America</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  8+ Distribution Centers
                </p>
                <p className="text-xs text-muted-foreground">
                  Brazil, Argentina, Chile
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionBackground>
    </div>
  )
}