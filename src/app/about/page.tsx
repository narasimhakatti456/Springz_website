import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AboutHero from '@/components/about/AboutHero'
import OurStory from '@/components/about/OurStory'
import OurValues from '@/components/about/OurValues'
import TeamSection from '@/components/about/TeamSection'
import Certifications from '@/components/about/Certifications'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-springz-cream">
      <Header />
      <main>
        <AboutHero />
        <OurStory />
        <OurValues />
        <TeamSection />
        <Certifications />
      </main>
      <Footer />
    </div>
  )
}

