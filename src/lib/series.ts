import { getAllPosts, SITE_URL, type PostMeta } from "./blog";
import { AUTO_HOURS, MANUAL_HOURS, fmtDuration } from "@/components/blog/visuals/pipelineModel";
import { C27_TOTAL } from "@/components/blog/visuals/measureModel";
import { C28_LIVE, C28_READY_DAY } from "@/components/blog/visuals/coreModel";
import { LEAD_END, LEAD_START } from "@/components/blog/visuals/yearModel";
import { PLATFORM_METRICS } from "@/components/blog/visuals/aiGovernanceModel";

/**
 * Article series. A series is an ordered list of posts (by slug) with the extra framing a landing page needs.
 * Headline numbers are imported from the same models the articles use, so the landing page always agrees with them.
 * Parts that do not yet have a published .mdoc file remain visible on the series roadmap as upcoming installments
 * and automatically unlock as soon as their .mdoc file is created.
 */

export interface SeriesPart {
  slug: string;
  /** The wall or architectural dimension this part addresses, in a word or two. */
  wall: string;
  /** The part's headline number: optional "before", the figure, and what it measures. */
  stat: { before?: string; value: string; label: string };
  /** One line for a board, from the part's own "What I'd tell a board" card. */
  boardLine: string;
  /** Fallback title used on the editorial roadmap before the post's .mdoc file is published. */
  plannedTitle?: string;
  /** Fallback summary used on the editorial roadmap before the post's .mdoc file is published. */
  plannedExcerpt?: string;
  /** Editorial objective for the roadmap view. */
  objective?: string;
  /** Key architectural concepts explored in this installment. */
  keyConcepts?: string[];
  /** How this article hands off to the next installment in the series. */
  connectionToNext?: string;
}

export interface Series {
  slug: string;
  eyebrowLabel?: string;
  title: string;
  tagline: string;
  description: string;
  centralThesis?: string;
  boardCardTitle?: string;
  parts: SeriesPart[];
}

export interface ResolvedSeriesPart extends SeriesPart {
  n: number;
  post: PostMeta | null;
  title: string;
  excerpt: string;
}

const days = (d: number) => `${Math.round(d)} days`;
const c28Weeks = `${((C28_LIVE.coupled - C28_READY_DAY) / 5).toFixed(1).replace(/\.0$/, "")} weeks`;

