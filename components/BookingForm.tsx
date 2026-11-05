"use client";

import { useEffect, useId, useMemo, useState, type FormEvent, type ReactNode } from "react";
import calendar from "@/data/dates.json";
import { ArrowIcon, WhatsAppIcon } from "@/components/icons";
import { openBooking, type Prefill } from "@/components/DateBar";
import { useLocale } from "@/components/providers";
import {
  classMessage,
  eventMessage,
  EVENT_TYPES,
  formatDay,
  FORMATS,
  isoDay,
  isPhone,
  LEVELS,
  STYLES,
  takenDates,
  waLink,
  YESNO,
  type EventType,
  type Format,
  type Level,
  type Style,
  type YesNo,
} from "@/lib/booking";
import { intlLocale } from "@/lib/locales";

type Tab = "event" | "class";
type Errors = Partial<Record<"name" | "phone", string>>;

function Field({ label, hint, error, children, id }: { label: ReactNode; hint?: string; error?: string; children: ReactNode; id: string }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {hint && <p className="mt-2 text-[0.8125rem] leading-relaxed text-gold-ink">{hint}</p>}
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-2 text-[0.8125rem] text-gold-ink">
          {error}
        </p>
      )}
    </div>
  );
}

function Choices<T extends string>({ name, label, options, labels, value, onChange }: { name: string; label: ReactNode; options: readonly T[]; labels: Record<T, string>; value: T | ""; onChange: (v: T) => void }) {
  const id = useId();
  return (
    <div>
      <p className="label" id={id}>
        {label}
      </p>
      <div role="radiogroup" aria-labelledby={id} className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className="chip">
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} className="sr-only" />
            {labels[o]}
          </label>
        ))}
      </div>
    </div>
  );
}

function Legend({ n, children }: { n: string; children: ReactNode }) {
  return (
    <legend className="mb-8 flex items-baseline gap-4">
      <span className="num text-[0.9375rem] text-gold-ink" dir="ltr">
        {n}
      </span>
      <span className="display text-[1.8rem] rtl:text-[1.6rem]">{children}</span>
    </legend>
  );
}

