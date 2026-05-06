export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Link = { label: string; href: string };

export type DrupalSite = {
  name: string;
  thumbnail: string;       // path under /public, e.g. "/projects/drupal/cbtwaco.webp"
  liveUrl?: string;        // present → linked; absent → inert
  note?: string;
};

export type ProjectDetail =
  | { kind: "drupal"; sites: DrupalSite[] }
  | { kind: "capabilities"; capabilities: string[] }
  | { kind: "simple" };

export type Project = {
  id: "drupal-cluster" | "q2-sdk" | "road-trip-planner";
  title: string;
  role: string;
  timeframe: string;
  summary: string;
  tags: string[];
  images: ProjectImage[];
  links: Link[];
  detail?: ProjectDetail;
};

export const projects: Project[] = [
  {
    id: "drupal-cluster",
    title: "Drupal Sites",
    role: "Senior Developer / Theme & Module Author",
    timeframe: "2011 – 2026",
    summary:
      "More than ten years building Drupal sites for financial institutions — custom modules, migration assistance, design-system implementation, and close collaboration with external designers.",
    tags: ["Drupal 7/8/9/10", "PHP", "Twig", "JavaScript", "SCSS"],
    images: [],
    links: [],
    detail: {
      kind: "drupal",
      sites: [
        {
          name: "CBT Waco",
          thumbnail: "/projects/drupal/cbtwaco.webp",
          liveUrl: "https://www.cbtwaco.bank/",
          note: "Customized template site",
        },
        {
          name: "Founders FCU",
          thumbnail: "/projects/drupal/founders.webp",
          liveUrl: "https://www.foundersfcu.com/",
          note: "Custom modules + migration",
        },
        {
          name: "Founders Insurance",
          thumbnail: "/projects/drupal/founders-insurance.webp",
          liveUrl: "https://www.foundersfcuinsurance.com/",
        },
        {
          name: "Founders Wealth",
          thumbnail: "/projects/drupal/founders-wealth.webp",
          liveUrl: "https://www.wealthmanagementatfounders.com/",
        },
        {
          name: "Verity CU",
          thumbnail: "/projects/drupal/verity.webp",
          liveUrl: "https://www.veritycu.com/",
          note: "Implemented third-party design",
        },
      ],
    },
  },
  {
    id: "q2-sdk",
    title: "Q2 SDK Work",
    role: "Senior Developer",
    timeframe: "2021 – 2026",
    summary:
      "Architected and integrated complex third-party applications and SSO solutions into online banking environments via the Q2 SDK platform — REST/SOAP, modern auth, and a wide range of capabilities. Client names withheld.",
    tags: ["React", "TypeScript", "Tailwind", "Python", "Q2 SDK", "REST/SOAP"],
    images: [],
    links: [],
    detail: {
      kind: "capabilities",
      capabilities: [
        "Member-to-member transfer & management application",
        "FX international wire transfers",
        "B2B API integration",
        "Q2 prepaid card flows",
        "Multiple third-party chat integrations",
        "Multiple SSO integrations",
      ],
    },
  },
  {
    id: "road-trip-planner",
    title: "Road Trip Planner",
    role: "Solo project",
    timeframe: "2025 – present",
    summary:
      "Personal experiment in AI-assisted trip planning. Generates routes, finds stops, and turns a vague weekend idea into something you can actually execute.",
    tags: ["Next.js", "TypeScript", "AI"],
    images: [],
    links: [],
    detail: { kind: "simple" },
  },
];