export const SERIES: Series[] = [
  {
    slug: "governed-ai",
    eyebrowLabel: "AI Agents & Enterprise Governance",
    title: "Governed Autonomy, From AI Knowledge to Controlled Enterprise Action",
    tagline:
      "Eight architectural essays on how enterprises give AI the authority to act—without surrendering identity, policy, risk boundaries, or non-repudiation.",
    description:
      "A flagship technical thought-leadership series on enterprise AI governance: separating probabilistic LLM reasoning from deterministic execution authority via canonical capability contracts, continuous authorization, cryptographic execution grants, and tamper-evident audit trails.",
    centralThesis:
      "The future of enterprise AI is not about giving AI more access. It is about giving AI the right capabilities, within the right boundaries, under the right governance.",
    boardCardTitle: "Eight architectural laws before granting AI execution authority",
    parts: [
      {
        slug: "beyond-the-chatbot-from-knowledge-to-governed-action",
        wall: "The Paradigm Shift",
        plannedTitle: "Beyond the Chatbot: Why Enterprise AI Must Evolve from Knowledge to Governed Action",
        plannedExcerpt:
          "Answering questions is a solved problem; executing work across enterprise systems safely is not. Why the next decade of enterprise AI belongs to governed orchestration layers, not bigger chat windows.",
        stat: {
          before: "Read-only RAG",
          value: "9 stages",
          label: "from natural-language intent to hash-chained, grant-verified enterprise execution",
        },
        boardLine:
          "Stop funding isolated chatbots that leave humans as the manual copy-paste bus; fund the governance spine that lets AI execute safely.",
        objective:
          "Establish why conversational knowledge retrieval hits a ceiling in enterprise operations, why naïve tool-calling agents fail security review, and how a split-service governance architecture bridges the gap.",
        keyConcepts: [
          "Four-stage evolution: Knowledge AI → Co-Pilot → Unconstrained Agent → Governed AI Control Plane",
          "The model proposes; deterministic services decide",
          "9-stage controlled execution pipeline from OIDC identity context to hash-chained audit",
          "Three-tier production readiness: separating deterministic governance guarantees from target deployment controls",
        ],
        connectionToNext:
          "Once we accept that AI must execute actions to deliver real ROI, we immediately confront the CISO's central objection: why would any regulated enterprise trust a probabilistic model with production APIs?",
      },
      {
        slug: "would-you-give-an-ai-agent-production-credentials",
        wall: "The Trust Gap",
        plannedTitle: "The AI Trust Problem: Would You Give an AI Agent Access to Your Enterprise Systems?",
        plannedExcerpt:
          "Prompt injection, confused-deputy privilege escalation, schema smuggling, and blind retry loops: a systematic threat model of what actually goes wrong when LLMs meet production APIs.",
        stat: {
          value: "5 zones",
          label: "of defense-in-depth isolating probabilistic reasoning from production credentials and system mutations",
        },
        boardLine:
          "System prompts are advice, not security boundaries. Never place credentials, role decisions, or retry loops inside the model's trust zone.",
        objective:
          "Deconstruct the anatomy of autonomous execution failures—indirect prompt injection, BOLA/confused deputy, duplicate writes on timeout, and unreviewed tool drift—and prove why traditional RBAC and prompt guardrails cannot stop them alone.",
        keyConcepts: [
          "Indirect prompt injection via untrusted documents and tool outputs",
          "Confused-deputy OAuth passthrough and over-broad service credentials",
          "Why HTTP timeouts turn naïve agent loops into duplicate-mutation amplifiers",
          "Defense-in-depth across five explicit trust boundaries (Edge Ingress through Cryptographic Dispatch)",
        ],
        connectionToNext:
          "If embedding agent loops inside individual apps creates twenty unmonitored attack surfaces, how do we centralize control without building a monolith? That requires a universal, application-agnostic governance layer.",
      },
      {
        slug: "universal-governance-layer-for-enterprise-ai",
        wall: "Universal Layer",
        plannedTitle: "The Universal Governance Layer: Decoupling AI Orchestration from Business Applications",
        plannedExcerpt:
          "Why AI governance must be decoupled from individual business applications—and how a canonical capability contract normalizes REST/OpenAPI, MCP, and native adapters behind one control plane.",
        stat: {
          before: "N×M custom tools",
          value: "1 contract",
          label: "normalizing OpenAPI, MCP, and native adapters into immutable, risk-classified capability contracts",
        },
        boardLine:
          "Onboard applications by configuration and certified contracts, not by rewriting the AI runtime for every department.",
        objective:
          "Show how to architect a reusable AI governance control plane that connects to HRMS, ERP, CRM, and internal services via versioned manifests and canonical capability contracts without embedding business-specific branches in the planner.",
        keyConcepts: [
          "Capabilities are data, not source-code branches (Application Independence)",
          "Canonical Capability Contract across REST/OpenAPI, MCP Streamable HTTP, and Native adapters",
          "Discover broadly, publish narrowly: Registered → Discovering → Quarantined Draft → Reviewed → Certified → Published",
          "Relational persistence as authoritative truth and fencing authority over evictable caches",
        ],
        connectionToNext:
          "With a universal capability catalog in place, how does a vague human sentence become a validated, multi-step execution plan across multiple systems without letting the LLM write arbitrary code?",
      },
      {
        slug: "from-ai-intent-to-controlled-execution",
        wall: "Intent to Action",
        plannedTitle: "From AI Intent to Controlled Execution: The Handshake Between Reasoning and Authority",
        plannedExcerpt:
          "Inside the two-engine handshake between a bounded graph planner and a deterministic workflow engine: typed action DAGs, preconditions, optimistic concurrency, and outcome reconciliation.",
        stat: {
          before: "Unbounded loops",
          value: `≤ ${PLATFORM_METRICS.maxPlanNodes} nodes`,
          label: `bounded DAG (${PLATFORM_METRICS.maxMutationNodes} max writes, sequential width ${PLATFORM_METRICS.maxParallelMutations}, 1 repair cap) with durable state persistence`,
        },
        boardLine:
          "A multi-action AI request is not a database transaction. Bound the graph, serialize mutations, and reconcile uncertain outcomes explicitly.",
        objective:
          "Walk through the exact lifecycle of a multi-action turn—how the reasoning runtime drafts a typed DAG with result bindings and preconditions, how the control plane validates it, and how durable workflows execute activities with idempotency and explicit compensation.",
        keyConcepts: [
          "Why non-deterministic reasoning and deterministic workflow execution must run in separate engines",
          "Explicit 10-stage state-graph topology vs. unconstrained ReAct loops",
          "Parallel read groups, sequential mutations, and declarative JSONPath preconditions",
          "Handling network timeouts after the fence: outcome_unknown state and idempotency-key reconciliation",
        ],
        connectionToNext:
          "A deterministic DAG still needs to know who is asking and what they are allowed to touch—at discovery time, at planning time, and at the exact millisecond of execution.",
      },
      {
        slug: "principle-of-least-privilege-for-ai-agents",
        wall: "Least Privilege",
        plannedTitle: "The Principle of Least Privilege for AI Agents: Continuous Authorization & Cryptographic Grants",
        plannedExcerpt:
          "An API schema describes shapes, not permissions. How seven-stage continuous authorization, context-injected fields, signed retrieval scopes, and RFC 8785 execution grants eliminate the confused deputy.",
        stat: {
          before: "1 static check",
          value: `${PLATFORM_METRICS.continuousAuthStages} stages`,
          label: `of continuous policy authorization plus ${PLATFORM_METRICS.grantBindingHashes}+ SHA-256 bindings per single-attempt execution grant`,
        },
        boardLine:
          "Never pass user tokens or static secrets to an AI runtime. Reauthorize at the millisecond of execution and issue a one-time cryptographic grant.",
        objective:
          "Detail a seven-stage continuous authorization pipeline, two-stage capability filtering for enterprise catalogs, resource-level ownership resolvers, brokered Ed25519 knowledge scopes, and JCS-canonicalized execution grants.",
        keyConcepts: [
          "Server-derived principal context and contextInjectedFields (preventing BOLA/IDOR by construction)",
          "Two-stage capability selection: hard policy allow-set before semantic ranking",
          "Brokered RAG: 60s Ed25519-signed retrieval scopes and two-step citation release",
          "Single-attempt Signed Execution Grant verified against 15+ RFC 8785 JCS SHA-256 digests before network I/O",
        ],
        connectionToNext:
          "Even when a user is authorized to propose an action, not all actions carry equal consequence. How do we replace rubber-stamp 'Are you sure?' dialogs with risk-proportional governance?",
      },
      {
        slug: "human-in-the-loop-is-not-enough-risk-based-governance",
        wall: "Risk & Approvals",
        plannedTitle: "Human-in-the-Loop Is Not Enough: Designing R0–R4 Risk-Based AI Governance",
        plannedExcerpt:
          "When every action asks for confirmation, humans click 'Approve' blindly. How a five-tier risk model (R0–R4) combines zero-friction reads, hash-bound confirmations, step-up MFA, and four-eyes segregation of duties.",
        stat: {
          before: "Rubber-stamp UI",
          value: "R0–R4",
          label: "five risk tiers with planHash-bound confirmation, ≤5m MFA step-up, and four-eyes quorum",
        },
        boardLine:
          "Reserve human friction for where it changes risk: automate R1 evidence, bind R2 confirmations to a cryptographic hash, and enforce four-eyes on R3.",
        objective:
          "Show why generic human-in-the-loop prompts fail in practice and how the R0–R4 taxonomy, automatic escalation rules, deterministic previews, planHash/nonce bindings, and four-eyes workflows create tamper-evident human oversight.",
        keyConcepts: [
          "R0–R4 taxonomy and safe-by-default R4 quarantine for all unreviewed imports",
          "Automatic risk escalation rules (restricted data, bulk > 10 targets, irreversible or non-idempotent side effects)",
          "Tamper-proof proposals: binding confirmation to proposalVersion, planHash, one-time nonce, and target ETag",
          "Segregation of duties (requesterMayFinalApprove: false) and fresh MFA step-up (≤ 5m)",
        ],
        connectionToNext:
          "When an R3 action executes—or is denied—six months before an external regulatory audit, how do you prove beyond doubt what happened, why it happened, and which exact artifact versions authorized it?",
      },
      {
        slug: "making-every-ai-action-traceable",
        wall: "Traceability",
        plannedTitle: "Making Every AI Action Traceable: Hash-Chained Audit, Correlation, and Compliance Proof",
        plannedExcerpt:
          "Chat logs are not audit trails. How to correlate 17 runtime identifiers from user turn to external API receipt, hash-chain domain audit records, and enforce build-time specification verification in CI.",
        stat: {
          before: "Scattered logs",
          value: `${PLATFORM_METRICS.correlatedIdsPerRun} IDs`,
          label: "correlated per run into hash-chained audit partitions anchored to signed immutable storage",
        },
        boardLine:
          "If an auditor cannot reconstruct the prompt, policy revision, approval hash, and external receipt in one query, the AI system is not production-ready.",
        objective:
          "Explore the dual meaning of traceability in enterprise AI: 1) runtime non-repudiation (17 correlated IDs, append-only hash-chained audit events, signed object-storage anchors, canary secret scrubbing) and 2) build-time specification-to-test traceability.",
        keyConcepts: [
          "End-to-end correlation across W3C trace context and 17 domain identifiers",
          "Append-only hash-chained audit partitions anchored to signed object storage",
          "Privacy by design: audience-specific result projections and canary secret/PII non-disclosure tests",
          "Executable governance: mapping normative architectural invariants to automated CI verification evidence",
        ],
        connectionToNext:
          "With all seven architectural pillars in place, how does an enterprise actually deploy, operate, certify, and roll out this architecture across business units without a big-bang failure?",
      },
      {
        slug: "building-enterprise-ai-that-can-be-trusted",
        wall: "Production Blueprint",
        plannedTitle: "Building Enterprise AI That Can Be Trusted: Self-Hosted Operations, Release Gates, and Rollout",
        plannedExcerpt:
          "Bringing the full architecture together: HA topology, signed declarative bundle promotion, emergency kill switches, 12 production release gates, and the five-stage enterprise rollout model.",
        stat: {
          before: "Demo to prod",
          value: "12 gates",
          label: "mandatory release gates and 5 staged launch rings with independent kill switches",
        },
        boardLine:
          "Treat enterprise AI as critical financial infrastructure: ship behind twelve release gates, promote signed declarative bundles, and keep a kill switch on every connector.",
        objective:
          "Synthesize the complete production blueprint—from self-hosted HA topology and least-privilege database role isolation to signed declarative promotion, emergency containment controls, and phased organizational adoption.",
        keyConcepts: [
          "Self-hosted HA topology, least-privilege database role isolation, and mTLS service boundaries",
          "Declarative capability bundles with dry-run diff, policy simulation, and detached cryptographic signatures",
          "Runtime emergency controls: independent kill switches for mutations, R3 actions, connectors, and schedules",
          "12 production release gates and 5-stage launch progression from sandbox to high-consequence R3 workflows",
        ],
      },
    ],
  },
  {
    slug: "digital-transformation",
    eyebrowLabel: "Digital Transformation",
    title: "Digital Transformation, From the Inside",
    tagline: "Six essays on what actually slows a bank down, and what a board can do about it.",
    description:
      "A six-part series on digital transformation in banking, told through one small change and the five walls it meets on its way to customers: the boundary, approvals, measurement, incentives and the core, then the first year that ties them together.",
    boardCardTitle: "Six things to tell a board about digital transformation",
    parts: [
      {
        slug: "the-factory-is-the-easy-part",
        wall: "The boundary",
        stat: { value: "4×", label: "the wait, when the teams around the factory go from 80% to 95% busy" },
        boardLine: "The factory is the easy part. Fund the boundary as seriously as the factory.",
      },
      {
        slug: "evidence-not-meetings",
        wall: "Approvals",
        stat: { before: fmtDuration(MANUAL_HOURS), value: fmtDuration(AUTO_HOURS), label: "change 27 from finished to live, once controls become evidence" },
        boardLine: "Ask for evidence, not attendance. Approval meetings are not control.",
      },
      {
        slug: "the-one-number-a-board-should-watch",
        wall: "Measurement",
        stat: { value: days(C27_TOTAL), label: "change 27 from idea to customer, behind a board pack of green tiles" },
        boardLine: "Watch one number: lead time from approved idea to customer, reported as a promise.",
      },
      {
        slug: "fear-is-rational",
        wall: "Incentives",
        stat: { value: "94%", label: "of troubles belong to the system, not the people in it (Deming)" },
        boardLine: "Look at the payoffs before the people. You can't bribe your way past blame.",
      },
      {
        slug: "fast-edge-steady-core",
        wall: "The core",
        stat: { before: c28Weeks, value: `${C28_LIVE.decoupled - C28_READY_DAY} day`, label: "change 28 from ready to live, once it stops waiting for the core" },
        boardLine: "The core isn't the problem; the wiring is. Let the core be slow on purpose.",
      },
      {
        slug: "year-one",
        wall: "Time",
        stat: { before: days(LEAD_START), value: `${LEAD_END.toFixed(1)} days`, label: "change 27 in month 1 and month 12, after getting worse first" },
        boardLine: "Expect a J, not a line, and don't cut the boundary at month four.",
      },
    ],
  },
];

