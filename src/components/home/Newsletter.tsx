'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Mail, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate newsletter subscription
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Newsletter subscription:', email)
      
      setIsSubscribed(true)
      toast.success('Successfully subscribed to our newsletter!')
      setEmail('')
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubscribed) {
    return (
      <section className="py-16 bg-springz-orange">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-white">
            <CardContent className="p-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-springz-green mb-2">
                Welcome to the Springz Family!
              </h3>
              <p className="text-gray-600 mb-6">
                Thank you for subscribing! You'll receive exclusive offers, 
                nutrition tips, and product updates.
              </p>
              <Button 
                onClick={() => setIsSubscribed(false)}
                variant="outline"
              >
                Subscribe Another Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-springz-orange">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Updated with Springz
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Get exclusive offers, nutrition tips, and early access to new products. 
            Join our community of health-conscious individuals.
          </p>
        </div>

        <Card className="bg-white">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-springz-green hover:bg-springz-green/90"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Subscribing...
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                By subscribing, you agree to our{' '}
                <a href="#" className="text-springz-green hover:underline">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="#" className="text-springz-green hover:underline">
                  Terms of Service
                </a>
                . Unsubscribe at any time.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="h-12 w-12 bg-springz-light-green rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Mail className="h-6 w-6 text-springz-green" />
                </div>
                <h3 className="font-semibold text-springz-green mb-1">
                  Exclusive Offers
                </h3>
                <p className="text-sm text-gray-600">
                  Get special discounts and early access to sales
                </p>
              </div>
              <div>
                <div className="h-12 w-12 bg-springz-light-green rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-springz-green font-bold text-lg">💡</span>
                </div>
                <h3 className="font-semibold text-springz-green mb-1">
                  Nutrition Tips
                </h3>
                <p className="text-sm text-gray-600">
                  Expert advice on health, fitness, and nutrition
                </p>
              </div>
              <div>
                <div className="h-12 w-12 bg-springz-light-green rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-springz-green font-bold text-lg">🆕</span>
                </div>
                <h3 className="font-semibold text-springz-green mb-1">
                  New Products
                </h3>
                <p className="text-sm text-gray-600">
                  Be the first to know about new product launches
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

