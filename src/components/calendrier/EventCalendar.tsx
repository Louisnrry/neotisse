"use client";

import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Layout";
import { RuledTitle } from "@/components/ui/Typography";
import { eventTypeLabels } from "@/lib/events";
import type { EventType, NeoEvent } from "@/sanity/types";
import { cn } from "@/lib/cn";
import { dayNumber, formatEventDates, formatMonthYear, todayInParis } from "@/lib/dates";

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const JOURS_LONGS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

/** Couleur des pastilles du calendrier selon le type (comme la V1). */
const chipColors: Record<EventType, string> = {
  atelier: "bg-garance",
  festival: "bg-ink",
  conference: "bg-garance-dark",
  autre: "bg-gris",
};

type Month = { y: number; m: number }; // m : 0 à 11

/** Date ISO « AAAA-MM-JJ » d’un jour UTC. */
const iso = (d: Date) => d.toISOString().slice(0, 10);
/** Rang du jour dans la semaine, lundi = 0. */
const weekday = (d: Date) => (d.getUTCDay() + 6) % 7;

/** Jours affichés pour un mois : semaines complètes, du lundi au dimanche. */
function monthDays({ y, m }: Month) {
  const first = new Date(Date.UTC(y, m, 1));
  const last = new Date(Date.UTC(y, m + 1, 0));
  const start = new Date(first);
  start.setUTCDate(1 - weekday(first));
  const end = new Date(last);
  end.setUTCDate(last.getUTCDate() + (6 - weekday(last)));
  const days: Date[] = [];
  for (const d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) days.push(new Date(d));
  return days;
}

const monthOf = (isoDate: string): Month => {
  const [y, m] = isoDate.split("-").map(Number);
  return { y, m: m - 1 };
};

const end = (e: NeoEvent) => e.endDate ?? e.startDate;
const typeLabel = (e: NeoEvent) => eventTypeLabels[e.type];
const noop = () => () => {};

type Texts = {
  upcomingTitle: string;
  empty: string;
  more: string;
  agendaTitle: string;
  contact: { label: string; href: string };
};

/**
 * Liste « À venir », calendrier mensuel et modale détail (reprend `calendrier.js` de la V1).
 * Le serveur fournit la date du jour (Europe/Paris) ; le navigateur la remet à jour à l’hydratation.
 */
