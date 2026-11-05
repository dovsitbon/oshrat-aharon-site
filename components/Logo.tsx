/**
 * Logo typographique (Oshrat n'a pas de logo : sa photo de profil est un portrait) :
 * « OSHRAT AHARON » en Cormorant Garamond très fin et très espacé, « BRIDAL & EVENING HAIR » en tout petit,
 * une mèche ondulée au trait doré terminée par une épingle à perle, et « אושרת אהרון » en Frank Ruhl Libre.
 * Facile à remplacer : il suffit de changer ces composants (et app/icon.svg pour le favicon).
 */

/** Mèche ondulée + épingle à perle (viewBox 0 0 56 20). */
export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 20" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c4.5-6.5 8.5-6.5 12 0s7.5 6.5 12 0 7.5-6.5 12 0c2.2 3.4 5.6 3.2 6.6.4.8-2.3-1-4.2-3.2-3.4" />
      <path d="M43.5 4.2 53 2.4" />
      <path d="M43.8 5.8 52.6 4" opacity="0.6" />
      <circle cx="42.6" cy="5" r="1.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Marque du header : « OSHRAT AHARON » + sous-ligne. */
export function Wordmark({ className = "", sub = true }: { className?: string; sub?: boolean }) {
  return (
    <span className={`inline-flex flex-col items-center ${className}`} translate="no" dir="ltr">
      <span className="ps-[0.36em] font-[family-name:var(--font-cormorant)] text-[1.05rem] leading-none font-light tracking-[0.36em] md:text-[1.4rem]">OSHRAT AHARON</span>
      {sub && <span className="mt-1.5 ps-[0.44em] font-[family-name:var(--font-jost)] text-[0.5rem] leading-none tracking-[0.44em] opacity-80 md:text-[0.5625rem]">BRIDAL &amp; EVENING HAIR</span>}
    </span>
  );
}

/** Logo complet (pied de page) : mèche, nom latin, sous-ligne, nom hébreu. */
export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`} translate="no">
      <Mark className="mb-5 h-6 w-16 text-gold" />
      <Wordmark className="[&>span:first-child]:text-[1.6rem] md:[&>span:first-child]:text-[1.9rem]" />
      <span className="mt-4 font-[family-name:var(--font-frank)] text-[1.35rem] leading-none font-light" dir="rtl" lang="he">
        אושרת אהרון
      </span>
    </div>
  );
}
