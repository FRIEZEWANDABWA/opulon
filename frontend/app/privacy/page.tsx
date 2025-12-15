import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionBackground } from "@/components/section-background"
import { Shield, Lock, Eye, Users, FileText, AlertCircle } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <SectionBackground image="healthcare-29.jpg" overlay="dark" className="min-h-[70vh] flex items-center">
        <div className="container space-y-8 pb-16 pt-16 md:pb-24 md:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl text-white">
              Privacy Policy
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Your Privacy Matters
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-200 sm:text-xl">
              Learn how we protect your personal information and maintain the highest 
              standards of data security in healthcare.
            </p>
          </div>
        </div>
      </SectionBackground>

      {/* Privacy Overview */}
      <SectionBackground image="healthcare-30.jpg" overlay="light">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Our Commitment to Privacy
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Effective Date: January 1, 2025 | Last Updated: January 1, 2025
              </p>
            </div>

            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 mb-8">
              <CardContent className="p-8">
                <p className="text-lg leading-relaxed">
                  At Opulon, we are committed to protecting your privacy and maintaining the confidentiality 
                  of your personal and health information. This Privacy Policy explains how we collect, use, 
                  disclose, and safeguard your information when you use our healthcare distribution platform 
                  and services.
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-8 md:grid-cols-3 mb-12">
              <Card className="text-center backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <Shield className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle>HIPAA Compliant</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Full compliance with healthcare privacy regulations and industry standards.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <Lock className="mx-auto h-12 w-12 text-green-600 mb-4" />
                  <CardTitle>Secure Encryption</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Advanced encryption protects your data both in transit and at rest.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <Eye className="mx-auto h-12 w-12 text-purple-600 mb-4" />
                  <CardTitle>Transparent Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Clear information about how we collect, use, and protect your data.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SectionBackground>

      {/* Information Collection */}
      <SectionBackground image="healthcare-31.jpg" overlay="blue">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-white mb-8">Information We Collect</h2>
            
            <div className="space-y-6">
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Name, address, phone number, and email address</li>
                    <li>• Professional credentials and license information</li>
                    <li>• Payment and billing information</li>
                    <li>• Account preferences and settings</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    Health Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Prescription information and medication history</li>
                    <li>• Healthcare provider information</li>
                    <li>• Insurance and coverage details</li>
                    <li>• Medical device and supply orders</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-purple-600" />
                    Usage Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Website and platform usage data</li>
                    <li>• Order history and transaction records</li>
                    <li>• Communication preferences</li>
                    <li>• Device and browser information</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SectionBackground>

      {/* How We Use Information */}
      <SectionBackground image="healthcare-32.jpg" overlay="green">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-white mb-8">How We Use Your Information</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle>Service Delivery</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Process and fulfill your orders</li>
                    <li>• Provide customer support</li>
                    <li>• Manage your account</li>
                    <li>• Send order confirmations and updates</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle>Healthcare Operations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Verify prescriptions and credentials</li>
                    <li>• Ensure regulatory compliance</li>
                    <li>• Coordinate with healthcare providers</li>
                    <li>• Maintain medication safety records</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle>Business Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Analyze usage patterns</li>
                    <li>• Improve our services</li>
                    <li>• Develop new features</li>
                    <li>• Conduct research and analytics</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle>Legal Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Meet regulatory requirements</li>
                    <li>• Respond to legal requests</li>
                    <li>• Prevent fraud and abuse</li>
                    <li>• Maintain audit trails</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SectionBackground>

      {/* Data Protection */}
      <SectionBackground image="healthcare-33.jpg" overlay="purple">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-white mb-8">Data Protection & Security</h2>
            
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 mb-8">
              <CardContent className="p-8">
                <p className="text-lg leading-relaxed mb-6">
                  We implement comprehensive security measures to protect your information:
                </p>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-3">Technical Safeguards</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• 256-bit SSL encryption</li>
                      <li>• Multi-factor authentication</li>
                      <li>• Regular security audits</li>
                      <li>• Intrusion detection systems</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Administrative Safeguards</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Employee training programs</li>
                      <li>• Access controls and permissions</li>
                      <li>• Incident response procedures</li>
                      <li>• Regular compliance reviews</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionBackground>

      {/* Your Rights */}
      <SectionBackground image="healthcare-34.jpg" overlay="orange">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-white mb-8">Your Privacy Rights</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle>Access & Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Access your personal information</li>
                    <li>• Request corrections or updates</li>
                    <li>• Download your data</li>
                    <li>• Delete your account</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle>Communication Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Opt out of marketing communications</li>
                    <li>• Choose notification preferences</li>
                    <li>• Manage cookie settings</li>
                    <li>• Control data sharing</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 mt-8">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-4">Questions About Your Privacy?</h3>
                <p className="text-muted-foreground mb-6">
                  Contact our Privacy Officer for any questions or concerns about your personal information.
                </p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> privacy@opulon.com</p>
                  <p><strong>Phone:</strong> 1-800-PRIVACY</p>
                  <p><strong>Mail:</strong> Privacy Officer, Opulon, 6555 State Hwy 161, Irving, TX 75039</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionBackground>
    </div>
  )
}