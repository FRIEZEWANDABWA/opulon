import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, Award, Globe, Heart, Shield, TrendingUp, 
  Building2, Target, Eye, Lightbulb, ArrowRight
} from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container space-y-8 pb-16 pt-16 md:pb-24 md:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
              Advancing Healthcare
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Through Partnership
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              For over a century, Opulon has been at the forefront of healthcare innovation, 
              connecting pharmaceutical manufacturers, healthcare providers, and patients 
              through comprehensive distribution and technology solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="container py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-3">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 rounded-full bg-blue-100 p-4 dark:bg-blue-900">
                <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                To improve lives and advance health outcomes by delivering pharmaceutical 
                and healthcare products, services, and solutions to communities across the globe.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 rounded-full bg-green-100 p-4 dark:bg-green-900">
                <Eye className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                To be the most trusted partner in healthcare, enabling better health outcomes 
                through innovative distribution, technology, and care solutions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 rounded-full bg-purple-100 p-4 dark:bg-purple-900">
                <Heart className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-2xl">Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Integrity, innovation, and collaboration guide everything we do as we work 
                to improve patient outcomes and advance the future of healthcare.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Company Overview */}
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold sm:text-4xl mb-6">
                Leading Healthcare Distribution & Technology
              </h2>
              <p className="text-lg text-muted-foreground">
                Opulon is a Fortune 10 company that partners with pharmaceutical manufacturers, 
                providers, pharmacies, governments, and other organizations to deliver insights, 
                products, and services that make quality care more accessible and affordable.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">What We Do</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 p-1 dark:bg-blue-900">
                      <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Pharmaceutical Distribution</h4>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive supply chain solutions for pharmaceuticals, 
                        specialty medications, and biosimilars.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-100 p-1 dark:bg-green-900">
                      <Building2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Medical-Surgical Solutions</h4>
                      <p className="text-sm text-muted-foreground">
                        Medical equipment, surgical supplies, and healthcare 
                        technology solutions for providers.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-purple-100 p-1 dark:bg-purple-900">
                      <Lightbulb className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Healthcare Technology</h4>
                      <p className="text-sm text-muted-foreground">
                        Innovative technology platforms and data analytics 
                        to improve healthcare outcomes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">Our Impact</h3>
                <div className="grid gap-4">
                  <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
                    <div className="text-2xl font-bold text-blue-600">50,000+</div>
                    <div className="text-sm text-muted-foreground">Healthcare facilities served</div>
                  </div>
                  <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
                    <div className="text-2xl font-bold text-green-600">1M+</div>
                    <div className="text-sm text-muted-foreground">Patients reached daily</div>
                  </div>
                  <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
                    <div className="text-2xl font-bold text-purple-600">99.9%</div>
                    <div className="text-sm text-muted-foreground">Order accuracy rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Principles */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <h2 className="text-3xl font-bold sm:text-4xl mb-6">
            Our Leadership Principles
          </h2>
          <p className="text-lg text-muted-foreground">
            These principles guide our decisions and actions as we work to advance healthcare
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="text-center">
            <CardHeader>
              <Shield className="mx-auto h-10 w-10 text-blue-600 mb-2" />
              <CardTitle className="text-lg">Integrity First</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                We conduct business with the highest ethical standards 
                and transparency in all our interactions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="mx-auto h-10 w-10 text-green-600 mb-2" />
              <CardTitle className="text-lg">Customer Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                We prioritize our customers' needs and work tirelessly 
                to exceed their expectations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Lightbulb className="mx-auto h-10 w-10 text-purple-600 mb-2" />
              <CardTitle className="text-lg">Innovation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                We embrace new ideas and technologies to continuously 
                improve healthcare delivery.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="mx-auto h-10 w-10 text-orange-600 mb-2" />
              <CardTitle className="text-lg">Excellence</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                We strive for operational excellence in everything 
                we do to deliver superior results.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Corporate Governance */}
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold sm:text-4xl mb-6">
                Corporate Governance & Responsibility
              </h2>
              <p className="text-lg text-muted-foreground">
                We are committed to the highest standards of corporate governance, 
                environmental stewardship, and social responsibility.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <Award className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Governance Excellence</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    Strong board oversight, transparent reporting, and 
                    ethical business practices guide our operations.
                  </CardDescription>
                  <Link href="/governance" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Learn More <ArrowRight className="inline h-3 w-3 ml-1" />
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Globe className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Sustainability</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    Environmental responsibility and sustainable practices 
                    across our global operations and supply chain.
                  </CardDescription>
                  <Link href="/sustainability" className="text-green-600 hover:text-green-700 text-sm font-medium">
                    Learn More <ArrowRight className="inline h-3 w-3 ml-1" />
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Heart className="h-8 w-8 text-red-600 mb-2" />
                  <CardTitle>Social Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    Community investment, healthcare access initiatives, 
                    and programs that improve health equity.
                  </CardDescription>
                  <Link href="/social-impact" className="text-red-600 hover:text-red-700 text-sm font-medium">
                    Learn More <ArrowRight className="inline h-3 w-3 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-6">
            Partner with Opulon
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join us in our mission to advance healthcare and improve patient outcomes 
            through innovative solutions and trusted partnerships.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <Link href="/business-solutions">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Building2 className="mr-2 h-5 w-5" />
                Explore Solutions
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}