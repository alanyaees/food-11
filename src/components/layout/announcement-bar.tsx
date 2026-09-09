import { Marquee } from "@/components/ui/marquee";
import { brand } from "@/lib/brand";

export function AnnouncementBar() {
  return (
    <div className="bg-ink text-on-ink">
      <div className="kicker flex h-8 items-center text-[0.66rem] text-on-ink-muted">
        <Marquee
          className="edge-fade-x w-full px-4"
          speed="60s"
          items={[
            "Take a survey",
            brand.packLine,
            brand.phrases[0],
            brand.phrases[4],
            "Shipping across the EU",
            brand.phrases[2],
          ]}
        />
      </div>
    </div>
  );
}
