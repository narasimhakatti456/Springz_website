import { Leaf, Heart, Shield, Globe } from 'lucide-react'

export default function TrustIndicators() {
  const indicators = [
    {
      icon: Leaf,
      title: '100% DIAAS',
      description: 'Superior amino acid availability'
    },
    {
      icon: Heart,
      title: 'FSSAI & GMP',
      description: 'Certified quality standards'
    },
    {
      icon: Leaf,
      title: 'Clean Label',
      description: 'No artificial additives'
    },
    {
      icon: Globe,
      title: 'Sustainable',
      description: 'Eco-friendly packaging'
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {indicators.map((indicator, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto w-16 h-16 bg-springz-light-green rounded-full flex items-center justify-center mb-4">
                <indicator.icon className="h-8 w-8 text-springz-green" />
              </div>
              <h3 className="text-lg font-semibold text-springz-green mb-2">
                {indicator.title}
              </h3>
              <p className="text-sm text-gray-600">
                {indicator.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

