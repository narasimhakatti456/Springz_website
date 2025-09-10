import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/Card'
import { Linkedin, Twitter, Mail } from 'lucide-react'

export default function TeamSection() {
  const teamMembers = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      bio: 'PhD in Nutritional Sciences with 15+ years in plant-based nutrition research.',
      linkedin: '#',
      twitter: '#',
      email: 'sarah@springz.com'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Product Development',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      bio: 'Food scientist specializing in protein formulation and clean label development.',
      linkedin: '#',
      twitter: '#',
      email: 'michael@springz.com'
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Chief Scientific Officer',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      bio: 'Research scientist focused on bioavailability and DIAAS optimization.',
      linkedin: '#',
      twitter: '#',
      email: 'emily@springz.com'
    },
    {
      name: 'James Park',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      bio: 'Supply chain expert ensuring sustainable sourcing and quality control.',
      linkedin: '#',
      twitter: '#',
      email: 'james@springz.com'
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-springz-green mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our diverse team of nutrition experts, scientists, and food technologists 
            work together to bring you the highest quality plant-based nutrition products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="relative h-48 w-48 mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold text-springz-green mb-1">
                  {member.name}
                </h3>
                <p className="text-springz-orange font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {member.bio}
                </p>
                <div className="flex justify-center space-x-3">
                  <a
                    href={member.linkedin}
                    className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={member.twitter}
                    className="h-8 w-8 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="h-8 w-8 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

