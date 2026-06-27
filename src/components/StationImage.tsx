import { useState } from "react";
import { cn } from "@/lib/utils";

// Verified high-quality EV charging fallback image
export const FALLBACK_STATION_IMAGE =
  "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80";

interface Props {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Tailwind aspect ratio utility, default aspect-[16/10] */
  aspect?: string;
  rounded?: string;
  hoverZoom?: boolean;
}

export function StationImage({
  src,
  alt,
  className,
  imgClassName,
  aspect = "aspect-[16/10]",
  rounded = "",
  hoverZoom = true,
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const finalSrc = errored ? FALLBACK_STATION_IMAGE : src;

  return (
    <div className={cn("relative w-full overflow-hidden bg-white/5", aspect, rounded, className)}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/5 via-white/10 to-white/5" />
      )}
      <img
        src={finalSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setErrored(true);
          setLoaded(true);
        }}
        className={cn(
          "absolute inset-0 h-full w-full object-cover object-center transition-all duration-500",
          hoverZoom && "group-hover:scale-105",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName,
        )}
      />
    </div>
  );
}

/** Small square avatar variant for list rows. */
export function StationThumb({
  src,
  alt,
  size = "h-14 w-14",
}: {
  src: string;
  alt: string;
  size?: string;
}) {
  const [errored, setErrored] = useState(false);
  return (
    <img
      src={errored ? FALLBACK_STATION_IMAGE : src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
      className={cn("shrink-0 rounded-xl object-cover object-center bg-white/5", size)}
    />
  );
}