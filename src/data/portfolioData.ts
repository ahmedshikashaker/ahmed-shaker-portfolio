export type AttributionLevel =
  | "Executive Ownership & Direction"
  | "Hands-On Architecture & Delivery"
  | "Chapter Leadership & CI/CD Governance"
  | "Cross-Functional Factory Delivery";

export interface ExecutiveMetric {
  id: string;
  value: string;
  label: string;
  sublabel: string;
  verificationNote: string;
}

export interface DigitalFactoryPillar {
  title: string;
  subtitle: string;
  description: string;
  outcomes: string[];
}

export interface DigitalFactoryCaseStudy {
  id: "kib" | "warba";
  institution: string;
  factoryName: string;
  role: string;
  period: string;
  location: string;
  accentColor: "emerald" | "amber";
  badgeText: string;
  executiveSummary: string;
  strategicContext: string;
  architecturalMandate: string;
  myDirectContribution: string[];
  organizationScope: string;
  technologyFoundation: {
    mobileAndWeb: string[];
    backendAndData: string[];
    devopsAndGovernance: string[];
  };
  pillars: DigitalFactoryPillar[];
  keyProductsDelivered: {
    name: string;
    category: string;
    summary: string;
  }[];
}

export interface BankingProduct {
  id: string;
  name: string;
  arabicOrSubName?: string;
  institution: "Kuwait International Bank (KIB)" | "Warba Bank" | "United Bank for Africa (Cit Global)" | "ITG Solutions";
  factoryTag: "KIB Digital Factory" | "Warba Al-Wateen Factory" | "Enterprise Banking & EdTech";
  category: string;
  tagline: string;
  iconPath?: string;
  screenshots?: string[];
  platforms: ("Android" | "iOS" | "Flutter" | "Web" | "Microservices" | "BaaS API")[];
  attributionBadge: AttributionLevel;
  purposeAndExperience: string;
  problemAddressed: string;
  architectureAndTech: string[];
  myRoleAndContribution: string;
  organizationalDistinction: string;
  verifiableImpact: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  featured: boolean;
}

export interface CareerMilestone {
  id: string;
  role: string;
  organization: string;
  organizationTag: string;
  location: string;
  period: string;
  durationHighlight: string;
  isDigitalFactoryRole: boolean;
  executiveHeadline: string;
  strategicScope: string;
  achievements: {
    category: "Strategy & Leadership" | "Architecture & Engineering" | "Product Delivery" | "DevOps & Governance";
    text: string;
  }[];
  technologies: string[];
}

export interface ArchitectureLayer {
  id: string;
  layerNumber: string;
  name: string;
  executiveThesis: string;
  description: string;
  technologies: string[];
  designPrinciples: string[];
  bankingUseCase: string;
}

export interface LeadershipPrinciple {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  narrative: string;
  evidenceFromCareer: string;
  keyPractices: string[];
}

export const EXECUTIVE_PROFILE = {
  name: "Ahmed Shaker",
  title: "Head of Digital Technology",
  positioningHeadline:
    "Architecting Digital Factories & Production-Grade Banking Ecosystems from the Ground Up.",
  positioningSubheadline:
    "Senior Technology Executive and Digital Transformation Leader with 10+ years engineering and scaling regulated banking platforms across Mobile, Backend Microservices, and Cloud-Native DevOps. Instrumental in establishing two pioneering banking Digital Factories in Kuwait—at Kuwait International Bank (KIB) and Warba Bank.",
  shortBio:
    "Digital transformation leader with 10+ years building and scaling banking and enterprise platforms across mobile, backend, and DevOps. Instrumental in establishing the digital factories at Kuwait International Bank and Warba Bank, delivering core mobile banking, wealth, real estate, remittance, BNPL, and loyalty products from the ground up.",
  location: "Kuwait City, Kuwait",
  timezone: "AST (UTC+3)",
  contact: {
    email: "ahmed.shika.shaker@gmail.com",
    phone: "+965 9441 8109",
    phoneClean: "+96594418109",
    linkedin: "https://www.linkedin.com/in/ahmed-shaker-492413a2/",
    linkedinDisplay: "linkedin.com/in/ahmed-shaker",
    github: "https://github.com/ahmedmshaker",
    githubDisplay: "github.com/ahmedmshaker",
    stackoverflow: "https://stackoverflow.com/users/3972906",
    stackoverflowDisplay: "stackoverflow.com/users/3972906",
    kibAppStoreDeveloper:
      "https://apps.apple.com/kw/developer/kuwait-international-bank/id409763762",
    kibPlayStoreDeveloper:
      "https://play.google.com/store/apps/developer?id=Kuwait+International+Bank+K.S.C",
  },
  education: {
    degree: "B.Sc. in Computer Science & Information Technology",
    institution: "Faculty of Computer and Information Sciences, Ain Shams University",
    location: "Cairo, Egypt",
    period: "2012 – 2016",
  },
  languages: [
    { language: "Arabic", proficiency: "Native / Bilingual Proficiency" },
    { language: "English", proficiency: "Professional Working Proficiency" },
  ],
};

export const EXECUTIVE_METRICS: ExecutiveMetric[] = [
  {
    id: "years",
    value: "10+ Yrs",
    label: "Banking & Enterprise Technology Leadership",
    sublabel: "2016 – Present · Full-stack digital transformation across MENA & Africa",
    verificationNote: "Verified from career history (Oct 2016 – Present)",
  },
  {
    id: "factories",
    value: "02",
    label: "Banking Digital Factories Built from Scratch",
    sublabel: "Kuwait International Bank (KIB) & Warba Bank (Al-Wateen)",
    verificationNote: "Foundational strategic, architectural & engineering leadership",
  },
  {
    id: "kib-ecosystem",
    value: "08+",
    label: "Core Digital Banking Product Lines at KIB",
    sublabel: "Retail, Corporate, Aqari, Invest, Paytally, Remittance, Backoffice & BIN Sponsorship",
    verificationNote: "Directed across Android, iOS, Web & Microservices as Head of Digital Technology",
  },
  {
    id: "domains",
    value: "3 Pillars",
    label: "End-to-End Engineering Ownership",
    sublabel: "Mobile (Android · iOS · Flutter) • Backend (NestJS · Java) • DevOps (K8s · Argo CD)",
    verificationNote: "Unified architecture standards, CI/CD pipelines & release governance",
  },
];

