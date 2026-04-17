import CoffeeGallerySection from "../components/home/CoffeeGallerySection";
import CollaborateSection from "../components/home/CollaborateSection";
import ConceptStoreSection from "../components/home/ConceptStoreSection";
import EventsSection from "../components/home/EventsSection";
import FoundersSection from "../components/home/FoundersSection";
import IntroSection from "../components/home/IntroSection";
import SiteFooterSection from "../components/home/SiteFooterSection";
import EventSpaces from "../components/home/EventSpaces";
import HomeStickyHeader from "../components/home/HomeStickyHeader";
import ComingSoonPage from "../components/ComingSoonPage";
import { client } from "@/sanity/lib/client";

export default async function Home(props: { params: Promise<{ lang: 'en' | 'es' }> }) {
    const params = await props.params;
    const lang = params.lang;

    const query = `*[_type == "introSection"][0]{
        "leftTitle": leftTitle[$lang],
        "leftBody": leftBody[$lang],
        "rightTitle": rightTitle[$lang],
        "rightBody": rightBody[$lang],
        "featuredImageUrl": featuredImage.asset->url,
        "backgroundImageUrl": backgroundImage.asset->url
    }`;

    // You can also add more items to the query for other sections

    const homeData = await client.fetch(query, { lang });

    return (
        <>
            {/* <ComingSoonPage /> */}
            <HomeStickyHeader />
            
            {/* Example: Passing sanity data down */}
            <IntroSection 
                leftTitle={homeData?.leftTitle} 
                leftBody={homeData?.leftBody} 
                rightTitle={homeData?.rightTitle} 
                rightBody={homeData?.rightBody} 
                featuredImage={homeData?.featuredImageUrl}
                backgroundImage={homeData?.backgroundImageUrl}
            />
            {/* <IntroSection /> */}

            <EventSpaces />
            <EventsSection />

            <CollaborateSection />
            <FoundersSection />
        </>
    );
}
