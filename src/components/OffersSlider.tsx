"use client";

import { useState, useEffect, useRef } from "react";
import { MenuItem } from "@/data/menu";
import MenuCard from "./MenuCard";
import styles from "./OffersSlider.module.css";

interface OffersSliderProps {
  offers: MenuItem[];
}

export default function OffersSlider({ offers }: OffersSliderProps) {
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);

  // ─── Auto-play ────────────────────────────────────────────────────
  useEffect(() => {
    if (offers.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % offers.length);
    }, 6000);
    return () => clearInterval(id);
  }, [offers.length]);

  // ─── Swipe handlers ───────────────────────────────────────────────
  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.targetTouches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null) return;
    const delta = touchX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) < 50) return;
    if (delta > 0) setIndex((p) => (p + 1) % offers.length);
    else setIndex((p) => (p === 0 ? offers.length - 1 : p - 1));
    touchX.current = null;
  }

  if (!offers.length) return null;

  return (
    <section className={styles.section}>
      <div className="container">

        {/* Title */}
        <h2 className={styles.title}>🔥 عروض ما تتفوتش 🔥</h2>

        {/* Slide area */}
        <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {/* key={index} → React remounts this div every time → .offerSlide CSS animation fires */}
          <div key={index} className={`${styles.slideWrapper} offerSlide`}>
            <MenuCard item={offers[index]} />
          </div>
        </div>

        {/* Dots */}
        {offers.length > 1 && (
          <div className={styles.dots}>
            {offers.map((_, i) => (
              <button
                key={i}
                className={i === index ? styles.dotActive : styles.dot}
                onClick={() => setIndex(i)}
                aria-label={`عرض ${i + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
