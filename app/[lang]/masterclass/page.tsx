import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingSection, Faq, MasterclassBlock, PageHero, photo } from "@/components/sections";
import { getDict, isLocale } from "@/lib/i18n";
import { ldScript, pageJsonLd, pageMeta } from "@/lib/jsonld";

export async function generateMetadata({ params }: PageProps<"/[lang]/masterclass">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const m = getDict(lang).meta.masterclass;
  return pageMeta(lang, "/masterclass", m.title, m.description);
}

export default async function Masterclass({ params }: PageProps<"/[lang]/masterclass">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const p = d.pages.masterclass;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(pageJsonLd(lang, "masterclass"))} />
      <PageHero eyebrow={p.eyebrow} title={d.masterclass.title} text={p.intro} cta={p.cta} tab="class" p={photo(d, "/media/masterclass/masterclass-gestes-01.jpg")} />
      <MasterclassBlock d={d} lang={lang} imgs={[photo(d, "/media/details/chignon-dos-02.jpg"), photo(d, "/media/mariees/chignon-flou-04.jpg")]} heading={false} />
      <Faq d={d} />
      <BookingSection d={d} lang={lang} initialTab="class" />
    </>
  );
}
