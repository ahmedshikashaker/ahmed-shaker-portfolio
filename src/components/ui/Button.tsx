"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useFinePointer } from "@/lib/hooks";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const BASE =
  "relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-[-0.005em] transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-[var(--c-btn-bg)] text-[var(--c-btn-fg)] shadow-soft hover:bg-[var(--c-btn-bg-hover)]",
  secondary: "border border-line-2 bg-surface/70 text-fg backdrop-blur-sm hover:border-line-3 hover:bg-surface-2",
  outline: "border border-accent/45 text-accent hover:border-accent hover:bg-accent/10",
  ghost: "text-fg-2 hover:text-fg",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-[3.25rem] px-6 text-[15px]",
};

export function buttonClasses({ variant = "primary", size = "md", className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

/** Arrow that exits and re-enters on hover of any parent link or button. */
export function ArrowGlyph({ direction = "up-right", className }: { direction?: "up-right" | "down-right" | "right"; className?: string }) {
  const Icon = direction === "down-right" ? ArrowDownRight : direction === "right" ? ArrowRight : ArrowUpRight;
  return (
    <span aria-hidden="true" data-dir={direction} className={cn("arrow-swap size-4", className)}>
      <Icon strokeWidth={1.75} />
      <Icon strokeWidth={1.75} />
    </span>
  );
}

/** Pulls its child gently toward the cursor (fine pointers only, never with reduced motion). */
export function Magnetic({ children, strength = 0.26, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });

  if (reduce || !fine) return <span className={cn("inline-flex", className)}>{children}</span>;

  return (
    <motion.span
      ref={ref}
      className={cn("inline-flex", className)}
      style={{ x: springX, y: springY }}
      onPointerEnter={() => {
        rect.current = ref.current?.getBoundingClientRect() ?? null;
      }}
      onPointerMove={(event) => {
        const r = rect.current;
        if (!r) return;
        x.set((event.clientX - (r.left + r.width / 2)) * strength);
        y.set((event.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        rect.current = null;
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
  iconLeading?: ReactNode;
  magnetic?: boolean;
}

type AnchorProps = BaseProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & { href: string };
type NativeProps = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: undefined };

export function Button(props: AnchorProps | NativeProps) {
  const { variant, size, className, children, icon, iconLeading, magnetic, ...rest } = props;
  const classes = buttonClasses({ variant, size, className });
  const content = (
    <>
      {iconLeading}
      <span>{children}</span>
      {icon}
    </>
  );

  let element: ReactNode;
  if (props.href !== undefined) {
    const { href, ...anchorRest } = rest as Omit<AnchorProps, keyof BaseProps>;
    // App routes use client-side navigation; files such as /blog/rss.xml need a normal request.
    const internal = href.startsWith("/") && !href.startsWith("//") && !/\.[a-z0-9]+(?:[?#]|$)/i.test(href);
    element = internal ? (
      <Link href={href} className={classes} {...anchorRest}>
        {content}
      </Link>
    ) : (
      <a href={href} className={classes} {...anchorRest}>
        {content}
      </a>
    );
  } else {
    element = (
      <button type="button" className={classes} {...(rest as Omit<NativeProps, keyof BaseProps>)}>
        {content}
      </button>
    );
  }

  return magnetic ? <Magnetic>{element}</Magnetic> : element;
}
