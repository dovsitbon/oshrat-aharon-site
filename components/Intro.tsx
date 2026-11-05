"use client";

import { useEffect, useState, type CSSProperties } from "react";

const KEY = "oshrat-intro";
const at = (d: number) => ({ "--d": `${d}s` }) as CSSProperties;

/**
 * Ouverture (≤ 2 s, une fois par session), tout en CSS (globals.css) :
 * fond ivoire, une fine ligne dorée dessine une mèche ondulée qui s'enroule, une épingle à perle se pose au bout,
 * « OSHRAT AHARON » apparaît, puis « אושרת אהרון » et « BRIDAL & EVENING HAIR » en fondu, et fondu sur le hero.
 */
export function Intro({ skipLabel }: { skipLabel: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      document.documentElement.classList.add("intro-seen");
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div className="intro-curtain flex flex-col items-center justify-center overflow-hidden text-ink">
      <svg viewBox="0 0 280 70" className="h-auto w-[min(76vw,420px)]" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path
          className="intro-stroke"
          pathLength={1}
          d="M6 44c18-28 34-28 48 0s34 28 50 0 34-28 50 0 34 28 50 0c10-17 26-20 36-10 9 9 4 23-7 22-9-1-11-12-4-16"
          stroke="#bc9c68"
          strokeWidth="1.3"
        />
        <g className="intro-pin" style={at(0.85)}>
          <path d="M229 40 266 30" stroke="#bc9c68" strokeWidth="1.1" />
          <path d="M230 45 265 35.5" stroke="#bc9c68" strokeWidth="0.8" opacity="0.6" />
          <circle cx="226" cy="42.5" r="5" fill="#fffaf2" stroke="#e2cfaf" strokeWidth="1" />
          <circle cx="224.5" cy="41" r="1.4" fill="#fff" />
        </g>
      </svg>
      <p className="intro-name mt-8 ps-[0.3em] text-center font-[family-name:var(--font-cormorant)] text-[clamp(1.9rem,7vw,3.8rem)] leading-none font-light tracking-[0.3em]" dir="ltr" translate="no">
        OSHRAT AHARON
      </p>
      <p className="intro-fade mt-5 font-[family-name:var(--font-frank)] text-[1.5rem] leading-none font-light" style={at(1.1)} dir="rtl" lang="he" translate="no">
        אושרת אהרון
      </p>
      <p className="intro-fade mt-5 ps-[0.5em] font-[family-name:var(--font-jost)] text-[0.625rem] tracking-[0.5em] text-gold-ink" style={at(1.25)} dir="ltr" translate="no">
        BRIDAL &amp; EVENING HAIR
      </p>
      <button
        type="button"
        onClick={() => {
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
          document.documentElement.classList.add("intro-seen");
          setGone(true);
        }}
        className="nav-link absolute end-4 bottom-4 min-h-11 px-4 text-muted transition-colors hover:text-ink"
      >
        {skipLabel}
      </button>
    </div>
  );
}
