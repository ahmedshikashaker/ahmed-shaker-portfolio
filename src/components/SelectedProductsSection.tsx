"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Smartphone,
  ExternalLink,
  ShieldCheck,
  Layers,
  CheckCircle2,
  X,
  ArrowUpRight,
  Building2,
  Code2,
  Sparkles,
} from "lucide-react";
import {
  SELECTED_PRODUCTS,
  BankingProduct,
  EXECUTIVE_PROFILE,
} from "@/data/portfolioData";

type FilterCategory =
  | "ALL"
  | "KIB Digital Factory"
  | "Warba Al-Wateen Factory"
  | "Enterprise Banking & EdTech";

export default function SelectedProductsSection() {
  const [filter, setFilter] = useState<FilterCategory>("ALL");
  const [activeProduct, setActiveProduct] = useState<BankingProduct | null>(null);

  const filteredProducts =
    filter === "ALL"
      ? SELECTED_PRODUCTS
      : SELECTED_PRODUCTS.filter((p) => p.factoryTag === filter);

  return (
    <section
      id="products"
      className="relative py-28 lg:py-36 border-t border-white/[0.08] bg-gradient-to-b from-[#05070b] via-[#070b14] to-[#05070b]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Production Banking Portfolio</span>
            </div>

            <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
              Selected Digital Banking{" "}
              <span className="font-[family-name:var(--font-serif)] italic font-normal text-gold-gradient">
                Products &amp; Ecosystems.
              </span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              A curated showcase of flagship retail, corporate, wealth, real estate, marketplace, lifestyle, and embedded-finance applications delivered through the <strong className="text-white">KIB Digital Factory</strong>, <strong className="text-white">Warba Bank’s “Al-Wateen” Digital Factory</strong>, and international banking transformations.
            </p>
          </div>

          {/* Direct Verified Store Portfolio Links */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href={EXECUTIVE_PROFILE.contact.kibAppStoreDeveloper}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.09] text-slate-200 border border-white/[0.1] hover:border-amber-400/40 transition-all"
            >
              <span>KIB Apple App Store Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </a>
            <a
              href={EXECUTIVE_PROFILE.contact.kibPlayStoreDeveloper}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.09] text-slate-200 border border-white/[0.1] hover:border-emerald-400/40 transition-all"
            >
              <span>KIB Google Play Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </a>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-10 flex flex-wrap items-center gap-2 pb-4 border-b border-white/[0.08]">
          {[
            { id: "ALL", label: `All Ecosystems (${SELECTED_PRODUCTS.length})` },
            {
              id: "KIB Digital Factory",
              label: `KIB Digital Factory (${
                SELECTED_PRODUCTS.filter((p) => p.factoryTag === "KIB Digital Factory").length
              })`,
            },
            {
              id: "Warba Al-Wateen Factory",
              label: `Warba Bank Al-Wateen (${
                SELECTED_PRODUCTS.filter((p) => p.factoryTag === "Warba Al-Wateen Factory").length
              })`,
            },
            {
              id: "Enterprise Banking & EdTech",
              label: "Global Banking Modernization (1)",
            },
          ].map((tab) => {
            const isSelected = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as FilterCategory)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                    : "bg-white/[0.04] text-slate-300 hover:text-white border border-white/[0.07]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.article
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="group relative rounded-2xl bg-[#0a0f1b]/95 border border-white/[0.08] hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Top Card Content */}
                <div className="p-6 space-y-4">
                  {/* App Icon + Institution Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      {product.iconPath ? (
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/15 shadow-lg shrink-0 bg-[#05070b]">
                          <Image
                            src={product.iconPath}
                            alt={`${product.name} official icon`}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 via-emerald-500/10 to-sky-500/20 border border-amber-400/35 flex items-center justify-center shrink-0">
                          <Layers className="w-6 h-6 text-amber-300" />
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-amber-300 block">
                          {product.category}
                        </span>
                        <h3 className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors leading-snug">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-400">{product.institution}</p>
                      </div>
                    </div>
                  </div>

                  {/* Attribution Pill */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider ${
                        product.attributionBadge === "Executive Ownership & Direction"
                          ? "bg-emerald-500/12 text-emerald-300 border border-emerald-400/30"
                          : "bg-amber-500/12 text-amber-300 border border-amber-400/30"
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3" />
                      {product.attributionBadge}
                    </span>
                  </div>

                  {/* Tagline */}
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {product.tagline}
                  </p>

                  {/* My Role & Contribution Summary */}
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                    <div className="text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-amber-300">
                      My Role &amp; Contribution
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {product.myRoleAndContribution}
                    </p>
                  </div>

                  {/* Genuine Screenshots Preview Strip (if available) */}
                  {product.screenshots && product.screenshots.length > 0 && (
                    <div
                      onClick={() => setActiveProduct(product)}
                      className="cursor-pointer group/screens relative pt-2"
                    >
                      <div className="grid grid-cols-2 gap-2.5 h-44 overflow-hidden rounded-xl bg-[#05070b] p-2 border border-white/[0.07]">
                        {product.screenshots.slice(0, 2).map((src, i) => (
                          <div
                            key={src}
                            className="relative h-full w-full rounded-lg overflow-hidden border border-white/10"
                          >
                            <Image
                              src={src}
                              alt={`${product.name} screenshot ${i + 1}`}
                              fill
                              sizes="(max-width: 768px) 45vw, 180px"
                              className="object-cover object-top group-hover/screens:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Platform Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {product.platforms.map((plat) => (
                      <span
                        key={plat}
                        className="px-2 py-0.5 rounded text-[10px] font-[family-name:var(--font-mono)] bg-white/[0.04] text-slate-300 border border-white/[0.07]"
                      >
                        {plat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-6 py-4 bg-[#070a12] border-t border-white/[0.07] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveProduct(product)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 cursor-pointer"
                  >
                    <span>Case Study &amp; Architecture</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {product.appStoreUrl && (
                      <a
                        href={product.appStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`View ${product.name} on Apple App Store`}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/[0.05] hover:bg-white/[0.12] text-slate-200 border border-white/[0.08] transition-colors inline-flex items-center gap-1"
                      >
                        <span>iOS</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                    {product.playStoreUrl && (
                      <a
                        href={product.playStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`View ${product.name} on Google Play Store`}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/[0.05] hover:bg-white/[0.12] text-slate-200 border border-white/[0.08] transition-colors inline-flex items-center gap-1"
                      >
                        <span>Android</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Product Deep-Dive Case Study Modal */}
      <AnimatePresence>
        {activeProduct && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProduct(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b101d] border border-amber-400/35 shadow-[0_25px_90px_rgba(0,0,0,0.85)] text-slate-100"
            >
              {/* Modal Top Bar */}
              <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#0b101d]/95 backdrop-blur-xl border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  {activeProduct.iconPath && (
                    <Image
                      src={activeProduct.iconPath}
                      alt={activeProduct.name}
                      width={36}
                      height={36}
                      className="rounded-xl border border-white/15"
                    />
                  )}
                  <div>
                    <span className="text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-widest text-amber-300 block">
                      {activeProduct.institution} · {activeProduct.factoryTag}
                    </span>
                    <h3 id="product-modal-title" className="text-base sm:text-lg font-bold text-white">
                      {activeProduct.name}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setActiveProduct(null)}
                  className="p-2 rounded-xl bg-white/[0.06] text-slate-300 hover:text-white cursor-pointer"
                  aria-label="Close product case study"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Attribution & Store Links Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-300">
                      Attribution: {activeProduct.attributionBadge}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {activeProduct.appStoreUrl && (
                      <a
                        href={activeProduct.appStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-400 text-slate-950 hover:brightness-110 transition-all"
                      >
                        <span>Apple App Store</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {activeProduct.playStoreUrl && (
                      <a
                        href={activeProduct.playStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.08] text-white border border-white/15 hover:bg-white/[0.15] transition-all"
                      >
                        <span>Google Play Store</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Case Study Breakdown Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.07] space-y-2">
                    <div className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider text-amber-300">
                      01 · Purpose &amp; Customer Experience
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {activeProduct.purposeAndExperience}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.07] space-y-2">
                    <div className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider text-amber-300">
                      02 · Business &amp; Market Problem Addressed
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {activeProduct.problemAddressed}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-500/[0.06] border border-emerald-400/25 space-y-2">
                    <div className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider text-emerald-300">
                      03 · My Actual Role &amp; Leadership Contribution
                    </div>
                    <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                      {activeProduct.myRoleAndContribution}
                    </p>
                    <p className="text-xs text-slate-400 pt-2 border-t border-white/[0.08]">
                      <strong>Organizational Context:</strong> {activeProduct.organizationalDistinction}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.07] space-y-3">
                    <div className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider text-sky-300">
                      04 · Architectural &amp; Technical Considerations
                    </div>
                    <ul className="space-y-1.5">
                      {activeProduct.architectureAndTech.map((tech) => (
                        <li key={tech} className="flex items-center gap-2 text-xs text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span>{tech}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2 border-t border-white/[0.06] text-xs text-emerald-300">
                      <strong>Verifiable Impact:</strong> {activeProduct.verifiableImpact}
                    </div>
                  </div>
                </div>

                {/* Official Store Screenshots Gallery */}
                {activeProduct.screenshots && activeProduct.screenshots.length > 0 && (
                  <div className="pt-2">
                    <div className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider text-slate-400 mb-3">
                      Official App Store Visual Assets
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                      {activeProduct.screenshots.map((shot, idx) => (
                        <div
                          key={shot}
                          className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-[#05070b] border border-white/10"
                        >
                          <Image
                            src={shot}
                            alt={`${activeProduct.name} official screenshot ${idx + 1}`}
                            fill
                            sizes="(max-width: 768px) 90vw, 400px"
                            className="object-contain p-2"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
