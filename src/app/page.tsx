import HeroSection from '@/components/home/HeroSection';
import ClubsSection from '@/components/home/ClubsSection';
import ProjectsShowcase from '@/components/home/ProjectsShowcase';
import JEGEBanner from '@/components/home/JEGEBanner';
import EventsAgenda from '@/components/home/EventsAgenda';
import NewsSection from '@/components/home/NewsSection';
import PartnersSection from '@/components/home/PartnersSection';

export default function HomePage() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <ClubsSection />
      <ProjectsShowcase />
      <JEGEBanner />
      <EventsAgenda />
      <NewsSection />
      <PartnersSection />
    </div>
  );
}
