import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionBackground } from "@/components/section-background"
import { 
  Search, MessageCircle, Phone, Mail, FileText, 
  ShoppingCart, Package, CreditCard, Users, ArrowRight
} from "lucide-react"

export default function HelpPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <SectionBackground image="healthcare-20.jpg" overlay="dark" className="min-h-[70vh] flex items-center">
        <div className="container space-y-8 pb-16 pt-16 md:pb-24 md:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl text-white">
              Help Center
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                We're Here to Help
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-200 sm:text-xl">
              Find answers to your questions, get support, and learn how to make the most 
              of your Opulon healthcare solutions.
            </p>
          </div>
        </div>
      </SectionBackground>

      {/* Quick Help Options */}
      <SectionBackground image="healthcare-21.jpg" overlay="light">
        <div className="container py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center hover:shadow-lg transition-shadow backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              <CardHeader>
                <div className="mx-auto mb-4 rounded-full bg-blue-100 p-4 dark:bg-blue-900">
                  <ShoppingCart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">Order Help</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Get assistance with placing orders, tracking shipments, and managing your account.
                </CardDescription>
                <Button variant="outline" className="w-full">
                  Order Support
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              <CardHeader>
                <div className="mx-auto mb-4 rounded-full bg-green-100 p-4 dark:bg-green-900">
                  <Package className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg">Product Info</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Learn about our pharmaceutical products, medical supplies, and equipment.
                </CardDescription>
                <Button variant="outline" className="w-full">
                  Product Guide
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              <CardHeader>
                <div className="mx-auto mb-4 rounded-full bg-purple-100 p-4 dark:bg-purple-900">
                  <CreditCard className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg">Billing & Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Manage your payment methods, view invoices, and resolve billing issues.
                </CardDescription>
                <Button variant="outline" className="w-full">
                  Billing Help
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              <CardHeader>
                <div className="mx-auto mb-4 rounded-full bg-orange-100 p-4 dark:bg-orange-900">
                  <Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-lg">Account Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Update your profile, manage preferences, and secure your account.
                </CardDescription>
                <Button variant="outline" className="w-full">
                  Account Help
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionBackground>

      {/* FAQ Section */}
      <SectionBackground image="healthcare-22.jpg" overlay="blue">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold sm:text-4xl text-white mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-200">
                Quick answers to common questions about our healthcare solutions
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle className="text-lg">How do I place an order?</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Browse our products, add items to your cart, and proceed to checkout. 
                    You'll need to create an account or log in to complete your purchase.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle className="text-lg">What are your shipping options?</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    We offer standard, expedited, and overnight shipping. Temperature-controlled 
                    shipping is available for specialty pharmaceuticals.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle className="text-lg">How can I track my order?</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Once your order ships, you'll receive a tracking number via email. 
                    You can also track orders in your account dashboard.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    We accept major credit cards, ACH transfers, and purchase orders 
                    for qualified healthcare organizations.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SectionBackground>

      {/* Contact Support */}
      <SectionBackground image="healthcare-23.jpg" overlay="green">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl text-white mb-6">
              Still Need Help?
            </h2>
            <p className="text-lg text-gray-200 mb-8">
              Our healthcare experts are available 24/7 to assist you
            </p>
            
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="text-center backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <Phone className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle>Call Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Speak with a support specialist
                  </p>
                  <p className="font-medium">1-800-SUPPORT</p>
                  <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
                    Call Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <MessageCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
                  <CardTitle>Live Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get instant help via chat
                  </p>
                  <p className="font-medium">Available 24/7</p>
                  <Button className="mt-4 w-full bg-green-600 hover:bg-green-700">
                    Start Chat
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <Mail className="mx-auto h-12 w-12 text-purple-600 mb-4" />
                  <CardTitle>Email Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Send us a detailed message
                  </p>
                  <p className="font-medium">support@opulon.com</p>
                  <Link href="/contact">
                    <Button className="mt-4 w-full bg-purple-600 hover:bg-purple-700">
                      Send Email
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SectionBackground>
    </div>
  )
}