export const DIGITAL_FACTORIES: DigitalFactoryCaseStudy[] = [
  {
    id: "kib",
    institution: "Kuwait International Bank (KIB)",
    factoryName: "KIB Digital Factory & Multi-Platform Ecosystem",
    role: "Head of Digital Technology",
    period: "Jun 2022 – Present",
    location: "Kuwait City, Kuwait",
    accentColor: "emerald",
    badgeText: "Factory 02 · Enterprise-Scale Multi-Product Command",
    executiveSummary:
      "Established and scaled KIB’s internal Digital Factory from the ground up, transitioning the bank into a multi-platform digital powerhouse capable of building, shipping, and governing retail, corporate, wealth, real estate, marketplace, and embedded-finance (BaaS) products in-house.",
    strategicContext:
      "To compete at the forefront of Islamic digital banking in the GCC, KIB needed more than isolated app releases—it required an institutionalized Digital Factory with unified technical governance, multi-year technology roadmaps, reusable microservice foundations, and synchronized cross-platform squads.",
    architecturalMandate:
      "Own the bank's digital technology function across Mobile (Native Android, Native iOS, Flutter), Web, and Backend Microservices (NestJS, Java EE, Kafka, RabbitMQ), while instituting enterprise release governance and Kubernetes/Argo CD delivery pipelines.",
    myDirectContribution: [
      "Defined the Digital Factory’s multi-year technology roadmap, target technology stacks, and enterprise architectural standards from scratch.",
      "Lead the bank's digital technology function, holding executive ownership of mobile, web, and backend delivery across both retail and corporate banking lines.",
      "Direct cross-platform engineering squads delivering 8 flagship ecosystems: KIB Retail, KIB Corporate, KIB Aqari, KIB Invest, Remittance (WAGE), Paytally (BuyNow), Backoffice portals, and BIN Sponsorship (BaaS).",
      "Established strict engineering practices (SOLID, Domain-Driven Design, TDD, OWASP security patterns) and release governance across native (Kotlin/Swift) and Flutter codebases.",
      "Aligned cloud-native DevOps capabilities using Kubernetes, Argo CD, Jenkins, and event-driven microservices to support high-velocity, audit-compliant banking releases.",
    ],
    organizationScope:
      "Products are delivered by specialized cross-functional engineering squads (Android, iOS, Flutter, Web, Backend, QA, DevOps) operating under my architectural standards, release governance, and executive technology leadership.",
    technologyFoundation: {
      mobileAndWeb: [
        "Android Native (Kotlin, Hilt, Dagger)",
        "iOS Native (Swift)",
        "Flutter (Cross-Platform Mobile & Web)",
        "TypeScript / Modern Web Portals",
      ],
      backendAndData: [
        "NestJS & Node.js Microservices",
        "Java EE Enterprise Services",
        "Apache Kafka & RabbitMQ Event Streaming",
        "REST & SOAP Core Banking Integrations",
        "MongoDB & Relational Databases",
      ],
      devopsAndGovernance: [
        "Kubernetes Container Orchestration",
        "Argo CD GitOps Continuous Delivery",
        "Jenkins CI/CD Automation",
        "OWASP Security & Release Governance",
        "Domain-Driven Design (DDD) & TDD",
      ],
    },
    pillars: [
      {
        title: "01. Strategic Roadmap & Stack Standardization",
        subtitle: "Executive Technology Direction",
        description:
          "Selected and standardized a hybrid client strategy (Native Kotlin/Swift where deep OS integration is paramount, and Flutter for rapid cross-platform mobile and web delivery) backed by NestJS and Java microservices.",
        outcomes: [
          "Eliminated fragmented vendor silos across retail and corporate channels",
          "Enabled shared architectural patterns across 8+ distinct product lines",
        ],
      },
      {
        title: "02. Multi-Vertical Product Factory Scaling",
        subtitle: "Simultaneous Delivery Across 8 Banking Verticals",
        description:
          "Structured engineering teams to deliver parallel roadmaps spanning core retail banking, corporate treasury approvals, PropTech (Aqari), WealthTech (Invest), BNPL (Paytally), and Financial Inclusion (WAGE).",
        outcomes: [
          "Published a comprehensive suite of verified production apps on App Store & Google Play",
          "Expanded beyond traditional banking into non-bank customer acquisition (Paytally & Aqari)",
        ],
      },
      {
        title: "03. Embedded Finance & BIN Sponsorship Infrastructure",
        subtitle: "Banking-as-a-Service (BaaS) Enablement",
        description:
          "Guided the digital technology delivery supporting KIB’s BIN Sponsorship and BaaS platform—enabling external fintechs and exchange partners to issue custom multi-currency digital payment cards.",
        outcomes: [
          "Supported KIB's milestone as the first bank in Kuwait to achieve Visa Ready for Fintech Enablement certification",
          "Extended core banking capabilities into programmable partner ecosystems",
        ],
      },
      {
        title: "04. Enterprise Governance & GitOps Automation",
        subtitle: "Zero-Compromise Reliability & Security",
        description:
          "Instituted rigorous code quality gates, OWASP compliance, Git branching discipline, and automated deployment pipelines via Jenkins, Kubernetes, and Argo CD.",
        outcomes: [
          "Predictable, auditable release cadences across Android, iOS, and Web",
          "Resilient microservice topologies utilizing Kafka and RabbitMQ",
        ],
      },
    ],
    keyProductsDelivered: [
      {
        name: "KIB Mobile (Retail)",
        category: "Core Retail Banking",
        summary: "Next-gen retail banking app with WAMD instant payments, accounts, cards & financing.",
      },
      {
        name: "KIB Corporate",
        category: "Commercial Banking",
        summary: "Executive corporate banking suite with multi-tier transaction approvals and cash visibility.",
      },
      {
        name: "KIB Aqari",
        category: "PropTech & Real Estate",
        summary: "Automated rent collection, property management, and QR-verified real estate appraisals.",
      },
      {
        name: "KIB Invest",
        category: "Shariah WealthTech",
        summary: "100% digital investment onboarding (PACI/e-signature) and Shariah fund portfolio management.",
      },
      {
        name: "Paytally (BuyNow by KIB)",
        category: "BNPL & Marketplace",
        summary: "Kuwait's first bank-led digital marketplace offering 0% profit Islamic financing.",
      },
      {
        name: "Remittance & WAGE by KIB",
        category: "Financial Inclusion",
        summary: "Accessible digital account opening, salary management, and international remittance.",
      },
      {
        name: "BIN Sponsorship & BaaS",
        category: "Embedded Finance",
        summary: "Card-as-a-Service & BIN sponsorship infrastructure for fintech and exchange partners.",
      },
      {
        name: "Backoffice Suite",
        category: "Internal Operations",
        summary: "Unified administrative portals and operational engines governing digital channels.",
      },
    ],
  },
  {
    id: "warba",
    institution: "Warba Bank",
    factoryName: "“Al-Wateen” Digital Factory — Foundational Mobile & Product Engineering",
    role: "Android Chapter Lead",
    period: "Mar 2019 – Jun 2022",
    location: "Kuwait City, Kuwait",
    accentColor: "amber",
    badgeText: "Factory 01 · Pioneering Islamic Banking Digital Factory",
    executiveSummary:
      "Served as one of the core builders who established Warba Bank’s pioneering “Al-Wateen” Digital Factory from scratch—architecting and building the flagship Warba Bank mobile app from the ground up, establishing CI/CD and release engineering for the mobile chapter, and delivering innovative lifestyle and youth banking products.",
    strategicContext:
      "Warba Bank set out to establish Kuwait’s first internal Islamic banking Digital Factory ('Al-Wateen') to break away from slow traditional banking release cycles and pioneer youth, lifestyle, and gamified financial products.",
    architecturalMandate:
      "Build and manage the flagship Warba Bank mobile application from scratch, lead the Android Engineering Chapter, automate CI/CD pipelines in Jenkins, establish Git branching and release governance, and expand into cross-platform Flutter mobile & web products.",
    myDirectContribution: [
      "Architected, built, and managed the flagship Warba Bank mobile banking application from scratch—owning its technical foundation, feature delivery, and production support.",
      "Established the Mobile Chapter’s engineering backbone: created automated CI/CD pipelines in Jenkins and defined Git branching and release-management strategies.",
      "Developed Fayez (Warba Bank's gamified fitness, step-tracking, sports prediction, and loyalty rewards app) and built Fayez Admin using Flutter Web.",
      "Delivered Hassala Kids end-to-end—a dedicated digital savings and financial literacy application designed for children.",
      "Instituted clean architecture, dependency injection (Dagger/Hilt), and modular Kotlin/Java practices across the chapter.",
    ],
    organizationScope:
      "Combined direct hands-on greenfield architecture and development with Chapter Leadership—mentoring mobile engineers, governing pull requests and releases, and collaborating across Al-Wateen Digital Factory squads.",
    technologyFoundation: {
      mobileAndWeb: [
        "Android Native (Kotlin & Java)",
        "Flutter Mobile & Flutter Web",
        "Dagger & Hilt Dependency Injection",
        "Apple Health / Google Fit Integrations (Fayez)",
      ],
      backendAndData: [
        "REST & SOAP Banking APIs",
        "JSON & XML (SAX, DOM) Processing",
        "Secure Local Storage & Biometric Auth",
      ],
      devopsAndGovernance: [
        "Jenkins CI/CD Pipelines",
        "Git Flow & Release-Management Governance",
        "SOLID Principles & Clean Architecture",
        "Automated Build & Distribution Workflows",
      ],
    },
    pillars: [
      {
        title: "01. Greenfield Core Mobile Banking Architecture",
        subtitle: "Built from Scratch to Production Scale",
        description:
          "Designed and engineered the Warba Bank mobile application from a blank slate, creating a modular, maintainable architecture capable of supporting rapid feature expansion across retail accounts, cards, financing, and Pocket loyalty.",
        outcomes: [
          "Successfully launched and scaled Warba Bank's primary digital customer touchpoint",
          "Sustained high stability through disciplined architectural boundaries and ongoing support",
        ],
      },
      {
        title: "02. Mobile Chapter CI/CD & Release Engineering",
        subtitle: "From Manual Builds to Automated Pipelines",
        description:
          "Built Jenkins CI/CD pipelines from the ground up and codified Git branching and release-management strategies for the mobile engineering chapter.",
        outcomes: [
          "Standardized how every mobile engineer branched, reviewed, tested, and shipped code",
          "Eliminated release bottlenecks across concurrent digital factory squads",
        ],
      },
      {
        title: "03. Gamified Lifestyle & Loyalty Ecosystem (Fayez)",
        subtitle: "Beyond Traditional Banking Transactions",
        description:
          "Developed the Fayez mobile app and Fayez Admin (Flutter Web), turning daily health habits (walking/running steps) and sports predictions into redeemable cash prizes and Warba loyalty points.",
        outcomes: [
          "Pioneered early Flutter Web adoption in production for banking administration",
          "Created a high-engagement daily lifestyle touchpoint for both customers and non-customers",
        ],
      },
      {
        title: "04. End-to-End Youth Financial Literacy (Hassala Kids)",
        subtitle: "Full-Lifecycle Product Delivery",
        description:
          "Owned the end-to-end delivery of Hassala Kids, translating the traditional savings 'money box' into an engaging digital savings experience for children and families.",
        outcomes: [
          "Delivered complete product lifecycle from architecture to store release",
          "Strengthened Warba Bank's family and youth banking proposition",
        ],
      },
    ],
    keyProductsDelivered: [
      {
        name: "Warba Bank Mobile App",
        category: "Flagship Retail Banking",
        summary: "Core retail banking app built and managed from scratch—architecture, delivery & support.",
      },
      {
        name: "Fayez & Fayez Admin",
        category: "Lifestyle, Fitness & Loyalty + Flutter Web",
        summary: "Gamified fitness & challenges app integrated with loyalty rewards, plus Flutter Web admin portal.",
      },
      {
        name: "Hassala Kids",
        category: "Youth Digital Savings",
        summary: "End-to-end digital savings ('money box') application teaching financial literacy to children.",
      },
      {
        name: "Mobile Chapter CI/CD Spine",
        category: "DevOps & Release Governance",
        summary: "Jenkins automation pipelines, Git branching models, and chapter-wide engineering standards.",
      },
    ],
  },
];

