import React from "react";
import { Img, staticFile } from "remotion";
import { DISPLAY, TEXT } from "./theme";

/**
 * Port of the site's CSS-3D phone (src/components/launch/Phone3D.tsx) for Remotion: a glass front, a glass back
 * with a camera plateau, and a metal band of side walls and faceted corners between them, so it has true
 * thickness when it turns. Same geometry, finishes and screens as the site, sized from one number, `w` (the
 * phone's width in px), and driven by plain numbers from the frame instead of motion values. Put it inside an
 * element with `perspective`, and keep `opacity`, `filter` and `overflow` off its 3D ancestors (they flatten it).
 */

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

/** The phone's width, for screens that size themselves in phone widths (the site's --w). */
const PhoneWidth = React.createContext(300);
export const useU = () => {
  const w = React.useContext(PhoneWidth);
  return (k: number) => k * w;
};

export interface Phone3DProps {
  /** Width of the phone in px. */
  w: number;
  finish?: Finish;
  rx?: number;
  ry?: number;
  rz?: number;
  /** What the screen shows. */
  screen?: React.ReactNode;
  /** The Dynamic Island cut-out. */
  island?: boolean;
  /** Extra pieces in the phone's own 3D space (px from its top-left corner). */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Phone3D: React.FC<Phone3DProps> = ({ w, finish = "midnight", rx = 0, ry = 0, rz = 0, screen, island = true, children, style }) => {
  const f = FINISHES[finish];
  const u = (k: number) => k * w;
  // The sheen on the glass slides across as the phone turns.
  const turn = ((((ry % 360) + 540) % 360) - 180) / 70;
  const glareX = Math.max(-1.4, Math.min(1.4, -turn)) * 55;

  return (
    <PhoneWidth.Provider value={w}>
      <div
        style={{
          position: "relative",
          flexShrink: 0,
          transformStyle: "preserve-3d",
          width: w,
          height: u(PHONE.height),
          transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
          ...style,
        }}
      >
        {WALLS.map((wall) => (
          <span
            key={wall.key}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: u(wall.width),
              height: u(PHONE.depth),
              marginLeft: u(-wall.width / 2),
              marginTop: u(-PHONE.depth / 2),
              transform: `translate3d(${u(wall.x)}px, ${u(wall.y)}px, 0) rotateZ(${wall.angle}deg) rotateX(90deg)`,
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
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              borderRadius: 999,
              width: u(button.h),
              height: u(PHONE.depth * 0.42),
              marginLeft: u(-button.h / 2),
              marginTop: u(-PHONE.depth * 0.21),
              transform: `translate3d(${u(-0.008)}px, ${u(button.y + button.h / 2)}px, 0) rotateZ(90deg) rotateX(90deg)`,
              background: f.band,
              boxShadow: "0 0 0 0.5px rgba(0,0,0,0.35)",
            }}
          />
        ))}

        <PhoneBack w={w} finish={finish} />

        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: u(PHONE.radius),
            transform: `translateZ(${u(PHONE.depth / 2)}px)`,
            background: "#050506",
            boxShadow: `inset 0 0 0 ${u(0.007)}px ${f.ring}, inset 0 0 0 ${u(0.013)}px #000`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: u(PHONE.bezel),
              borderRadius: u(PHONE.radius - PHONE.bezel),
              overflow: "hidden",
              background: "#000",
            }}
          >
            {screen}
            {island && (
              <span
                style={{
                  position: "absolute",
                  left: "50%",
                  top: u(0.032),
                  width: u(0.29),
                  height: u(0.085),
                  marginLeft: u(-0.145),
                  borderRadius: 999,
                  background: "#000",
                }}
              />
            )}
            <span
              style={{
                pointerEvents: "none",
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "-50%",
                width: "200%",
                mixBlendMode: "screen",
                transform: `translateX(${glareX}%)`,
                background: "linear-gradient(112deg, transparent 38%, rgba(255,255,255,0.16) 47%, rgba(255,255,255,0.05) 53%, transparent 62%)",
              }}
            />
          </div>
        </div>

        {children}
      </div>
    </PhoneWidth.Provider>
  );
};

