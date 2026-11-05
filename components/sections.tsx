import Image from "next/image";
import site from "@/data/site.json";
import avis from "@/data/avis.json";
import partenaires from "@/data/partenaires.json";
import { BookButton, BookingForm } from "@/components/BookingForm";
import { InstagramIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { Mark } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { extras, formatDay, masterclass, money, services, waLink } from "@/lib/booking";
import { altOf, fill, type Dict, type Locale } from "@/lib/i18n";
import { img } from "@/lib/media";

export const photo = (d: Dict, path: string) => ({ ...img(path), alt: altOf(d, path) });

export function SectionHead({ eyebrow, title, text, center = true, id, ltrEyebrow = false }: { eyebrow: string; title: string; text?: string; center?: boolean; id?: string; ltrEyebrow?: boolean }) {
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-xl"}>
      <p className="eyebrow" dir={ltrEyebrow ? "ltr" : undefined}>
        {eyebrow}
      </p>
      <h2 id={id} className="display mt-6 text-[2.5rem] md:text-[3.6rem] rtl:md:text-[3.1rem]">
        {title}
      </h2>
      {text && <p className="mt-6 text-[1.0625rem] leading-[1.9] text-muted">{text}</p>}
    </Reveal>
  );
}

/** Photo portrait avec zoom doux au survol. */
export function Portrait({ p, sizes, className = "aspect-[4/5]", priority = false }: { p: ReturnType<typeof photo>; sizes: string; className?: string; priority?: boolean }) {
  return (
    <div className={`shine bg-pearl ${className}`}>
      <Image src={p.src} alt={p.alt} width={p.width} height={p.height} sizes={sizes} quality={75} priority={priority} className="h-full w-full object-cover object-top" />
    </div>
  );
}

/** En-tête des pages intérieures : photo verticale + titre + texte court + un bouton. */
export function PageHero({ eyebrow, title, text, cta, tab, p }: { eyebrow: string; title: string; text: string; cta: string; tab: "event" | "class"; p: ReturnType<typeof photo> }) {
  return (
    <section className="px-5 pt-10 pb-20 md:px-10 md:pt-16 md:pb-28" aria-labelledby="page-title">
      <div className="mx-auto grid max-w-[1300px] items-center gap-12 md:grid-cols-[5fr_6fr] md:gap-20">
        <div className="rise md:order-last">
          <Portrait p={p} sizes="(min-width: 768px) 50vw, 92vw" className="aspect-[4/5] max-h-[78svh] w-full" priority />
        </div>
        <div className="rise [animation-delay:0.15s]">
          <p className="eyebrow" dir="ltr">
            {eyebrow}
          </p>
          <h1 id="page-title" className="display mt-6 text-[3rem] md:text-[4.6rem] rtl:md:text-[3.8rem]">
            {title}
          </h1>
          <p className="mt-6 max-w-lg text-[1.0625rem] leading-[1.9] text-muted">{text}</p>
          <BookButton tab={tab} className="btn-solid mt-10">
            {cta}
          </BookButton>
        </div>
      </div>
    </section>
  );
}

