import Link from "next/link";

type EventInfoBlockProps = {
  label: string;
  title: string;
  description?: string;
  linkText?: string;
  linkHref?: string;
};

export default function EventInfoBlock({
  label,
  title,
  description,
  linkText,
  linkHref,
}: EventInfoBlockProps) {
  return (
    <div className="border-b border-mist-800 pb-12">
      <p className="text-[14px] text-mist-500 leading-4">{label}</p>
      <p className="text-[20px] text-mist-100 mb-.5">{title}</p>
      {description ? (
        <p className="text-[16px] text-mist-300">{description}</p>
      ) : null}
      {linkText && linkHref ? (
        <Link href={linkHref} className="text-[16px] underline text-mist-400">
          {linkText} {"→"}
        </Link>
      ) : null}
    </div>
  );
}
