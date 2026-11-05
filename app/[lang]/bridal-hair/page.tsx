import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StylePage } from "@/components/StylePage";
import { getDict, isLocale } from "@/lib/i18n";
import { ldScript, pageJsonLd, pageMeta } from "@/lib/jsonld";

export async function generateMetadata({ params }: PageProps<"/[lang]/bridal-hair">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const m = getDict(lang).meta.bridal;
  return pageMeta(lang, "/bridal-hair", m.title, m.description);
}

export default async function BridalHair({ params }: PageProps<"/[lang]/bridal-hair">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(pageJsonLd(lang, "bridal"))} />
      <StylePage
        d={d}
        lang={lang}
        kind="bridal"
        hero="/media/mariees/ondulations-07.jpg"
        styleImgs={["/media/details/chignon-dos-01.jpg", "/media/mariees/semi-attache-02.jpg", "/media/mariees/ondulations-01.jpg", "/media/details/couronne-01.jpg"]}
      />
    </>
  );
}
