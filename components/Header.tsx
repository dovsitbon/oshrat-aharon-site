"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import site from "@/data/site.json";
import { Mark, Wordmark } from "@/components/Logo";
import { LangSwitch } from "@/components/LangSwitch";
import { CloseIcon, InstagramIcon, MenuIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";

/** Lien « Vérifier ma date » : le formulaire de la page courante, ou celui de l'accueil (page légale). */
export function useBookHref() {
  const { lang } = useLocale();
  const path = usePathname() ?? "";
  return path.endsWith("/legal") ? `/${lang}#contact` : "#contact";
}

/** Bandeau d'infos pratiques, refermable (mémorisé dans le navigateur). */
function InfoBar() {
  const { d } = useLocale();
  return (
    <div className="infobar border-b border-line bg-pearl text-ink">
      <div className="relative mx-auto flex min-h-10 max-w-[1400px] items-center justify-center px-12 py-2 text-center text-[0.8125rem] leading-snug">
        <p>
          {d.infobar.text}
          <span className="mx-2 hidden text-gold sm:inline" aria-hidden="true">
            ·
          </span>
          <span className="block text-muted sm:inline">{d.infobar.reminder}</span>
        </p>
        <button
          type="button"
          aria-label={d.infobar.close}
          onClick={() => {
            try {
              localStorage.setItem("oshrat-infobar", "closed");
            } catch {}
            document.documentElement.classList.add("infobar-closed");
          }}
          className="absolute end-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-muted transition-colors hover:text-ink"
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function Header() {
  const { lang, d } = useLocale();
  const [menu, setMenu] = useState(false);
  const bookHref = useBookHref();

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (menu) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = menu ? "hidden" : "";
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const home = `/${lang}`;
  const links = [
    { href: `${home}/bridal-hair`, label: d.nav.brides },
    { href: `${home}/evening-hair`, label: d.nav.evening },
    { href: `${home}/masterclass`, label: d.nav.masterclass },
    { href: `${home}#gallery`, label: d.nav.gallery },
    { href: `${home}#tips`, label: d.nav.tips },
    { href: bookHref, label: d.nav.contact },
  ];

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[70] focus:bg-ivory focus:px-4 focus:py-2 focus:text-ink">
        {d.nav.skip}
      </a>
      <InfoBar />
      <header className="sticky top-0 z-50 bg-ivory/95 text-ink backdrop-blur-sm">
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-line px-4 md:h-[5rem] md:px-10">
          <div className="flex items-center">
            <button type="button" className="-m-2 flex h-11 w-11 items-center justify-center min-[1280px]:hidden" onClick={() => setMenu(true)} aria-label={d.nav.menu} aria-expanded={menu}>
              <MenuIcon />
            </button>
            <nav className="hidden items-center gap-6 min-[1280px]:flex" aria-label={d.nav.menu}>
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="nav-link whitespace-nowrap transition-opacity duration-500 hover:opacity-60">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link href={home} className="flex items-center" aria-label={d.nav.home}>
            <Wordmark />
          </Link>

          <div className="flex items-center justify-end gap-4 md:gap-5">
            <LangSwitch lang={lang} label={d.nav.language} className="hidden lg:flex" />
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="-m-2 hidden h-11 w-11 items-center justify-center transition-opacity hover:opacity-60 lg:flex" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href={bookHref} className="nav-link hidden min-h-10 items-center border border-ink bg-ink px-5 whitespace-nowrap text-ivory transition-colors duration-500 hover:border-gold-ink hover:bg-gold-ink sm:flex">
              {d.nav.book}
            </a>
          </div>
        </div>
      </header>

      {menu && (
        <div className="fade-in fixed inset-0 z-[60] flex flex-col overscroll-contain bg-ivory text-ink" role="dialog" aria-modal="true" aria-label={d.nav.menu}>
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center px-4 md:h-[5rem] md:px-10">
            <button type="button" className="-m-2 flex h-11 w-11 items-center justify-center justify-self-start" onClick={() => setMenu(false)} aria-label={d.nav.close}>
              <CloseIcon />
            </button>
            <Wordmark />
            <span />
          </div>
          <nav className="flex flex-1 flex-col items-center justify-center gap-5" aria-label={d.nav.menu}>
            {links.map((l, i) => (
              <div key={l.href} className="fade-up" style={{ animationDelay: `${0.05 * i + 0.1}s` }}>
                <Link href={l.href} onClick={() => setMenu(false)} className="display text-[2.2rem] rtl:text-[1.9rem]">
                  {l.label}
                </Link>
              </div>
            ))}
            <div className="fade-in mt-6" style={{ animationDelay: "0.5s" }}>
              <a href={bookHref} onClick={() => setMenu(false)} className="btn-solid">
                {d.nav.book}
              </a>
            </div>
            <Mark className="mt-8 h-6 w-16 text-gold" />
          </nav>
          <div className="flex items-center justify-between border-t border-line px-6 py-4">
            <LangSwitch lang={lang} label={d.nav.language} />
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 text-sm">
              <InstagramIcon />
              <span dir="ltr">{site.instagramHandle}</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
