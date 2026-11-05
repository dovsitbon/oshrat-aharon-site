import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookButton } from "@/components/BookingForm";
import { DateBar } from "@/components/DateBar";
import { Gallery, type GalleryCat, type GalleryItem } from "@/components/Gallery";
import { ArrowIcon, WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { BookingSection, Faq, MasterclassBlock, Partners, photo, Portrait, Process, SectionHead, ServicesList, Tips, Words, Zone } from "@/components/sections";
import { waLink } from "@/lib/booking";
import { getDict, isLocale } from "@/lib/i18n";
import { homeJsonLd, ldScript, pageMeta } from "@/lib/jsonld";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return pageMeta(lang, "", d.meta.title, d.meta.description);
}

// Galerie des mariées : [photo, filtre]. Aucun prénom ni compte de mariée n'est affiché.
const GALLERY: [string, GalleryCat][] = [
  ["/media/hero/chignon-dos-01.jpg", "chignon"],
  ["/media/mariees/ondulations-07.jpg", "waves"],
  ["/media/mariees/semi-attache-01.jpg", "halfup"],
  ["/media/details/couronne-01.jpg", "accessories"],
  ["/media/mariees/chignon-flou-01.jpg", "chignon"],
  ["/media/mariees/ondulations-02.jpg", "waves"],
  ["/media/details/chignon-dos-01.jpg", "chignon"],
  ["/media/mariees/queue-de-cheval-01.jpg", "halfup"],
  ["/media/details/chignon-bijou-01.jpg", "accessories"],
  ["/media/mariees/ondulations-08.jpg", "waves"],
  ["/media/mariees/chignon-bas-02.jpg", "chignon"],
  ["/media/mariees/semi-attache-02.jpg", "halfup"],
  ["/media/details/couronne-03.jpg", "accessories"],
  ["/media/mariees/ondulations-05.jpg", "waves"],
  ["/media/mariees/chignon-flou-02.jpg", "chignon"],
  ["/media/mariees/semi-attache-05.jpg", "halfup"],
  ["/media/mariees/ondulations-10.jpg", "waves"],
  ["/media/details/chignon-dos-02.jpg", "chignon"],
  ["/media/details/fleurs-01.jpg", "accessories"],
  ["/media/mariees/queue-de-cheval-02.jpg", "halfup"],
  ["/media/mariees/chignon-bas-05.jpg", "chignon"],
  ["/media/mariees/ondulations-11.jpg", "waves"],
  ["/media/mariees/semi-attache-04.jpg", "halfup"],
  ["/media/details/couronne-02.jpg", "accessories"],
  ["/media/mariees/chignon-haut-01.jpg", "chignon"],
  ["/media/mariees/ondulations-03.jpg", "waves"],
  ["/media/mariees/chignon-bas-04.jpg", "chignon"],
  ["/media/mariees/ondulations-09.jpg", "waves"],
];

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const home = `/${lang}`;

  // Hero : triptyque sur grand écran (chignon de dos, ondulations, chignon bijou), une seule photo sur mobile
  const heroCenter = photo(d, "/media/hero/ondulations-01.jpg");
  const heroSides = [photo(d, "/media/hero/chignon-dos-01.jpg"), photo(d, "/media/hero/chignon-bijou-01.jpg")];
  const tiles = ["/media/mariees/chignon-flou-01.jpg", "/media/soiree/soiree-ondulations-01.jpg", "/media/masterclass/masterclass-gestes-01.jpg"].map((p) => photo(d, p));
  const tileLinks = [`${home}/bridal-hair`, `${home}/evening-hair`, `${home}/masterclass`];
  const bleed = photo(d, "/media/mariees/ondulations-04.jpg");
  const about = photo(d, "/media/apropos/oshrat-01.jpg");
  const mcImgs = [photo(d, "/media/masterclass/masterclass-gestes-01.jpg"), photo(d, "/media/masterclass/lisse-01.jpg")];
  const galleryItems: GalleryItem[] = GALLERY.map(([p, cat]) => ({ ...photo(d, p), cat }));
  const wa = waLink(d.whatsapp.hello);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(homeJsonLd(lang))} />

      {/* ——— Hero ——— */}
      <section className="relative" aria-labelledby="hero-title">
        <div className="relative h-[calc(100svh-7.5rem)] min-h-[520px] overflow-hidden bg-pearl text-ivory md:h-[calc(100svh-9rem)] md:max-h-[920px]">
          <div className="absolute inset-0 grid md:grid-cols-[1fr_1.25fr_1fr] md:gap-1.5">
            <Image src={heroSides[0].src} alt={heroSides[0].alt} width={heroSides[0].width} height={heroSides[0].height} sizes="30vw" quality={75} className="hidden h-full w-full object-cover object-[50%_20%] md:block" />
            <Image src={heroCenter.src} alt={heroCenter.alt} width={heroCenter.width} height={heroCenter.height} sizes="(min-width: 768px) 40vw, 100vw" quality={80} priority className="h-full w-full object-cover object-[50%_18%]" />
            <Image src={heroSides[1].src} alt={heroSides[1].alt} width={heroSides[1].width} height={heroSides[1].height} sizes="30vw" quality={75} className="hidden h-full w-full object-cover object-[50%_30%] md:block" />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(40,32,29,0)_45%,rgba(40,32,29,0.62)_100%)]" aria-hidden="true" />
          <div className="relative z-10 flex h-full flex-col items-center justify-end px-5 pb-12 text-center md:pb-24">
            <p className="rise eyebrow !text-ivory/90" dir="ltr">
              {d.hero.eyebrow}
            </p>
            <h1 id="hero-title" className="rise display mt-5 max-w-[16ch] text-[2.7rem] [animation-delay:0.15s] sm:text-[3.6rem] md:text-[4.6rem] rtl:md:text-[3.9rem]">
              {d.hero.title}
            </h1>
            <div className="rise mt-9 flex flex-col items-center gap-3 [animation-delay:0.3s] sm:flex-row sm:gap-5">
              <BookButton tab="event" className="btn-line on-dark min-w-[15rem] bg-ivory !text-ink hover:!bg-ink hover:!text-ivory">
                {d.hero.cta}
              </BookButton>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="nav-link inline-flex min-h-12 items-center gap-2 px-4 text-ivory/90 hover:text-ivory">
                <WhatsAppIcon className="h-4 w-4" />
                {d.hero.whatsapp}
              </a>
            </div>
          </div>
        </div>
        <div className="relative z-10 mx-auto max-w-[1200px] px-0 md:-mt-12 md:px-10">
          <DateBar className="border-b border-line px-5 py-8 md:border md:px-10 md:py-7 md:shadow-[0_24px_60px_-40px_rgba(58,48,44,0.45)]" />
        </div>
      </section>

      {/* ——— Tuiles de prestations ——— */}
      <section className="px-5 pt-20 pb-24 md:px-10 md:pt-28 md:pb-32" aria-labelledby="tiles-title">
        <h2 id="tiles-title" className="sr-only">
          {d.tiles.title}
        </h2>
        <ol className="mx-auto grid max-w-[1300px] gap-14 md:grid-cols-3 md:gap-8">
          {d.tiles.items.map((c, i) => (
            <Reveal as="li" key={c.name} delay={i * 0.1} className="group">
              <Link href={tileLinks[i]} className="block">
                <Portrait p={tiles[i]} sizes="(min-width: 768px) 31vw, 92vw" />
                <div className="mt-7 flex items-baseline justify-between gap-4 border-b border-line pb-5">
                  <h3 className="display text-[2rem] rtl:text-[1.8rem]">{c.name}</h3>
                  <span className="num text-[0.9375rem] text-gold-ink" dir="ltr">
                    {String(i + 1).padStart(3, "0")}
                  </span>
                </div>
                <p className="mt-5 leading-[1.85] text-muted">{c.text}</p>
                <span className="nav-link link-line mt-6 inline-flex items-center gap-2">
                  {c.link}
                  <ArrowIcon className="h-3.5 w-3.5 rtl:-scale-x-100" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ——— Manifeste ——— */}
      <section className="bg-pearl px-5 py-28 md:py-36" aria-labelledby="manifesto-title">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">{d.manifesto.eyebrow}</p>
          <h2 id="manifesto-title" className="display mt-8 text-[2.4rem] leading-[1.15] md:text-[3.6rem] rtl:md:text-[3rem]">
            {d.manifesto.title}
          </h2>
          <div className="hairline mx-auto my-10 w-24" />
          <p className="mx-auto max-w-2xl text-[1.0625rem] leading-[1.95] text-muted">{d.manifesto.text}</p>
        </Reveal>
      </section>

      {/* ——— Prestations et prix ——— */}
      <ServicesList d={d} lang={lang} />

      {/* ——— Grande image, texte très court ——— */}
      <section className="relative flex h-[80svh] min-h-[460px] items-end overflow-hidden bg-pearl text-ivory" aria-label={d.pages.bridal.title}>
        <Image src={bleed.src} alt={bleed.alt} width={bleed.width} height={bleed.height} sizes="100vw" quality={75} className="absolute inset-0 h-full w-full object-cover object-[50%_22%]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(40,32,29,0)_40%,rgba(40,32,29,0.6)_100%)]" aria-hidden="true" />
        <Reveal className="relative mx-auto w-full max-w-[1300px] px-5 pb-14 md:px-10 md:pb-20">
          <p className="display max-w-2xl text-[2.6rem] leading-[1.1] md:text-[4.2rem] rtl:md:text-[3.5rem]">{d.manifesto.bleed}</p>
          <Link href={`${home}/bridal-hair`} className="nav-link link-line mt-8 inline-flex items-center gap-2 text-ivory">
            {d.tiles.items[0].link}
            <ArrowIcon className="h-3.5 w-3.5 rtl:-scale-x-100" />
          </Link>
        </Reveal>
      </section>

      {/* ——— Portrait d'Oshrat ——— */}
      <section id="about" className="px-5 py-24 md:px-10 md:py-32" aria-labelledby="about-title">
        <div className="mx-auto grid max-w-[1200px] items-center gap-14 md:grid-cols-[5fr_6fr] md:gap-24">
          <Reveal>
            <Portrait p={{ ...about, alt: d.about.photoAlt }} sizes="(min-width: 768px) 40vw, 92vw" className="aspect-[4/5]" />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">{d.about.eyebrow}</p>
            <h2 id="about-title" className="display mt-6 text-[3rem] md:text-[4.2rem] rtl:md:text-[3.6rem]">
              {d.about.title}
            </h2>
            {/* À COMPLÉTER avec Oshrat : son histoire, ses années d'expérience (aucun chiffre inventé) */}
            {d.about.text.map((t) => (
              <p key={t.slice(0, 24)} className="mt-6 text-[1.0625rem] leading-[1.9] text-muted">
                {t}
              </p>
            ))}
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-line mt-10">
              <WhatsAppIcon className="h-4 w-4" />
              {d.about.cta}
            </a>
          </Reveal>
        </div>
      </section>

      {/* ——— Nos mariées ——— */}
      <section id="gallery" className="bg-pearl px-4 py-24 md:px-10 md:py-32" aria-labelledby="gallery-title">
        <SectionHead eyebrow={d.gallery.eyebrow} title={d.gallery.title} text={d.gallery.text} id="gallery-title" />
        <div className="mx-auto mt-12 max-w-[1400px]">
          <Gallery items={galleryItems} labels={d.gallery.lightbox} filters={d.gallery.filters} openLabel={d.gallery.open} />
        </div>
      </section>

      <Process d={d} />
      <MasterclassBlock d={d} lang={lang} imgs={mcImgs} />
      <Tips d={d} />
      <Partners d={d} />
      <Zone d={d} />
      <Faq d={d} />
      <Words d={d} />
      <BookingSection d={d} lang={lang} />
    </>
  );
}
