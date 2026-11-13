"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
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

/** Couleur au survol (ou au focus) : un ton plus foncé. */
const chipHoverColors: Record<EventType, string> = {
  atelier: "bg-garance-dark",
  festival: "bg-ink-deep",
  conference: "bg-ink",
  autre: "bg-ink",
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

/** Morceau d’un événement dans une semaine : une barre continue du premier au dernier jour visible. */
type Segment = {
  event: NeoEvent;
  /** Colonne de départ (lundi = 0) et nombre de jours couverts */
  col: number;
  span: number;
  /** Ligne de la barre dans la semaine (0 = sous le numéro du jour) */
  lane: number;
  /** Le vrai début / la vraie fin tombent dans cette semaine (sinon la barre continue sur la semaine voisine) */
  startsHere: boolean;
  endsHere: boolean;
};

/** Découpe les événements d’une semaine en barres, réparties sur des lignes sans chevauchement. */
function weekSegments(week: Date[], events: NeoEvent[]) {
  const first = iso(week[0]);
  const last = iso(week[6]);
  const segments: Segment[] = events
    .filter((e) => e.startDate <= last && end(e) >= first)
    .map((e) => {
      const from = e.startDate > first ? e.startDate : first;
      const to = end(e) < last ? end(e) : last;
      const col = week.findIndex((d) => iso(d) === from);
      return {
        event: e,
        col,
        span: week.findIndex((d) => iso(d) === to) - col + 1,
        lane: 0,
        startsHere: e.startDate >= first,
        endsHere: end(e) <= last,
      };
    })
    // Les barres les plus longues d’abord, à départ égal
    .sort((a, b) => a.col - b.col || b.span - a.span);
  const laneEnds: number[] = [];
  for (const seg of segments) {
    let lane = laneEnds.findIndex((endCol) => endCol < seg.col);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = seg.col + seg.span - 1;
    seg.lane = lane;
  }
  return { segments, lanes: laneEnds.length };
}
/** Mois couverts par au moins un événement, sous la forme « AAAA-M » (m de 0 à 11). */
function monthsWithEvents(events: NeoEvent[]) {
  const set = new Set<string>();
  for (const e of events) {
    const from = monthOf(e.startDate);
    const to = monthOf(end(e));
    for (let y = from.y, m = from.m; y < to.y || (y === to.y && m <= to.m); m === 11 ? (y++, (m = 0)) : m++) {
      set.add(`${y}-${m}`);
    }
  }
  return set;
}

/** Première et dernière année du sélecteur de mois. */
function yearRange(events: NeoEvent[], currentYear: number) {
  let min = currentYear;
  let max = currentYear;
  for (const e of events) {
    min = Math.min(min, monthOf(e.startDate).y);
    max = Math.max(max, monthOf(end(e)).y);
  }
  return { min, max };
}

const MOIS_COURTS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
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
  // Événement survolé : toutes ses barres réagissent ensemble (événement sur plusieurs semaines)
  const [hovered, setHovered] = useState<string | null>(null);
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
  const todayMonth = monthOf(today);
  const isCurrentMonth = view.y === todayMonth.y && view.m === todayMonth.m;
  const eventMonths = monthsWithEvents(events);
  // Années proposées : de la première à la dernière année qui a un événement, année en cours comprise
  const years = yearRange(events, todayMonth.y);

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
                    className="group grid w-full cursor-pointer grid-cols-[72px_minmax(0,1fr)] items-center gap-6 border-[1.5px] border-transparent rounded-[4px] bg-pierre px-6 py-[18px] text-left transition-[border-color,transform] duration-200 hover:translate-x-1 hover:border-garance min-[641px]:grid-cols-[104px_minmax(0,1fr)_auto]"
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

      {/* Calendrier mensuel : masqué sur mobile (sous 721px), la liste « À venir » suffit (demande de Louis du 13/11/2026) */}
      <Section
        spacing="none"
        className="mt-[1.2rem] hidden py-10 min-[721px]:block"
        labelledBy="agenda-titre"
        innerClassName="grid gap-8"
      >
        <RuledTitle id="agenda-titre">{texts.agendaTitle}</RuledTitle>
        <div className="border border-t-4 border-filet border-t-garance p-[clamp(16px,3vw,32px)]">
          {/* « ‹ mois année › » centré ; « Aujourd’hui » à droite (demande de Louis du 13/11/2026) */}
          <div className="mb-[18px] grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="col-start-2 flex items-center gap-3">
              <NavButton label="Mois précédent" onClick={() => shift(-1)} d="M15 5l-7 7 7 7" />
              <MonthPicker view={view} label={monthLabel} years={years} eventMonths={eventMonths} onPick={setView} />
              <NavButton label="Mois suivant" onClick={() => shift(1)} d="M9 5l7 7-7 7" />
            </div>
            <button
              type="button"
              onClick={() => setView(monthOf(today))}
              disabled={isCurrentMonth}
              className="justify-self-end rounded-[4px] border-2 border-ink px-4 py-2 text-[0.9rem] font-semibold text-ink transition-colors duration-200 enabled:cursor-pointer enabled:hover:bg-ink enabled:hover:text-blanc disabled:opacity-35"
            >
              Aujourd’hui
            </button>
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
            {weeks.map((week) => {
              const { segments, lanes } = weekSegments(week, events);
              return (
                <div
                  role="row"
                  key={iso(week[0])}
                  className="contents"
                  style={{ "--lanes": lanes } as React.CSSProperties}
                >
                  {week.map((d, col) => {
                    const k = iso(d);
                    const out = d.getUTCMonth() !== view.m;
                    const isToday = k === today;
                    return (
                      <div
                        key={k}
                        role="gridcell"
                        aria-current={isToday ? "date" : undefined}
                        className={cn(
                          // La case grandit si la semaine a beaucoup de barres
                          "relative flex min-h-[max(73px,calc(33px+var(--lanes)*13px+4px))] min-w-0 flex-col border-r border-b border-filet p-1 min-[721px]:min-h-[max(141px,calc(45px+var(--lanes)*29px+8px))] min-[721px]:p-2",
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
                        {segments
                          .filter((seg) => seg.col === col)
                          .map((seg) => (
                            <EventBar
                              key={seg.event.id}
                              segment={seg}
                              onOpen={open}
                              active={hovered === seg.event.id}
                              onHover={setHovered}
                            />
                          ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      <EventDialog ref={dialog} event={current} onClose={onClose} contact={texts.contact} />
    </>
  );
}

/**
 * Barre d’un événement, posée dans la case de son premier jour de la semaine et étirée sur `span` cases
 * (filets compris) : un événement de plusieurs jours se lit d’un seul tenant.
 * Coins arrondis seulement au vrai début et à la vraie fin ; bord droit à la coupure d’une semaine.
 * Cliquable : icône « + » à droite ; au survol ou au focus, la barre fonce, se soulève et le titre se souligne
 * (toutes les barres du même événement ensemble).
 */
function EventBar({
  segment,
  onOpen,
  active,
  onHover,
}: {
  segment: Segment;
  onOpen: (e: NeoEvent, from: HTMLElement) => void;
  active: boolean;
  onHover: (id: string | null) => void;
}) {
  const { event: e, span, lane, startsHere, endsHere } = segment;
  const dates = formatEventDates(e.startDate, e.endDate);
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      title={`${e.title} · ${dates}`}
      aria-label={`${typeLabel(e)} : ${e.title}, ${dates}. Voir le détail`}
      onClick={(ev) => onOpen(e, ev.currentTarget)}
      onMouseEnter={() => onHover(e.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(e.id)}
      onBlur={() => onHover(null)}
      style={{ "--span": span, "--lane": lane } as React.CSSProperties}
      className={cn(
        // Position : sous le numéro du jour, une ligne par barre (8px + 5px sur mobile, 24px + 5px au-dessus de 720px)
        "absolute z-10 flex h-2 cursor-pointer items-center gap-1 overflow-hidden p-0 text-left whitespace-nowrap font-sans text-[length:0px] leading-6 font-semibold text-blanc",
        "top-[calc(33px+var(--lane)*13px)] min-[721px]:top-[calc(45px+var(--lane)*29px)] min-[721px]:h-6 min-[721px]:pr-1.5 min-[721px]:pl-2 min-[721px]:text-[0.8rem]",
        // Largeur : `span` cases et leurs filets de 1px, moins le retrait des extrémités réelles
        "left-[var(--il)] w-[calc(var(--span)*(100%+1px)-1px-var(--il)-var(--ir))]",
        startsHere ? "rounded-l-[4px] [--il:4px] min-[721px]:[--il:8px]" : "[--il:0px]",
        endsHere ? "rounded-r-[4px] [--ir:4px] min-[721px]:[--ir:8px]" : "[--ir:0px]",
        "transition-[background-color,translate,box-shadow] duration-200",
        active
          ? cn(chipHoverColors[e.type], "z-20 -translate-y-px shadow-[0_3px_8px_-2px_rgb(20_29_34/0.45)]")
          : chipColors[e.type],
      )}
    >
      {/* Flèches : l’événement continue sur la semaine précédente / suivante */}
      {!startsHere && <span aria-hidden="true">←</span>}
      <span className={cn("min-w-0 flex-1 truncate underline-offset-2", active && "underline")}>{e.title}</span>
      {/* Icône « voir le détail » (masquée sur mobile, où la barre ne fait que 8px) */}
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className={cn(
          "hidden size-3.5 shrink-0 transition-transform duration-200 min-[721px]:block",
          active && "rotate-90",
        )}
      >
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 4.5v7M4.5 8h7" stroke="currentColor" strokeWidth="1.4" />
      </svg>
      {!endsHere && <span aria-hidden="true">→</span>}
    </button>
  );
}

/**
 * Titre « mois année » cliquable : ouvre un panneau pour aller directement à un mois (demande de Louis du 13/11/2026).
 * Année avec ‹ › (bornée aux années qui ont des événements), grille des 12 mois ; un point marque les mois
 * qui ont des événements. Se ferme au choix d’un mois, avec Échap ou par un clic à côté ; le focus revient au titre.
 */
function MonthPicker({
  view,
  label,
  years,
  eventMonths,
  onPick,
}: {
  view: Month;
  label: string;
  years: { min: number; max: number };
  eventMonths: Set<string>;
  onPick: (month: Month) => void;
}) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(view.y);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const panelId = useId();

  function show() {
    setYear(Math.min(Math.max(view.y, years.min), years.max));
    setOpen(true);
  }

  function close(refocus: boolean) {
    setOpen(false);
    if (refocus) toggle.current?.focus();
  }

  // À l’ouverture, le focus va sur le mois affiché (ou le premier mois de l’année)
  useEffect(() => {
    if (!open) return;
    const target =
      panel.current?.querySelector<HTMLButtonElement>("[aria-pressed=true]") ??
      panel.current?.querySelector<HTMLButtonElement>("[data-month]");
    target?.focus();
  }, [open]);

  // Clic à côté du panneau : fermeture
  useEffect(() => {
    if (!open) return;
    const onDown = (ev: PointerEvent) => {
      if (!root.current?.contains(ev.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  return (
    <div
      ref={root}
      className="relative"
      onKeyDown={(ev) => {
        if (ev.key === "Escape" && open) {
          ev.stopPropagation();
          close(true);
        }
      }}
    >
      <button
        ref={toggle}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? close(false) : show())}
        className="flex min-w-[9ch] cursor-pointer items-center justify-center gap-2 rounded-[4px] px-2 py-1 font-display text-[clamp(1.3rem,0.75rem+2.4vw,2.2rem)] leading-[1.1] font-normal capitalize transition-colors duration-200 hover:bg-pierre aria-expanded:bg-pierre"
      >
        {/* Annoncé à chaque changement de mois */}
        <span aria-live="polite">{label}</span>
        <span className="sr-only">, choisir un autre mois</span>
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          aria-hidden="true"
          className={cn("shrink-0 text-garance transition-transform duration-200", open && "rotate-180")}
        >
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" />
        </svg>
      </button>

      {open && (
        <div
          ref={panel}
          id={panelId}
          role="group"
          aria-label="Choisir un mois"
          className="absolute top-full left-1/2 z-30 mt-2 w-[300px] -translate-x-1/2 border border-t-4 border-filet border-t-garance bg-blanc p-4 shadow-[0_24px_48px_-20px_rgb(20_29_34/0.45)]"
        >
          <div className="mb-3 flex items-center justify-between">
            <YearButton label="Année précédente" disabled={year <= years.min} onClick={() => setYear(year - 1)} d="M15 5l-7 7 7 7" />
            <p aria-live="polite" className="font-display text-[1.5rem] leading-none tabular-nums">
              {year}
            </p>
            <YearButton label="Année suivante" disabled={year >= years.max} onClick={() => setYear(year + 1)} d="M9 5l7 7-7 7" />
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {MOIS_COURTS.map((name, m) => {
              const selected = year === view.y && m === view.m;
              const hasEvents = eventMonths.has(`${year}-${m}`);
              return (
                <button
                  key={name}
                  type="button"
                  data-month
                  aria-pressed={selected}
                  onClick={() => {
                    onPick({ y: year, m });
                    close(true);
                  }}
                  className={cn(
                    "relative h-11 cursor-pointer rounded-[4px] text-[0.95rem] font-semibold transition-colors duration-200",
                    // Mois avec événements : en garance, en plus du point (demande de Louis du 13/11/2026)
                    selected ? "bg-garance text-blanc" : cn("hover:bg-pierre", hasEvents ? "text-garance" : "text-ink"),
                  )}
                >
                  {name}
                  {hasEvents && (
                    <>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute bottom-1.5 left-1/2 size-[5px] -translate-x-1/2 rounded-full",
                          selected ? "bg-blanc" : "bg-garance",
                        )}
                      />
                      <span className="sr-only">, avec des événements</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function YearButton({ label, disabled, onClick, d }: { label: string; disabled: boolean; onClick: () => void; d: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-[4px] text-ink transition-colors duration-200 enabled:cursor-pointer enabled:hover:bg-pierre disabled:opacity-25"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d={d} fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </button>
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
                  className="inline-block rounded-[4px] bg-garance px-[1.5em] py-[0.8em] font-semibold text-creme no-underline transition-colors duration-200 hover:bg-garance-dark hover:text-blanc"
                >
                  {e.placeUrlLabel ?? "Site du lieu"} ↗<span className="sr-only"> (nouvel onglet)</span>
                </a>
              )}
              <Link
                href={contact.href}
                className="inline-block rounded-[4px] border-2 border-ink px-[1.5em] py-[0.8em] font-semibold text-ink no-underline transition-colors duration-200 hover:bg-ink hover:text-blanc"
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