const PhoneBack: React.FC<{ w: number; finish: Finish }> = ({ w, finish }) => {
  const f = FINISHES[finish];
  const u = (k: number) => k * w;
  const lens = (left: number, top: number) => (
    <span
      style={{
        position: "absolute",
        borderRadius: 999,
        left: u(left),
        top: u(top),
        width: u(0.142),
        height: u(0.142),
        background: "radial-gradient(circle at 50% 50%, #0c1018 0 26%, #1d2433 27% 38%, #05070b 39% 58%, #2a2d33 59% 66%, #0d0e11 67% 100%)",
        boxShadow: `0 0 0 ${u(0.008)}px ${f.ring}, 0 ${u(0.01)}px ${u(0.03)}px rgba(0,0,0,0.45)`,
      }}
    >
      <span
        style={{ position: "absolute", borderRadius: 999, background: "rgba(255,255,255,0.5)", filter: "blur(0.5px)", left: "30%", top: "28%", width: "13%", height: "13%" }}
      />
    </span>
  );
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        borderRadius: u(PHONE.radius),
        transform: `rotateY(180deg) translateZ(${u(PHONE.depth / 2)}px)`,
        background: f.back,
        boxShadow: `inset 0 0 0 ${u(0.007)}px ${f.ring}`,
      }}
    >
      <span style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.18), transparent 40%, transparent 70%, rgba(255,255,255,0.07))" }} />
      <span
        style={{
          position: "absolute",
          left: u(0.06),
          top: u(0.06),
          width: u(0.38),
          height: u(0.38),
          borderRadius: u(0.11),
          background: f.plateau,
          boxShadow: `inset 0 0 0 ${u(0.005)}px ${f.ring}, 0 ${u(0.012)}px ${u(0.03)}px rgba(0,0,0,0.25)`,
        }}
      >
        {lens(0.028, 0.028)}
        {lens(0.028, 0.21)}
        {lens(0.205, 0.118)}
        <span style={{ position: "absolute", borderRadius: 999, left: u(0.262), top: u(0.04), width: u(0.05), height: u(0.05), background: "radial-gradient(circle, #fffbea, #cfc6a3)" }} />
        <span style={{ position: "absolute", borderRadius: 999, background: "rgba(0,0,0,0.6)", left: u(0.272), top: u(0.302), width: u(0.03), height: u(0.03) }} />
      </span>
    </div>
  );
};

/** A soft contact shadow under a phone (in 2D, below it); narrows as the phone turns edge-on. */
export const PhoneShadow: React.FC<{ x: number; y: number; w: number; ry?: number; opacity?: number }> = ({ x, y, w, ry = 0, opacity = 1 }) => {
  const sx = 0.42 + 0.58 * Math.abs(Math.cos(rad(ry)));
  return (
    <span
      style={{
        position: "absolute",
        left: x - w * 0.55,
        top: y - w * 0.06,
        width: w * 1.1,
        height: w * 0.12,
        borderRadius: "50%",
        background: "rgba(0,0,0,0.42)",
        filter: `blur(${w * 0.09}px)`,
        transform: `scaleX(${sx})`,
        opacity,
      }}
    />
  );
};

/* ------------------------------------------------------------------ Screens */

const fill: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" };

export const StatusBar: React.FC<{ tone?: "light" | "dark" }> = ({ tone = "light" }) => {
  const u = useU();
  const color = tone === "light" ? "#fff" : "#000";
  return (
    <span
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: TEXT,
        fontWeight: 600,
        height: u(0.15),
        paddingLeft: u(0.085),
        paddingRight: u(0.085),
        color,
        fontSize: u(0.045),
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <span>9:41</span>
      <span style={{ display: "flex", alignItems: "center", gap: u(0.015) }}>
        <span style={{ display: "flex", alignItems: "flex-end", gap: u(0.006), height: u(0.03) }}>
          {[0.4, 0.6, 0.8, 1].map((h) => (
            <span key={h} style={{ display: "block", borderRadius: 1, width: u(0.009), height: `${h * 100}%`, background: color }} />
          ))}
        </span>
        <span style={{ display: "block", borderRadius: 2, border: `1px solid ${color}`, width: u(0.052), height: u(0.026), padding: u(0.004), boxSizing: "border-box" }}>
          <span style={{ display: "block", height: "100%", width: "78%", borderRadius: 1, background: color }} />
        </span>
      </span>
    </span>
  );
};

