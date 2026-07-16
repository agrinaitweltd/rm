"use client";

import { useState } from "react";

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
  const effective = failed && fallback ? fallback : src;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
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
