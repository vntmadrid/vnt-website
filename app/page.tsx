import CoffeeGallerySection from "./components/home/CoffeeGallerySection";
import CollaborateSection from "./components/home/CollaborateSection";
import ConceptStoreSection from "./components/home/ConceptStoreSection";
import EventsSection from "./components/home/EventsSection";
import FoundersSection from "./components/home/FoundersSection";
import IntroSection from "./components/home/IntroSection";
import SiteFooterSection from "./components/home/SiteFooterSection";

export default function Home() {
  return (
    <>
      <IntroSection />
      <CoffeeGallerySection />
      <ConceptStoreSection />
      <EventsSection />
      <CollaborateSection />
      <FoundersSection />
    </>
  );
}
