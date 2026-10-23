"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  SELECTED_PRODUCTS,
  BankingProduct,
  ProductFactoryGroup,
  EXECUTIVE_PROFILE,
} from "@/data/portfolioData";

type FilterCategory = "ALL" | ProductFactoryGroup;

export default function SelectedProductsSection() {
  const [filter, setFilter] = useState<FilterCategory>("ALL");
  const [selectedProductId, setSelectedProductId] = useState<string>(
    SELECTED_PRODUCTS[0].id
  );

  const filteredProducts =
    filter === "ALL"
      ? SELECTED_PRODUCTS
      : SELECTED_PRODUCTS.filter((p) => p.factoryTag === filter);

  const activeProduct: BankingProduct =
    filteredProducts.find((p) => p.id === selectedProductId) ||
    filteredProducts[0] ||
    SELECTED_PRODUCTS[0];

  const handleFilterChange = (newFilter: FilterCategory) => {
    setFilter(newFilter);
    const nextList =
      newFilter === "ALL"
        ? SELECTED_PRODUCTS
        : SELECTED_PRODUCTS.filter((p) => p.factoryTag === newFilter);
    if (nextList.length > 0) {
      setSelectedProductId(nextList[0].id);
    }
  };

  return (
    <section
      id="products"
      className="relative py-24 lg:py-32 bg-[#0f172a] border-b border-slate-200/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-slate-200/[0.08]">
          <div className="max-w-3xl space-y-4">
            <div className="text-xs font-tech uppercase tracking-widest text-[#dfc490]">
              03 · Production Portfolio ({SELECTED_PRODUCTS.length} Platforms)
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-50 tracking-tight leading-[1.15]">
              Selected Banking, EdTech &amp;{" "}
              <span className="font-editorial italic font-normal text-[#dfc490]">
                Enterprise Platforms.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-[1.75]">
              Explore the production platforms delivered across{" "}
              <strong className="text-slate-100">Kuwait International Bank (KIB)</strong>,{" "}
              <strong className="text-slate-100">Warba Bank</strong>,{" "}
              <strong className="text-slate-100">ITG Solutions</strong> (EduWave K-12, Higher-ED, AMS, MedXJordan, Great Tafsirs, Al-Zakah),{" "}
              <strong className="text-slate-100">United Bank for Africa (UBA)</strong>, and{" "}
              <strong className="text-slate-100">Advicenode</strong>.
            </p>
          </div>

          {/* Official Developer Store Portfolio Links */}
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <a
              href={EXECUTIVE_PROFILE.contact.kibAppStoreDeveloper}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-[#182338] hover:bg-[#1e2b45] text-slate-200 border border-slate-200/[0.1] transition-colors"
            >
              <span>KIB App Store</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#dfc490]" />
            </a>
            <a
              href={EXECUTIVE_PROFILE.contact.kibPlayStoreDeveloper}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-[#182338] hover:bg-[#1e2b45] text-slate-200 border border-slate-200/[0.1] transition-colors"
            >
              <span>KIB Google Play</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#5eead4]" />
            </a>
            <a
              href={EXECUTIVE_PROFILE.contact.itgPlayStoreDeveloper}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-[#182338] hover:bg-[#1e2b45] text-slate-200 border border-slate-200/[0.1] transition-colors"
            >
              <span>ITG Solutions Google Play</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-sky-300" />
            </a>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-8 flex flex-wrap gap-2">
          {[
            { id: "ALL", label: `All Platforms (${SELECTED_PRODUCTS.length})` },
            {
              id: "KIB Digital Factory",
              label: `KIB Digital Factory (${
                SELECTED_PRODUCTS.filter((p) => p.factoryTag === "KIB Digital Factory").length
              })`,
            },
            {
              id: "Warba Al-Wateen Factory",
              label: `Warba Bank (${
                SELECTED_PRODUCTS.filter((p) => p.factoryTag === "Warba Al-Wateen Factory").length
              })`,
            },
            {
              id: "ITG Solutions Ecosystem",
              label: `ITG Solutions (${
                SELECTED_PRODUCTS.filter((p) => p.factoryTag === "ITG Solutions Ecosystem").length
              })`,
            },
            {
              id: "Global Banking & FinTech",
              label: `UBA & Advicenode (${
                SELECTED_PRODUCTS.filter((p) => p.factoryTag === "Global Banking & FinTech").length
              })`,
            },
          ].map((tab) => {
            const isSelected = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleFilterChange(tab.id as FilterCategory)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer border ${
                  isSelected
                    ? "bg-[#dfc490] text-slate-950 border-[#dfc490] font-semibold"
                    : "bg-[#131c31] text-slate-300 border-slate-200/[0.08] hover:bg-[#182338] hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Master-Detail Interactive Showroom */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 5 Columns: Scrollable Platform Roster */}
          <div className="lg:col-span-5 rounded-2xl bg-[#131c31]/90 border border-slate-200/[0.09] divide-y divide-slate-200/[0.07] overflow-hidden">
            {filteredProducts.map((product, idx) => {
              const isSelected = activeProduct.id === product.id;
              return (
                <button
                  key={product.id}
                  onClick={() => setSelectedProductId(product.id)}
                  className={`w-full p-4 sm:p-5 text-left transition-all flex items-center justify-between gap-3.5 cursor-pointer ${
                    isSelected
                      ? "bg-[#1c2942] border-l-4 border-l-[#dfc490]"
                      : "hover:bg-[#182338]/70"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className={`font-tech text-xs shrink-0 ${
                        isSelected ? "text-[#dfc490] font-semibold" : "text-slate-500"
                      }`}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>

                    {product.iconPath ? (
                      <div className="relative w-11 h-11 rounded-xl shrink-0 overflow-hidden border border-slate-200/15 bg-[#0f172a]">
                        <Image
                          src={product.iconPath}
                          alt={product.name}
                          width={44}
                          height={44}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-xl shrink-0 border border-[#d4b982]/35 bg-[#182338] flex items-center justify-center font-tech text-xs font-semibold text-[#dfc490]">
                        {product.name.slice(0, 3).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="text-[11px] text-slate-400 truncate">
                        {product.institution}
                      </div>
                      <div
                        className={`text-sm sm:text-base font-semibold truncate ${
                          isSelected ? "text-slate-50" : "text-slate-200"
                        }`}
                      >
                        {product.name}
                      </div>
                      <div className="text-xs text-[#dfc490] truncate">
                        {product.category}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`font-tech text-xs shrink-0 ${
                      isSelected ? "text-[#dfc490]" : "text-slate-600"
                    }`}
                  >
                    →
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right 7 Columns: Sticky Case Study & Device Stage */}
          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="rounded-3xl bg-[#131c31] border border-slate-200/[0.1] overflow-hidden shadow-xl shadow-slate-950/40"
              >
                {/* Stage Top Header */}
                <div className="p-6 sm:p-8 border-b border-slate-200/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    {activeProduct.iconPath ? (
                      <div className="relative w-16 h-16 rounded-2xl shrink-0 border border-slate-200/15 overflow-hidden bg-[#0f172a]">
                        <Image
                          src={activeProduct.iconPath}
                          alt={activeProduct.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl shrink-0 border border-[#d4b982]/40 bg-[#182338] flex items-center justify-center font-tech text-sm font-semibold text-[#dfc490]">
                        {activeProduct.name.slice(0, 3).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-tech text-[#dfc490]">
                          {activeProduct.factoryTag}
                        </span>
                        <span className="text-slate-500">·</span>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#182338] border border-slate-200/10 text-slate-200">
                          {activeProduct.attributionBadge}
                        </span>
                      </div>
                      <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight">
                        {activeProduct.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {activeProduct.institution} — {activeProduct.category}
                      </p>
                    </div>
                  </div>

                  {/* Verified Store Links */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {activeProduct.appStoreUrl && (
                      <a
                        href={activeProduct.appStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#dfc490] text-slate-950 hover:bg-[#e8d1a4] text-xs font-semibold transition-colors"
                      >
                        <span>App Store</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {activeProduct.playStoreUrl && (
                      <a
                        href={activeProduct.playStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#182338] hover:bg-[#1e2b45] border border-slate-200/15 text-slate-100 text-xs font-medium transition-colors"
                      >
                        <span>Google Play</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#5eead4]" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Hardware Showcase Stage (when official screenshots exist) */}
                {activeProduct.screenshots && activeProduct.screenshots.length > 0 ? (
                  <div className="relative py-8 px-6 bg-[#0f172a]/70 border-b border-slate-200/[0.08]">
                    <div className="text-xs font-tech text-slate-400 mb-5 flex items-center justify-between">
                      <span>Official Store Interface</span>
                      <span className="text-[#dfc490]">Verified Production Screenshots</span>
                    </div>

                    <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
                      {activeProduct.screenshots.slice(0, 2).map((shot, i) => (
                        <div
                          key={shot}
                          className="relative mx-auto w-full max-w-[215px] aspect-[9/19.2] rounded-[26px] p-2 bg-[#1e293b] border border-slate-200/15 shadow-2xl"
                        >
                          <div className="relative w-full h-full rounded-[19px] overflow-hidden bg-[#0f172a]">
                            <Image
                              src={shot}
                              alt={`${activeProduct.name} screen ${i + 1}`}
                              fill
                              sizes="(max-width: 768px) 45vw, 220px"
                              className="object-cover object-top"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-7 bg-[#0f172a]/60 border-b border-slate-200/[0.08]">
                    <div className="text-xs font-tech text-[#dfc490] mb-1.5">
                      Platform Overview
                    </div>
                    <p className="font-editorial italic text-xl sm:text-2xl text-slate-100 leading-relaxed">
                      “{activeProduct.tagline}”
                    </p>
                  </div>
                )}

                {/* 4-Quadrant Case Study Dossier */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200/[0.08]">
                  <div className="p-6 sm:p-7 space-y-5">
                    <div>
                      <div className="text-xs font-tech text-[#dfc490] mb-1.5">
                        01 · Purpose &amp; Customer Experience
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {activeProduct.purposeAndExperience}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-200/[0.07]">
                      <div className="text-xs font-tech text-slate-400 mb-1.5">
                        02 · Business &amp; Market Problem Addressed
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {activeProduct.problemAddressed}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 space-y-5 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-tech text-[#5eead4] mb-1.5">
                        03 · My Actual Role &amp; Contribution
                      </div>
                      <p className="text-sm text-slate-100 leading-relaxed">
                        {activeProduct.myRoleAndContribution}
                      </p>
                      <p className="mt-3 text-xs text-slate-400 leading-relaxed border-l-2 border-[#dfc490]/50 pl-3">
                        {activeProduct.organizationalDistinction}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-200/[0.07]">
                      <div className="text-xs font-tech text-slate-400 mb-2.5">
                        04 · Architecture &amp; Technical Stack
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeProduct.architectureAndTech.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded-lg text-xs bg-[#182338] text-slate-200 border border-slate-200/[0.08]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-200/[0.07] text-xs text-[#dfc490]">
                        {activeProduct.verifiableImpact}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
