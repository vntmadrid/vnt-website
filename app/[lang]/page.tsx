import CoffeeGallerySection from "../components/home/CoffeeGallerySection";
import CollaborateSection from "../components/home/CollaborateSection";
import ConceptStoreSection from "../components/home/ConceptStoreSection";
import EventsSection from "../components/home/EventsSection";
import FoundersSection from "../components/home/FoundersSection";
import IntroSection from "../components/home/IntroSection";
import VntSpaces from "../components/home/vntSpaces";
import HomeStickyHeader from "../components/home/HomeStickyHeader";
import ComingSoonPage from "../components/ComingSoonPage";
import { client } from "@/sanity/lib/client";

export default async function Home(props: {
    params: Promise<{ lang: "en" | "es" }>;
}) {
    const params = await props.params;
    const lang = params.lang;

    const query = `{
      "intro": *[_type == "introSection"][0]{
          "leftTitle": leftTitle[$lang],
          "leftBody": leftBody[$lang],
          "rightTitle": rightTitle[$lang],
          "rightBody": rightBody[$lang],
          "featuredImageUrl": featuredImage.asset->url,
          "backgroundImageUrl": backgroundImage.asset->url
      },
      "vntSpaces": *[_type == "vntSpaces"][0]{
          "coffeeBgUrl": coffeeBg.asset->url,
          "conceptBgUrl": conceptBg.asset->url,
          "coffeeLabel": coffeeLabel[$lang],
          "coffeeTitle": coffeeTitle[$lang],
          "coffeeDesc": coffeeDesc[$lang],
          "menuButtonText": menuButtonText[$lang],
          "conceptLabel": conceptLabel[$lang],
          "conceptTitle": conceptTitle[$lang],
          "conceptDesc": conceptDesc[$lang],
          "menuTitle": menuTitle[$lang],
          "menuFooter": menuFooter[$lang],
          "menuSections": menuSections[]{
            "sectionName": sectionName[$lang],
            "items": items[]{
               "name": name[$lang],
               "description": description[$lang],
               price
            }
          }
      },
    "events": *[_type == "event"] | order(_createdAt desc) {
        "slug": slug.current,
        "title": title[$lang],
        "coverImageUrl": coverPhoto.asset->url
    },
      "collaborate": *[_type == "collaborateSection"][0]{
          "sectionTitle": sectionTitle[$lang],
          "offers": offers[]{
              "title": title[$lang],
              "description": description[$lang]
          },
          "ctaTitle": ctaTitle[$lang],
          "ctaDescription": ctaDescription[$lang],
          "ctaButtonText": ctaButtonText[$lang]
      },
      "founders": *[_type == "foundersSection"][0]{
          "sectionTitle": sectionTitle[$lang],
          "backgroundImageUrl": backgroundImage.asset->url,
          "foundersImageUrl": foundersImage.asset->url,
          "founders": founders[]{
              name,
              "description": description[$lang]
          }
      }
    }`;

    // You can also add more items to the query for other sections

    const data = await client.fetch(query, { lang });

    return (
        <>
            {/* <ComingSoonPage /> */}
            <HomeStickyHeader />

            {/* Example: Passing sanity data down */}
            <IntroSection
                leftTitle={data.intro?.leftTitle}
                leftBody={data.intro?.leftBody}
                rightTitle={data.intro?.rightTitle}
                rightBody={data.intro?.rightBody}
                featuredImage={data.intro?.featuredImageUrl}
                backgroundImage={data.intro?.backgroundImageUrl}
            />
            {/* <IntroSection /> */}

            <VntSpaces data={data.vntSpaces} />
            <EventsSection eventsData={data.events} />

            <CollaborateSection data={data.collaborate} />
            <FoundersSection data={data.founders} />
        </>
    );
}