export function EventCalendar({
  events,
  upcoming,
  serverToday,
  initialMonth,
  texts,
}: {
  events: NeoEvent[];
  upcoming: NeoEvent[];
  serverToday: string;
  initialMonth: string;
  texts: Texts;
}) {
  const today = useSyncExternalStore(noop, () => todayInParis(), () => serverToday);
  const [view, setView] = useState<Month>(() => monthOf(initialMonth));
  const [current, setCurrent] = useState<NeoEvent | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);

  function open(e: NeoEvent, from: HTMLElement) {
    trigger.current = from;
    // Contenu rendu avant l’ouverture : le focus initial va sur le bouton « Fermer »
    flushSync(() => setCurrent(e));
    const d = dialog.current;
    if (d && !d.open) d.showModal();
  }

  function onClose() {
    trigger.current?.focus();
  }

  function shift(delta: number) {
    setView(({ y, m }) => {
      const d = new Date(Date.UTC(y, m + delta, 1));
      return { y: d.getUTCFullYear(), m: d.getUTCMonth() };
    });
  }

  const days = monthDays(view);
  const weeks = Array.from({ length: days.length / 7 }, (_, i) => days.slice(i * 7, i * 7 + 7));
  const monthLabel = formatMonthYear(`${view.y}-${String(view.m + 1).padStart(2, "0")}-01`);

  return (
    <>
      {/* À venir */}
      <Section spacing="none" width="full" className="mt-[1.2rem] py-10" labelledBy="a-venir-titre">
        <div className="mx-auto grid max-w-[1040px] gap-8">
          <RuledTitle id="a-venir-titre">{texts.upcomingTitle}</RuledTitle>
          <ol className="grid gap-3.5">
            {upcoming.length === 0 && (
              <li>
                <p>{texts.empty}</p>
              </li>
            )}
            {upcoming.map((e) => {
              const dates = formatEventDates(e.startDate, e.endDate);
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    onClick={(ev) => {
                      setView(monthOf(e.startDate));
                      open(e, ev.currentTarget);
                    }}
                    className="group grid w-full cursor-pointer grid-cols-[72px_minmax(0,1fr)] items-center gap-6 border-[1.5px] border-transparent bg-pierre px-6 py-[18px] text-left transition-[border-color,transform] duration-200 hover:translate-x-1 hover:border-garance min-[641px]:grid-cols-[104px_minmax(0,1fr)_auto]"
                  >
                    <span className="flex flex-col items-center border-r border-filet pr-6">
                      <span className="font-serif text-[2.8rem] leading-none font-bold text-garance">
                        {dayNumber(e.startDate)}
                      </span>
                      <span className="text-kicker font-bold tracking-[0.12em] text-gris uppercase">
                        {formatMonthYear(e.startDate)}
                      </span>
                    </span>
                    <span>
                      <span className="text-kicker font-bold tracking-[0.12em] text-gris uppercase">{typeLabel(e)}</span>
                      <span className="block font-display text-[1.6rem] leading-[1.15] font-normal">{e.title}</span>
                      <span className="block text-[0.95rem] font-semibold text-garance">
                        {[dates, e.place].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="col-start-2 inline-flex items-center gap-2 text-[0.9rem] font-bold tracking-[0.04em] whitespace-nowrap text-garance underline-offset-4 group-hover:underline group-focus-visible:underline min-[641px]:col-start-auto"
                    >
                      {texts.more}
                      <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1">
                        →
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </Section>

      {/* Calendrier mensuel */}
      <Section spacing="none" className="mt-[1.2rem] py-10" labelledBy="agenda-titre" innerClassName="grid gap-8">
        <RuledTitle id="agenda-titre">{texts.agendaTitle}</RuledTitle>
        <div className="border border-t-4 border-filet border-t-garance p-[clamp(16px,3vw,32px)]">
          <div className="mb-[18px] flex items-center justify-center gap-3">
            <NavButton label="Mois précédent" onClick={() => shift(-1)} d="M15 5l-7 7 7 7" />
            <p
              aria-live="polite"
              className="min-w-[9ch] text-center font-display text-[clamp(1.3rem,0.75rem+2.4vw,2.2rem)] leading-[1.1] font-normal capitalize"
            >
              {monthLabel}
            </p>
            <NavButton label="Mois suivant" onClick={() => shift(1)} d="M9 5l7 7-7 7" />
          </div>

          <div role="grid" aria-label={`Calendrier, ${monthLabel}`} className="grid grid-cols-7 border-t border-l border-filet">
            <div role="row" className="contents">
              {JOURS.map((j, i) => (
                <div
                  key={j}
                  role="columnheader"
                  className="border-r border-b border-filet px-1.5 py-2.5 text-center text-[0.62rem] font-bold text-gris uppercase min-[721px]:text-[0.75rem] min-[721px]:tracking-[0.12em]"
                >
                  <abbr title={JOURS_LONGS[i]} className="no-underline">
                    {j}
                  </abbr>
                </div>
              ))}
            </div>
            {weeks.map((week) => (
              <div role="row" key={iso(week[0])} className="contents">
                {week.map((d) => {
                  const k = iso(d);
                  const out = d.getUTCMonth() !== view.m;
                  const isToday = k === today;
                  const dayEvents = events.filter((e) => e.startDate <= k && end(e) >= k);
                  return (
                    <div
                      key={k}
                      role="gridcell"
                      aria-current={isToday ? "date" : undefined}
                      className={cn(
                        "flex min-h-[73px] min-w-0 flex-col gap-[5px] border-r border-b border-filet p-1 min-[721px]:min-h-[141px] min-[721px]:p-2",
                        out && "bg-hachures",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-6 place-items-center font-serif text-[1rem] leading-none font-bold min-[721px]:size-8 min-[721px]:text-[1.4rem]",
                          out && "opacity-35",
                          isToday && "bg-garance text-blanc",
                        )}
                      >
                        <span aria-hidden="true">{d.getUTCDate()}</span>
                        <span className="sr-only">
                          {JOURS_LONGS[weekday(d)]} {formatEventDates(k)}
                          {isToday && ", aujourd’hui"}
                        </span>
                      </span>
                      {dayEvents.map((e) => (
                        <button
                          key={e.id}
                          type="button"
                          aria-haspopup="dialog"
                          title={e.title}
                          aria-label={`${typeLabel(e)} : ${e.title}, ${formatEventDates(e.startDate, e.endDate)}`}
                          onClick={(ev) => open(e, ev.currentTarget)}
                          className={cn(
                            "block h-2 w-full cursor-pointer truncate p-0 text-left font-sans text-[length:0px] leading-[1.25] font-semibold text-blanc min-[721px]:h-auto min-[721px]:px-2 min-[721px]:py-[5px] min-[721px]:text-[0.8rem]",
                            chipColors[e.type],
                          )}
                        >
                          {/* Titre au premier jour et en début de semaine, comme la V1 */}
                          {e.startDate === k || weekday(d) === 0 ? e.title : " "}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <EventDialog ref={dialog} event={current} onClose={onClose} contact={texts.contact} />
    </>
  );
}

function NavButton({ label, onClick, d }: { label: string; onClick: () => void; d: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-[46px] shrink-0 cursor-pointer place-items-center border-2 border-ink bg-blanc text-ink transition-colors duration-200 hover:bg-ink hover:text-blanc"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d={d} fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </button>
  );
}

/**
 * Modale détail d’un événement (`<dialog>` natif : Échap, focus piégé, voile flouté).
 * Colonne garance à gauche (jour, mois, type), texte à droite. Une colonne sous 760px.
 */
function EventDialog({
  ref,
  event: e,
  onClose,
  contact,
}: {
  ref: React.RefObject<HTMLDialogElement | null>;
  event: NeoEvent | null;
  onClose: () => void;
  contact: { label: string; href: string };
}) {
  const multi = e && e.endDate && e.endDate !== e.startDate;
  return (
    <dialog
      ref={ref}
      aria-labelledby="evenement-titre"
      onClose={onClose}
      onClick={(ev) => {
        // Clic sur le voile : ferme la modale
        if (ev.target === ev.currentTarget) ev.currentTarget.close();
      }}
      className="m-auto h-[calc(100dvh-24px)] max-h-none w-[calc(100vw-24px)] max-w-none overflow-hidden border-0 bg-blanc p-0 text-ink shadow-[0_40px_100px_-30px_rgb(20_29_34/0.6)] backdrop:bg-ink-deep/60 backdrop:backdrop-blur-[3px] open:grid open:grid-cols-1 open:grid-rows-[auto_minmax(0,1fr)] min-[761px]:h-[min(720px,calc(100dvh-32px))] min-[761px]:w-[min(1080px,calc(100vw-32px))] min-[761px]:open:grid-cols-[minmax(220px,4fr)_minmax(0,8fr)] min-[761px]:open:grid-rows-[minmax(0,1fr)]"
    >
      {e && (
        <>
          <div className="flex min-h-0 flex-row flex-wrap items-baseline gap-x-3.5 gap-y-1 bg-garance px-[22px] py-5 text-creme min-[761px]:flex-col min-[761px]:flex-nowrap min-[761px]:items-stretch min-[761px]:gap-0 min-[761px]:p-[clamp(28px,4vw,48px)]">
            <p className="font-serif text-[3rem] leading-[0.9] font-bold min-[761px]:text-[clamp(4.5rem,9vw,7.5rem)]">
              {dayNumber(e.startDate)}
              {multi && `–${dayNumber(e.endDate!)}`}
            </p>
            <p className="font-serif text-[clamp(1.4rem,2.2vw,1.8rem)] leading-[1.2] font-semibold capitalize min-[761px]:mt-2.5">
              {formatMonthYear(e.startDate)}
            </p>
            <p className="w-full text-[0.8rem] font-bold tracking-[0.14em] uppercase min-[761px]:mt-auto min-[761px]:border-t min-[761px]:border-creme/35 min-[761px]:pt-6">
              {typeLabel(e)}
            </p>
          </div>

          <div className="relative flex min-h-0 flex-col overflow-hidden p-[22px] min-[761px]:px-[clamp(24px,4vw,56px)] min-[761px]:pt-[clamp(28px,4vw,52px)] min-[761px]:pb-[clamp(24px,3vw,40px)]">
            <form method="dialog">
              <button
                aria-label="Fermer"
                className="absolute top-3.5 right-3.5 grid size-11 cursor-pointer place-items-center border border-filet bg-blanc transition-colors duration-200 hover:bg-ink hover:text-blanc"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </form>
            <h2 id="evenement-titre" className="pr-12 text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.05]">
              {e.title}
            </h2>
            <p className="mt-3 border-b border-filet pb-[18px] font-semibold text-garance">
              {[formatEventDates(e.startDate, e.endDate), e.hours, e.place].filter(Boolean).join(" · ")}
            </p>
            <div
              // Zone qui défile : atteignable au clavier
              tabIndex={0}
              key={e.id}
              className="mt-[18px] min-h-0 flex-auto overflow-y-auto overscroll-contain pr-1.5 leading-[1.65] [scrollbar-color:var(--color-garance)_transparent] [scrollbar-width:thin]"
            >
              {(e.body.length ? e.body : e.excerpt ? [e.excerpt] : []).map((p, i) => (
                <p key={i} className="mb-[0.85em]">
                  <RichText value={p} />
                </p>
              ))}
            </div>
            <div className="mt-[22px] flex flex-wrap gap-3 border-t border-filet pt-5">
              {e.placeUrl && (
                <a
                  href={e.placeUrl}
                  target="_blank"
                  rel="noopener"
                  className="inline-block bg-garance px-[1.5em] py-[0.8em] font-semibold text-creme no-underline transition-colors duration-200 hover:bg-garance-dark hover:text-blanc"
                >
                  {e.placeUrlLabel ?? "Site du lieu"} ↗<span className="sr-only"> (nouvel onglet)</span>
                </a>
              )}
              <Link
                href={contact.href}
                className="inline-block border-2 border-ink px-[1.5em] py-[0.8em] font-semibold text-ink no-underline transition-colors duration-200 hover:bg-ink hover:text-blanc"
              >
                {contact.label}
              </Link>
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}
