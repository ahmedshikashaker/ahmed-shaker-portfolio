"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform, type MotionStyle, type MotionValue } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A phone built in real CSS 3D: a glass front, a glass back with a camera plateau, and a metal band of side
 * walls and faceted corners between them, so it has true thickness when it turns. Everything is sized from one
 * variable, --w (the phone's width), so it scales with the layout. Put it inside an element with `perspective`.
 */

type Num = number | MotionValue<number>;

export type Finish = "midnight" | "silver" | "natural" | "blue";

const FINISHES: Record<Finish, { band: string; back: string; plateau: string; ring: string }> = {
  midnight: {
    band: "linear-gradient(180deg,#101115 0%,#3a3d46 34%,#7a7e89 50%,#3a3d46 66%,#101115 100%)",
    back: "linear-gradient(155deg,#30333c 0%,#1f2128 52%,#16171c 100%)",
    plateau: "linear-gradient(155deg,#3a3d47,#25272e)",
    ring: "#555963",
  },
  silver: {
    band: "linear-gradient(180deg,#8a8d93 0%,#d5d7db 34%,#ffffff 50%,#d0d2d6 66%,#83868c 100%)",
    back: "linear-gradient(155deg,#f6f7f9 0%,#e6e8ec 52%,#d5d8dd 100%)",
    plateau: "linear-gradient(155deg,#eef0f3,#d9dce1)",
    ring: "#c3c6cb",
  },
  natural: {
    band: "linear-gradient(180deg,#7b776f 0%,#c7c2b8 34%,#efebe3 50%,#c2bdb3 66%,#757169 100%)",
    back: "linear-gradient(155deg,#ddd7cd 0%,#cbc4b8 52%,#b9b2a6 100%)",
    plateau: "linear-gradient(155deg,#d8d2c7,#c3bcb0)",
    ring: "#a9a296",
  },
  blue: {
    band: "linear-gradient(180deg,#1b2235 0%,#46526e 34%,#8a96b3 50%,#46526e 66%,#1b2235 100%)",
    back: "linear-gradient(155deg,#33405c 0%,#26314a 52%,#1c2539 100%)",
    plateau: "linear-gradient(155deg,#3c4a69,#2a3550)",
    ring: "#56627e",
  },
};

/** Proportions, in phone widths. */
export const PHONE = {
  height: 2.06,
  depth: 0.1,
  radius: 0.165,
  bezel: 0.03,
} as const;

const u = (k: number) => `calc(var(--w) * ${Number(k.toFixed(5))})`;
const rad = (deg: number) => (deg * Math.PI) / 180;

/** Light falls from the top left; walls facing away from it are shaded. */
const LIGHT = { x: -0.37, y: -0.93 };
const shade = (nx: number, ny: number) => Math.max(0, Math.min(0.42, 0.21 - 0.25 * (nx * LIGHT.x + ny * LIGHT.y)));

interface Wall {
  key: string;
  width: number;
  x: number;
  y: number;
  angle: number;
  shade: number;
}

/** The band around the phone: four straight walls plus three facets on each rounded corner. */
const WALLS: Wall[] = (() => {
  const { height: H, radius: R } = PHONE;
  const walls: Wall[] = [
    { key: "top", width: 1 - 2 * R + 0.004, x: 0.5, y: 0, angle: 0, shade: shade(0, -1) },
    { key: "bottom", width: 1 - 2 * R + 0.004, x: 0.5, y: H, angle: 0, shade: shade(0, 1) },
    { key: "left", width: H - 2 * R + 0.004, x: 0, y: H / 2, angle: 90, shade: shade(-1, 0) },
    { key: "right", width: H - 2 * R + 0.004, x: 1, y: H / 2, angle: 90, shade: shade(1, 0) },
  ];
  const corners = [
    { cx: R, cy: R, start: 180 },
    { cx: 1 - R, cy: R, start: 270 },
    { cx: 1 - R, cy: H - R, start: 0 },
    { cx: R, cy: H - R, start: 90 },
  ];
  const step = 30;
  const chord = 2 * R * Math.sin(rad(step / 2)) + 0.006;
  const reach = R * Math.cos(rad(step / 2));
  corners.forEach(({ cx, cy, start }, c) => {
    for (let k = 0; k < 3; k++) {
      const phi = start + step / 2 + step * k;
      const nx = Math.cos(rad(phi));
      const ny = Math.sin(rad(phi));
      walls.push({ key: `c${c}${k}`, width: chord, x: cx + reach * nx, y: cy + reach * ny, angle: phi + 90, shade: shade(nx, ny) });
    }
  });
  return walls;
})();

/** Keeps a plain number and a MotionValue interchangeable as a style input. */
function useNum(value: Num | undefined, fallback = 0): MotionValue<number> {
  const local = useMotionValue(typeof value === "number" ? value : fallback);
  useEffect(() => {
    if (typeof value === "number") local.set(value);
  }, [value, local]);
  return typeof value === "object" ? value : local;
}

export interface Phone3DProps {
  /** CSS width of the phone, e.g. "clamp(11rem, 20vw, 18rem)". */
  width: string;
  finish?: Finish;
  rotateX?: Num;
  rotateY?: Num;
  rotateZ?: Num;
  /** What the screen shows. */
  screen?: ReactNode;
  /** The Dynamic Island cut-out; off for screenshots that already include one. */
  island?: boolean;
  /** Extra pieces in the phone's own 3D space (phone widths from its top-left corner). */
  children?: ReactNode;
  className?: string;
  style?: MotionStyle;
}

export function Phone3D({ width, finish = "midnight", rotateX, rotateY, rotateZ, screen, island = true, children, className, style }: Phone3DProps) {
  const f = FINISHES[finish];
  const rx = useNum(rotateX);
  const ry = useNum(rotateY);
  const rz = useNum(rotateZ);
  // The sheen on the glass slides across as the phone turns.
  const glareX = useTransform(ry, (value) => {
    const turn = ((((value % 360) + 540) % 360) - 180) / 70;
    return `${Math.max(-1.4, Math.min(1.4, -turn)) * 55}%`;
  });

  return (
    <motion.div
      className={cn("relative shrink-0 [transform-style:preserve-3d]", className)}
      style={{ ["--w" as string]: width, width: "var(--w)", height: u(PHONE.height), rotateX: rx, rotateY: ry, rotateZ: rz, ...style }}
    >
      {WALLS.map((wall) => (
        <span
          key={wall.key}
          aria-hidden="true"
          className="absolute left-0 top-0"
          style={{
            width: u(wall.width),
            height: u(PHONE.depth),
            marginLeft: u(-wall.width / 2),
            marginTop: u(-PHONE.depth / 2),
            transform: `translate3d(${u(wall.x)}, ${u(wall.y)}, 0) rotateZ(${wall.angle}deg) rotateX(90deg)`,
            backgroundImage: `linear-gradient(rgba(0,0,0,${wall.shade.toFixed(3)}),rgba(0,0,0,${wall.shade.toFixed(3)})),${f.band}`,
          }}
        />
      ))}

      {/* Side buttons, on the left wall */}
      {[
        { y: 0.36, h: 0.1 },
        { y: 0.52, h: 0.17 },
        { y: 0.73, h: 0.17 },
      ].map((button) => (
        <span
          key={button.y}
          aria-hidden="true"
          className="absolute left-0 top-0 rounded-full"
          style={{
            width: u(button.h),
            height: u(PHONE.depth * 0.42),
            marginLeft: u(-button.h / 2),
            marginTop: u(-PHONE.depth * 0.21),
            transform: `translate3d(${u(-0.008)}, ${u(button.y + button.h / 2)}, 0) rotateZ(90deg) rotateX(90deg)`,
            background: f.band,
            boxShadow: "0 0 0 0.5px rgba(0,0,0,0.35)",
          }}
        />
      ))}

      <PhoneBack finish={finish} />

      <div
        className="absolute inset-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
        style={{
          borderRadius: u(PHONE.radius),
          transform: `translateZ(${u(PHONE.depth / 2)})`,
          background: "#050506",
          boxShadow: `inset 0 0 0 ${u(0.007)} ${f.ring}, inset 0 0 0 ${u(0.013)} #000`,
        }}
      >
        <div
          className="absolute overflow-hidden bg-black"
          style={{ inset: u(PHONE.bezel), borderRadius: u(PHONE.radius - PHONE.bezel) }}
        >
          {screen}
          {island && (
            <span
              aria-hidden="true"
              className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black"
              style={{ top: u(0.032), width: u(0.29), height: u(0.085) }}
            />
          )}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-[200%] mix-blend-screen"
            style={{
              x: glareX,
              background: "linear-gradient(112deg, transparent 38%, rgba(255,255,255,0.16) 47%, rgba(255,255,255,0.05) 53%, transparent 62%)",
            }}
          />
        </div>
      </div>

      {children}
    </motion.div>
  );
}

function PhoneBack({ finish }: { finish: Finish }) {
  const f = FINISHES[finish];
  const lens = (left: number, top: number) => (
    <span
      className="absolute rounded-full"
      style={{
        left: u(left),
        top: u(top),
        width: u(0.142),
        height: u(0.142),
        background: "radial-gradient(circle at 50% 50%, #0c1018 0 26%, #1d2433 27% 38%, #05070b 39% 58%, #2a2d33 59% 66%, #0d0e11 67% 100%)",
        boxShadow: `0 0 0 ${u(0.008)} ${f.ring}, 0 ${u(0.01)} ${u(0.03)} rgba(0,0,0,0.45)`,
      }}
    >
      <span className="absolute rounded-full bg-white/50 blur-[0.5px]" style={{ left: "30%", top: "28%", width: "13%", height: "13%" }} />
    </span>
  );
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
      style={{
        borderRadius: u(PHONE.radius),
        transform: `rotateY(180deg) translateZ(${u(PHONE.depth / 2)})`,
        background: f.back,
        boxShadow: `inset 0 0 0 ${u(0.007)} ${f.ring}`,
      }}
    >
      <span className="absolute inset-0" style={{ background: "linear-gradient(120deg, rgba(255,255,255,0.18), transparent 40%, transparent 70%, rgba(255,255,255,0.07))" }} />
      <span
        className="absolute"
        style={{
          left: u(0.06),
          top: u(0.06),
          width: u(0.38),
          height: u(0.38),
          borderRadius: u(0.11),
          background: f.plateau,
          boxShadow: `inset 0 0 0 ${u(0.005)} ${f.ring}, 0 ${u(0.012)} ${u(0.03)} rgba(0,0,0,0.25)`,
        }}
      >
        {lens(0.028, 0.028)}
        {lens(0.028, 0.21)}
        {lens(0.205, 0.118)}
        <span className="absolute rounded-full" style={{ left: u(0.262), top: u(0.04), width: u(0.05), height: u(0.05), background: "radial-gradient(circle, #fffbea, #cfc6a3)" }} />
        <span className="absolute rounded-full bg-black/60" style={{ left: u(0.272), top: u(0.302), width: u(0.03), height: u(0.03) }} />
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ Screens */

export function StatusBar({ tone = "light" }: { tone?: "light" | "dark" }) {
  const color = tone === "light" ? "#fff" : "#000";
  return (
    <span aria-hidden="true" className="absolute inset-x-0 top-0 flex items-center justify-between font-text font-semibold" style={{ height: u(0.15), paddingInline: u(0.085), color, fontSize: u(0.045) }}>
      <span className="numeric">9:41</span>
      <span className="flex items-center" style={{ gap: u(0.015) }}>
        <span className="flex items-end" style={{ gap: u(0.006), height: u(0.03) }}>
          {[0.4, 0.6, 0.8, 1].map((h) => (
            <span key={h} className="block rounded-[1px]" style={{ width: u(0.009), height: `${h * 100}%`, background: color }} />
          ))}
        </span>
        <span className="block rounded-[2px] border" style={{ width: u(0.052), height: u(0.026), borderColor: color, padding: u(0.004) }}>
          <span className="block h-full w-[78%] rounded-[1px]" style={{ background: color }} />
        </span>
      </span>
    </span>
  );
}

/** The app opening: its icon centred on a black screen, with its name. */
export function SplashScreen({ icon, name, caption }: { icon: string; name: string; caption?: string }) {
  return (
    <span className="absolute inset-0 block bg-black">
      <StatusBar />
      <span className="absolute inset-x-0 flex flex-col items-center text-center text-white" style={{ top: "33%" }}>
        <span className="relative block overflow-hidden" style={{ width: u(0.34), height: u(0.34), borderRadius: u(0.078), boxShadow: `0 ${u(0.03)} ${u(0.08)} rgba(0,0,0,0.35)` }}>
          <Image src={icon} alt="" fill sizes="(min-width: 1024px) 110px, 70px" className="object-cover" />
        </span>
        <span className="font-head font-semibold tracking-[-0.02em]" style={{ marginTop: u(0.07), fontSize: u(0.075) }}>
          {name}
        </span>
        {caption && (
          <span className="font-text opacity-75" style={{ marginTop: u(0.015), fontSize: u(0.042) }}>
            {caption}
          </span>
        )}
      </span>
    </span>
  );
}

/** A store page for one of the apps: icon, name, maker and two of its store screenshots. */
export function ListingScreen({ icon, name, maker, shots }: { icon?: string; name: string; maker: string; shots: string[] }) {
  return (
    <span className="absolute inset-0 block bg-white text-[#1d1d1f]">
      <StatusBar tone="dark" />
      <span className="absolute inset-x-0 flex items-center" style={{ top: u(0.2), paddingInline: u(0.07), gap: u(0.05) }}>
        {icon && (
          <span className="relative block shrink-0 overflow-hidden" style={{ width: u(0.24), height: u(0.24), borderRadius: u(0.055), boxShadow: "0 0 0 0.5px rgba(0,0,0,0.12)" }}>
            <Image src={icon} alt="" fill sizes="80px" className="object-cover" />
          </span>
        )}
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-head font-bold tracking-[-0.02em]" style={{ fontSize: u(0.068) }}>
            {name}
          </span>
          <span className="truncate font-text text-[#6e6e73]" style={{ fontSize: u(0.04), marginTop: u(0.006) }}>
            {maker}
          </span>
          <span
            className="mt-auto inline-flex w-fit items-center rounded-full bg-[#0071e3] font-text font-semibold text-white"
            style={{ fontSize: u(0.038), height: u(0.068), paddingInline: u(0.05), marginTop: u(0.03) }}
          >
            Open
          </span>
        </span>
      </span>
      <span className="absolute inset-x-0 h-px bg-black/10" style={{ top: u(0.5), marginInline: u(0.07) }} />
      <span className="absolute flex" style={{ top: u(0.56), left: u(0.07), right: u(-0.3), gap: u(0.035) }}>
        {shots.slice(0, 3).map((shot) => (
          <span key={shot} className="relative block shrink-0 overflow-hidden bg-[#f5f5f7]" style={{ width: u(0.47), height: u(0.94), borderRadius: u(0.04), boxShadow: "0 0 0 0.5px rgba(0,0,0,0.1)" }}>
            <Image src={shot} alt="" fill sizes="(min-width: 1024px) 140px, 90px" className="object-cover object-top" />
          </span>
        ))}
      </span>
      <span className="absolute inset-x-0 flex justify-center" style={{ bottom: u(0.03) }}>
        <span className="block rounded-full bg-black/80" style={{ width: u(0.34), height: u(0.012) }} />
      </span>
    </span>
  );
}

/** A real screenshot of a screen, edge to edge. */
export function ShotScreen({ src, alt = "", position = "top" }: { src: string; alt?: string; position?: string }) {
  return <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 300px, 180px" className="object-cover" style={{ objectPosition: position }} />;
}