/** Calendrier des dates déjà prises (data/dates.json) : dates grisées, un clic sur une date libre la choisit. */
function TakenCalendar({ value, onPick, today }: { value: string; onPick: (iso: string) => void; today: string }) {
  const { lang, d } = useLocale();
  const c = d.booking.calendar;
  const start = (value || today || isoDay(new Date())).slice(0, 7);
  const [month, setMonth] = useState(start);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- suit la date choisie dans le champ
  useEffect(() => setMonth(start), [start]);

  const [y, m] = month.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay(); // semaine israélienne : dimanche en premier
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const shift = (n: number) => {
    const dt = new Date(Date.UTC(y, m - 1 + n, 1));
    setMonth(`${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}`);
  };
  const weekdays = useMemo(() => Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(intlLocale[lang], { weekday: "narrow", timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, 7 + i)))), [lang]);

  return (
    <div className="mt-5 border border-line p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => shift(-1)} aria-label={c.prev} className="flex h-10 w-10 items-center justify-center hover:text-gold-ink">
          <ArrowIcon className="h-3.5 w-3.5 -scale-x-100 rtl:scale-x-100" />
        </button>
        <p className="text-[0.9375rem]" aria-live="polite">
          {formatDay(`${month}-01`, lang, { month: "long", year: "numeric" })}
        </p>
        <button type="button" onClick={() => shift(1)} aria-label={c.next} className="flex h-10 w-10 items-center justify-center hover:text-gold-ink">
          <ArrowIcon className="h-3.5 w-3.5 rtl:-scale-x-100" />
        </button>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[0.8125rem]" role="grid" aria-label={c.title}>
        {weekdays.map((w, i) => (
          <span key={i} className="pb-1 text-muted" aria-hidden="true">
            {w}
          </span>
        ))}
        {Array.from({ length: first }, (_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const iso = `${month}-${String(i + 1).padStart(2, "0")}`;
          const taken = takenDates.has(iso);
          const past = today !== "" && iso < today;
          const selected = iso === value;
          return (
            <button
              key={iso}
              type="button"
              disabled={past}
              onClick={() => onPick(iso)}
              aria-pressed={selected}
              aria-label={`${formatDay(iso, lang)}${taken ? ` · ${c.taken}` : ""}`}
              className={`flex h-9 items-center justify-center transition-colors ${selected ? "bg-ink text-ivory" : taken ? "bg-pearl text-muted/60 line-through" : past ? "text-muted/40" : "hover:bg-nude-soft"}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <p className="mt-3 flex items-center gap-2 text-[0.75rem] text-muted">
        <span className="inline-block h-3 w-3 bg-pearl" aria-hidden="true" />
        {c.taken}
        <span className="ms-auto">
          {c.updated} {formatDay(calendar.updated, lang, { day: "numeric", month: "short", year: "numeric" })}
        </span>
      </p>
    </div>
  );
}

/**
 * Formulaire de vérification de date, deux onglets.
 * Événement : type, date, ville des préparatifs, heure, coiffure, nombre de personnes, essai, maquilleuse, coordonnées.
 * Masterclass : niveau, format, disponibilités, coordonnées, Instagram.
 * Le récapitulatif part sur le WhatsApp d'Oshrat, dans la langue du visiteur. Aucun paiement, rien n'est stocké.
 */
export function BookingForm({ initialTab = "event" }: { initialTab?: Tab }) {
  const { lang, d } = useLocale();
  const b = d.booking;
  const f = b.fields;
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  const [tab, setTab] = useState<Tab>(initialTab);
  // Événement
  const [type, setType] = useState<EventType | "">("");
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [time, setTime] = useState("");
  const [style, setStyle] = useState<Style | "">("");
  const [people, setPeople] = useState("");
  const [trial, setTrial] = useState<YesNo | "">("");
  const [makeup, setMakeup] = useState<YesNo | "">("");
  const [inspiration, setInspiration] = useState(false);
  // Masterclass
  const [level, setLevel] = useState<Level | "">("");
  const [format, setFormat] = useState<Format | "">("");
  const [when, setWhen] = useState("");
  const [instagram, setInstagram] = useState("");
  // Commun
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);
  const [today, setToday] = useState("");

  // eslint-disable-next-line react-hooks/set-state-in-effect -- date du jour lue une fois au montage
  useEffect(() => setToday(isoDay(new Date())), []);

  // Barre du hero et boutons « Je veux m'inscrire » : choisissent l'onglet et préremplissent
  useEffect(() => {
    const onPick = (e: Event) => {
      const p = (e as CustomEvent<Prefill>).detail;
      if (p.tab) setTab(p.tab);
      if (p.date) setDate(p.date);
      if (p.city) setCity(p.city);
      if (p.people) setPeople(p.people);
      if (p.where) setWhen(p.where);
      setSent(null);
    };
    window.addEventListener("book-prefill", onPick);
    return () => window.removeEventListener("book-prefill", onPick);
  }, []);

  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
  const dateHint = validDate && takenDates.size > 0 ? (takenDates.has(date) ? f.dateTaken : f.dateFree) : undefined;

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const e: Errors = {};
    if (!name.trim()) e.name = b.required;
    if (!phone.trim()) e.phone = b.required;
    else if (!isPhone(phone)) e.phone = b.invalidPhone;
    setErrors(e);
    const first = (["name", "phone"] as const).find((k) => e[k]);
    if (first) {
      document.getElementById(id(first))?.focus();
      return;
    }
    const common = { name: name.trim(), phone: phone.trim(), message: message.trim() };
    const text =
      tab === "event"
        ? eventMessage({ type, date: validDate ? date : "", city: city.trim(), time, style, people: people.trim(), trial, makeup, inspiration, ...common }, lang, d)
        : classMessage({ level, format, when: when.trim(), instagram: instagram.trim(), ...common }, lang, d);
    const url = waLink(text);
    window.open(url, "_blank", "noopener");
    setSent(url);
  };

  const err = (k: keyof Errors) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${id(k)}-err` } : {});
  const optional = <span className="normal-case tracking-normal opacity-80">({f.optional})</span>;

  if (sent)
    return (
      <div className="fade-in py-6 text-center md:py-10" role="status">
        <p className="display text-[3rem] leading-none text-gold-ink italic">{b.success.thanks}</p>
        <h3 className="display mt-5 text-[1.9rem]">{b.success.title}</h3>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">{b.success.text}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href={sent} target="_blank" rel="noopener noreferrer" className="btn-solid">
            <WhatsAppIcon className="h-4 w-4" />
            {b.success.again}
          </a>
          <button type="button" onClick={() => setSent(null)} className="link-line nav-link">
            {b.success.reset}
          </button>
        </div>
      </div>
    );

  const tabs: Tab[] = ["event", "class"];

  return (
    <div>
      <div role="tablist" aria-label={b.tabsLabel} className="mb-12 grid grid-cols-2 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            id={id(`tab-${t}`)}
            aria-selected={tab === t}
            aria-controls={id("panel")}
            onClick={() => setTab(t)}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                const next = t === "event" ? "class" : "event";
                setTab(next);
                document.getElementById(id(`tab-${next}`))?.focus();
              }
            }}
            tabIndex={tab === t ? 0 : -1}
            className={`nav-link -mb-px min-h-12 border-b pb-3 transition-colors duration-500 ${tab === t ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"}`}
          >
            {b.tabs[t]}
          </button>
        ))}
      </div>

      <form id={id("panel")} role="tabpanel" aria-labelledby={id(`tab-${tab}`)} onSubmit={onSubmit} noValidate className="space-y-14">
        {tab === "event" ? (
          <>
            <fieldset className="space-y-8">
              <Legend n="01">{b.steps.event}</Legend>
              <Choices name="type" label={f.type} options={EVENT_TYPES} labels={f.types} value={type} onChange={setType} />
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <Field id={id("date")} label={f.date} hint={dateHint}>
                    <input id={id("date")} name="date" type="date" min={today || undefined} value={date} onChange={(e) => setDate(e.target.value)} className="field" />
                  </Field>
                </div>
                <Field id={id("time")} label={<>{f.time} {optional}</>}>
                  <input id={id("time")} name="time" type="time" step={900} value={time} onChange={(e) => setTime(e.target.value)} className="field" />
                </Field>
              </div>
              {takenDates.size > 0 && <TakenCalendar value={validDate ? date : ""} onPick={setDate} today={today} />}
              <Field id={id("city")} label={f.city}>
                <input id={id("city")} name="city" type="text" autoComplete="address-level2" placeholder={f.cityPlaceholder} value={city} onChange={(e) => setCity(e.target.value)} className="field" maxLength={160} />
              </Field>
            </fieldset>

            <fieldset className="space-y-8">
              <Legend n="02">{b.steps.style}</Legend>
              <Choices name="style" label={f.style} options={STYLES} labels={f.styles} value={style} onChange={setStyle} />
              <Field id={id("people")} label={<>{f.people} <span className="normal-case tracking-normal opacity-80">({f.peopleHint})</span></>}>
                <input id={id("people")} name="people" type="number" inputMode="numeric" min={1} max={30} value={people} onChange={(e) => setPeople(e.target.value)} className="field sm:max-w-[12rem]" />
              </Field>
              <div className="grid gap-8 sm:grid-cols-2">
                <Choices name="trial" label={f.trial} options={YESNO} labels={f.yesno} value={trial} onChange={setTrial} />
                <Choices name="makeup" label={f.makeup} options={YESNO} labels={f.yesno} value={makeup} onChange={setMakeup} />
              </div>
            </fieldset>
          </>
        ) : (
          <fieldset className="space-y-8">
            <Legend n="01">{b.steps.class}</Legend>
            <Choices name="level" label={f.level} options={LEVELS} labels={f.levels} value={level} onChange={setLevel} />
            <Choices name="format" label={f.format} options={FORMATS} labels={f.formats} value={format} onChange={setFormat} />
            <Field id={id("when")} label={f.when}>
              <input id={id("when")} name="when" type="text" placeholder={f.whenPlaceholder} value={when} onChange={(e) => setWhen(e.target.value)} className="field" maxLength={160} />
            </Field>
          </fieldset>
        )}

        <fieldset className="space-y-8">
          <Legend n={tab === "event" ? "03" : "02"}>{b.steps.contact}</Legend>
          <div className="grid gap-8 sm:grid-cols-2">
            <Field id={id("name")} label={`${f.name} *`} error={errors.name}>
              <input id={id("name")} name="name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className="field" maxLength={120} {...err("name")} />
            </Field>
            <Field id={id("phone")} label={`${f.phone} *`} error={errors.phone}>
              <input id={id("phone")} name="phone" type="tel" autoComplete="tel" inputMode="tel" required dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} className="field rtl:text-end" maxLength={30} {...err("phone")} />
            </Field>
          </div>
          {tab === "class" && (
            <Field id={id("instagram")} label={<>{f.instagram} {optional}</>}>
              <input id={id("instagram")} name="instagram" type="text" dir="ltr" spellCheck={false} autoCapitalize="none" placeholder="@" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="field rtl:text-end" maxLength={60} />
            </Field>
          )}
          <Field id={id("message")} label={<>{f.message} {optional}</>}>
            <textarea id={id("message")} name="message" rows={3} placeholder={f.messagePlaceholder} value={message} onChange={(e) => setMessage(e.target.value)} className="field resize-y" maxLength={1500} />
          </Field>
          {tab === "event" && (
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[0.9375rem]">
              <input type="checkbox" checked={inspiration} onChange={(e) => setInspiration(e.target.checked)} className="h-4 w-4 accent-[var(--color-gold-ink)]" />
              {f.inspiration} <span className="text-muted">({f.optional})</span>
            </label>
          )}
        </fieldset>

        <div>
          <button type="submit" className="btn-solid w-full sm:w-auto">
            <WhatsAppIcon className="h-4 w-4" />
            {b.submit}
          </button>
          <p className="mt-4 max-w-md text-[0.8125rem] leading-relaxed text-muted">{b.hours}</p>
        </div>
      </form>
    </div>
  );
}

/** Bouton qui ouvre le formulaire sur le bon onglet puis y fait défiler la page. */
export function BookButton({ tab, className, children }: { tab: Tab; className?: string; children: ReactNode }) {
  return (
    <a
      href="#contact"
      className={className}
      onClick={(e) => {
        if (!document.getElementById("contact")) return;
        e.preventDefault();
        openBooking({ tab });
      }}
    >
      {children}
    </a>
  );
}
