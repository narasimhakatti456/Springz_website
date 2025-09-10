import Image from 'next/image'

export default function AboutHero() {
  return (
    <section className="relative bg-gradient-to-br from-springz-light-green to-springz-light-orange py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-springz-green leading-tight">
              About
              <span className="block text-springz-orange">Springz Nutrition</span>
            </h1>
            <p className="mt-6 text-lg text-gray-700 max-w-2xl">
              We're on a mission to revolutionize nutrition with science-grade plant proteins 
              that deliver exceptional taste and performance for everyday life.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-springz-green">50K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-springz-green">4.8/5</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-springz-green">100%</div>
                <div className="text-sm text-gray-600">Plant-Based</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative h-96 lg:h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop"
                alt="Springz Nutrition Team"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-springz-green rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div>
                  <h3 className="font-semibold text-springz-green">Founded in 2020</h3>
                  <p className="text-sm text-gray-600">Science-driven nutrition</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

