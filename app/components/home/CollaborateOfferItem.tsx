type CollaborateOfferItemProps = {
  title: string;
  description: string;
};

export default function CollaborateOfferItem({
  title,
  description,
}: CollaborateOfferItemProps) {
  return (
    <div className="lg:max-w-[400px]">
      <p className="mb-1 text-xl lg:text-2xl font-medium">{title}</p>
      <p className="lg:text-lg">{description}</p>
    </div>
  );
}
