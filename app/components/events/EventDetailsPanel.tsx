import Link from "next/link";

type EventDetailsPanelProps = {
  artistName: string;
  artistDescription: string;
  artistSiteHref: string;
  typeTitle: string;
  typeDescription: string;
  spaceTitle: string;
  spaceSize: string;
  durationTitle: string;
  durationRange: string;
  collaborateTitle: string;
  collaborateDescription: string;
  collaborateHref: string;
};

export default function EventDetailsPanel({
  artistName,
  artistDescription,
  artistSiteHref,
  typeTitle,
  typeDescription,
  spaceTitle,
  spaceSize,
  durationTitle,
  durationRange,
  collaborateTitle,
  collaborateDescription,
  collaborateHref,
}: EventDetailsPanelProps) {
  return (
    <div className="p-4">
      <div className="space-y-6">
        <div>
          <p className="text-[14px] text-mist-500">Artist</p>
          <p className="text-[20px]">{artistName}</p>
          <p className="text-[16px] text-mist-300">{artistDescription}</p>
          <Link
            href={artistSiteHref}
            className="text-[16px] underline text-mist-400"
          >
            Visit Artist Site {"->"}
          </Link>
        </div>

        <div>
          <p className="text-[14px] text-mist-500">Type</p>
          <p className="text-[20px]">{typeTitle}</p>
          <p className="text-[16px] text-mist-300">{typeDescription}</p>
        </div>

        <div>
          <p className="text-[14px] text-mist-500">Space</p>
          <p className="text-[20px]">{spaceTitle}</p>
          <p className="text-[16px] text-mist-300">{spaceSize}</p>
        </div>

        <div>
          <p className="text-[14px] text-mist-500">Duration</p>
          <p className="text-[20px]">{durationTitle}</p>
          <p className="text-[16px] text-mist-300">{durationRange}</p>
        </div>

        <div className="pt-2">
          <p className="text-[20px]">{collaborateTitle}</p>
          <p className="text-[16px] text-mist-300">{collaborateDescription}</p>
          <Link
            href={collaborateHref}
            className="text-[16px] underline text-mist-400"
          >
            COLLABORATE WITH US {"->"}
          </Link>
        </div>
      </div>
    </div>
  );
}
