import CoffeeGalleryBG from "@/public/images/CoffeeGalleryBg.png";

export default function CoffeeGallerySection() {
  return (
    <div
      className="flex min-h-screen items-end justify-center bg-cover bg-center bg-no-repeat p-5 font-sans"
      style={{ backgroundImage: `url(${CoffeeGalleryBG.src})` }}
    >
      <div className="bg-white text-black">
        <div className="p-3">
          <p>Coffee_gallery</p>
          <p className="mb-3 text-2xl font-medium">
            The smell of coffee. The pull of art. A space that was always meant
            to feel like this.
          </p>
          <div className="flex flex-row justify-between border-t border-gray-300 pt-3 text-sm items-center">
            <div className="max-w-[50%]">
              <p>
                The building used to generate electricity. We think it still
                does.
              </p>
            </div>
            <div className="p-1 px-2 border-2 text-md font-bold">
              <p> View Menu →</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
