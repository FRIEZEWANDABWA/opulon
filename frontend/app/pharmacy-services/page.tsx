import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionBackground } from "@/components/section-background"
import { 
  Building2, Pill, Users, Shield, TrendingUp, Clock,
  ArrowRight, CheckCircle, Heart, Award, Zap, Globe
} from "lucide-react"

export default function PharmacyServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <SectionBackground image="cta.png" overlay="dark" className="min-h-[70vh] flex items-center">
        <div className="container space-y-8 pb-16 pt-16 md:pb-24 md:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl text-white drop-shadow-lg">
              Comprehensive
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                Pharmacy Services
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-100 sm:text-xl drop-shadow-md">
              Empowering pharmacies with innovative solutions, technology platforms, 
              and support services that enhance patient care and operational efficiency.
            </p>
          </div>
        </div>
      </SectionBackground>

      {/* Service Categories */}
      <SectionBackground image="Healthcare Technology3.png" overlay="light">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl drop-shadow-sm">
              Complete Pharmacy Solutions Portfolio
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From retail to specialty pharmacy, we provide comprehensive solutions 
              that help pharmacies thrive in today's healthcare landscape
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Retail Pharmacy */}
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border border-white/20 dark:border-gray-700/50">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="rounded-lg bg-white/20 p-3">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Retail Pharmacy Solutions</h3>
                    <p className="opacity-90">Independent & chain pharmacy support</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Comprehensive support for independent and chain pharmacies including 
                    inventory management, prescription processing, and patient care programs.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Automated inventory management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Prescription workflow optimization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Patient adherence programs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Clinical support services</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Specialty Pharmacy */}
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border border-white/20 dark:border-gray-700/50">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="rounded-lg bg-white/20 p-3">
                    <Pill className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Specialty Pharmacy</h3>
                    <p className="opacity-90">Complex medication management</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Specialized services for complex medications including biologics, 
                    oncology drugs, and rare disease treatments with comprehensive patient support.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Specialty drug distribution</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Patient support programs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Clinical monitoring services</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Reimbursement support</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Institutional Pharmacy */}
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border border-white/20 dark:border-gray-700/50">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="rounded-lg bg-white/20 p-3">
                    <Shield className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Institutional Pharmacy</h3>
                    <p className="opacity-90">Hospital & health system solutions</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Complete pharmacy solutions for hospitals and health systems including 
                    sterile compounding, medication management, and clinical services.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Sterile compounding services</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Medication therapy management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Clinical decision support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Regulatory compliance</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Technology Solutions */}
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border border-white/20 dark:border-gray-700/50">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="rounded-lg bg-white/20 p-3">
                    <Zap className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Pharmacy Technology</h3>
                    <p className="opacity-90">Digital transformation platforms</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Advanced technology platforms including pharmacy management systems, 
                    automation solutions, and data analytics for operational excellence.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Pharmacy management systems</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Automation & robotics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Data analytics & insights</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Mobile applications</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionBackground>

      {/* Key Benefits */}
      <SectionBackground image="Healthcare Technology1.webp" overlay="purple">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl text-white drop-shadow-lg">
              Why Pharmacies Choose Opulon
            </h2>
            <p className="mt-4 text-lg text-gray-100 drop-shadow-md">
              Delivering measurable value through innovation, reliability, and comprehensive support
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border border-white/20 dark:border-gray-700/50">
              <CardHeader>
                <TrendingUp className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Improved Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Streamlined workflows and automation reduce operational 
                  costs while improving prescription processing speed.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border border-white/20 dark:border-gray-700/50">
              <CardHeader>
                <Heart className="mx-auto h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Enhanced Patient Care</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Clinical support services and patient programs improve 
                  medication adherence and health outcomes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border border-white/20 dark:border-gray-700/50">
              <CardHeader>
                <Shield className="mx-auto h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Regulatory Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Comprehensive compliance support ensures adherence 
                  to all regulatory requirements and industry standards.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border border-white/20 dark:border-gray-700/50">
              <CardHeader>
                <Clock className="mx-auto h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>24/7 Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Round-the-clock technical support and customer service 
                  ensure uninterrupted pharmacy operations.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionBackground>

      {/* Success Metrics */}
      <SectionBackground image="cta page.jpg" overlay="green">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl text-white drop-shadow-lg">
              Proven Results for Pharmacy Partners
            </h2>
            <p className="mt-4 text-lg text-gray-100 drop-shadow-md">
              Our pharmacy solutions deliver measurable improvements in efficiency and patient outcomes
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center backdrop-blur-md bg-white/20 dark:bg-gray-900/20 rounded-lg p-6 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">25,000+</div>
              <div className="text-gray-100 drop-shadow-md">Pharmacies Served</div>
            </div>
            <div className="text-center backdrop-blur-md bg-white/20 dark:bg-gray-900/20 rounded-lg p-6 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">98%</div>
              <div className="text-gray-100 drop-shadow-md">Customer Satisfaction</div>
            </div>
            <div className="text-center backdrop-blur-md bg-white/20 dark:bg-gray-900/20 rounded-lg p-6 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">30%</div>
              <div className="text-gray-100 drop-shadow-md">Efficiency Improvement</div>
            </div>
            <div className="text-center backdrop-blur-md bg-white/20 dark:bg-gray-900/20 rounded-lg p-6 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">15%</div>
              <div className="text-gray-100 drop-shadow-md">Cost Reduction</div>
            </div>
          </div>
        </div>
      </SectionBackground>

      {/* CTA Section */}
      <SectionBackground image="18.jpg" overlay="dark">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl mb-6 text-white drop-shadow-lg">
              Transform Your Pharmacy Operations
            </h2>
            <p className="text-xl mb-8 text-gray-100 drop-shadow-md">
              Partner with Opulon to enhance patient care, improve efficiency, 
              and grow your pharmacy business with our comprehensive solutions.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
              <Link href="/contact">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <Users className="mr-2 h-5 w-5" />
                  Contact Pharmacy Experts
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                  Request Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </SectionBackground>
    </div>
  )
}