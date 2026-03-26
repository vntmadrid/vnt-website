import CoffeeGalleryBG from "@/public/images/CoffeeGalleryBg.png";

export default function CoffeeGallerySection() {
    return (
        <div
            className="flex min-h-screen items-end justify-center bg-cover bg-center bg-no-repeat p-5 font-sans lg:justify-end lg:items-stretch "
            style={{ backgroundImage: `url(${CoffeeGalleryBG.src})` }}
        >
            <div className="bg-white text-black lg:max-w-[570px] lg:flex lg:flex-col lg:justify-between">
                {/* Child 1 - title */}
                <div className="p-3 lg:p-6">
                    <p className="lg:text-2xl">Coffee_gallery</p>
                    <p className="text-2xl lg:text-[52px] font-medium lg:font-normal lg:leading-16">
                        The smell of coffee. The pull of art. A space that was
                        always meant to feel like this.
                    </p>
                </div>

                {/* Child 2 - bottom section */}
                <div className="flex flex-row justify-between border-t border-gray-300 p-3 pt-3 text-sm items-center">
                    <div className="max-w-[50%] lg:text-[20px]">
                        <p>
                            The building used to generate electricity. We think
                            it still does.
                        </p>
                    </div>
                    <div className="p-1 px-2 border-2 text-md lg:text-2xl font-semibold">
                        <p>View Menu →</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
