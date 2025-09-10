import { Card, CardContent } from '@/components/ui/Card'
import { Heart, Shield, Leaf, Zap, Users, Award } from 'lucide-react'

export default function OurValues() {
  const values = [
    {
      icon: Heart,
      title: 'Health First',
      description: 'Every product is designed with your health and wellbeing as the top priority.',
      color: 'text-red-500'
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Rigorous testing and quality control ensure every batch meets our high standards.',
      color: 'text-blue-500'
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'We\'re committed to environmentally responsible practices and sustainable sourcing.',
      color: 'text-green-500'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Continuous research and development to bring you the latest in nutrition science.',
      color: 'text-yellow-500'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a supportive community of health-conscious individuals and athletes.',
      color: 'text-purple-500'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Striving for excellence in everything we do, from product development to customer service.',
      color: 'text-orange-500'
    }
  ]

  return (
    <section className="py-16 bg-springz-light-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-springz-green mb-4">
            Our Values
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            These core values guide everything we do at Springz Nutrition, from product 
            development to customer service. They're not just words on a wall—they're 
            the foundation of our company culture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 ${value.color} bg-gray-100`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-springz-green mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-springz-green mb-4">
              Our Commitment to You
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We promise to always put your health first, maintain the highest quality standards, 
              and continuously innovate to bring you the best plant-based nutrition products. 
              Your trust is our most valuable asset, and we work every day to earn and maintain it.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