export const SELECTED_PRODUCTS: BankingProduct[] = [
  {
    id: "kib-mobile",
    name: "KIB Mobile (KIB Retail)",
    institution: "Kuwait International Bank (KIB)",
    factoryTag: "KIB Digital Factory",
    category: "Core Retail Mobile Banking",
    tagline: "Reimagined flagship retail banking experience for everyday accounts, WAMD instant payments, cards, and Islamic financing.",
    iconPath: "/assets/apps/icons/kib-mobile.jpg",
    screenshots: [
      "/assets/apps/screenshots/kib-mobile-1.jpg",
      "/assets/apps/screenshots/kib-mobile-2.jpg",
    ],
    platforms: ["Android", "iOS", "Flutter", "Microservices"],
    attributionBadge: "Executive Ownership & Direction",
    purposeAndExperience:
      "Serves as KIB’s primary retail digital banking flagship, empowering individual customers to manage accounts, execute local and international transfers (including WAMD instant peer-to-peer payments), manage credit/prepaid cards, settle financing installments, and track deposits effortlessly.",
    problemAddressed:
      "Replaced fragmented legacy banking workflows with a unified, intuitive digital experience that minimizes branch visits and supports real-time payment rails and personalized self-service.",
    architectureAndTech: [
      "Cross-platform & Native Mobile Architecture",
      "NestJS & Java EE Backend Microservices",
      "Apache Kafka & RabbitMQ Event Processing",
      "Kubernetes & Argo CD GitOps Deployment",
      "OWASP Mobile Security & Biometric Authentication",
    ],
    myRoleAndContribution:
      "As Head of Digital Technology, I own the end-to-end mobile, web, and backend delivery function, define the enterprise architecture standards and release governance, and direct the cross-platform engineering teams building and evolving KIB Retail.",
    organizationalDistinction:
      "Delivered by KIB Digital Factory cross-functional engineering squads under my executive technology direction, architectural standards, and release governance.",
    verifiableImpact:
      "Live flagship retail banking application serving KIB’s retail customer base across Kuwait on the Apple App Store and Google Play Store.",
    appStoreUrl: "https://apps.apple.com/kw/app/kib-mobile/id409840829",
    playStoreUrl: "https://play.google.com/store/apps/details?id=eu.eleader.mobilebanking.kib",
    featured: true,
  },
  {
    id: "kib-corporate",
    name: "KIB Corporate",
    institution: "Kuwait International Bank (KIB)",
    factoryTag: "KIB Digital Factory",
    category: "Commercial & Corporate Treasury Banking",
    tagline: "Enterprise-grade mobile and web corporate banking with multi-tier approval workflows and real-time commercial liquidity control.",
    iconPath: "/assets/apps/icons/kib-corporate.jpg",
    screenshots: [
      "/assets/apps/screenshots/kib-corporate-1.png",
      "/assets/apps/screenshots/kib-corporate-2.png",
    ],
    platforms: ["Android", "iOS", "Web", "Microservices"],
    attributionBadge: "Executive Ownership & Direction",
    purposeAndExperience:
      "Provides corporate executives, CFOs, and business owners with secure mobile and web command over commercial accounts, bulk and single transaction approvals, corporate credit cards, and beneficiary management.",
    problemAddressed:
      "Corporate decision-makers historically depended on desktop-only portals to authorize time-sensitive payroll, trade, and treasury transactions. KIB Corporate brings full maker-checker approval governance and granular cash visibility to mobile and web.",
    architectureAndTech: [
      "Multi-Tier Role-Based Access Control (RBAC)",
      "Maker-Checker Approval Workflow Engine",
      "Android, iOS & Responsive Web Delivery",
      "REST/SOAP Core Corporate Banking Integration",
      "High-Assurance Security & Audit Logging",
    ],
    myRoleAndContribution:
      "Direct the cross-platform mobile, web, and backend engineering squads delivering KIB Corporate; establish architectural patterns for secure corporate authorization flows and release governance.",
    organizationalDistinction:
      "Built and maintained by KIB's corporate digital squads operating within the Digital Factory governance framework I lead.",
    verifiableImpact:
      "Publicly available on iOS App Store, Google Play Store, and KIB Corporate Web, modernizing commercial banking operations for KIB business clients.",
    appStoreUrl: "https://apps.apple.com/kw/app/kib-corporate/id6456405889",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.kib.corporate",
    featured: true,
  },
  {
    id: "kib-aqari",
    name: "KIB Aqari",
    institution: "Kuwait International Bank (KIB)",
    factoryTag: "KIB Digital Factory",
    category: "PropTech & Real Estate Platform",
    tagline: "Kuwait’s one-stop digital real estate ecosystem for automated rent collection, property management, and QR-verified official appraisals.",
    iconPath: "/assets/apps/icons/kib-aqari.jpg",
    screenshots: [
      "/assets/apps/screenshots/kib-aqari-1.jpg",
      "/assets/apps/screenshots/kib-aqari-2.jpg",
    ],
    platforms: ["Android", "iOS", "Web", "Microservices"],
    attributionBadge: "Executive Ownership & Direction",
    purposeAndExperience:
      "Digitizes KIB’s deep heritage in real estate advisory and property management—allowing property owners and investors to automate monthly rent collection, track delinquent payments, request certified property appraisals, and verify appraisal authenticity via QR code.",
    problemAddressed:
      "Real estate management and official property valuation in Kuwait traditionally involved manual rent tracking and paper-based appraisal certificates. KIB Aqari unifies property operations and certified bank valuations in a single digital platform.",
    architectureAndTech: [
      "Automated Payment Link & Rent Scheduling Engine",
      "QR-Code Cryptographic Appraisal Verification",
      "Cross-Platform Mobile & Web Portals",
      "Microservices Backend (NestJS / Java)",
    ],
    myRoleAndContribution:
      "Own the technology delivery and architectural governance for KIB Aqari across mobile, web, and backend teams as Head of Digital Technology.",
    organizationalDistinction:
      "Engineered by KIB Digital Factory squads in collaboration with KIB's Real Estate Department under my technical leadership.",
    verifiableImpact:
      "Established a differentiated PropTech vertical for KIB on the App Store and Google Play Store, serving both property investors and appraisal clients.",
    appStoreUrl: "https://apps.apple.com/kw/app/kib-aqari/id6447563934",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.kib.aqari",
    featured: true,
  },
  {
    id: "kib-invest",
    name: "KIB Invest",
    institution: "Kuwait International Bank (KIB)",
    factoryTag: "KIB Digital Factory",
    category: "Shariah-Compliant WealthTech",
    tagline: "100% digital investment onboarding and Shariah-compliant fund portfolio management.",
    iconPath: "/assets/apps/icons/kib-invest.jpg",
    screenshots: [
      "/assets/apps/screenshots/kib-invest-1.jpg",
      "/assets/apps/screenshots/kib-invest-2.jpg",
    ],
    platforms: ["Android", "iOS", "Flutter", "Microservices"],
    attributionBadge: "Executive Ownership & Direction",
    purposeAndExperience:
      "Enables retail and affluent investors to open investment accounts completely digitally (integrating PACI Kuwait Mobile ID verification and digital signatures), subscribe to and redeem Shariah-compliant money market and equity funds, and monitor NAV trends in real time.",
    problemAddressed:
      "Democratized access to Shariah-compliant wealth management by eliminating paper-heavy brokerage onboarding and in-person branch visits, allowing funding from KIB or any local bank account.",
    architectureAndTech: [
      "PACI Digital Identity & E-Signature Onboarding",
      "Real-Time Portfolio & NAV Analytics",
      "Cross-Platform Mobile Architecture",
      "Secure Wealth Management API Integration",
    ],
    myRoleAndContribution:
      "Direct the engineering teams delivering KIB Invest across Android, iOS, and backend integration layers, ensuring security, regulatory compliance, and architectural consistency.",
    organizationalDistinction:
      "Delivered through the KIB Digital Factory in partnership with Al Dawli Invest (KIB Invest) under my digital technology leadership.",
    verifiableImpact:
      "Launched as a standalone digital wealth companion on the Apple App Store and Google Play Store (`com.kib.invest`).",
    appStoreUrl: "https://apps.apple.com/kw/app/kib-invest/id6745544920",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.kib.invest",
    featured: true,
  },
  {
    id: "kib-paytally",
    name: "Paytally (BuyNow by KIB)",
    institution: "Kuwait International Bank (KIB)",
    factoryTag: "KIB Digital Factory",
    category: "Bank-Led Marketplace & 0% Profit Financing",
    tagline: "Kuwait’s first bank-led digital marketplace and postpay financing platform—accessible without salary transfer.",
    iconPath: "/assets/apps/icons/kib-paytally.jpg",
    screenshots: [
      "/assets/apps/screenshots/kib-paytally-1.jpg",
      "/assets/apps/screenshots/kib-paytally-2.jpg",
    ],
    platforms: ["Android", "iOS", "Web", "Microservices"],
    attributionBadge: "Executive Ownership & Direction",
    purposeAndExperience:
      "Combines an e-commerce partner marketplace with instant, Shariah-compliant 0% profit consumer financing across medical, education, electronics, automotive, and home categories—open to both KIB and non-KIB customers without requiring a salary transfer.",
    problemAddressed:
      "Traditional consumer financing required lengthy paperwork and salary transfers. Paytally / BuyNow by KIB embeds digital Islamic financing directly into merchant discovery and checkout.",
    architectureAndTech: [
      "Digital Credit Decisioning & Onboarding Workflows",
      "Multi-Merchant Marketplace & Order Orchestration",
      "Cross-Platform Mobile & Partner Portals",
      "Event-Driven Microservices (NestJS, Kafka/RabbitMQ)",
    ],
    myRoleAndContribution:
      "Lead the digital engineering teams responsible for Paytally / BuyNow across mobile, web, and backend services, overseeing architecture, scalability, and release governance.",
    organizationalDistinction:
      "Built by KIB Digital Factory engineering squads as a flagship embedded-financing initiative under my technology leadership.",
    verifiableImpact:
      "Recognized as Kuwait's first bank-led digital marketplace platform, live on the App Store and Google Play (`com.kib.postpay`).",
    appStoreUrl: "https://apps.apple.com/kw/app/buynow-by-kib/id6472891180",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.kib.postpay",
    featured: true,
  },
  {
    id: "kib-remittance-wage",
    name: "KIB Remittance & WAGE by KIB",
    institution: "Kuwait International Bank (KIB)",
    factoryTag: "KIB Digital Factory",
    category: "Remittance & Financial Inclusion",
    tagline: "Streamlined digital account onboarding, wage management, and cross-border remittance.",
    iconPath: "/assets/apps/icons/kib-wage.jpg",
    screenshots: [
      "/assets/apps/screenshots/kib-wage-1.jpg",
      "/assets/apps/screenshots/kib-wage-2.jpg",
    ],
    platforms: ["Android", "iOS", "Flutter", "Microservices"],
    attributionBadge: "Executive Ownership & Direction",
    purposeAndExperience:
      "Provides accessible mobile banking, fast digital onboarding, everyday account management, and international remittance services tailored for underserved segments and wage earners.",
    problemAddressed:
      "Eliminates physical queues at branches and exchange houses by delivering multilingual, lightweight mobile onboarding and fast cross-border transfer capabilities.",
    architectureAndTech: [
      "Flutter Cross-Platform Mobile Architecture",
      "International Remittance Rail Integrations",
      "Digital KYC & Identity Verification",
      "Microservices Backend & CI/CD Delivery",
    ],
    myRoleAndContribution:
      "Direct the cross-platform and backend engineering teams delivering KIB’s Remittance and WAGE digital products under unified factory governance.",
    organizationalDistinction:
      "Delivered by KIB Digital Factory squads under my direction as Head of Digital Technology.",
    verifiableImpact:
      "Live on the Apple App Store and Google Play (`com.kib.kiblite.kib_lite`), expanding KIB's digital footprint into inclusive banking and remittance.",
    appStoreUrl: "https://apps.apple.com/kw/app/wage-by-kib/id6608959158",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.kib.kiblite.kib_lite",
    featured: false,
  },
  {
    id: "kib-bin-sponsorship",
    name: "KIB BIN Sponsorship, BaaS & Backoffice Suite",
    institution: "Kuwait International Bank (KIB)",
    factoryTag: "KIB Digital Factory",
    category: "Banking-as-a-Service (BaaS) & Internal Operations",
    tagline: "Visa-Ready BIN Sponsorship infrastructure and enterprise Backoffice portals powering fintechs and bank operations.",
    platforms: ["BaaS API", "Microservices", "Web", "Android", "iOS"],
    attributionBadge: "Executive Ownership & Direction",
    purposeAndExperience:
      "Enables external fintechs and major exchange institutions to issue and manage digital multi-currency prepaid and payment cards backed by KIB’s banking license and technical infrastructure, paired with comprehensive internal Backoffice web portals.",
    problemAddressed:
      "Fintechs and exchange houses in Kuwait needed regulated card-issuing and settlement infrastructure without building a bank from scratch, while KIB operations needed unified backoffice tooling across all digital products.",
    architectureAndTech: [
      "NestJS & Java EE Microservices",
      "Apache Kafka & RabbitMQ Event Mesh",
      "Kubernetes & Argo CD Cloud-Native Infrastructure",
      "Visa Ready Partner API & Backoffice Web Portals",
    ],
    myRoleAndContribution:
      "Own the digital technology delivery for KIB's BIN Sponsorship and Backoffice platforms, defining microservice architecture standards, API security (OWASP), and release governance.",
    organizationalDistinction:
      "Delivered by KIB’s Digital Factory backend, web, and mobile engineering teams in alignment with payment scheme and regulatory standards.",
    verifiableImpact:
      "Powered KIB's milestone as the first bank in Kuwait to earn Visa Ready for Fintech Enablement certification and onboard institutional multi-currency card partners.",
    featured: true,
  },
  {
    id: "warba-mobile",
    name: "Warba Bank Mobile Banking",
    institution: "Warba Bank",
    factoryTag: "Warba Al-Wateen Factory",
    category: "Flagship Retail Mobile Banking",
    tagline: "Architected, built, and managed Warba Bank’s core mobile banking app from scratch within the Al-Wateen Digital Factory.",
    iconPath: "/assets/apps/icons/warba-mobile.jpg",
    screenshots: [
      "/assets/apps/screenshots/warba-mobile-1.jpg",
      "/assets/apps/screenshots/warba-mobile-2.jpg",
    ],
    platforms: ["Android", "iOS"],
    attributionBadge: "Hands-On Architecture & Delivery",
    purposeAndExperience:
      "Warba Bank’s primary retail mobile application providing personalized account dashboards, digital onboarding, financing, Al Sunbula draws,Hassala saving goals, transfer services, and Pocket loyalty management.",
    problemAddressed:
      "Warba Bank needed to transition to an in-house engineered, modular mobile banking platform built for rapid iteration inside its newly formed Al-Wateen Digital Factory.",
    architectureAndTech: [
      "Android Native (Kotlin & Java)",
      "Dagger & Hilt Dependency Injection",
      "SOLID & Clean Modular Architecture",
      "Jenkins CI/CD Automation & Git Release Governance",
    ],
    myRoleAndContribution:
      "Built and managed the Warba Bank mobile banking app from scratch—personally leading its Android architecture, engineering delivery, ongoing production support, Jenkins CI/CD pipelines, and Git branching/release strategies as Android Chapter Lead.",
    organizationalDistinction:
      "Direct hands-on architecture, code authorship, and chapter leadership for the Android platform, working alongside iOS, backend, and design peers in Warba Bank's Al-Wateen Digital Factory.",
    verifiableImpact:
      "Served as the foundational mobile banking platform for Warba Bank’s retail customer base during a pivotal 3+ year period of digital growth.",
    appStoreUrl: "https://apps.apple.com/kw/app/warba-bank/id925349051",
    featured: true,
  },
  {
    id: "warba-fayez",
    name: "Fayez & Fayez Admin",
    institution: "Warba Bank",
    factoryTag: "Warba Al-Wateen Factory",
    category: "Gamified Fitness, Loyalty & Flutter Web Admin",
    tagline: "Gamified lifestyle, step-tracking, and sports prediction ecosystem with a custom Flutter Web administration suite.",
    iconPath: "/assets/apps/icons/warba-fayez.jpg",
    screenshots: [
      "/assets/apps/screenshots/warba-fayez-1.png",
      "/assets/apps/screenshots/warba-fayez-2.png",
    ],
    platforms: ["Android", "iOS", "Flutter", "Web"],
    attributionBadge: "Hands-On Architecture & Delivery",
    purposeAndExperience:
      "A free-to-join lifestyle and loyalty application ('Everyone is a Winner') where users walk, run, track daily steps via health APIs, and predict sports and quiz challenges to win cash prizes and Warba Bank loyalty points, paired with Fayez Admin for campaign management.",
    problemAddressed:
      "Created a high-frequency non-transactional engagement channel that connected everyday health and sports enthusiasm directly to Warba Bank's loyalty and account ecosystem.",
    architectureAndTech: [
      "Mobile App Development (Android / Flutter)",
      "Fayez Admin Built with Flutter Web",
      "Health & Step-Tracking Sensor Integrations",
      "Jenkins CI/CD & Automated Release Workflows",
    ],
    myRoleAndContribution:
      "Personally developed the Fayez mobile application and engineered the Fayez Admin portal using Flutter Web.",
    organizationalDistinction:
      "Directly developed by me within Warba Bank’s Al-Wateen Digital Factory.",
    verifiableImpact:
      "Published on the App Store and Google Play Store as one of Kuwait’s most distinctive bank-backed lifestyle and loyalty applications.",
    appStoreUrl: "https://apps.apple.com/kw/app/fayez/id1292165363",
    featured: true,
  },
  {
    id: "warba-hassala-kids",
    name: "Hassala Kids",
    institution: "Warba Bank",
    factoryTag: "Warba Al-Wateen Factory",
    category: "Youth Digital Savings & Financial Literacy",
    tagline: "End-to-end digital savings application designed to cultivate financial literacy for children and families.",
    platforms: ["Android", "Flutter"],
    attributionBadge: "Hands-On Architecture & Delivery",
    purposeAndExperience:
      "Digitizes the traditional 'Hassala' (savings money box) for children, enabling young savers and parents to set savings goals, track allowances, and build lifelong financial habits inside a child-friendly banking experience.",
    problemAddressed:
      "Bridged the gap in youth banking by transforming passive children's savings accounts into an interactive, goal-oriented digital experience.",
    architectureAndTech: [
      "End-to-End Mobile Application Architecture",
      "Child-Centric Gamified UI & Parental Controls",
      "Clean Architecture & Automated CI/CD",
    ],
    myRoleAndContribution:
      "Delivered Hassala Kids end-to-end—owning architecture, development, and release delivery within Warba Bank.",
    organizationalDistinction:
      "End-to-end engineering delivery led directly by me at Warba Bank.",
    verifiableImpact:
      "Expanded Warba Bank’s youth and family digital banking proposition out of the Al-Wateen Digital Factory.",
    featured: false,
  },
  {
    id: "uba-mobile-banking",
    name: "UBA Mobile Banking (Cordova-to-Flutter Modernization)",
    institution: "United Bank for Africa (Cit Global)",
    factoryTag: "Enterprise Banking & EdTech",
    category: "Cross-Platform Banking Modernization",
    tagline: "Architectural migration of United Bank for Africa's mobile banking platform from legacy Cordova to high-performance Flutter.",
    iconPath: "/assets/apps/icons/uba-mobile.jpg",
    platforms: ["Flutter", "Android", "iOS"],
    attributionBadge: "Hands-On Architecture & Delivery",
    purposeAndExperience:
      "Modernized the mobile banking experience for United Bank for Africa (UBA), delivering native-grade 60fps UI responsiveness, push notification orchestration, and a dedicated Personal Finance Management (PFM) module.",
    problemAddressed:
      "The legacy Apache Cordova hybrid wrapper suffered from performance bottlenecks and maintenance friction. Re-architecting in Flutter unified the codebase while dramatically improving speed and developer velocity.",
    architectureAndTech: [
      "Legacy Cordova to Flutter Re-Architecture",
      "Personal Finance Management (PFM) Engine",
      "Push Notification Infrastructure",
      "Clean Modular Flutter Architecture & Team Mentorship",
    ],
    myRoleAndContribution:
      "As Mobile Consultant at Cit Global, I defined the new Flutter application architecture, led the migration from Cordova, built the Push Notifications and Personal Finance Management (PFM) features, and mentored the engineering team.",
    organizationalDistinction:
      "Direct architectural authorship, hands-on feature engineering, and technical mentorship.",
    verifiableImpact:
      "Significantly improved runtime performance, UX responsiveness, and long-term codebase maintainability for pan-African mobile banking.",
    appStoreUrl: "https://apps.apple.com/kw/app/uba-mobile-banking/id1000669926",
    featured: false,
  },
];

