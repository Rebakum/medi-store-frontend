"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  alt?: string;
  className?: string;
  aspectClass?: string;
  showCount?: boolean;
  maxThumbs?: number;
  autoPlay?: boolean;
  intervalMs?: number;
};

export default function ImageSlider({
  images,
  alt = "image",
  className = "",
  aspectClass = "h-[320px]",
  showCount = true,
  maxThumbs = 10,
  autoPlay = true,
  intervalMs = 2500,
}: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const assetBase = process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "";
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setActive(0);
  }, [images?.length]);

  const normalized = useMemo(() => {
    const list = (images ?? []).filter(Boolean).map((p) => p.trim());
    return list.map((p) => (p.startsWith("http") ? p : `${assetBase}${p}`));
  }, [images, assetBase]);

  const hasMany = normalized.length > 1;
  const mainSrc = normalized[active] || "/logo.png";

  const prev = () => {
    setActive((p) => (p === 0 ? normalized.length - 1 : p - 1));
  };

  const next = () => {
    setActive((p) => (p === normalized.length - 1 ? 0 : p + 1));
  };

  useEffect(() => {
    if (!autoPlay || !hasMany || paused) return;

    timerRef.current = window.setInterval(() => {
      setActive((p) => (p === normalized.length - 1 ? 0 : p + 1));
    }, intervalMs);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoPlay, hasMany, paused, intervalMs, normalized.length]);

  return (
    <div
      className={`space-y-3 ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden bg-white border rounded-xl">
        <div className={`relative ${aspectClass}`}>
          <Image
            src={mainSrc}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority={active === 0}
            placeholder="empty"
          />
        </div>

        {hasMany && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute px-3 py-1 text-white -translate-y-1/2 rounded left-2 top-1/2 bg-black/60 hover:bg-black/80 transition"
              aria-label="Previous image"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={next}
              className="absolute px-3 py-1 text-white -translate-y-1/2 rounded right-2 top-1/2 bg-black/60 hover:bg-black/80 transition"
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}

        {showCount && (
          <div className="absolute px-2 py-1 text-xs text-white rounded bottom-2 right-2 bg-black/60">
            {normalized.length ? `${active + 1}/${normalized.length}` : "0/0"}
          </div>
        )}
      </div>

      {hasMany && (
        <div className="grid grid-cols-5 gap-2">
          {normalized.slice(0, maxThumbs).map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              onClick={() => setActive(idx)}
              className={`relative border rounded-lg overflow-hidden ${
                idx === active ? "ring-2 ring-black" : ""
              }`}
              aria-label={`Select image ${idx + 1}`}
            >
              <div className="relative h-14">
                <Image
                  src={src}
                  alt={`thumb-${idx}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                  loading="lazy"
                  placeholder="empty"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
