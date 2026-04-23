import SiteFooterSection from "../components/home/SiteFooterSection";
import { client } from "@/sanity/lib/client";

export default async function LangLayout({ children, params }: { children: React.ReactNode, params: Promise<{ lang: 'en' | 'es' }> }) {
    const p = await params;
    const lang = p.lang;
    
    const query = `*[_type == "siteFooter"][0]{
        "logoUrl": logo.asset->url,
        "locationLabel": locationLabel[$lang],
        "locationText": locationText[$lang],
        locationLink,
        "hoursLabel": hoursLabel[$lang],
        "hoursText": hoursText[$lang],
        "emailLabel": emailLabel[$lang],
        emailText
    }`;
    const footerData = await client.fetch(query, { lang });

    return (
        <>
            {children}
            <SiteFooterSection data={footerData} lang={lang} />
        </>
    );
}