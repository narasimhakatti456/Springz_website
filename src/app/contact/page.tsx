import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ContactForm from '@/components/contact/ContactForm'
import ContactInfo from '@/components/contact/ContactInfo'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-springz-cream">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-springz-light-green to-springz-light-orange py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-springz-green mb-6">
                Get in Touch
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Have questions about our products? Need help with your order? 
                We're here to help you on your nutrition journey.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-springz-green mb-8">
                  Send us a Message
                </h2>
                <ContactForm />
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold text-springz-green mb-8">
                  Contact Information
                </h2>
                <ContactInfo />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-springz-green mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600">
                Quick answers to common questions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-springz-green mb-2">
                    What makes Springz protein different?
                  </h3>
                  <p className="text-gray-600">
                    Our DIAAS-100% formulation ensures superior amino acid availability 
                    with clean, sustainable ingredients and no artificial additives.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-springz-green mb-2">
                    How long does shipping take?
                  </h3>
                  <p className="text-gray-600">
                    Standard shipping takes 3-5 business days. Express shipping 
                    options are available for faster delivery.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-springz-green mb-2">
                    Can I return products?
                  </h3>
                  <p className="text-gray-600">
                    Yes! We offer a 30-day satisfaction guarantee. If you're not 
                    completely satisfied, we'll provide a full refund.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-springz-green mb-2">
                    Are your products vegan?
                  </h3>
                  <p className="text-gray-600">
                    Yes, all our products are 100% plant-based and vegan-friendly, 
                    made with sustainable ingredients.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-springz-green mb-2">
                    Do you offer bulk discounts?
                  </h3>
                  <p className="text-gray-600">
                    Yes! We offer special pricing for bulk orders. Contact us 
                    for custom pricing on large quantities.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-springz-green mb-2">
                    How should I store the products?
                  </h3>
                  <p className="text-gray-600">
                    Store in a cool, dry place. Once opened, use within 6 months 
                    for best quality and freshness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