export const CAREER_TIMELINE: CareerMilestone[] = [
  {
    id: "kib-head-of-digital-tech",
    role: "Head of Digital Technology",
    organization: "Kuwait International Bank (KIB)",
    organizationTag: "Islamic Retail, Corporate & BaaS Banking",
    location: "Kuwait City, Kuwait",
    period: "Jun 2022 – Present",
    durationHighlight: "Executive Technology Leadership · Digital Factory II",
    isDigitalFactoryRole: true,
    executiveHeadline:
      "Leading KIB’s Digital Technology function and Digital Factory—owning mobile, web, and backend delivery across 8+ retail, corporate, real estate, wealth, and embedded finance product lines.",
    strategicScope:
      "Full executive and architectural ownership of KIB's digital channels, engineering practices, technology stack evolution, and release governance across native (Android/iOS), Flutter, Web, and backend microservices.",
    achievements: [
      {
        category: "Strategy & Leadership",
        text: "Co-architected and established KIB's Digital Factory from the ground up, defining multi-year technology roadmaps, organizational squad structures, and engineering hiring/capability standards.",
      },
      {
        category: "Product Delivery",
        text: "Direct cross-platform engineering teams delivering KIB Retail, KIB Aqari, KIB Corporate, KIB Invest, Remittance (WAGE), Paytally (BuyNow), Backoffice portals, and BIN Sponsorship across Android, iOS, and Web.",
      },
      {
        category: "Architecture & Engineering",
        text: "Define enterprise architecture standards, Domain-Driven Design (DDD) boundaries, and OWASP security practices across native (Kotlin/Swift), Flutter, and backend microservices (NestJS, Java EE, Kafka, RabbitMQ).",
      },
      {
        category: "DevOps & Governance",
        text: "Establish end-to-end release governance and GitOps continuous delivery leveraging Kubernetes, Argo CD, and Jenkins across all digital banking squads.",
      },
    ],
    technologies: [
      "Kotlin",
      "Swift",
      "Flutter",
      "TypeScript",
      "NestJS",
      "Java EE",
      "Kafka",
      "RabbitMQ",
      "MongoDB",
      "Kubernetes",
      "Argo CD",
      "Jenkins",
      "DDD",
      "OWASP",
    ],
  },
  {
    id: "warba-chapter-lead",
    role: "Android Chapter Lead",
    organization: "Warba Bank",
    organizationTag: "Pioneering “Al-Wateen” Digital Factory",
    location: "Kuwait City, Kuwait",
    period: "Mar 2019 – Jun 2022",
    durationHighlight: "3 Yrs 4 Mos · Digital Factory I",
    isDigitalFactoryRole: true,
    executiveHeadline:
      "Foundational engineering leader in Warba Bank’s “Al-Wateen” Digital Factory—building the core mobile banking app from scratch, automating CI/CD, and shipping flagship lifestyle and youth apps.",
    strategicScope:
      "Combined hands-on greenfield architecture of Warba Bank's core retail app with chapter leadership, CI/CD pipeline creation, Git release governance, and end-to-end cross-platform product delivery.",
    achievements: [
      {
        category: "Architecture & Engineering",
        text: "Built and managed the flagship Warba Bank mobile banking application from scratch—owning its modular architecture, feature delivery, and ongoing production support.",
      },
      {
        category: "DevOps & Governance",
        text: "Created automated CI/CD pipelines in Jenkins and codified Git branching and release-management strategies for the entire mobile chapter.",
      },
      {
        category: "Product Delivery",
        text: "Developed Fayez (gamified fitness, challenges & loyalty rewards app) and engineered Fayez Admin using Flutter Web.",
      },
      {
        category: "Product Delivery",
        text: "Delivered Hassala Kids end-to-end—a specialized digital savings application designed for children.",
      },
    ],
    technologies: [
      "Kotlin",
      "Java",
      "Android Native",
      "Flutter",
      "Flutter Web",
      "Dagger",
      "Hilt",
      "Jenkins CI/CD",
      "SOLID",
      "Git Governance",
    ],
  },
  {
    id: "cit-global-consultant",
    role: "Mobile Consultant — Android & Flutter",
    organization: "Cit Global",
    organizationTag: "International Banking Modernization · Part-time",
    location: "Cairo, Egypt (Remote / Part-time)",
    period: "Jan 2020 – Jan 2021",
    durationHighlight: "1 Yr · Legacy-to-Flutter Banking Transformation",
    isDigitalFactoryRole: false,
    executiveHeadline:
      "Spearheaded the architectural migration of United Bank for Africa (UBA) Mobile Banking from legacy Cordova to Flutter while mentoring the engineering team.",
    strategicScope:
      "Advisory and hands-on principal architecture role focused on cross-platform modernization, performance optimization, and capability transfer.",
    achievements: [
      {
        category: "Architecture & Engineering",
        text: "Re-architected and migrated the UBA Mobile Banking application from Apache Cordova to Flutter, significantly improving runtime performance and codebase maintainability.",
      },
      {
        category: "Product Delivery",
        text: "Engineered push notification infrastructure and a comprehensive Personal Finance Management (PFM) feature.",
      },
      {
        category: "Strategy & Leadership",
        text: "Defined the target Flutter application architecture, coding standards, and mentored the internal mobile engineering team.",
      },
    ],
    technologies: [
      "Flutter",
      "Dart",
      "Android Native",
      "Clean Architecture",
      "Push Notifications",
      "PFM Analytics",
    ],
  },
  {
    id: "itg-solutions-lead",
    role: "Senior Mobile Developer · Acting Android Lead",
    organization: "ITG Solutions (Integrated Technology Group)",
    organizationTag: "Enterprise EdTech & Healthcare Platforms",
    location: "Amman / Cairo",
    period: "Nov 2017 – Mar 2019",
    durationHighlight: "1 Yr 5 Mos · Multi-Team Mobile Leadership",
    isDigitalFactoryRole: false,
    executiveHeadline:
      "Led Android and Flutter teams while restructuring and redeveloping large-scale education (EduWave) and healthcare (MedX Jordan) mobile platforms.",
    strategicScope:
      "Technical leadership across Android and early-stage Flutter engineering teams, focusing on architectural refactoring, reusable component libraries, and UX modernization.",
    achievements: [
      {
        category: "Product Delivery",
        text: "Restructured and redeveloped EduWave Higher Education, EduWave K-12, and the MedX Jordan medical application—elevating app performance and redesigning the user experience.",
      },
      {
        category: "Strategy & Leadership",
        text: "Led both the Android and Flutter teams, establishing code review practices and mentoring developers.",
      },
      {
        category: "Architecture & Engineering",
        text: "Architected and maintained high-performance, reusable Kotlin and Java modules shared across enterprise product lines.",
      },
    ],
    technologies: [
      "Kotlin",
      "Java",
      "Flutter",
      "Android SDK",
      "REST & SOAP",
      "XML (SAX, DOM)",
      "UX Redesign",
    ],
  },
  {
    id: "advicenode-engineer",
    role: "Software Engineer",
    organization: "Advicenode",
    organizationTag: "Automated WealthTech & Robo-Advisory",
    location: "Cairo, Egypt",
    period: "Oct 2016 – Oct 2017",
    durationHighlight: "1 Yr · Dynamic FinTech Platform Engineering",
    isDigitalFactoryRole: false,
    executiveHeadline:
      "Engineered the core Advicenode platform capable of dynamically generating white-label robo-advisor investment applications.",
    strategicScope:
      "Foundational FinTech engineering role building configurable wealth-advisory application generators.",
    achievements: [
      {
        category: "Architecture & Engineering",
        text: "Built the Advicenode platform that dynamically generated tailored robo-advisor applications, laying an early foundation in digital wealth and financial software architecture.",
      },
    ],
    technologies: [
      "Java",
      "Android",
      "JavaScript",
      "JSON / REST APIs",
      "Dynamic App Generation",
    ],
  },
];

