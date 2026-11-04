"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { CalendarClock, Check, FileText, Play, RotateCcw, ShieldAlert, UserCheck, Zap } from "lucide-react";
import { ALL_AUTO, ALL_MANUAL, GATES, MANUAL_HOURS, fmtDuration, stepFor, type Mode, type Modes } from "./pipelineModel";

/**
 * "Pipeline Gates": a change moving through six control gates. Each gate can run as a manual queue
 * (people, meetings, windows) or as an automated check that produces evidence. A "novel change" switch shows
 * escalation to human review. Durations are illustrative assumptions (see pipelineModel.ts), shown to the reader
 * in the model notes.
 */

const BASELINE_HOURS = MANUAL_HOURS;

export default function PipelineGates({ caption }: { caption?: string }) {
  const [modes, setModes] = useState<Modes>(ALL_MANUAL);
  const [novel, setNovel] = useState(false);
  const [active, setActive] = useState<number | null>(null); // index of gate the change is at
  const [done, setDone] = useState(false);
  const timer = useRef<number | null>(null);

  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduced = mounted ? prefersReduced : null;

  const steps = useMemo(() => GATES.map((g) => stepFor(g, modes, novel)), [modes, novel]);
  const totalHours = steps.reduce((s, x) => s + x.step.hours, 0);
  const waitingHours = steps.filter((x) => x.kind === "manual").reduce((s, x) => s + x.step.hours, 0);
  const reviewHours = steps.filter((x) => x.kind === "escalated").reduce((s, x) => s + x.step.hours, 0);
  const escalated = reviewHours > 0;
  const machineEvidence = steps.filter((x) => x.kind === "auto" || x.kind === "human").length;
  const routineHumanChecks = steps.filter((x) => x.kind === "manual").length;
  const allAuto = GATES.every((g) => g.human || modes[g.id] === "auto");
  const allManual = GATES.every((g) => g.human || modes[g.id] === "manual");

  function stop() {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    setActive(null);
    setDone(false);
  }
  useEffect(() => stop, []);
  // Any change to the configuration resets a run in progress.
  useEffect(() => {
    stop();
  }, [modes, novel]);

  function run() {
    stop();
    if (reduced) {
      setDone(true);
      return;
    }
    let i = 0;
    const tick = () => {
      setActive(i);
      const kind = steps[i].kind;
      const dwell = kind === "manual" ? 1250 : kind === "escalated" ? 1000 : kind === "human" ? 700 : 380;
      timer.current = window.setTimeout(() => {
        i += 1;
        if (i < steps.length) tick();
        else {
          setActive(null);
          setDone(true);
        }
      }, dwell);
    };
    tick();
  }

  const setAll = (m: Modes) => setModes(m);
  const pct = Math.max(1.5, (totalHours / BASELINE_HOURS) * 100);

  const waitingShare = waitingHours / totalHours;
  const summary = `${novel ? "Novel change. " : ""}Lead time ${fmtDuration(totalHours)}, ${
    waitingHours === 0
      ? "with no time in manual queues"
      : waitingShare >= 0.95
        ? "almost all of it waiting in manual queues"
        : `of which ${fmtDuration(waitingHours)} waiting in manual queues`
  }${escalated ? `, and ${fmtDuration(reviewHours)} in a human risk review` : ""}. ${machineEvidence} of 6 controls ${
    machineEvidence === 1 ? "produces" : "produce"
  } evidence automatically.`;

  const outcome =
    waitingHours === 0 && !escalated
      ? ", with no queue in the way."
      : waitingHours === 0
        ? `, ${fmtDuration(reviewHours)} of it a deliberate human risk review.`
        : waitingShare >= 0.95
          ? ", almost all of it waiting in queues."
          : `, ${fmtDuration(waitingHours)} of it waiting.`;

  return (
    <figure className="not-prose my-14 font-sans">
      <div className="overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
            <span className="eyebrow text-fg-3">Interactive model · Evidence, not meetings</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setAll(ALL_MANUAL);
              setNovel(false);
            }}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-fg-3 transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
          >
            <RotateCcw className="size-3.5" strokeWidth={1.75} aria-hidden="true" /> Reset
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-4 sm:px-6">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Scenarios">
            <button
              type="button"
              aria-pressed={allManual}
              onClick={() => setAll(ALL_MANUAL)}
              className={`rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                allManual ? "border-accent bg-accent text-on-accent" : "border-line-2 text-fg-2 hover:border-line-3 hover:text-fg"
              }`}
            >
              Meetings and queues
            </button>
            <button
              type="button"
              aria-pressed={allAuto}
              onClick={() => setAll(ALL_AUTO)}
              className={`rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                allAuto ? "border-accent bg-accent text-on-accent" : "border-line-2 text-fg-2 hover:border-line-3 hover:text-fg"
              }`}
            >
              Evidence in the pipeline
            </button>
          </div>
          <label className="ms-auto inline-flex cursor-pointer items-center gap-2.5 text-[12.5px] text-fg-2">
            <span>Novel change (new third party, new data use)</span>
            <button
              type="button"
              role="switch"
              aria-checked={novel}
              onClick={() => setNovel((v) => !v)}
              className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                novel ? "border-accent bg-accent" : "border-line-3 bg-line"
              }`}
            >
              <span className={`absolute top-0.5 size-3.5 rounded-full bg-bg shadow transition-[inset-inline-start] ${novel ? "start-[1.05rem]" : "start-0.5"}`} />
            </button>
          </label>
        </div>

        {/* Gates */}
        <ol className="relative px-5 py-5 sm:px-6">
          {/* Centred on the 2rem nodes: list padding + 1rem, minus half the line's width. */}
          <span aria-hidden="true" className="absolute bottom-9 start-[calc(2.25rem_-_0.5px)] top-9 w-px bg-line-2 sm:start-[calc(2.5rem_-_0.5px)]" />
          {GATES.map((g, i) => {
            const { step, kind } = steps[i];
            const isActive = active === i;
            const passed = done || (active !== null && i < active);
            const nodeTone =
              kind === "manual"
                ? "border-danger/60 text-danger"
                : kind === "escalated"
                  ? "border-accent text-accent"
                  : "border-signal/70 text-signal";
            return (
              <li key={g.id} className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 py-2.5 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:items-center">
                <span
                  aria-hidden="true"
                  className={`relative z-10 mt-0.5 flex size-8 items-center justify-center rounded-full border bg-surface transition-all duration-300 sm:mt-0 ${nodeTone} ${
                    isActive ? "scale-110 shadow-[0_0_0_6px_color-mix(in_oklab,var(--c-accent)_18%,transparent)]" : ""
                  } ${passed ? "bg-surface-2" : ""}`}
                >
                  {kind === "manual" ? (
                    <CalendarClock className={`size-4 ${isActive ? "animate-pulse" : ""}`} strokeWidth={1.75} />
                  ) : kind === "escalated" ? (
                    <ShieldAlert className="size-4" strokeWidth={1.75} />
                  ) : passed ? (
                    <Check className="size-4" strokeWidth={2} />
                  ) : kind === "human" ? (
                    <UserCheck className="size-4" strokeWidth={1.75} />
                  ) : (
                    <Zap className="size-4" strokeWidth={1.75} />
                  )}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <p className="text-[14.5px] font-medium text-fg">{g.name}</p>
                    <p className="text-[12px] text-fg-4">{g.control}</p>
                  </div>
                  <p className={`mt-0.5 text-[13px] leading-snug ${kind === "manual" ? "text-fg-2" : kind === "escalated" ? "text-accent" : "text-fg-2"}`}>
                    {step.label}
                    <span className={`ms-2 font-mono text-[12px] tabular-nums ${kind === "manual" ? "text-danger" : "text-fg-3"}`}>
                      {isActive && kind === "manual" ? `waiting… ${fmtDuration(step.hours)}` : fmtDuration(step.hours)}
                    </span>
                  </p>
                </div>
                <div className="col-start-2 mt-2 sm:col-start-auto sm:mt-0">
                  {g.human ? (
                    <span className="inline-block rounded-md border border-line-2 px-2.5 py-1 text-[11.5px] text-fg-3">Human by design</span>
                  ) : (
                    <div className="inline-flex rounded-md border border-line-2 p-0.5" role="group" aria-label={`${g.name} mode`}>
                      {(["manual", "auto"] as Mode[]).map((m) => (
                        <button
                          key={m}
                          type="button"
                          aria-pressed={modes[g.id] === m}
                          onClick={() => setModes((prev) => ({ ...prev, [g.id]: m }))}
                          className={`rounded px-2.5 py-1 text-[11.5px] transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                            modes[g.id] === m
                              ? m === "auto"
                                ? "bg-signal/15 text-signal"
                                : "bg-danger/12 text-danger"
                              : "text-fg-3 hover:text-fg"
                          }`}
                        >
                          {m === "auto" ? "Automated" : "Manual"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="flex flex-wrap items-center gap-3 border-t border-line px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={run}
            disabled={active !== null}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-[13px] font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Play className="size-3.5" strokeWidth={2} aria-hidden="true" />
            {active !== null ? "Change in progress…" : done ? "Send another change" : "Send a change through"}
          </button>
          {done && (
            <p className="text-[13px] text-fg-2">
              Delivered in <strong className="font-semibold text-fg">{fmtDuration(totalHours)}</strong>
              {outcome}
            </p>
          )}
        </div>

        {/* Readouts */}
        <div className="grid gap-px border-t border-line bg-line md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="bg-surface px-5 py-5 sm:px-6">
            <p className="eyebrow text-fg-4">{novel ? "Lead time for a novel change" : "Lead time for a routine change"}</p>
            <p className="mt-2 font-display text-[2.6rem] leading-none tabular-nums text-fg">{fmtDuration(totalHours)}</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-line" aria-hidden="true">
              <div
                className={`h-full rounded-full transition-[width] duration-700 ${waitingHours > totalHours / 2 ? "bg-danger" : "bg-accent"}`}
                style={{ width: `${Math.min(100, pct)}%` }}
              />
            </div>
            <p className="mt-2 text-[11.5px] text-fg-3">
              Bar scale: all-manual process = {fmtDuration(BASELINE_HOURS)}
            </p>
            <p className="mt-4 text-[13px] leading-relaxed text-fg-2">
              People re-checking routine work:{" "}
              <strong className="font-semibold text-fg">{routineHumanChecks === 0 ? "none" : `${routineHumanChecks} gates`}</strong>
              {escalated ? (
                <span className="text-accent"> · this change escalated for a human risk decision</span>
              ) : (
                novel && <span className="text-fg-3"> · the weekly board gives it the same two minutes as any other change</span>
              )}
            </p>
          </div>
          <div className="bg-surface px-5 py-5 sm:px-6">
            <div className="flex items-baseline justify-between gap-3">
              <p className="eyebrow text-fg-4">Evidence pack that ships with the release</p>
              <span className="shrink-0 whitespace-nowrap font-mono text-[12px] tabular-nums text-signal">{machineEvidence}/6 automatic</span>
            </div>
            <ul className="mt-3 space-y-1.5">
              {GATES.map((g, i) => {
                const { step, kind } = steps[i];
                const auto = kind === "auto" || kind === "human";
                return (
                  <li key={g.id} className="flex items-start gap-2 text-[12.5px] leading-snug">
                    {auto ? (
                      <Check className="mt-0.5 size-3.5 shrink-0 text-signal" strokeWidth={2.25} aria-hidden="true" />
                    ) : kind === "escalated" ? (
                      <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-accent" strokeWidth={2} aria-hidden="true" />
                    ) : (
                      <FileText className="mt-0.5 size-3.5 shrink-0 text-fg-4" strokeWidth={1.75} aria-hidden="true" />
                    )}
                    <span className={auto ? "text-fg-2" : "text-fg-3"}>
                      {step.evidence}
                      <span className="text-fg-4"> · {auto ? "attached automatically" : kind === "escalated" ? "human decision, recorded" : "collected by hand"}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {summary}
        </p>

        <details className="group border-t border-line px-5 py-4 text-[13px] leading-relaxed text-fg-3 sm:px-6">
          <summary className="cursor-pointer list-none font-medium text-fg-2 hover:text-fg">
            <span className="me-2 inline-block transition-transform group-open:rotate-90">›</span>
            How this model works
          </summary>
          <div className="mt-3 space-y-2 ps-4">
            <p>
              Manual gates wait for the next slot, so their time is mostly queueing: a test cycle every few days, a security review queue, a
              weekly change board (on average a change waits half a week), an out-of-hours release window. Automated gates run on every change
              in minutes. Peer review stays human in both cases, because it is how segregation of duties is met.
            </p>
            <p>
              A novel change is escalated to people even when every gate is automated. That is deliberate: rules written yesterday are weakest
              exactly where something is new.
            </p>
            <p className="text-fg-4">
              Illustrative durations with round numbers, not data from any bank. Times are elapsed hours, not working hours.
            </p>
          </div>
        </details>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "Switch gates to “Automated” one at a time, then send a change through. Then try a novel change."}
      </figcaption>
    </figure>
  );
}
