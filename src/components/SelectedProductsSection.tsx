"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
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
      className="relative py-28 lg:py-40 bg-[#080807] text-[#F4F0E8] swiss-grid-dark border-b border-[#F4F0E8]/[0.12]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Section Editorial Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-14 border-b border-[#F4F0E8]/[0.12]">
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <span className="font-tech text-xs uppercase tracking-[0.2em] text-[#C8A464]">
                02 // PRODUCTION ECOSYSTEMS
              </span>
              <div className="mt-4 font-display text-6xl sm:text-7xl font-extrabold tracking-[-0.05em] text-[#F4F0E8] leading-none">
                11
              </div>
              <p className="mt-2 font-tech text-xs uppercase tracking-[0.14em] text-[#9A958B]">
                VERIFIED BANKING &amp; FINTECH PLATFORMS
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={EXECUTIVE_PROFILE.contact.kibAppStoreDeveloper}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#F4F0E8]/20 hover:border-[#C8A464] font-tech text-[10px] uppercase tracking-[0.14em] text-[#F4F0E8] hover:text-[#C8A464] transition-colors"
              >
                <span>KIB App Store Developer Page</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
              <a
                href={EXECUTIVE_PROFILE.contact.kibPlayStoreDeveloper}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#F4F0E8]/20 hover:border-[#C8A464] font-tech text-[10px] uppercase tracking-[0.14em] text-[#F4F0E8] hover:text-[#C8A464] transition-colors"
              >
                <span>KIB Google Play Developer Page</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <h2 className="font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.04em] text-[#F4F0E8] leading-[0.96]">
              Selected Digital Banking{" "}
              <span className="font-editorial italic font-normal normal-case text-bronze-foil">
                Products &amp; Platforms.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-[#9A958B] max-w-3xl leading-relaxed">
              Explore the production banking platforms delivered across <strong className="text-[#F4F0E8]">Kuwait International Bank (KIB)</strong>, <strong className="text-[#F4F0E8]">Warba Bank</strong>, and <strong className="text-[#F4F0E8]">United Bank for Africa (UBA)</strong>. Select any platform from the index below to inspect its official store assets, architectural stack, business problem, and my exact scope of leadership.
            </p>

            {/* Filter Bar */}
            <div className="pt-2 flex flex-wrap gap-2">
              {[
                { id: "ALL", label: "ALL PLATFORMS [11]" },
                { id: "KIB Digital Factory", label: "KIB DIGITAL FACTORY [07]" },
                { id: "Warba Al-Wateen Factory", label: "WARBA AL-WATEEN [03]" },
                { id: "Enterprise Banking & EdTech", label: "GLOBAL BANKING [01]" },
              ].map((tab) => {
                const isSelected = filter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleFilterChange(tab.id as FilterCategory)}
                    className={`px-4 py-2.5 font-tech text-[11px] uppercase tracking-[0.14em] transition-colors cursor-pointer border ${
                      isSelected
                        ? "bg-[#C8A464] text-[#080807] border-[#C8A464] font-semibold"
                        : "bg-transparent text-[#9A958B] border-[#F4F0E8]/15 hover:border-[#F4F0E8]/40 hover:text-[#F4F0E8]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Master-Detail Interactive Showroom */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 5 Columns: Numbered Architectural Roster */}
          <div className="lg:col-span-5 border border-[#F4F0E8]/[0.12] divide-y divide-[#F4F0E8]/[0.1] bg-[#0B0B09]">
            {filteredProducts.map((product, idx) => {
              const isSelected = activeProduct.id === product.id;
              return (
                <button
                  key={product.id}
                  onClick={() => setSelectedProductId(product.id)}
                  className={`w-full p-5 text-left transition-all flex items-center justify-between gap-4 cursor-pointer ${
                    isSelected
                      ? "bg-[#161512] border-l-4 border-l-[#C8A464]"
                      : "hover:bg-[#F4F0E8]/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span
                      className={`font-tech text-xs shrink-0 ${
                        isSelected ? "text-[#C8A464] font-bold" : "text-[#9A958B]"
                      }`}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>

                    {product.iconPath ? (
                      <div className="relative w-11 h-11 shrink-0 overflow-hidden border border-[#F4F0E8]/20 bg-[#080807]">
                        <Image
                          src={product.iconPath}
                          alt={product.name}
                          width={44}
                          height={44}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 shrink-0 border border-[#C8A464]/40 bg-[#12110E] flex items-center justify-center font-tech text-xs font-bold text-[#C8A464]">
                        {product.name.slice(0, 3).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="font-tech text-[10px] uppercase tracking-[0.14em] text-[#9A958B] truncate">
                        {product.institution}
                      </div>
                      <div
                        className={`font-display text-base sm:text-lg font-bold truncate ${
                          isSelected ? "text-[#F4F0E8]" : "text-[#D6D1C7]"
                        }`}
                      >
                        {product.name}
                      </div>
                      <div className="font-tech text-[10px] text-[#C8A464] truncate">
                        {product.category}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`font-tech text-xs shrink-0 ${
                      isSelected ? "text-[#C8A464]" : "text-[#9A958B]/40"
                    }`}
                  >
                    →
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right 7 Columns: Sticky Case Study & Device Stage */}
          <div className="lg:col-span-7 lg:sticky lg:top-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="border border-[#F4F0E8]/[0.14] bg-[#0D0D0B]"
              >
                {/* Stage Top Header */}
                <div className="p-6 sm:p-8 border-b border-[#F4F0E8]/[0.1] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    {activeProduct.iconPath ? (
                      <div className="relative w-16 h-16 shrink-0 border border-[#F4F0E8]/20 overflow-hidden">
                        <Image
                          src={activeProduct.iconPath}
                          alt={activeProduct.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 shrink-0 border border-[#C8A464]/50 bg-[#141310] flex items-center justify-center font-tech text-sm font-bold text-[#C8A464]">
                        BaaS
                      </div>
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-tech text-[10px] uppercase tracking-[0.16em] text-[#C8A464]">
                          {activeProduct.factoryTag}
                        </span>
                        <span className="text-[#9A958B]">·</span>
                        <span className="font-tech text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 border border-[#C8A464]/40 text-[#F4F0E8]">
                          {activeProduct.attributionBadge}
                        </span>
                      </div>
                      <h3 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-[#F4F0E8] tracking-tight">
                        {activeProduct.name}
                      </h3>
                      <p className="text-xs font-tech text-[#9A958B] mt-0.5">
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
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#F4F0E8] text-[#080807] hover:bg-[#C8A464] font-tech text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors"
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
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[#F4F0E8]/25 text-[#F4F0E8] hover:border-[#C8A464] hover:text-[#C8A464] font-tech text-[11px] uppercase tracking-[0.12em] transition-colors"
                      >
                        <span>Google Play</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Hardware Showcase Stage (when official screenshots exist) */}
                {activeProduct.screenshots && activeProduct.screenshots.length > 0 ? (
                  <div className="relative py-10 px-6 bg-gradient-to-b from-[#13120F] to-[#090908] border-b border-[#F4F0E8]/[0.1] overflow-hidden">
                    <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-[#9A958B] mb-6 flex items-center justify-between">
                      <span>OFFICIAL PRODUCTION INTERFACE //</span>
                      <span className="text-[#C8A464]">APPLE APP STORE VERIFIED ASSETS</span>
                    </div>

                    <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto">
                      {activeProduct.screenshots.slice(0, 2).map((shot, i) => (
                        <div
                          key={shot}
                          className="relative mx-auto w-full max-w-[230px] aspect-[9/19.2] rounded-[28px] p-2 bg-[#1E1D1A] border border-[#F4F0E8]/20 shadow-[0_25px_70px_rgba(0,0,0,0.85)]"
                        >
                          {/* Subtle Dynamic Island Notch */}
                          <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-20 w-14 h-3.5 rounded-full bg-[#080807] border border-white/10" />
                          <div className="relative w-full h-full rounded-[21px] overflow-hidden bg-[#080807]">
                            <Image
                              src={shot}
                              alt={`${activeProduct.name} screen ${i + 1}`}
                              fill
                              sizes="(max-width: 768px) 45vw, 240px"
                              className="object-cover object-top"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 bg-[#12110E] border-b border-[#F4F0E8]/[0.1]">
                    <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-[#C8A464] mb-2">
                      ARCHITECTURAL PLATFORM SPECIFICATION //
                    </div>
                    <p className="font-editorial italic text-2xl text-[#F4F0E8]">
                      “{activeProduct.tagline}”
                    </p>
                  </div>
                )}

                {/* 4-Quadrant Case Study Dossier */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#F4F0E8]/[0.1]">
                  <div className="p-6 sm:p-7 space-y-6">
                    <div>
                      <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-[#C8A464] mb-2">
                        01 // PURPOSE &amp; CUSTOMER EXPERIENCE
                      </div>
                      <p className="text-xs sm:text-sm text-[#D6D1C7] leading-relaxed">
                        {activeProduct.purposeAndExperience}
                      </p>
                    </div>

                    <div className="pt-5 border-t border-[#F4F0E8]/[0.08]">
                      <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-[#9A958B] mb-2">
                        02 // BUSINESS &amp; MARKET PROBLEM ADDRESSED
                      </div>
                      <p className="text-xs sm:text-sm text-[#D6D1C7] leading-relaxed">
                        {activeProduct.problemAddressed}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 space-y-6 flex flex-col justify-between">
                    <div>
                      <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-[#C8A464] mb-2">
                        03 // MY ACTUAL ROLE &amp; CONTRIBUTION
                      </div>
                      <p className="text-xs sm:text-sm text-[#F4F0E8] font-medium leading-relaxed">
                        {activeProduct.myRoleAndContribution}
                      </p>
                      <p className="mt-3 text-xs text-[#9A958B] leading-relaxed border-l-2 border-[#C8A464]/50 pl-3">
                        {activeProduct.organizationalDistinction}
                      </p>
                    </div>

                    <div className="pt-5 border-t border-[#F4F0E8]/[0.08]">
                      <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-[#9A958B] mb-3">
                        04 // ARCHITECTURE &amp; PLATFORMS
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeProduct.architectureAndTech.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 font-tech text-[11px] bg-[#161512] text-[#D6D1C7] border border-[#F4F0E8]/[0.1]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#F4F0E8]/[0.08] text-xs text-[#C8A464]">
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