export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: "layer-client",
    layerNumber: "LAYER 01",
    name: "Multi-Channel Client Experience & Design Systems",
    executiveThesis:
      "Strategic selection between Native (Kotlin/Swift) and Cross-Platform (Flutter Mobile & Web) based on product lifecycle, regulatory integration, and time-to-market—governed by a single architectural standard.",
    description:
      "In a multi-product Digital Factory delivering 8+ concurrent applications, client architecture cannot be ad-hoc. We enforce strict modular separation, dependency injection (Hilt/Dagger), reactive state management, and shared UI primitives across Android, iOS, and Web.",
    technologies: [
      "Android Native (Kotlin)",
      "iOS Native (Swift)",
      "Flutter (Mobile & Web)",
      "Dart",
      "TypeScript / JavaScript",
      "Hilt & Dagger DI",
    ],
    designPrinciples: [
      "Feature-modularized multi-repo & monorepo boundaries",
      "Unified design tokens across Retail, Corporate, and Vertical apps",
      "Strict offline-resilience & optimistic UI patterns",
    ],
    bankingUseCase:
      "Powers KIB Retail, KIB Corporate, KIB Aqari, KIB Invest, Paytally, WAGE, Warba Bank Mobile, and Fayez Admin (Flutter Web).",
  },
  {
    id: "layer-security",
    layerNumber: "LAYER 02",
    name: "Security Perimeter, Identity & Release Governance",
    executiveThesis:
      "In regulated Islamic and commercial banking, security and compliance are architectural invariants—embedded into every commit rather than bolted on before release.",
    description:
      "Every mobile and web client integrates defense-in-depth protections aligned with OWASP standards, national digital identity onboarding (PACI Mobile ID & digital signatures), biometric cryptographic binding, and auditable maker-checker corporate authorization.",
    technologies: [
      "OWASP Mobile & API Top 10",
      "PACI & E-Signature Integration",
      "Biometric KeyStore / Keychain",
      "Release Governance Gates",
      "Maker-Checker RBAC",
    ],
    designPrinciples: [
      "Zero-trust API communication & payload integrity",
      "Automated static analysis & security linting in CI",
      "Segregated environments with formal release promotion",
    ],
    bankingUseCase:
      "Enables 100% branchless digital onboarding in KIB Invest and multi-signatory corporate treasury approvals in KIB Corporate.",
  },
  {
    id: "layer-microservices",
    layerNumber: "LAYER 03",
    name: "Domain-Driven Microservices & Event-Driven Mesh",
    executiveThesis:
      "Decoupling high-velocity digital channels from legacy core banking monoliths through Domain-Driven Design (DDD), NestJS/Java microservices, and asynchronous event streaming.",
    description:
      "Digital banking ecosystems require high availability even when downstream core systems undergo maintenance. By modeling bounded contexts (Accounts, Payments, Real Estate, BNPL, BaaS Cards) with NestJS and Java EE connected via Kafka and RabbitMQ, squads deploy independently without cascading failures.",
    technologies: [
      "NestJS (Node.js / TypeScript)",
      "Java EE",
      "Apache Kafka",
      "RabbitMQ",
      "REST & SOAP Adapters",
      "Domain-Driven Design (DDD)",
      "SOLID & TDD",
    ],
    designPrinciples: [
      "Bounded context isolation per banking vertical",
      "Event-driven choreography via Kafka & RabbitMQ",
      "Anti-corruption layers (ACL) wrapping legacy SOAP/XML cores",
    ],
    bankingUseCase:
      "Orchestrates real-time WAMD payments, BIN Sponsorship card issuance for fintech partners, and Paytally 0%-profit financing workflows.",
  },
  {
    id: "layer-data",
    layerNumber: "LAYER 04",
    name: "Polyglot Persistence & High-Throughput Data Formats",
    executiveThesis:
      "Pairing the ACID guarantees of relational databases for financial ledgers with the schema agility of MongoDB for digital product catalogs, real estate listings, and customer journeys.",
    description:
      "Modern banking super-apps and marketplaces handle diverse workloads—from strict double-entry transaction audit trails to dynamic merchant catalogs (Paytally), property appraisal records (Aqari), and legacy XML (SAX/DOM) core banking messages.",
    technologies: [
      "Relational Databases (SQL)",
      "MongoDB (Document Store)",
      "JSON Schemas",
      "XML (SAX & DOM Parsers)",
      "C++ Native Modules",
    ],
    designPrinciples: [
      "Polyglot persistence matched to domain access patterns",
      "High-performance streaming XML/JSON parsing for core integration",
      "Strict data ownership per microservice domain",
    ],
    bankingUseCase:
      "Supports property appraisal records in KIB Aqari, merchant catalogs in BuyNow/Paytally, and core banking ledger synchronization.",
  },
  {
    id: "layer-devops",
    layerNumber: "LAYER 05",
    name: "Cloud-Native DevOps, Kubernetes & GitOps Delivery Spine",
    executiveThesis:
      "A Digital Factory is only as fast as its path to production. Automated CI/CD pipelines and declarative GitOps turn engineering strategy into repeatable daily execution.",
    description:
      "From pioneering Jenkins mobile CI/CD pipelines and Git branching governance at Warba Bank to scaling Kubernetes and Argo CD GitOps workflows at KIB, delivery automation ensures every squad ships tested, reproducible artifacts.",
    technologies: [
      "Kubernetes (K8s)",
      "Argo CD (GitOps)",
      "Jenkins CI/CD",
      "GitLab & Bitbucket",
      "Jira & Confluence",
      "Automated Testing (TDD)",
    ],
    designPrinciples: [
      "Declarative GitOps cluster state via Argo CD",
      "Standardized Git branching & release-train governance",
      "Automated build, test, and signing pipelines for iOS, Android & Microservices",
    ],
    bankingUseCase:
      "Governs continuous integration and release orchestration across 8+ concurrent product lines at KIB and the mobile chapter at Warba Bank.",
  },
];

