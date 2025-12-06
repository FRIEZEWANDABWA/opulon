import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Building2, Pill, Users, Shield, TrendingUp, Clock,
  ArrowRight, CheckCircle, Heart, Award, Zap, Globe
} from "lucide-react"

export default function PharmacyServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container space-y-8 pb-16 pt-16 md:pb-24 md:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
              Comprehensive
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Pharmacy Services
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Empowering pharmacies with innovative solutions, technology platforms, 
              and support services that enhance patient care and operational efficiency.
            </p>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Complete Pharmacy Solutions Portfolio
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From retail to specialty pharmacy, we provide comprehensive solutions 
            that help pharmacies thrive in today's healthcare landscape
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Retail Pharmacy */}
          <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
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
          <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
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
          <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
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
          <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
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
      </section>

      {/* Key Benefits */}
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Why Pharmacies Choose Opulon
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Delivering measurable value through innovation, reliability, and comprehensive support
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center">
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

            <Card className="text-center">
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

            <Card className="text-center">
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

            <Card className="text-center">
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
      </section>

      {/* Success Metrics */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Proven Results for Pharmacy Partners
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our pharmacy solutions deliver measurable improvements in efficiency and patient outcomes
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">25,000+</div>
            <div className="text-muted-foreground">Pharmacies Served</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
            <div className="text-muted-foreground">Customer Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">30%</div>
            <div className="text-muted-foreground">Efficiency Improvement</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">15%</div>
            <div className="text-muted-foreground">Cost Reduction</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl mb-6">
              Transform Your Pharmacy Operations
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Partner with Opulon to enhance patient care, improve efficiency, 
              and grow your pharmacy business with our comprehensive solutions.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                  <Users className="mr-2 h-5 w-5" />
                  Contact Pharmacy Experts
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  Request Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}