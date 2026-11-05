import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import "../globals.css";
import site from "@/data/site.json";
import { dirOf, getDict, isLocale, locales } from "@/lib/i18n";
import { Providers } from "@/components/providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Intro } from "@/components/Intro";
import { SmoothScroll } from "@/components/SmoothScroll";
import { FloatingActions } from "@/components/FloatingActions";

// Polices servies en local (app/fonts) : aucun appel à Google Fonts, ni au build ni à l'affichage.
// Latin : Cormorant Garamond (titres, très fin) + Jost 300 (texte). Hébreu : Frank Ruhl Libre (titres) + Heebo 300 (texte).
const cormorant = localFont({
  src: [
    { path: "../fonts/cormorant-garamond-latin-300-normal.woff2", weight: "300" },
    { path: "../fonts/cormorant-garamond-latin-300-italic.woff2", weight: "300", style: "italic" },
    { path: "../fonts/cormorant-garamond-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/cormorant-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  adjustFontFallback: false,
});
const jost = localFont({
  src: [
    { path: "../fonts/jost-latin-300-normal.woff2", weight: "300" },
    { path: "../fonts/jost-latin-400-normal.woff2", weight: "400" },
  ],
  variable: "--font-jost",
  display: "swap",
  adjustFontFallback: false,
});
const heebo = localFont({
  src: [
    { path: "../fonts/heebo-hebrew-300-normal.woff2", weight: "300" },
    { path: "../fonts/heebo-hebrew-400-normal.woff2", weight: "400" },
    { path: "../fonts/heebo-hebrew-500-normal.woff2", weight: "500" },
  ],
  variable: "--font-heebo",
  display: "swap",
  adjustFontFallback: false,
  preload: false,
});
const frank = localFont({
  src: [
    { path: "../fonts/frank-ruhl-libre-hebrew-300-normal.woff2", weight: "300" },
    { path: "../fonts/frank-ruhl-libre-hebrew-400-normal.woff2", weight: "400" },
  ],
  variable: "--font-frank",
  display: "swap",
  adjustFontFallback: false,
  preload: false,
});

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    metadataBase: new URL(site.url),
    applicationName: site.nameLatin,
    formatDetection: { telephone: false },
    authors: [{ name: "Oshrat Aharon" }],
    robots: { index: true, follow: true, "max-image-preview": "large" },
  };
}

export const viewport: Viewport = { themeColor: "#fbf8f4", width: "device-width", initialScale: 1 };

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

const introScript = `document.documentElement.classList.add("js");try{if(sessionStorage.getItem("oshrat-intro")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-seen");if(localStorage.getItem("oshrat-infobar")==="closed")document.documentElement.classList.add("infobar-closed")}catch(e){}`;

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);

  return (
    <html lang={lang} dir={dirOf(lang)} className={`${cormorant.variable} ${jost.variable} ${heebo.variable} ${frank.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <Providers lang={lang} d={d}>
          <Intro skipLabel={d.intro.skip} />
          <SmoothScroll />
          <Header />
          <main id="main">{children}</main>
          <Footer lang={lang} d={d} />
          <FloatingActions />
        </Providers>
      </body>
    </html>
  );
}
