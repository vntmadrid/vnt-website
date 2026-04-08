import ConceptStoreBg from "@/public/images/ConceptStoreBG.png";

export default function ConceptStoreSection() {
    return (
        <div
            className="flex min-h-screen items-end justify-center bg-cover bg-center bg-no-repeat p-5 font-sans lg:justify-start lg:items-stretch"
            style={{ backgroundImage: `url(${ConceptStoreBg.src})` }}
        >
            <div className="bg-white text-black lg:max-w-[570px] p-3 lg:p-6 lg:flex lg:flex-col lg:justify-between">
                <div className="">
                    <p className="lg:text-2xl">Concept_store</p>
                    <p className="mb-3 text-2xl font-medium lg:text-[52px] lg:leading-16">
                        Every visit, a different world. Design, fashion, and
                        art, thoughtfully arranged, always evolving.
                    </p>
                </div>
                <div className="mb-1 flex flex-row items-center justify-between border-t border-gray-300 pt-3 text-sm">
                    <div className="lg:text-[20px]">
                        <p>90m² of rotating design, fashion, and art.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
