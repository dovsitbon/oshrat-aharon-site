"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { useBookHref } from "@/components/Header";
import { useLocale } from "@/components/providers";
import { waLink } from "@/lib/booking";

/**
 * Mobile : barre fixée en bas avec « Vérifier ma date » + bouton WhatsApp rond.
 * Ordinateur : seulement le bouton WhatsApp rond (le bouton « Vérifier ma date » est dans l'en-tête).
 * La barre se retire quand le formulaire est à l'écran.
 */
export function FloatingActions() {
  const { d } = useLocale();
  const bookHref = useBookHref();
  const path = usePathname();
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const form = document.getElementById("contact");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- nouvelle page : on repart de l'état « formulaire hors écran »
    setFormVisible(false);
    if (!form) return;
    const io = new IntersectionObserver((entries) => setFormVisible(entries.some((e) => e.isIntersecting)), { rootMargin: "0px 0px -30% 0px" });
    io.observe(form);
    return () => io.disconnect();
  }, [path]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex items-end gap-3 px-4 pb-[max(0.9rem,env(safe-area-inset-bottom))] md:justify-end md:px-8 md:pb-8">
      <a
        href={bookHref}
        className={`btn-solid pointer-events-auto flex-1 shadow-[0_10px_30px_-12px_rgba(58,48,44,0.55)] transition-[opacity,transform] duration-500 md:hidden ${formVisible ? "pointer-events-none translate-y-3 opacity-0" : ""}`}
        tabIndex={formVisible ? -1 : 0}
        aria-hidden={formVisible}
      >
        {d.nav.book}
      </a>
      <a
        href={waLink(d.whatsapp.hello)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={d.whatsapp.float}
        className="pointer-events-auto flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full bg-ivory text-ink shadow-[0_10px_30px_-12px_rgba(58,48,44,0.55)] ring-1 ring-gold/60 transition-colors duration-500 hover:bg-ink hover:text-ivory md:h-14 md:w-14"
      >
        <WhatsAppIcon className="h-6 w-6" />
      </a>
    </div>
  );
}