export const LEADERSHIP_PRINCIPLES: LeadershipPrinciple[] = [
  {
    id: "factory-builder",
    number: "01",
    title: "Institutionalizing Digital Factories from Zero",
    subtitle: "From Outsourcing Dependency to In-House Engineering Sovereignty",
    narrative:
      "Many financial institutions struggle because they treat digital transformation as a series of vendor procurement projects. My methodology centers on building permanent internal engineering capability: defining the technology roadmap, hiring and structuring cross-platform chapters, codifying architectural standards, and establishing the CI/CD spine before scaling squad headcount.",
    evidenceFromCareer:
      "Proven twice in the Kuwaiti banking sector—first as a founding pillar of Warba Bank’s 'Al-Wateen' Digital Factory, and subsequently as Head of Digital Technology establishing and scaling KIB’s Digital Factory across 8+ product verticals.",
    keyPractices: [
      "Multi-year technology roadmap & stack definition",
      "In-house engineering capability & chapter establishment",
      "Reusable platform foundations across Retail, Corporate & BaaS",
    ],
  },
  {
    id: "architectural-pragmatism",
    number: "02",
    title: "Pragmatic Polyglot Architecture",
    subtitle: "Uniting Native Excellence, Flutter Velocity & Microservice Resilience",
    narrative:
      "Technology dogmatism slows organizations down. As an executive who has written production code across Kotlin, Swift, Dart/Flutter, NestJS/TypeScript, Java EE, and C++, I evaluate stacks through the lens of business durability, security, and team velocity—combining Native mobile where appropriate with Flutter across mobile and web, backed by event-driven microservices.",
    evidenceFromCareer:
      "Successfully governed mixed Native (Android/iOS) and Flutter codebases at KIB and Warba Bank, pioneered Flutter Web for Fayez Admin, and migrated UBA Mobile Banking from legacy Cordova to Flutter.",
    keyPractices: [
      "SOLID, Domain-Driven Design (DDD) & Clean Architecture",
      "Asynchronous event choreography with Kafka & RabbitMQ",
      "Seamless legacy modernization without business disruption",
    ],
  },
  {
    id: "release-governance",
    number: "03",
    title: "Release Governance as a Competitive Advantage",
    subtitle: "Shipping Faster in Regulated Banking Through Automation",
    narrative:
      "In banking, speed without governance creates operational risk, while governance without automation creates paralysis. By embedding OWASP security standards, Test-Driven Development (TDD), disciplined Git branching strategies, Jenkins CI/CD, and Argo CD / Kubernetes GitOps directly into the engineering workflow, compliance becomes automatic.",
    evidenceFromCareer:
      "Created the mobile chapter's Jenkins CI/CD pipelines and Git release-management strategy at Warba Bank, and scaled enterprise release governance across mobile, web, and backend microservices at KIB.",
    keyPractices: [
      "Automated Jenkins CI/CD & Argo CD GitOps pipelines",
      "Strict Git branching, peer review & release train governance",
      "OWASP security-by-design & TDD quality gates",
    ],
  },
  {
    id: "business-product-alignment",
    number: "04",
    title: "Translating Boardroom Strategy into New Revenue Ecosystems",
    subtitle: "Expanding the Bank Beyond Traditional Accounts",
    narrative:
      "Modern digital banking leadership requires thinking like a product strategist and commercial architect. Technology must not merely digitize existing forms—it must unlock entirely new customer segments, non-bank acquisition funnels, and B2B partnership models.",
    evidenceFromCareer:
      "Directed the technical delivery of Kuwait's first bank-led 0%-profit marketplace (Paytally), PropTech ecosystem (KIB Aqari), digital Shariah wealth manager (KIB Invest), Visa-Ready BIN Sponsorship BaaS platform, and gamified loyalty ecosystem (Fayez).",
    keyPractices: [
      "Embedded finance & BIN Sponsorship (BaaS / CaaS) enablement",
      "Vertical ecosystem expansion (PropTech, WealthTech, BNPL, Youth)",
      "Direct alignment between technical KPIs and institutional growth",
    ],
  },
];

