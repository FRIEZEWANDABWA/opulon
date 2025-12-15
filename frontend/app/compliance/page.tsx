import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionBackground } from "@/components/section-background"
import { 
  Shield, Award, FileCheck, Lock, 
  CheckCircle, AlertTriangle, Globe, Users 
} from "lucide-react"

export default function CompliancePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <SectionBackground image="healthcare-5.jpg" overlay="dark" className="min-h-[70vh] flex items-center">
        <div className="container space-y-8 pb-16 pt-16 md:pb-24 md:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl text-white">
              Regulatory Compliance
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Highest Standards
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-200 sm:text-xl">
              Opulon maintains the highest standards of regulatory compliance across all 
              healthcare distribution operations and services.
            </p>
          </div>
        </div>
      </SectionBackground>

      {/* Compliance Overview */}
      <SectionBackground image="healthcare-6.jpg" overlay="light">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Comprehensive Compliance Program
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Ensuring adherence to all healthcare regulations and industry standards
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
              <Card className="text-center backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <Shield className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle className="text-lg">FDA Compliant</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Full compliance with FDA regulations for pharmaceutical distribution.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <Lock className="mx-auto h-12 w-12 text-green-600 mb-4" />
                  <CardTitle className="text-lg">HIPAA Secure</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Complete HIPAA compliance for protected health information.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <Award className="mx-auto h-12 w-12 text-purple-600 mb-4" />
                  <CardTitle className="text-lg">DEA Licensed</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Licensed for controlled substance distribution and handling.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <FileCheck className="mx-auto h-12 w-12 text-orange-600 mb-4" />
                  <CardTitle className="text-lg">ISO Certified</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    ISO 9001 and ISO 13485 certified quality management systems.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SectionBackground>

      {/* Regulatory Framework */}
      <SectionBackground image="healthcare-7.jpg" overlay="blue">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-white mb-8">Regulatory Framework</h2>
            
            <div className="space-y-6">
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    FDA Regulations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">Drug Supply Chain Security Act (DSCSA)</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Product tracing and verification</li>
                        <li>• Serialization compliance</li>
                        <li>• Suspect product investigations</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Good Distribution Practices (GDP)</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Temperature-controlled storage</li>
                        <li>• Chain of custody documentation</li>
                        <li>• Quality assurance protocols</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-green-600" />
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">HIPAA Compliance</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Protected health information security</li>
                        <li>• Business associate agreements</li>
                        <li>• Breach notification procedures</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Data Protection</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Encryption and access controls</li>
                        <li>• Regular security assessments</li>
                        <li>• Employee training programs</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    Controlled Substances
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">DEA Compliance</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Schedule II-V drug handling</li>
                        <li>• Secure storage requirements</li>
                        <li>• Inventory tracking and reporting</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Anti-Diversion Programs</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Suspicious order monitoring</li>
                        <li>• Customer due diligence</li>
                        <li>• Reporting and investigation</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SectionBackground>

      {/* Quality Management */}
      <SectionBackground image="healthcare-8.jpg" overlay="green">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-white mb-8">Quality Management System</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle>ISO Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">ISO 9001:2015</h4>
                        <p className="text-sm text-muted-foreground">Quality Management Systems</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">ISO 13485:2016</h4>
                        <p className="text-sm text-muted-foreground">Medical Devices Quality Management</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">ISO 27001:2013</h4>
                        <p className="text-sm text-muted-foreground">Information Security Management</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle>Audit & Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Regular internal audits</li>
                    <li>• Third-party compliance assessments</li>
                    <li>• Continuous monitoring systems</li>
                    <li>• Corrective and preventive actions</li>
                    <li>• Management review processes</li>
                    <li>• Risk assessment and mitigation</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle>Training & Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Comprehensive employee training</li>
                    <li>• Regular compliance updates</li>
                    <li>• Certification programs</li>
                    <li>• Industry best practices</li>
                    <li>• Regulatory change management</li>
                    <li>• Performance monitoring</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle>Documentation Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Standard operating procedures</li>
                    <li>• Document version control</li>
                    <li>• Record retention policies</li>
                    <li>• Electronic signature systems</li>
                    <li>• Audit trail maintenance</li>
                    <li>• Regulatory submission support</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SectionBackground>

      {/* Global Compliance */}
      <SectionBackground image="healthcare-9.jpg" overlay="purple">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-white mb-8">International Compliance</h2>
            
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 mb-8">
              <CardContent className="p-8">
                <div className="grid gap-8 md:grid-cols-3">
                  <div className="text-center">
                    <Globe className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="font-semibold mb-2">European Union</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• GDP Guidelines</li>
                      <li>• GDPR Compliance</li>
                      <li>• MDR Regulations</li>
                    </ul>
                  </div>
                  
                  <div className="text-center">
                    <Globe className="mx-auto h-12 w-12 text-green-600 mb-4" />
                    <h3 className="font-semibold mb-2">Canada</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Health Canada Regulations</li>
                      <li>• Good Manufacturing Practices</li>
                      <li>• PIPEDA Compliance</li>
                    </ul>
                  </div>
                  
                  <div className="text-center">
                    <Globe className="mx-auto h-12 w-12 text-purple-600 mb-4" />
                    <h3 className="font-semibold mb-2">Asia Pacific</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• TGA Regulations (Australia)</li>
                      <li>• PMDA Guidelines (Japan)</li>
                      <li>• HSA Requirements (Singapore)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionBackground>

      {/* Contact Compliance */}
      <SectionBackground image="healthcare-10.jpg" overlay="orange">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl font-bold mb-6">Compliance Questions?</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Our compliance team is available to answer questions about our regulatory 
                  programs and help ensure your organization meets all requirements.
                </p>
                
                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <h3 className="font-semibold mb-2">Compliance Officer</h3>
                    <p className="text-sm text-muted-foreground">
                      compliance@opulon.com<br />
                      1-800-COMPLY-1
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Quality Assurance</h3>
                    <p className="text-sm text-muted-foreground">
                      quality@opulon.com<br />
                      1-800-QUALITY-1
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Regulatory Affairs</h3>
                    <p className="text-sm text-muted-foreground">
                      regulatory@opulon.com<br />
                      1-800-REGULATE
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionBackground>
    </div>
  )
}