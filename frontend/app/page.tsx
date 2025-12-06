import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ShoppingBag, Shield, Truck, Clock, Building2, Users, 
  Stethoscope, Pill, Heart, Activity, Award, Globe,
  ArrowRight, CheckCircle, Star, TrendingUp
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container relative space-y-8 pb-16 pt-16 md:pb-24 md:pt-20 lg:pb-32 lg:pt-24">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              <Award className="h-4 w-4" />
              Trusted Healthcare Distribution Leader
            </div>
            <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
              Advancing Healthcare
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Through Innovation
              </span>
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Opulon delivers comprehensive pharmaceutical distribution, medical-surgical supplies, 
              and healthcare technology solutions to improve patient outcomes across the continuum of care.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Link href="/business-solutions">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Building2 className="mr-2 h-5 w-5" />
                  Business Solutions
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" size="lg">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Browse Products
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">50K+</div>
                <div className="text-sm text-muted-foreground">Healthcare Facilities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime Reliability</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-muted-foreground">Customer Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Solutions Section */}
      <section className="container space-y-12 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            Comprehensive Business Solutions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tailored healthcare distribution and technology solutions for every segment of the industry
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                  <Pill className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl">Pharmaceutical Distribution</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Comprehensive pharmaceutical supply chain solutions including specialty medications, 
                generics, and biosimilars with temperature-controlled logistics.
              </CardDescription>
              <Link href="/pharmaceutical-distribution" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                  <Stethoscope className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl">Medical-Surgical Supplies</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Complete medical-surgical distribution including surgical instruments, 
                diagnostic equipment, and consumable medical supplies.
              </CardDescription>
              <Link href="/medical-surgical" className="mt-4 inline-flex items-center text-green-600 hover:text-green-700">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                  <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">Retail Pharmacy Services</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                End-to-end pharmacy solutions including inventory management, 
                prescription processing, and patient care programs.
              </CardDescription>
              <Link href="/pharmacy-services" className="mt-4 inline-flex items-center text-purple-600 hover:text-purple-700">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Opulon */}
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="container space-y-12 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
              Why Healthcare Leaders Choose Opulon
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Delivering excellence through innovation, reliability, and comprehensive support
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center">
              <CardHeader>
                <Shield className="mx-auto h-12 w-12 text-blue-600" />
                <CardTitle className="text-lg">Quality & Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  FDA-compliant facilities with rigorous quality assurance and 
                  temperature-controlled storage and distribution.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="mx-auto h-12 w-12 text-green-600" />
                <CardTitle className="text-lg">Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Data-driven insights and predictive analytics to optimize 
                  inventory, reduce costs, and improve patient outcomes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Globe className="mx-auto h-12 w-12 text-purple-600" />
                <CardTitle className="text-lg">Global Network</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Extensive distribution network with strategic partnerships 
                  ensuring reliable supply chain management worldwide.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Heart className="mx-auto h-12 w-12 text-red-600" />
                <CardTitle className="text-lg">Patient-Centered</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Solutions designed to improve patient access, adherence, 
                  and health outcomes across all care settings.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Trusted by Healthcare Professionals Nationwide
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-muted-foreground">Healthcare Facilities Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">1M+</div>
              <div className="text-muted-foreground">Patients Reached Daily</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-muted-foreground">Order Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">150+</div>
              <div className="text-muted-foreground">Years Combined Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl mb-6">
              Ready to Transform Your Healthcare Operations?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of healthcare professionals who trust Opulon for their 
              pharmaceutical and medical supply needs.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Users className="mr-2 h-5 w-5" />
                  Get Started Today
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Contact Sales Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}