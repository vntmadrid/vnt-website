import ConceptStoreBg from "@/public/images/ConceptStoreBG.png";

export default function ConceptStoreSection() {
  return (
    <div
      className="flex min-h-screen items-end justify-center bg-cover bg-center bg-no-repeat p-5 font-sans"
      style={{ backgroundImage: `url(${ConceptStoreBg.src})` }}
    >
      <div className="bg-white text-black">
        <div className="p-3">
          <p>Concept_store</p>
          <p className="mb-3 text-2xl font-medium">
            Every visit, a different world. Design, fashion, and art,
            thoughtfully arranged, always evolving.
          </p>
          <div className="flex flex-row justify-between border-t border-gray-300 pt-3 mb-1 text-sm items-center">
            <p>90m² of rotating design, fashion, and art.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