/** A store icon as a squircle tile. Without an icon: a flat neutral gray tile with a plain grid glyph. */
export const AppTile: React.FC<{ icon?: string; size: number; style?: React.CSSProperties }> = ({ icon, size, style }) => (
  <span
    style={{
      position: "relative",
      display: "block",
      flexShrink: 0,
      overflow: "hidden",
      width: size,
      height: size,
      borderRadius: size * 0.225,
      background: icon ? "#fff" : "#8e8e93",
      boxShadow: `0 0 0 1px rgba(0,0,0,0.08), 0 ${size * 0.06}px ${size * 0.16}px -${size * 0.06}px rgba(0,0,0,0.28)`,
      ...style,
    }}
  >
    {icon ? (
      <Img src={staticFile(icon)} style={fill} />
    ) : (
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ position: "absolute", inset: 0 }}>
        {[
          [30, 30],
          [54, 30],
          [30, 54],
          [54, 54],
        ].map(([x, y]) => (
          <rect key={`${x}${y}`} x={x} y={y} width={16} height={16} rx={4.5} fill="rgba(255,255,255,0.92)" />
        ))}
      </svg>
    )}
  </span>
);

/** The app opening: flat black, its icon centred, its name in white (the site's SplashScreen). */
export const SplashScreen: React.FC<{ icon: string; name: string; caption?: string }> = ({ icon, name, caption }) => {
  const u = useU();
  return (
    <span style={{ position: "absolute", inset: 0, display: "block", background: "#000" }}>
      <StatusBar />
      <span style={{ position: "absolute", left: 0, right: 0, top: "33%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", color: "#fff" }}>
        <span style={{ position: "relative", display: "block", overflow: "hidden", width: u(0.34), height: u(0.34), borderRadius: u(0.078) }}>
          <Img src={staticFile(icon)} style={fill} />
        </span>
        <span style={{ fontFamily: DISPLAY, fontWeight: 600, letterSpacing: "-0.02em", marginTop: u(0.07), fontSize: u(0.075), whiteSpace: "nowrap" }}>{name}</span>
        {caption && <span style={{ fontFamily: TEXT, color: "rgba(255,255,255,0.75)", marginTop: u(0.015), fontSize: u(0.042) }}>{caption}</span>}
      </span>
    </span>
  );
};

