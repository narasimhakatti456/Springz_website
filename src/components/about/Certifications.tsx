import { Card, CardContent } from '@/components/ui/Card'
import { Award, Shield, Leaf, CheckCircle, Star, Globe } from 'lucide-react'

export default function Certifications() {
  const certifications = [
    {
      icon: Award,
      title: 'FSSAI Certified',
      description: 'Food Safety and Standards Authority of India certification ensuring highest quality standards.',
      color: 'text-blue-600'
    },
    {
      icon: Shield,
      title: 'GMP Certified',
      description: 'Good Manufacturing Practices certification for consistent quality and safety.',
      color: 'text-green-600'
    },
    {
      icon: Leaf,
      title: 'Organic Certified',
      description: 'Certified organic ingredients sourced from verified organic farms.',
      color: 'text-emerald-600'
    },
    {
      icon: CheckCircle,
      title: 'ISO 22000',
      description: 'International food safety management system certification.',
      color: 'text-purple-600'
    },
    {
      icon: Star,
      title: 'DIAAS-100%',
      description: 'Digestible Indispensable Amino Acid Score of 100% for superior protein quality.',
      color: 'text-yellow-600'
    },
    {
      icon: Globe,
      title: 'Carbon Neutral',
      description: 'Committed to carbon-neutral operations and sustainable packaging.',
      color: 'text-teal-600'
    }
  ]

  const achievements = [
    {
      number: '50K+',
      label: 'Happy Customers',
      description: 'Satisfied customers worldwide'
    },
    {
      number: '4.8/5',
      label: 'Average Rating',
      description: 'Based on customer reviews'
    },
    {
      number: '99%',
      label: 'Customer Satisfaction',
      description: 'Would recommend to others'
    },
    {
      number: '100%',
      label: 'Plant-Based',
      description: 'All products are vegan'
    }
  ]

  return (
    <section className="py-16 bg-springz-light-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-springz-green mb-4">
            Certifications & Achievements
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our commitment to quality and safety is backed by industry-leading 
            certifications and customer satisfaction metrics.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {certifications.map((cert, index) => {
            const Icon = cert.icon
            return (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 ${cert.color} bg-gray-100`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-springz-green mb-3">
                    {cert.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {cert.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Achievement Stats */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-springz-green mb-8 text-center">
            Our Impact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-springz-orange mb-2">
                  {achievement.number}
                </div>
                <div className="text-lg font-semibold text-springz-green mb-1">
                  {achievement.label}
                </div>
                <div className="text-sm text-gray-600">
                  {achievement.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Promise */}
        <div className="mt-16 text-center">
          <div className="bg-springz-green text-white rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">
              Our Quality Promise
            </h3>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              Every product that leaves our facility undergoes rigorous testing and quality control. 
              We're committed to delivering not just nutrition, but peace of mind with every purchase.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

