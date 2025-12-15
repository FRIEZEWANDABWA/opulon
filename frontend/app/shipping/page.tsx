import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionBackground } from "@/components/section-background"
import { 
  Truck, Clock, Thermometer, Shield, 
  Package, MapPin, CheckCircle, AlertTriangle
} from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <SectionBackground image="healthcare-24.jpg" overlay="dark" className="min-h-[70vh] flex items-center">
        <div className="container space-y-8 pb-16 pt-16 md:pb-24 md:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl text-white">
              Shipping Information
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Safe & Reliable Delivery
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-200 sm:text-xl">
              Learn about our comprehensive shipping options, delivery times, and 
              specialized handling for pharmaceutical and medical products.
            </p>
          </div>
        </div>
      </SectionBackground>

      {/* Shipping Options */}
      <SectionBackground image="healthcare-25.jpg" overlay="light">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Shipping Options & Delivery Times
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the shipping method that best fits your needs
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="text-center backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              <CardHeader>
                <div className="mx-auto mb-4 rounded-full bg-blue-100 p-4 dark:bg-blue-900">
                  <Truck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Standard Shipping</CardTitle>
                <CardDescription>5-7 business days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">FREE on orders over $100</p>
                  <p className="text-muted-foreground">$9.99 for orders under $100</p>
                  <p className="text-muted-foreground">Ground delivery via FedEx/UPS</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              <CardHeader>
                <div className="mx-auto mb-4 rounded-full bg-green-100 p-4 dark:bg-green-900">
                  <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Expedited Shipping</CardTitle>
                <CardDescription>2-3 business days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">$19.99</p>
                  <p className="text-muted-foreground">Express delivery service</p>
                  <p className="text-muted-foreground">Priority handling & tracking</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              <CardHeader>
                <div className="mx-auto mb-4 rounded-full bg-purple-100 p-4 dark:bg-purple-900">
                  <Package className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Overnight Shipping</CardTitle>
                <CardDescription>Next business day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">$39.99</p>
                  <p className="text-muted-foreground">Next-day delivery by 10:30 AM</p>
                  <p className="text-muted-foreground">Signature required</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionBackground>

      {/* Specialized Shipping */}
      <SectionBackground image="healthcare-26.jpg" overlay="blue">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl text-white">
              Specialized Healthcare Shipping
            </h2>
            <p className="mt-4 text-lg text-gray-200">
              Advanced handling for temperature-sensitive and controlled substances
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                    <Thermometer className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle>Cold Chain Shipping</CardTitle>
                    <CardDescription>Temperature-controlled delivery</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>2-8°C refrigerated transport</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>-20°C frozen shipping available</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Real-time temperature monitoring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Insulated packaging with gel packs</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900">
                    <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <CardTitle>Controlled Substances</CardTitle>
                    <CardDescription>Secure & compliant delivery</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>DEA-compliant shipping protocols</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Tamper-evident packaging</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Chain of custody documentation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Signature required delivery</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionBackground>

      {/* Shipping Policies */}
      <SectionBackground image="healthcare-27.jpg" overlay="green">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold sm:text-4xl text-white">
                Shipping Policies & Guidelines
              </h2>
              <p className="mt-4 text-lg text-gray-200">
                Important information about our shipping procedures
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Delivery Areas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium">Domestic Shipping</h4>
                    <p className="text-sm text-muted-foreground">
                      All 50 US states, DC, and US territories
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">International Shipping</h4>
                    <p className="text-sm text-muted-foreground">
                      Available to licensed healthcare facilities in select countries
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Restricted Areas</h4>
                    <p className="text-sm text-muted-foreground">
                      Some products may have shipping restrictions based on regulations
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Important Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium">Order Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      Orders placed by 2 PM EST ship same business day
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Prescription Requirements</h4>
                    <p className="text-sm text-muted-foreground">
                      Valid prescription required for prescription medications
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Delivery Confirmation</h4>
                    <p className="text-sm text-muted-foreground">
                      Signature required for orders over $500 or controlled substances
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SectionBackground>

      {/* Tracking Information */}
      <SectionBackground image="healthcare-28.jpg" overlay="purple">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl text-white mb-6">
              Track Your Order
            </h2>
            <p className="text-lg text-gray-200 mb-8">
              Stay informed about your shipment every step of the way
            </p>
            
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              <CardContent className="p-8">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="text-center">
                    <div className="mx-auto mb-4 rounded-full bg-blue-100 p-3 dark:bg-blue-900 w-fit">
                      <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold mb-2">Order Confirmation</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive email confirmation with order details and tracking number
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="mx-auto mb-4 rounded-full bg-green-100 p-3 dark:bg-green-900 w-fit">
                      <Truck className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold mb-2">In Transit</h3>
                    <p className="text-sm text-muted-foreground">
                      Real-time updates as your package moves through our network
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="mx-auto mb-4 rounded-full bg-purple-100 p-3 dark:bg-purple-900 w-fit">
                      <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold mb-2">Delivered</h3>
                    <p className="text-sm text-muted-foreground">
                      Delivery confirmation with signature and timestamp
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