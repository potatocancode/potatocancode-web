import HeroVideo from '@/components/HeroVideo'
import Marquee from '@/components/home/Marquee'
import BentoGrid from '@/components/home/BentoGrid'
import FeaturedWork from '@/components/home/FeaturedWork'
import ServicesPreview from '@/components/home/ServicesPreview'
import ContactCTA from '@/components/home/ContactCTA'

export default function Home() {
  return (
    <main>
      <HeroVideo />
      <Marquee />
      <BentoGrid />
      <FeaturedWork />
      <ServicesPreview />
      <ContactCTA />
    </main>
  )
}
