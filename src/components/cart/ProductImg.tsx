"use client";

import { useEffect, useRef, useState } from "react";

// Product image with automatic fallback: if the photo (src) 404s — e.g. it
// hasn't been uploaded to public/ yet — the flat SVG icon is shown instead.
// The moment the correctly-named photo is deployed, it takes over untouched.
export default function ProductImg({
  src,
  fallback,
  alt,
  title,
  className,
  width,
  height,
  loading,
}: {
  src: string;
  fallback?: string;
  alt: string;
  title?: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
}) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // The server-rendered <img> starts its network request as soon as the HTML
  // parses — before React hydrates and attaches onError. A fast 404 (as on
  // localhost) can fire-and-be-missed in that window, leaving a broken image
  // with no fallback. On mount, check whether it already failed.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0 && fallback) {
      setFailed(true);
    }
  }, [fallback]);

  const effective = failed && fallback ? fallback : src;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={effective}
      alt={alt}
      title={title}
      className={className}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      onError={() => {
        if (!failed && fallback) setFailed(true);
      }}
    />
  );
}
