import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionBackground } from "@/components/section-background"
import { 
  Building2, Pill, Stethoscope, Users, Shield, TrendingUp,
  ArrowRight, CheckCircle, Globe, Heart, Award, Zap
} from "lucide-react"

export default function BusinessSolutionsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <SectionBackground image="20.jpeg" overlay="dark" className="min-h-[70vh] flex items-center">
        <div className="container space-y-8 pb-16 pt-16 md:pb-24 md:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl text-white drop-shadow-lg">
              Comprehensive Healthcare
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent drop-shadow-lg">
                Business Solutions
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-100 sm:text-xl drop-shadow-md">
              Empowering healthcare organizations with innovative distribution, technology, 
              and support solutions that improve patient outcomes and operational efficiency.
            </p>
          </div>
        </div>
      </SectionBackground>

      {/* Main Solutions Grid */}
      <SectionBackground image="17.jpeg" overlay="light">
        <div className="container py-16 md:py-24">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Pharmaceutical Distribution */}
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border border-white/20 dark:border-gray-700/50">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="rounded-lg bg-white/20 p-3">
                    <Pill className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Pharmaceutical Distribution</h3>
                    <p className="opacity-90">Complete supply chain solutions</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Comprehensive pharmaceutical distribution services including specialty medications, 
                    generics, biosimilars, and controlled substances with advanced cold chain management.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Temperature-controlled logistics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Specialty drug programs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Regulatory compliance</span>
                    </li>
                  </ul>
                  <Link href="/pharmaceutical-distribution">
                    <Button className="mt-4 w-full">
                      Explore Solutions <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Medical-Surgical */}
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border border-white/20 dark:border-gray-700/50">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="rounded-lg bg-white/20 p-3">
                    <Stethoscope className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Medical-Surgical</h3>
                    <p className="opacity-90">Advanced medical equipment & supplies</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Complete medical-surgical distribution including surgical instruments, 
                    diagnostic equipment, consumables, and innovative healthcare technologies.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Surgical instruments & equipment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Diagnostic solutions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Custom procedure kits</span>
                    </li>
                  </ul>
                  <Link href="/products?category=medical-supplies">
                    <Button className="mt-4 w-full bg-green-600 hover:bg-green-700">
                      Explore Solutions <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Pharmacy Services */}
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border border-white/20 dark:border-gray-700/50">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="rounded-lg bg-white/20 p-3">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Pharmacy Services</h3>
                    <p className="opacity-90">Comprehensive pharmacy solutions</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    End-to-end pharmacy solutions including retail, institutional, and specialty 
                    pharmacy services with advanced technology platforms.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Retail pharmacy support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Institutional pharmacy</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Specialty pharmacy programs</span>
                    </li>
                  </ul>
                  <Link href="/pharmacy-services">
                    <Button className="mt-4 w-full bg-purple-600 hover:bg-purple-700">
                      Explore Solutions <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Healthcare Technology */}
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border border-white/20 dark:border-gray-700/50">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="rounded-lg bg-white/20 p-3">
                    <Zap className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Healthcare Technology</h3>
                    <p className="opacity-90">Digital transformation solutions</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Innovative healthcare technology solutions including AI-powered analytics, 
                    automation platforms, and digital health tools.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">AI-powered analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Automation platforms</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Digital health tools</span>
                    </li>
                  </ul>
                  <Link href="/products?category=equipment">
                    <Button className="mt-4 w-full bg-orange-600 hover:bg-orange-700">
                      Explore Solutions <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionBackground>

      {/* Value Propositions */}
      <SectionBackground image="Healthcare Technology3.png" overlay="blue">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl text-white drop-shadow-lg">
              Why Choose Opulon for Your Healthcare Business
            </h2>
            <p className="mt-4 text-lg text-gray-100 drop-shadow-md">
              Delivering measurable value through innovation, expertise, and partnership
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="text-center backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border border-white/20 dark:border-gray-700/50">
              <CardHeader>
                <Shield className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Proven Reliability</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  99.9% order accuracy with comprehensive quality assurance 
                  and regulatory compliance across all operations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border border-white/20 dark:border-gray-700/50">
              <CardHeader>
                <TrendingUp className="mx-auto h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Operational Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Advanced analytics and automation to optimize inventory, 
                  reduce costs, and improve operational efficiency.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border border-white/20 dark:border-gray-700/50">
              <CardHeader>
                <Heart className="mx-auto h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Patient-Focused</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Solutions designed to improve patient access, adherence, 
                  and outcomes across the entire care continuum.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionBackground>

      {/* CTA Section */}
      <SectionBackground image="19.jpeg" overlay="dark">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl mb-6 text-white drop-shadow-lg">
              Ready to Optimize Your Healthcare Operations?
            </h2>
            <p className="text-lg text-gray-100 mb-8 drop-shadow-md">
              Connect with our healthcare experts to discover how Opulon can transform 
              your business with tailored solutions and proven results.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
              <Link href="/contact">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Users className="mr-2 h-5 w-5" />
                  Contact Our Experts
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                  Request a Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </SectionBackground>
    </div>
  )
}