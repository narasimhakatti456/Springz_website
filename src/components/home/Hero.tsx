import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-springz-light-green to-springz-light-orange">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-springz-green leading-tight">
              Science-grade nutrition.
              <span className="block text-springz-orange">Everyday taste.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-700 max-w-2xl">
              DIAAS-100% formulas, clean label. Sustainable ingredients for real-world performance.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/shop">
                <Button size="lg" className="w-full sm:w-auto">
                  Shop Proteins
                </Button>
              </Link>
              <Link href="/health-check">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Start Health Check (80s)
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Product Image */}
          <div className="relative">
            <div className="relative h-96 lg:h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&h=600&fit=crop"
                alt="Springz Premium Plant Protein"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-springz-green rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div>
                  <h3 className="font-semibold text-springz-green">Premium Plant Protein</h3>
                  <p className="text-sm text-gray-600">26g Protein • 0g Sugar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

