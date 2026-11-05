import type { Metadata } from "next";
import site from "@/data/site.json";
import { getDict, locales, ogLocale, type Locale, type PagePath } from "@/lib/i18n";
import { masterclass, services } from "@/lib/booking";

const business = `${site.url}/#business`;
const phone = site.phoneIntl.replace(/[\s-]/g, "");

/** Métadonnées d'une page : titre, description, canonique, hreflang, Open Graph. */
export function pageMeta(lang: Locale, path: PagePath, title: string, description: string, ogAlt?: string): Metadata {
  const url = `/${lang}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])), "x-default": `/he${path}` },
    },
    openGraph: {
      type: "website",
      url,
      siteName: site.nameLatin,
      title,
      description,
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: ogAlt ?? getDict(lang).meta.ogAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
  };
}

/** Coiffeuse (HairSalon / LocalBusiness) : zone d'intervention Israël (ou sa ville une fois confirmée), horaires de réponse, prestations. */
function businessNode(lang: Locale) {
  const d = getDict(lang);
  const he = lang === "he";
  return {
    "@type": ["HairSalon", "LocalBusiness"],
    "@id": business,
    name: he ? site.name : site.nameLatin,
    alternateName: ["אושרת אהרון", "Oshrat Aharon", "Oshrat Aharon Hairstyle", "אושרת אהרון מעצבת שיער"],
    description: d.meta.description,
    url: `${site.url}/${lang}`,
    image: [`${site.url}/og.jpg`, `${site.url}/media/hero/ondulations-01.jpg`],
    logo: `${site.url}/icon.svg`,
    telephone: phone,
    priceRange: "₪₪",
    address: { "@type": "PostalAddress", addressCountry: "IL", ...(site.city ? { addressLocality: site.city } : {}) },
    areaServed: site.city ? [{ "@type": "City", name: site.city }, { "@type": "Country", name: "Israel" }] : [{ "@type": "Country", name: "Israel" }],
    knowsAbout: ["Bridal hair", "Evening hairstyles", "Bridal updo", "Hair masterclass", "תסרוקות כלה", "תסרוקות ערב", "השתלמות תסרוקות"],
    sameAs: [site.instagram],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: phone,
      contactType: "reservations",
      availableLanguage: ["he", "en"],
      hoursAvailable: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"], opens: site.hours.open, closes: site.hours.close },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: d.services.eyebrow,
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        ...(s.price ? { price: s.price, priceCurrency: "ILS", priceSpecification: { "@type": "PriceSpecification", minPrice: s.price, priceCurrency: "ILS" } } : {}),
        itemOffered: { "@type": "Service", name: d.services.items[s.id].name, description: d.services.items[s.id].text, provider: { "@id": business } },
      })),
    },
  };
}

function courseNode(lang: Locale) {
  const d = getDict(lang);
  const mc = d.masterclass;
  return {
    "@type": "Course",
    "@id": `${site.url}/#masterclass`,
    name: mc.title,
    description: mc.text,
    url: `${site.url}/${lang}/masterclass`,
    provider: { "@id": business },
    inLanguage: "he",
    educationalLevel: [d.booking.fields.levels.beginner, d.booking.fields.levels.pro],
    syllabusSections: mc.program.map((p) => ({ "@type": "Syllabus", name: p.t, description: p.x })),
    ...(masterclass.price ? { offers: { "@type": "Offer", price: masterclass.price, priceCurrency: masterclass.currency } } : {}),
    hasCourseInstance: masterclass.sessions.length
      ? masterclass.sessions.map((s) => ({ "@type": "CourseInstance", courseMode: "Onsite", startDate: s.date, location: { "@type": "Place", name: s.city, address: { "@type": "PostalAddress", addressCountry: "IL" } } }))
      : [{ "@type": "CourseInstance", courseMode: "Onsite", courseWorkload: masterclass.hours ? `PT${masterclass.hours}H` : undefined, location: { "@type": "Place", name: "Israel" } }],
  };
}

function faqNode(lang: Locale) {
  const d = getDict(lang);
  return { "@type": "FAQPage", mainEntity: d.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
}

function crumbs(lang: Locale, name: string, path: PagePath) {
  const d = getDict(lang);
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: d.about.title, item: `${site.url}/${lang}` },
      { "@type": "ListItem", position: 2, name, item: `${site.url}/${lang}${path}` },
    ],
  };
}

export function homeJsonLd(lang: Locale) {
  const d = getDict(lang);
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${site.url}/#website`, url: site.url, name: site.nameLatin, inLanguage: [...locales], publisher: { "@id": business } },
      businessNode(lang),
      ...d.tiles.items.slice(0, 2).map((t) => ({ "@type": "Service", name: t.label, description: t.text, serviceType: t.label, provider: { "@id": business }, areaServed: { "@type": "Country", name: "Israel" } })),
      courseNode(lang),
      faqNode(lang),
    ],
  };
}

export function pageJsonLd(lang: Locale, kind: "bridal" | "evening" | "masterclass") {
  const d = getDict(lang);
  const path: PagePath = kind === "bridal" ? "/bridal-hair" : kind === "evening" ? "/evening-hair" : "/masterclass";
  const graph: object[] = [businessNode(lang), faqNode(lang)];
  if (kind === "masterclass") graph.push(courseNode(lang), crumbs(lang, d.masterclass.title, path));
  else {
    const p = d.pages[kind];
    graph.push(
      { "@type": "Service", name: p.title, description: p.intro, serviceType: p.title, provider: { "@id": business }, areaServed: { "@type": "Country", name: "Israel" }, url: `${site.url}/${lang}${path}` },
      crumbs(lang, p.title, path),
    );
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

export const ldScript = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
