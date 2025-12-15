import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionBackground } from "@/components/section-background"
import { FileText, Scale, Shield, AlertTriangle, CheckCircle, Users } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <SectionBackground image="healthcare-35.jpg" overlay="dark" className="min-h-[70vh] flex items-center">
        <div className="container space-y-8 pb-16 pt-16 md:pb-24 md:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl text-white">
              Terms of Service
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Clear & Fair Terms
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-200 sm:text-xl">
              Understand the terms and conditions that govern your use of Opulon's 
              healthcare distribution platform and services.
            </p>
          </div>
        </div>
      </SectionBackground>

      {/* Terms Overview */}
      <SectionBackground image="healthcare-36.jpg" overlay="light">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Terms & Conditions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Effective Date: January 1, 2025 | Last Updated: January 1, 2025
              </p>
            </div>

            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 mb-8">
              <CardContent className="p-8">
                <p className="text-lg leading-relaxed">
                  These Terms of Service ("Terms") govern your access to and use of Opulon's healthcare 
                  distribution platform, website, and related services. By accessing or using our services, 
                  you agree to be bound by these Terms and our Privacy Policy.
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-8 md:grid-cols-3 mb-12">
              <Card className="text-center backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <Scale className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle>Fair & Transparent</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Clear terms that protect both parties and ensure fair business practices.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <Shield className="mx-auto h-12 w-12 text-green-600 mb-4" />
                  <CardTitle>Regulatory Compliant</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Full compliance with healthcare regulations and industry standards.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <Users className="mx-auto h-12 w-12 text-purple-600 mb-4" />
                  <CardTitle>User Protection</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Terms designed to protect user rights and ensure service quality.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SectionBackground>

      {/* Account Terms */}
      <SectionBackground image="healthcare-1.jpg" overlay="blue">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-white mb-8">Account & Registration</h2>
            
            <div className="space-y-6">
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Account Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Must be 18 years or older to create an account</li>
                    <li>• Valid healthcare professional license required for prescription products</li>
                    <li>• Accurate and complete registration information required</li>
                    <li>• Responsible for maintaining account security and confidentiality</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Acceptable Use
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Use services only for legitimate healthcare purposes</li>
                    <li>• Comply with all applicable laws and regulations</li>
                    <li>• Respect intellectual property rights</li>
                    <li>• Do not attempt to circumvent security measures</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Prohibited Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Resale or distribution without proper licensing</li>
                    <li>• Fraudulent or deceptive practices</li>
                    <li>• Violation of prescription drug regulations</li>
                    <li>• Interference with platform operations</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SectionBackground>

      {/* Orders & Payment */}
      <SectionBackground image="healthcare-2.jpg" overlay="green">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-white mb-8">Orders, Payment & Delivery</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle>Order Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Orders subject to verification and approval</li>
                    <li>• Prescription validation required for Rx products</li>
                    <li>• Right to refuse or cancel orders</li>
                    <li>• Inventory availability not guaranteed</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle>Payment Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Payment due upon order placement</li>
                    <li>• Credit terms available for qualified customers</li>
                    <li>• Late payment fees may apply</li>
                    <li>• Disputed charges must be reported within 30 days</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle>Shipping & Delivery</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Delivery times are estimates, not guarantees</li>
                    <li>• Risk of loss transfers upon delivery</li>
                    <li>• Special handling fees may apply</li>
                    <li>• Signature required for certain products</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle>Returns & Refunds</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Returns subject to approval and conditions</li>
                    <li>• Prescription products generally non-returnable</li>
                    <li>• Restocking fees may apply</li>
                    <li>• Refunds processed within 5-10 business days</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SectionBackground>

      {/* Liability & Warranties */}
      <SectionBackground image="healthcare-3.jpg" overlay="purple">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-white mb-8">Warranties & Liability</h2>
            
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 mb-8">
              <CardContent className="p-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-4">Product Warranties</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Products sold with manufacturer warranties</li>
                      <li>• Quality assurance for all products</li>
                      <li>• Proper storage and handling guaranteed</li>
                      <li>• Defective products will be replaced</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Service Warranties</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Professional service standards</li>
                      <li>• Regulatory compliance assurance</li>
                      <li>• Timely order processing</li>
                      <li>• Customer support availability</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Limitation of Liability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  Opulon's liability is limited to the purchase price of products or services. 
                  We are not liable for indirect, incidental, or consequential damages. 
                  Healthcare professionals are responsible for proper use and administration 
                  of all products and services.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionBackground>

      {/* Contact & Updates */}
      <SectionBackground image="healthcare-4.jpg" overlay="orange">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-white mb-8">Updates & Contact</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle>Terms Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Terms may be updated periodically</li>
                    <li>• Users will be notified of material changes</li>
                    <li>• Continued use constitutes acceptance</li>
                    <li>• Check for updates regularly</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle>Governing Law</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Governed by Texas state law</li>
                    <li>• Federal healthcare regulations apply</li>
                    <li>• Disputes resolved through arbitration</li>
                    <li>• Venue in Dallas County, Texas</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 mt-8">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-4">Questions About These Terms?</h3>
                <p className="text-muted-foreground mb-6">
                  Contact our Legal Department for any questions about these Terms of Service.
                </p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> legal@opulon.com</p>
                  <p><strong>Phone:</strong> 1-800-OPULON-1</p>
                  <p><strong>Mail:</strong> Legal Department, Opulon, 6555 State Hwy 161, Irving, TX 75039</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionBackground>
    </div>
  )
}