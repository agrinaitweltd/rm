"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/hero.mp4"; // drop your own video into public/hero.mp4
const POSTER_SRC = "/hero-poster.png"; // shown before/between video plays
const POSTER_SECONDS = 2;

/**
 * Background media for the home hero: the poster image shows for a couple
 * of seconds, then the video plays; when it ends the poster returns and the
 * cycle repeats. If public/hero.mp4 doesn't exist the poster simply stays.
 */
export default function HeroBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [available, setAvailable] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(VIDEO_SRC, { method: "HEAD" })
      .then((res) => {
        if (!cancelled && res.ok && (res.headers.get("content-type") || "").startsWith("video")) {
          setAvailable(true);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!available) return;
    const timer = setTimeout(() => {
      setShowVideo(true);
      videoRef.current?.play().catch(() => {});
    }, POSTER_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [available]);

  const handleEnded = () => {
    setShowVideo(false);
    setTimeout(() => {
      const video = videoRef.current;
      if (!video) return;
      video.currentTime = 0;
      setShowVideo(true);
      video.play().catch(() => {});
    }, POSTER_SECONDS * 1000);
  };

  return (
    <div className="elementor-background-video-container">
      <img className="rm-hero-media" src={POSTER_SRC} alt="" />
      {available && (
        <video
          ref={videoRef}
          className="rm-hero-media rm-hero-video"
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          onEnded={handleEnded}
          style={{ opacity: showVideo ? 1 : 0 }}
        />
      )}
    </div>
  );
}
