"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { useLocale } from "@/components/providers";
import { isoDay } from "@/lib/booking";

export type Prefill = { tab?: "event" | "class"; date?: string; city?: string; people?: string; where?: string };

/** Ouvre le formulaire (#contact) en le préremplissant. */
export function openBooking(detail: Prefill) {
  window.dispatchEvent(new CustomEvent<Prefill>("book-prefill", { detail }));
  const el = document.getElementById("contact");
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -120 });
  else el.scrollIntoView({ behavior: "smooth" });
}

/** Petite barre de vérification de date (date, ville, nombre de personnes) qui préremplit le formulaire. */
export function DateBar({ className = "" }: { className?: string }) {
  const { d } = useLocale();
  const t = d.datebar;
  const uid = useId();
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [people, setPeople] = useState("");
  const [today, setToday] = useState("");

  // eslint-disable-next-line react-hooks/set-state-in-effect -- date du jour lue une fois au montage
  useEffect(() => setToday(isoDay(new Date())), []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    openBooking({ tab: "event", date, city: city.trim(), people });
  };

  return (
    <form onSubmit={onSubmit} className={`datebar bg-ivory ${className}`} aria-label={t.title}>
      <p className="eyebrow mb-5 md:hidden">{t.title}</p>
      <div className="grid gap-5 md:grid-cols-[auto_1.1fr_1.3fr_0.7fr_auto] md:items-end md:gap-8">
        <p className="display hidden self-center text-[1.5rem] leading-tight md:block rtl:text-[1.35rem]">{t.title}</p>
        <div>
          <label htmlFor={`${uid}-date`} className="label">
            {t.date}
          </label>
          <input id={`${uid}-date`} type="date" min={today || undefined} value={date} onChange={(e) => setDate(e.target.value)} className="field" />
        </div>
        <div>
          <label htmlFor={`${uid}-city`} className="label">
            {t.city}
          </label>
          <input id={`${uid}-city`} type="text" autoComplete="address-level2" placeholder={t.cityPlaceholder} value={city} onChange={(e) => setCity(e.target.value)} className="field" maxLength={80} />
        </div>
        <div>
          <label htmlFor={`${uid}-people`} className="label">
            {t.people} <span className="normal-case tracking-normal opacity-80">({t.peopleHint})</span>
          </label>
          <input id={`${uid}-people`} type="number" inputMode="numeric" min={1} max={30} placeholder="1" value={people} onChange={(e) => setPeople(e.target.value)} className="field" />
        </div>
        <button type="submit" className="btn-solid w-full md:w-auto">
          {t.submit}
        </button>
      </div>
    </form>
  );
}
