import { Marquee } from "@/components/ui/marquee";
import { brand } from "@/lib/brand";
import { tenPackDeal } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

export function AnnouncementBar() {
  return (
    <div className="bg-ink text-on-ink">
      <div className="kicker flex h-8 items-center text-[0.66rem] text-on-ink-muted">
        <Marquee
          className="edge-fade-x w-full px-4"
          speed="60s"
          items={[
            `Free shipping over ${formatPrice(brand.shipping.freeThresholdCents)}`,
            `10-Pack · ${formatPrice(tenPackDeal.priceCents)} · ${tenPackDeal.discountPercent}% off`,
            brand.packLine,
            "Concept nutrition data — formulations in development",
            brand.phrases[0],
            "Subscribe & save 15%",
            brand.phrases[4],
            "Shipping across the EU at launch",
          ]}
        />
      </div>
    </div>
  );
}
