import { Card, CardContent } from '@/components/ui/Card'
import { Leaf, Target, Users, Award } from 'lucide-react'

export default function OurStory() {
  const milestones = [
    {
      year: '2020',
      title: 'Founded',
      description: 'Started with a vision to make plant-based nutrition accessible and effective for everyone.',
      icon: Leaf
    },
    {
      year: '2021',
      title: 'First Product Launch',
      description: 'Launched our flagship Premium Plant Protein with DIAAS-100% formulation.',
      icon: Target
    },
    {
      year: '2022',
      title: 'Community Growth',
      description: 'Reached 10,000 satisfied customers and expanded our product line.',
      icon: Users
    },
    {
      year: '2023',
      title: 'Industry Recognition',
      description: 'Received multiple awards for innovation in plant-based nutrition.',
      icon: Award
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-springz-green mb-4">
            Our Story
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Springz Nutrition was born from a simple belief: nutrition should be both 
            scientifically superior and genuinely enjoyable. We combine cutting-edge 
            research with sustainable practices to create products that truly work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {milestones.map((milestone, index) => {
            const Icon = milestone.icon
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-16 w-16 bg-springz-light-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-springz-green" />
                  </div>
                  <div className="text-2xl font-bold text-springz-orange mb-2">
                    {milestone.year}
                  </div>
                  <h3 className="text-lg font-semibold text-springz-green mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {milestone.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-springz-green mb-6">
              The Science Behind Our Success
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 bg-springz-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-springz-green">DIAAS-100% Formulation</h4>
                  <p className="text-gray-600 text-sm">
                    Our proteins meet the highest digestibility standards, ensuring maximum amino acid absorption.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 bg-springz-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-springz-green">Clean Label Philosophy</h4>
                  <p className="text-gray-600 text-sm">
                    No artificial additives, preservatives, or fillers. Just pure, natural ingredients.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 bg-springz-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-springz-green">Sustainable Sourcing</h4>
                  <p className="text-gray-600 text-sm">
                    We partner with ethical suppliers who share our commitment to environmental responsibility.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative h-80">
              <Image
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop"
                alt="Science and Research"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

