import Link from "next/link";

export default function CollaborateSection() {
  return (
    <div className="flex justify-center bg-cover bg-center bg-no-repeat font-sans">
      <div className="bg-white text-black">
        <div className="p-6">
          <p className="text-4xl font-semibold mb-4">COLLABORATE_</p>
          <div className="flex flex-col gap-4">
            <div>
              <p className="mb-1 text-xl font-medium">Pop-up Experiences</p>
              <p>
                From two days to four weeks, take over the space and make it
                yours. Designed for fashion, fragrance, and lifestyle brands
                with something to say.
              </p>
            </div>
            <div className="h-[1px] border border-gray-200" />
            <div>
              <p className="mb-1 text-xl font-medium">Private Events</p>
              <p>
                From press launches to intimate tastings, VNT offers a refined
                backdrop for moments that deserve more than a generic venue.
              </p>
            </div>
            <div className="h-[1px] border border-gray-200" />
            <div>
              <p className="mb-1 text-xl font-medium">
                Exhibitions & Installations
              </p>
              <p>
                Show your collection where design, coffee, and community
                already meet. Our gallery program is built for work worth
                seeing.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-black text-white px-4 py-6 pb-7">
          <p className="text-4xl font-semibold mb-2">Got Something in Mind?</p>
          <p className="text-xl mb-6">
            Drop us a message and let's see what we can build together.
          </p>
        
          <Link href={"events"} className="p-2 border-4 flex flex-row justify-between text-2xl font-semibold">
            <p>Let's Talk </p>
            <p>→</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