export const seriesPath = (slug: string) => `/blog/series/${slug}`;
export const seriesUrl = (slug: string) => `${SITE_URL}${seriesPath(slug)}`;

export function getSeries(slug: string): Series | null {
  return SERIES.find((s) => s.slug === slug) ?? null;
}

/** The series a post belongs to, and its position (1-based). */
export function seriesForPost(postSlug: string): { series: Series; part: number; total: number } | null {
  for (const s of SERIES) {
    const i = s.parts.findIndex((p) => p.slug === postSlug);
    if (i >= 0) return { series: s, part: i + 1, total: s.parts.length };
  }
  return null;
}

/**
 * A series with each part's post metadata; `parts` holds published articles, while `allParts`
 * includes planned roadmap installments so progressive series pages work seamlessly as new articles ship.
 */
export async function getSeriesWithPosts(slug: string) {
  const series = getSeries(slug);
  if (!series) return null;
  const posts = await getAllPosts();
  const bySlug = new Map(posts.map((p) => [p.slug, p] as const));

  const allParts: ResolvedSeriesPart[] = series.parts
    .map((part, i) => {
      const rawPost = bySlug.get(part.slug) ?? null;
      const post = rawPost && !rawPost.draft ? rawPost : null;
      return {
        ...part,
        n: i + 1,
        post,
        title: post?.title ?? part.plannedTitle ?? part.wall,
        excerpt: post?.excerpt ?? part.plannedExcerpt ?? "",
      };
    })
    .filter((p) => p.post !== null || Boolean(p.plannedTitle));

  const parts = allParts.filter((p): p is ResolvedSeriesPart & { post: PostMeta } => p.post !== null);
  const minutes = parts.reduce((a, p) => a + p.post.readingMinutes, 0);
  return { series, parts, allParts, minutes };
}