/** Prestations et prix, en liste claire : nom, ce qui est inclus, prix « à partir de » (ou « sur demande »). */
export function ServicesList({ d, lang, only }: { d: Dict; lang: Locale; only?: string[] }) {
  const s = d.services;
  const list = only ? services.filter((x) => only.includes(x.id)) : services;
  return (
    <section id="services" className="px-5 py-24 md:px-10 md:py-32" aria-labelledby="services-title">
      <div className="mx-auto grid max-w-[1300px] gap-14 lg:grid-cols-[2fr_3fr] lg:gap-24">
        <div>
          <SectionHead eyebrow={s.eyebrow} title={s.title} text={s.text} center={false} id="services-title" />
          <Reveal className="mt-10">
            <BookButton tab="event" className="btn-line">
              {s.cta}
            </BookButton>
          </Reveal>
        </div>
        <div>
          <ul className="border-t border-line">
            {list.map((x, i) => {
              const item = s.items[x.id];
              return (
                <Reveal as="li" key={x.id} delay={i * 0.06} className="grid gap-4 border-b border-line py-8 sm:grid-cols-[1fr_auto] sm:gap-10">
                  <div>
                    <h3 className="display flex flex-wrap items-baseline gap-x-4 text-[1.75rem] rtl:text-[1.55rem]">
                      {item.name}
                      {x.featured && <span className="eyebrow !text-[0.625rem] rtl:!text-[0.8125rem]">{s.featured}</span>}
                    </h3>
                    <p className="mt-3 text-[0.9375rem] leading-[1.8] text-muted">{item.text}</p>
                    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[0.875rem]">
                      {item.includes.map((inc) => (
                        <li key={inc} className="flex items-center gap-2.5">
                          <span className="h-px w-3 shrink-0 bg-gold" aria-hidden="true" />
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="sm:pt-2 sm:text-end">
                    {x.price ? (
                      <>
                        <span className="block text-[0.75rem] tracking-[0.14em] text-muted uppercase rtl:tracking-normal">{s.from}</span>
                        <span className="display text-[1.9rem]">{money(x.price, lang)}</span>
                      </>
                    ) : (
                      // À REMPLIR : prix « à partir de » dans data/prestations.json
                      <span className="text-[0.875rem] text-gold-ink">{s.onRequest}</span>
                    )}
                  </p>
                </Reveal>
              );
            })}
          </ul>
          {!only && (
            <div className="mt-10 grid gap-6 sm:grid-cols-[auto_1fr_1fr] sm:gap-10">
              <p className="eyebrow pt-1">{s.extrasTitle}</p>
              {extras.map((x) => (
                <p key={x.id} className="text-[0.9375rem] leading-[1.8] text-muted">
                  <span className="text-ink">{s.extras[x.id].name}. </span>
                  {s.extras[x.id].text}
                  {x.price ? ` ${s.from} ${money(x.price, lang)}.` : ""}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function Process({ d }: { d: Dict }) {
  return (
    <section className="border-t border-line px-5 py-24 md:px-10 md:py-32" aria-labelledby="process-title">
      <SectionHead eyebrow={d.process.eyebrow} title={d.process.title} id="process-title" />
      <ol className="mx-auto mt-16 grid max-w-[1300px] gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {d.process.steps.map((s, i) => (
          <Reveal as="li" key={s.t} delay={i * 0.1} className="border-t border-gold/60 pt-6">
            <span className="num text-[0.9375rem] text-gold-ink" dir="ltr">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="display mt-3 text-[1.6rem] rtl:text-[1.45rem]">{s.t}</h3>
            <p className="mt-3 text-[0.9375rem] leading-[1.8] text-muted">{s.x}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/** Masterclass : format, programme, inclus, un bouton. Les données viennent de data/masterclass.json. */
export function MasterclassBlock({ d, lang, imgs, heading = true }: { d: Dict; lang: Locale; imgs: ReturnType<typeof photo>[]; heading?: boolean }) {
  const mc = d.masterclass;
  const facts = [
    { k: mc.formatTitle, v: mc.format },
    { k: mc.durationTitle, v: masterclass.hours ? fill(mc.hours, { n: masterclass.hours }) : mc.onRequest },
    { k: mc.priceTitle, v: masterclass.price ? money(masterclass.price, lang, masterclass.currency) : mc.onRequest },
    { k: mc.levelsTitle, v: `${d.booking.fields.levels.beginner} · ${d.booking.fields.levels.pro}` },
  ];
  return (
    <section id="masterclass" className="bg-nude-soft px-5 py-24 md:px-10 md:py-32" aria-labelledby="mc-title">
      <div className="mx-auto grid max-w-[1300px] items-start gap-14 lg:grid-cols-[5fr_6fr] lg:gap-24">
        <Reveal className="grid grid-cols-[3fr_2fr] items-end gap-4">
          <Portrait p={imgs[0]} sizes="(min-width: 1024px) 26vw, 55vw" className="aspect-[3/4]" />
          <Portrait p={imgs[1]} sizes="(min-width: 1024px) 17vw, 36vw" className="mb-14 aspect-[3/4]" />
        </Reveal>
        <div>
          {heading ? (
            <SectionHead eyebrow={mc.eyebrow} title={mc.title} text={mc.text} center={false} id="mc-title" />
          ) : (
            <Reveal>
              <h2 id="mc-title" className="sr-only">
                {mc.title}
              </h2>
              <p className="text-[1.0625rem] leading-[1.9] text-muted">{mc.text}</p>
            </Reveal>
          )}
          <Reveal className="mt-12">
            <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-y border-line py-8">
              {facts.map((f) => (
                <div key={f.k}>
                  <dt className="eyebrow">{f.k}</dt>
                  <dd className="mt-2 text-[0.9375rem]">{f.v}</dd>
                </div>
              ))}
            </dl>
            {masterclass.sessions.length > 0 ? (
              <div className="mt-8">
                <p className="eyebrow">{mc.upcoming}</p>
                <ul className="mt-4 space-y-2 text-[0.9375rem]">
                  {masterclass.sessions.map((s) => (
                    <li key={s.date}>
                      {formatDay(s.date, lang)} · {s.city}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-8 text-[0.9375rem] leading-[1.8] text-muted">
                <span className="text-ink">{mc.soon}. </span>
                {mc.soonText}
              </p>
            )}
          </Reveal>
          <div className="mt-12 grid gap-12 sm:grid-cols-[3fr_2fr]">
            <Reveal>
              <h3 className="eyebrow">{mc.programTitle}</h3>
              {/* À REMPLIR / valider avec Oshrat : programme réel de la masterclass */}
              <ol className="mt-6 space-y-5">
                {mc.program.map((p, i) => (
                  <li key={p.t} className="flex gap-5">
                    <span className="num pt-1 text-[0.875rem] text-gold-ink" dir="ltr">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="leading-[1.7]">
                      <span className="display text-[1.3rem]">{p.t}</span>
                      <span className="block text-[0.9375rem] text-muted">{p.x}</span>
                    </p>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="eyebrow">{mc.includedTitle}</h3>
              <ul className="mt-6 space-y-3 text-[0.9375rem]">
                {mc.included.map((x) => (
                  <li key={x} className="flex gap-3">
                    <span className="mt-[0.7em] h-px w-3 shrink-0 bg-gold" aria-hidden="true" />
                    {x}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal className="mt-12">
            <BookButton tab="class" className="btn-solid">
              {mc.cta}
            </BookButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Tips({ d }: { d: Dict }) {
  return (
    <section id="tips" className="px-5 py-24 md:px-10 md:py-32" aria-labelledby="tips-title">
      <SectionHead eyebrow={d.tips.eyebrow} title={d.tips.title} id="tips-title" />
      {/* Conseils rédigés comme une proposition : à faire valider par Oshrat (story « טיפים לחתונה ») */}
      <ol className="mx-auto mt-16 grid max-w-[1300px] gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {d.tips.items.map((t, i) => (
          <Reveal as="li" key={t.t} delay={(i % 3) * 0.08} className="bg-ivory p-8 md:p-10">
            <span className="num text-[0.875rem] text-gold-ink" dir="ltr">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="display mt-4 text-[1.55rem] rtl:text-[1.4rem]">{t.t}</h3>
            <p className="mt-3 text-[0.9375rem] leading-[1.8] text-muted">{t.x}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/** Maquilleuses partenaires : n'apparaît que si data/partenaires.json en contient (avec leur accord). */
export function Partners({ d }: { d: Dict }) {
  const list = partenaires.partners as { name: string; instagram: string }[];
  if (list.length === 0) return null;
  return (
    <section className="border-t border-line px-5 py-20 md:px-10" aria-labelledby="partners-title">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">{d.partners.eyebrow}</p>
        <h2 id="partners-title" className="display mt-5 text-[2.2rem] md:text-[2.8rem]">
          {d.partners.title}
        </h2>
        <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {list.map((p) => (
            <li key={p.name}>
              <a href={p.instagram} target="_blank" rel="noopener noreferrer" className="link-line">
                {p.name}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[0.9375rem] text-muted">{d.partners.text}</p>
      </Reveal>
    </section>
  );
}

export function Zone({ d }: { d: Dict }) {
  // À CONFIRMER : ville de base (data/site.json → city) et zone de déplacement
  const text = site.city ? fill(d.zone.cityText, { city: site.city }) : d.zone.text;
  return (
    <section className="bg-pearl px-5 py-20 md:px-10 md:py-24" aria-labelledby="zone-title">
      <Reveal className="mx-auto flex max-w-[1300px] flex-col gap-6 md:flex-row md:items-baseline md:justify-between md:gap-16">
        <div className="shrink-0">
          <p className="eyebrow">{d.zone.eyebrow}</p>
          <h2 id="zone-title" className="display mt-4 text-[2.4rem] md:text-[3rem]">
            {d.zone.title}
          </h2>
        </div>
        <p className="max-w-xl text-[1.0625rem] leading-[1.9] text-muted">{text}</p>
      </Reveal>
    </section>
  );
}

export function Faq({ d }: { d: Dict }) {
  return (
    <section className="px-5 py-24 md:px-10 md:py-32" aria-labelledby="faq-title">
      <div className="mx-auto grid max-w-[1200px] gap-12 md:grid-cols-[2fr_3fr] md:gap-20">
        <SectionHead eyebrow={d.faq.eyebrow} title={d.faq.title} center={false} id="faq-title" />
        <div className="border-t border-line">
          {d.faq.items.map((f) => (
            <details key={f.q} className="group border-b border-line">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                <h3 className="display text-[1.3rem] leading-snug rtl:text-[1.2rem]">{f.q}</h3>
                <span className="relative h-3 w-3 shrink-0" aria-hidden="true">
                  <span className="absolute top-1/2 h-px w-3 bg-ink" />
                  <span className="absolute top-1/2 h-px w-3 rotate-90 bg-ink transition-transform duration-500 group-open:rotate-0" />
                </span>
              </summary>
              <p className="pb-6 text-[0.9375rem] leading-[1.85] text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Les mots des mariées, juste au-dessus du formulaire. */
export function Words({ d }: { d: Dict }) {
  const reviews = avis.reviews as { text: string; name: string }[];
  return (
    <section className="border-t border-line px-5 py-24 md:py-28" aria-labelledby="words-title">
      <Reveal className="mx-auto max-w-3xl text-center">
        <Mark className="mx-auto h-6 w-16 text-gold" />
        <p className="eyebrow mt-8">{d.words.eyebrow}</p>
        <h2 id="words-title" className="display mt-6 text-[2.3rem] md:text-[3.2rem] rtl:md:text-[2.7rem]">
          {d.words.title}
        </h2>
        {/* À REMPLIR avec de vrais avis de mariées (data/avis.json, story « כלות מפרגנות »), avec leur accord : aucun avis n'est inventé */}
        {reviews.length > 0 ? (
          <ul className="mt-14 space-y-12">
            {reviews.map((r) => (
              <li key={r.name}>
                <blockquote className="display text-[1.6rem] leading-[1.5] italic">“{r.text}”</blockquote>
                <p className="mt-4 text-[0.8125rem] tracking-[0.2em] text-gold-ink uppercase">{r.name}</p>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <p className="mx-auto mt-6 max-w-xl text-[1.0625rem] leading-[1.9] text-muted">{d.words.text}</p>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn-line mt-10">
              <InstagramIcon className="h-4 w-4" />
              {d.words.cta}
            </a>
          </>
        )}
      </Reveal>
    </section>
  );
}

/** Formulaire de vérification de date, avec les coordonnées et les horaires de réponse. */
export function BookingSection({ d, lang, initialTab = "event" }: { d: Dict; lang: Locale; initialTab?: "event" | "class" }) {
  const wa = waLink(d.whatsapp.hello);
  return (
    <section id="contact" className="bg-pearl/70 px-5 py-24 md:px-10 md:py-32" aria-labelledby="contact-title">
      <div className="mx-auto grid max-w-[1300px] gap-16 lg:grid-cols-[2fr_3fr] lg:gap-24">
        <div>
          <SectionHead eyebrow={d.booking.eyebrow} title={d.booking.title} text={d.booking.text} center={false} id="contact-title" />
          <Reveal className="mt-12 space-y-8 border-t border-line pt-10">
            <ul className="space-y-3">
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-3 hover:text-gold-ink">
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`tel:${site.phoneIntl.replace(/[\s-]/g, "")}`} className="inline-flex min-h-8 items-center gap-3 hover:text-gold-ink">
                  <PhoneIcon className="h-4 w-4" />
                  <span dir="ltr">{lang === "he" ? site.phone : site.phoneIntl}</span>
                </a>
              </li>
              <li>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-3 hover:text-gold-ink">
                  <InstagramIcon className="h-4 w-4" />
                  <span dir="ltr">{site.instagramHandle}</span>
                </a>
              </li>
            </ul>
            <p className="text-[0.9375rem] leading-[1.8] text-muted">
              <span className="text-ink">{d.footer.hours}. </span>
              {d.infobar.reminder}.
            </p>
          </Reveal>
        </div>
        <Reveal className="bg-ivory p-6 sm:p-10 md:p-12">
          <BookingForm initialTab={initialTab} />
        </Reveal>
      </div>
    </section>
  );
}
