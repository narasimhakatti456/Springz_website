import { Card, CardContent } from '@/components/ui/Card'
import { Star, Quote } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Fitness Enthusiast',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Springz protein has completely transformed my post-workout recovery. The taste is amazing and I love that it\'s completely plant-based. My energy levels have never been better!'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Athlete',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'As a professional athlete, I need the best nutrition to perform at my peak. Springz delivers exactly that - clean, effective, and sustainable. Highly recommended!'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Health Coach',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'I recommend Springz to all my clients. The DIAAS-100% formulation is scientifically proven, and the clean ingredients make it perfect for anyone serious about their health.'
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'Busy Professional',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Perfect for my busy lifestyle. Quick to prepare, tastes great, and gives me the energy I need throughout the day. The subscription service is incredibly convenient.'
  },
  {
    id: 5,
    name: 'Lisa Park',
    role: 'Yoga Instructor',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'I love that Springz aligns with my values - sustainable, plant-based, and effective. My students often ask what I use for my energy and recovery.'
  },
  {
    id: 6,
    name: 'James Wilson',
    role: 'Personal Trainer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'The quality is unmatched. I\'ve tried many protein powders, but Springz stands out for its purity and effectiveness. My clients see real results.'
  }
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-springz-light-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-springz-green mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have transformed their health 
            and performance with Springz Nutrition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-springz-orange" />
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative h-12 w-12">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-springz-green">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-springz-green mb-4">
              Join Our Community
            </h3>
            <p className="text-gray-600 mb-6">
              Over 50,000 satisfied customers trust Springz for their nutrition needs
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-600">
              <div className="text-center">
                <div className="text-2xl font-bold text-springz-green">4.8/5</div>
                <div>Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-springz-green">50K+</div>
                <div>Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-springz-green">99%</div>
                <div>Would Recommend</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
