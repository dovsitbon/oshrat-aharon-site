import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StylePage } from "@/components/StylePage";
import { getDict, isLocale } from "@/lib/i18n";
import { ldScript, pageJsonLd, pageMeta } from "@/lib/jsonld";

export async function generateMetadata({ params }: PageProps<"/[lang]/evening-hair">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const m = getDict(lang).meta.evening;
  return pageMeta(lang, "/evening-hair", m.title, m.description);
}

export default async function EveningHair({ params }: PageProps<"/[lang]/evening-hair">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(pageJsonLd(lang, "evening"))} />
      <StylePage
        d={d}
        lang={lang}
        kind="evening"
        hero="/media/soiree/soiree-ondulations-03.jpg"
        styleImgs={["/media/soiree/soiree-ondulations-05.jpg", "/media/mariees/chignon-bas-03.jpg", "/media/soiree/soiree-attache-01.jpg"]}
      />
    </>
  );
}
