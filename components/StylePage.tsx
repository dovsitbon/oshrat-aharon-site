import { BookButton } from "@/components/BookingForm";
import { Reveal } from "@/components/Reveal";
import { BookingSection, Faq, PageHero, photo, Portrait, Process, SectionHead, ServicesList, Words, Zone } from "@/components/sections";
import type { Dict, Locale } from "@/lib/i18n";

/** Page « Coiffures de mariée » ou « Coiffures de soirée » : hero, styles en blocs alternés photo + texte, prix, déroulé, FAQ, avis, formulaire. */
export function StylePage({ d, lang, kind, hero, styleImgs }: { d: Dict; lang: Locale; kind: "bridal" | "evening"; hero: string; styleImgs: string[] }) {
  const p = d.pages[kind];
  const imgs = styleImgs.map((s) => photo(d, s));
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} text={p.intro} cta={p.cta} tab="event" p={photo(d, hero)} />

      <section className="border-t border-line px-5 py-24 md:px-10 md:py-32" aria-labelledby="styles-title">
        <SectionHead eyebrow={p.eyebrow} title={p.stylesTitle} id="styles-title" ltrEyebrow />
        <div className="mx-auto mt-16 max-w-[1100px] space-y-20 md:mt-24 md:space-y-28">
          {p.styles.map((s, i) => (
            <div key={s.t} className="grid items-center gap-10 md:grid-cols-2 md:gap-20">
              <Reveal className={i % 2 ? "md:order-last" : ""}>
                <Portrait p={imgs[i]} sizes="(min-width: 768px) 45vw, 92vw" className="aspect-[4/5]" />
              </Reveal>
              <Reveal delay={0.1}>
                <span className="num text-[0.9375rem] text-gold-ink" dir="ltr">
                  {String(i + 1).padStart(3, "0")}
                </span>
                <h3 className="display mt-4 text-[2.4rem] md:text-[3rem] rtl:md:text-[2.6rem]">{s.t}</h3>
                <p className="mt-5 max-w-md text-[1.0625rem] leading-[1.9] text-muted">{s.x}</p>
                <BookButton tab="event" className="btn-line mt-8">
                  {p.cta}
                </BookButton>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {kind === "evening" && "companionsTitle" in p && (
        <section className="bg-pearl px-5 py-24 md:py-28" aria-labelledby="companions-title">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 id="companions-title" className="display text-[2.4rem] md:text-[3.2rem]">
              {p.companionsTitle}
            </h2>
            <p className="mt-6 text-[1.0625rem] leading-[1.9] text-muted">{p.companionsText}</p>
          </Reveal>
        </section>
      )}

      <ServicesList d={d} lang={lang} only={kind === "bridal" ? ["bride", "trial", "companions"] : ["evening", "companions", "events"]} />
      <Process d={d} />
      <Zone d={d} />
      <Faq d={d} />
      <Words d={d} />
      <BookingSection d={d} lang={lang} />
    </>
  );
}
