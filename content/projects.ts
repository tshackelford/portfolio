export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Link = { label: string; href: string };

export type DrupalSite = {
  name: string;
  thumbnail: string;       // path under /public, e.g. "/projects/drupal/cbtwaco.jpg"
  liveUrl?: string;        // present → linked; absent → inert
};

export type ProjectDetail =
  | { kind: "drupal"; sites: DrupalSite[] }
  | { kind: "capabilities"; capabilities: string[] }
  | { kind: "simple" };

export type Project = {
  id: "drupal-cluster" | "digital-banking" | "road-trip-planner";
  title: string;
  role?: string;
  timeframe: string;
  summary: string;
  tags: string[];
  images: ProjectImage[];
  links: Link[];
  detail?: ProjectDetail;
};

export const projects: Project[] = [
  {
    id: "digital-banking",
    title: "Digital Banking Products",
    role: "Senior Developer",
    timeframe: "2021 – 2026",
    summary:
      "Building member-facing products on the Q2 digital banking platform - spanning SSO and chat integrations to custom forms, dashboards, and workflows offered to hundreds of financial institutions, with a focus on UX and accessibility.",
    tags: ["React", "TypeScript", "Tailwind", "Python", "Q2 SDK", "REST/SOAP", "SSO"],
    images: [],
    links: [],
    detail: {
      kind: "capabilities",
      capabilities: [
        "Member-to-member transfer & management application",
        "FX international wire transfers",
        "SDK Marketplace products",
        "Prepaid Card Activation Workflows",
        "Third-party chat integrations",
        "Multiple SSO integrations",
      ],
    },
  },{
    id: "drupal-cluster",
    title: "Drupal Development",
    role: "Senior Web Developer",
    timeframe: "2015 – 2026",
    summary:
      "More than ten years building custom and templated Drupal sites for financial institutions, while working with a team to maintain an in-house built Drupal based product. Custom modules, migration assistance, re-usable solutions, and a focus on web accessibility compliance. ",
    tags: ["Drupal 7/8/9/10", "PHP", "Twig", "JavaScript", "SCSS", "MySQL"],
    images: [],
    links: [],
    detail: {
      kind: "drupal",
      sites: [
        {
          name: "CBT Waco",
          thumbnail: "/projects/drupal/cbtwaco.jpg",
          liveUrl: "https://www.cbtwaco.bank/",
        },
        {
          name: "Founders FCU",
          thumbnail: "/projects/drupal/founders.jpg",
          liveUrl: "https://www.foundersfcu.com/",
        },
        {
          name: "Verity CU",
          thumbnail: "/projects/drupal/verity.jpg",
          liveUrl: "https://www.veritycu.com/",
        },
      ],
    },
  },
  {
    id: "road-trip-planner",
    title: "Road Trip Planner",
    role: "Personal project",
    timeframe: "2025 – present",
    summary:
      "A trip planner my wife and I actually wanted to use, and my testbed for building a complete product with modern AI tooling. Create trips and add stops, and it generates routes, drive times, and map pins from Mapbox and Google Places data. Full-stack build with authentication, a Postgres database, photo uploads, and an offline mode for life without signal on the road.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Prisma", "PostgreSQL", "NextAuth", "Mapbox", "Google Places", "AWS S3", "Vitest" ],
    images: [
      {
        src: "/projects/road-trip-planner/road_trip_planner_map.png",
        alt: "Day-by-day itinerary panel alongside a map of Scotland with routed pins.",
        width: 1260,
        height: 826,
      },
      {
        src: "/projects/road-trip-planner/road_trip_planner_stops.png",
        alt: "Stop detail view showing arrival/departure times, drive distance, and quick links to maps.",
        width: 693,
        height: 483,
      },
    ],
    links: [
      { label: "Visit the site", href: "https://road-trip-planner-iota.vercel.app/" },
    ],
    detail: { kind: "simple" },
  },
];
