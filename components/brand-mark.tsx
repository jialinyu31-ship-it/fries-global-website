import Image from "next/image";

type BrandMarkProps = {
  inverse?: boolean;
  compact?: boolean;
};

export function BrandMark({ inverse = false, compact = false }: BrandMarkProps) {
  return (
    <span className={`brand-mark ${inverse ? "brand-mark--inverse" : ""}`} aria-label="薯条出海 FRIES GLOBAL" data-brand-owner="FRIES GLOBAL">
      <Image
        className="brand-mark__image"
        src="/brand-symbol.png"
        alt=""
        width={54}
        height={54}
        priority
        aria-hidden="true"
      />
      {!compact && (
        <span className="brand-mark__copy">
          <strong>薯条出海</strong>
          <small>FRIES GLOBAL</small>
        </span>
      )}
    </span>
  );
}