export const SKILL_MATRIX = [
  {
    category: "Executive & Architectural Leadership",
    items: [
      "Digital Factory Establishment & Scaling",
      "Multi-Year Technology Roadmaps",
      "Enterprise & Solution Architecture",
      "Domain-Driven Design (DDD)",
      "Release Governance & Compliance",
      "Cross-Functional Squad & Chapter Leadership",
      "Banking-as-a-Service (BaaS) & BIN Sponsorship",
      "Legacy Platform Re-Architecture",
    ],
  },
  {
    category: "Mobile & Web Engineering",
    items: [
      "Android Native (Kotlin, Java)",
      "iOS Native (Swift)",
      "Flutter (iOS, Android & Web)",
      "Dart",
      "TypeScript / JavaScript",
      "Hilt & Dagger Dependency Injection",
      "Modular Design Systems",
      "C++ Native Interop",
    ],
  },
  {
    category: "Backend, Messaging & Data",
    items: [
      "NestJS & Node.js",
      "Java EE",
      "Microservices Architecture",
      "Apache Kafka",
      "RabbitMQ",
      "REST & SOAP Integrations",
      "MongoDB & Relational Databases",
      "JSON & XML (SAX, DOM)",
    ],
  },
  {
    category: "DevOps, Cloud & Engineering Practices",
    items: [
      "Kubernetes (K8s)",
      "Argo CD (GitOps)",
      "Jenkins CI/CD Automation",
      "OWASP Security Standards",
      "SOLID & Design Patterns",
      "Test-Driven Development (TDD)",
      "Git, GitLab & Bitbucket Governance",
      "Agile Delivery (Jira, Confluence)",
    ],
  },
];