/** A store page for one of the apps: icon, name, maker and two of its store screenshots. */
export const ListingScreen: React.FC<{ icon?: string; name: string; maker: string; shots: string[] }> = ({ icon, name, maker, shots }) => {
  const u = useU();
  return (
    <span style={{ position: "absolute", inset: 0, display: "block", background: "#fff", color: "#1d1d1f" }}>
      <StatusBar tone="dark" />
      <span style={{ position: "absolute", left: 0, right: 0, top: u(0.2), display: "flex", alignItems: "center", paddingLeft: u(0.07), paddingRight: u(0.07), gap: u(0.05) }}>
        {icon && (
          <span style={{ position: "relative", display: "block", flexShrink: 0, overflow: "hidden", width: u(0.24), height: u(0.24), borderRadius: u(0.055), boxShadow: "0 0 0 0.5px rgba(0,0,0,0.12)" }}>
            <Img src={staticFile(icon)} style={fill} />
          </span>
        )}
        <span style={{ display: "flex", minWidth: 0, flexDirection: "column" }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, letterSpacing: "-0.02em", fontSize: u(0.068), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>
          <span style={{ fontFamily: TEXT, color: "#6e6e73", fontSize: u(0.04), marginTop: u(0.006), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{maker}</span>
          <span
            style={{
              display: "inline-flex",
              width: "fit-content",
              alignItems: "center",
              borderRadius: 999,
              background: "#0071e3",
              fontFamily: TEXT,
              fontWeight: 600,
              color: "#fff",
              fontSize: u(0.038),
              height: u(0.068),
              paddingLeft: u(0.05),
              paddingRight: u(0.05),
              marginTop: u(0.03),
            }}
          >
            Open
          </span>
        </span>
      </span>
      <span style={{ position: "absolute", left: u(0.07), right: u(0.07), height: 1, background: "rgba(0,0,0,0.1)", top: u(0.5) }} />
      <span style={{ position: "absolute", display: "flex", top: u(0.56), left: u(0.07), right: u(-0.3), gap: u(0.035) }}>
        {shots.slice(0, 3).map((shot) => (
          <span key={shot} style={{ position: "relative", display: "block", flexShrink: 0, overflow: "hidden", background: "#f5f5f7", width: u(0.47), height: u(0.94), borderRadius: u(0.04), boxShadow: "0 0 0 0.5px rgba(0,0,0,0.1)" }}>
            <Img src={staticFile(shot)} style={{ ...fill, objectPosition: "top" }} />
          </span>
        ))}
      </span>
      <span style={{ position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center", bottom: u(0.03) }}>
        <span style={{ display: "block", borderRadius: 999, background: "rgba(0,0,0,0.8)", width: u(0.34), height: u(0.012) }} />
      </span>
    </span>
  );
};

/* ------------------------------------------------------------------ Home screen (film only) */

/**
 * Home-screen grid, in phone widths from the phone's top-left corner (bezel included), so a scene can find
 * where each icon sits on screen and lift it off.
 */
export const HOME = {
  cols: 4,
  icon: 0.165,
  /** Left edge of the first icon and the step between columns. */
  x0: PHONE.bezel + 0.0605,
  dx: 0.218,
  /** Top of the first row and the step between rows. */
  y0: PHONE.bezel + 0.2,
  dy: 0.27,
} as const;

export const homeIcon = (i: number) => ({
  x: HOME.x0 + (i % HOME.cols) * HOME.dx,
  y: HOME.y0 + Math.floor(i / HOME.cols) * HOME.dy,
  size: HOME.icon,
});

/** The factory's home screen: a flat deep navy. */
const HOME_BG = "#13203f";

/**
 * A home screen with one icon per line. `lift[i]` 0 → 1 fades icon i (and its label) off the screen as a scene
 * lifts it away; `title` fades in a centred line of text once the icons are gone.
 */
export const HomeScreen: React.FC<{
  lines: { short: string; icon?: string }[];
  lift?: number[];
  title?: string;
  titleIn?: number;
}> = ({ lines, lift = [], title, titleIn = 0 }) => {
  const u = useU();
  return (
    <span style={{ position: "absolute", inset: 0, display: "block", background: HOME_BG }}>
      <StatusBar />
      {lines.map((line, i) => {
        const g = homeIcon(i);
        const gone = lift[i] ?? 0;
        return (
          <span key={line.short} style={{ position: "absolute", left: u(g.x - PHONE.bezel), top: u(g.y - PHONE.bezel), width: u(g.size) }}>
            <AppTile icon={line.icon} size={u(g.size)} style={{ opacity: gone > 0 ? 0 : 1, boxShadow: `0 ${u(0.01)}px ${u(0.03)}px rgba(0,0,0,0.25)` }} />
            <span
              style={{
                position: "absolute",
                left: u(-0.04),
                right: u(-0.04),
                top: u(g.size + 0.022),
                textAlign: "center",
                fontFamily: TEXT,
                fontWeight: 500,
                fontSize: u(0.034),
                color: "#fff",
                whiteSpace: "nowrap",
                opacity: 1 - Math.min(1, gone * 3),
                textShadow: "0 1px 2px rgba(0,0,0,0.25)",
              }}
            >
              {line.short}
            </span>
          </span>
        );
      })}
      {/* dock */}
      <span
        style={{
          position: "absolute",
          left: u(0.035),
          right: u(0.035),
          bottom: u(0.035),
          height: u(0.24),
          borderRadius: u(0.1),
          background: "rgba(255,255,255,0.18)",
          boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.25)",
        }}
      />
      {title && (
        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "40%",
            textAlign: "center",
            color: "#fff",
            fontFamily: DISPLAY,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            fontSize: u(0.1),
            lineHeight: 1.05,
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * u(0.04)}px)`,
          }}
        >
          {title}
        </span>
      )}
      <span style={{ position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center", bottom: u(0.012) }}>
        <span style={{ display: "block", borderRadius: 999, background: "rgba(255,255,255,0.8)", width: u(0.34), height: u(0.012) }} />
      </span>
    </span>
  );
};

/* ------------------------------------------------------------------ Placement */

/**
 * One phone in its own full-frame 3D layer: centred on (cx, cy), seen from a camera whose vanishing point is
 * `origin` (default: straight on). Being its own layer, the phone can fade or blur as a whole without being
 * flattened. `lift` moves it in its own space (y down, z towards the camera), before it turns.
 */
export const PhoneAt: React.FC<
  Phone3DProps & {
    cx: number;
    cy: number;
    lift?: { y?: number; z?: number };
    origin?: { x: number; y: number };
    perspective?: number;
    layer?: React.CSSProperties;
  }
> = ({ cx, cy, lift, origin, perspective = 1700, layer, ...phone }) => {
  const h = phone.w * PHONE.height;
  return (
    <div style={{ position: "absolute", inset: 0, perspective, perspectiveOrigin: `${origin?.x ?? cx}px ${origin?.y ?? cy}px`, ...layer }}>
      <div
        style={{
          position: "absolute",
          left: cx - phone.w / 2,
          top: cy - h / 2,
          transformStyle: "preserve-3d",
          transform: `translate3d(0px, ${lift?.y ?? 0}px, ${lift?.z ?? 0}px)`,
        }}
      >
        <Phone3D {...phone} />
      </div>
    </div>
  );
};
