import { Card, CardContent } from '@/components/ui/Card'
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react'

export default function ContactInfo() {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us an email anytime',
      details: 'support@springz.com',
      action: 'mailto:support@springz.com'
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Mon-Fri from 9am to 6pm',
      details: '+1 (555) 123-4567',
      action: 'tel:+15551234567'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with us online',
      details: 'Available 24/7',
      action: '#'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      description: 'Come say hello',
      details: '123 Nutrition St, Health City, HC 12345',
      action: '#'
    }
  ]

  const businessHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: 'Closed' }
  ]

  return (
    <div className="space-y-8">
      {/* Contact Methods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contactMethods.map((method, index) => {
          const Icon = method.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-springz-light-green rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-springz-green" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-springz-green mb-1">
                      {method.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {method.description}
                    </p>
                    <a
                      href={method.action}
                      className="text-springz-orange hover:text-springz-orange/80 font-medium text-sm"
                    >
                      {method.details}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Business Hours */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-springz-light-orange rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-springz-orange" />
            </div>
            <h3 className="text-xl font-semibold text-springz-green">
              Business Hours
            </h3>
          </div>
          <div className="space-y-2">
            {businessHours.map((schedule, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-700 font-medium">{schedule.day}</span>
                <span className="text-gray-600">{schedule.hours}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Response Time */}
      <Card className="bg-springz-light-green">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-springz-green mb-2">
            Response Time
          </h3>
          <p className="text-gray-700">
            We typically respond to all inquiries within 24 hours. 
            For urgent matters, please call us directly.
          </p>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-springz-green mb-4">
            Follow Us
          </h3>
          <div className="flex space-x-4">
            <a
              href="#"
              className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
            >
              <span className="text-sm font-bold">f</span>
            </a>
            <a
              href="#"
              className="h-10 w-10 bg-pink-600 rounded-lg flex items-center justify-center text-white hover:bg-pink-700 transition-colors"
            >
              <span className="text-sm font-bold">ig</span>
            </a>
            <a
              href="#"
              className="h-10 w-10 bg-blue-400 rounded-lg flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
            >
              <span className="text-sm font-bold">tw</span>
            </a>
            <a
              href="#"
              className="h-10 w-10 bg-red-600 rounded-lg flex items-center justify-center text-white hover:bg-red-700 transition-colors"
            >
              <span className="text-sm font-bold">yt</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

