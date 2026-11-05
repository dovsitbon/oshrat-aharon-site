import site from "@/data/site.json";
import calendar from "@/data/dates.json";
import prestations from "@/data/prestations.json";
import masterclassData from "@/data/masterclass.json";
import type { Dict } from "@/lib/i18n";
import { intlLocale, type Locale } from "@/lib/locales";

export type ServiceId = "bride" | "trial" | "evening" | "companions" | "events";
export type ExtraId = "travel" | "early";
export type Service = { id: ServiceId; price: number | null; featured?: boolean; confirm?: boolean };
export const services = prestations.services as Service[];
export const extras = prestations.extras as { id: ExtraId; price: number | null }[];

export type McSession = { date: string; city: string; price: number | null; seats: number | null };
export const masterclass = {
  hours: masterclassData.hours as number | null,
  price: masterclassData.price as number | null,
  currency: masterclassData.currency,
  seats: masterclassData.seats as number | null,
  sessions: (masterclassData.sessions as McSession[]).slice().sort((a, b) => a.date.localeCompare(b.date)),
};

export const EVENT_TYPES = ["wedding", "henna", "engagement", "evening", "other"] as const;
export const STYLES = ["chignon", "halfup", "waves", "unsure"] as const;
export const YESNO = ["yes", "no"] as const;
export const LEVELS = ["beginner", "pro"] as const;
export const FORMATS = ["private", "group"] as const;
export type EventType = (typeof EVENT_TYPES)[number];
export type Style = (typeof STYLES)[number];
export type YesNo = (typeof YESNO)[number];
export type Level = (typeof LEVELS)[number];
export type Format = (typeof FORMATS)[number];

export const takenDates = new Set<string>(calendar.taken as string[]);

export const isPhone = (v: string) => /^[+\d][\d\s\-().]{7,19}$/.test(v.trim());
export const waLink = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export const money = (n: number, lang: Locale, currency = "ILS") => new Intl.NumberFormat(intlLocale[lang], { style: "currency", currency, maximumFractionDigits: 0 }).format(n);

/** Date du jour au format AAAA-MM-JJ, en heure d'Israël. */
export function isoDay(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function formatDay(iso: string, lang: Locale, opts: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long", year: "numeric" }) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(intlLocale[lang], { ...opts, timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d || 1)));
}

const colon = (lang: Locale) => (lang === "fr" ? " :" : ":");
const join = (blocks: string[][]) => blocks.map((b) => b.filter(Boolean).join("\n")).filter(Boolean).join("\n\n");

export type EventRequest = {
  type: EventType | "";
  date: string;
  city: string;
  time: string;
  style: Style | "";
  people: string;
  trial: YesNo | "";
  makeup: YesNo | "";
  name: string;
  phone: string;
  message: string;
  inspiration: boolean;
};

export type ClassRequest = { level: Level | ""; format: Format | ""; when: string; name: string; phone: string; instagram: string; message: string };

/** Récapitulatif « événement » envoyé sur le WhatsApp d'Oshrat, dans la langue du visiteur : date et lieu en premier. */
export function eventMessage(q: EventRequest, lang: Locale, d: Dict) {
  const m = d.booking.message;
  const f = d.booking.fields;
  const c = colon(lang);
  const line = (label: string, value: string) => (value ? `${label}${c} ${value}` : "");
  return join([
    [`*${m.eventTitle}*`],
    [
      line(m.type, q.type ? f.types[q.type] : ""),
      line(m.date, q.date ? formatDay(q.date, lang) : ""),
      line(m.city, q.city),
      line(m.time, q.time),
    ],
    [line(m.style, q.style ? f.styles[q.style] : ""), line(m.people, q.people), line(m.trial, q.trial ? f.yesno[q.trial] : ""), line(m.makeup, q.makeup ? f.yesno[q.makeup] : "")],
    [line(m.name, q.name), line(m.phone, q.phone), line(m.notes, q.message), q.inspiration ? m.inspiration : ""],
    [m.closing],
  ]);
}

/** Récapitulatif « masterclass ». */
export function classMessage(q: ClassRequest, lang: Locale, d: Dict) {
  const m = d.booking.message;
  const f = d.booking.fields;
  const c = colon(lang);
  const line = (label: string, value: string) => (value ? `${label}${c} ${value}` : "");
  return join([
    [`*${m.classTitle}*`],
    [line(m.level, q.level ? f.levels[q.level] : ""), line(m.format, q.format ? f.formats[q.format] : ""), line(m.when, q.when)],
    [line(m.name, q.name), line(m.phone, q.phone), line(m.instagram, q.instagram), line(m.notes, q.message)],
    [m.closing],
  ]);
}
