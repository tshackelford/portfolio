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
    title: "Drupal Development",
    role: "Senior Developer",
    timeframe: "2015 – 2026",
    summary:
      "More than ten years building custom and templated Drupal sites for financial institutions, while working with a team to maintain an in-house built Drupal based product. Custom modules, migration assistance, re-usable solutions, and a focus on web accessibility compliance.",
    tags: ["Drupal 7/8/9/10", "PHP", "Twig", "JavaScript", "SCSS"],
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
          name: "Founders Insurance",
          thumbnail: "/projects/drupal/founders-insurance.jpg",
          liveUrl: "https://www.foundersfcuinsurance.com/",
        },
        {
          name: "Founders Wealth",
          thumbnail: "/projects/drupal/founders-wealth.jpg",
          liveUrl: "https://www.wealthmanagementatfounders.com/",
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
    id: "q2-sdk",
    title: "Q2 SDK Work",
    role: "Senior Developer",
    timeframe: "2021 – 2026",
    summary:
      "Building custom solutions on behalf of FIs and vendors via the Q2 SDK platform. From basic 3rd party chat integrations to online banking user facing forms and dashboards to marketplace products offered to hundreds of FIs, we ",
    tags: ["React", "TypeScript", "Tailwind", "Python", "Q2 SDK", "REST/SOAP"],
    images: [],
    links: [],
    detail: {
      kind: "capabilities",
      capabilities: [
        "Member-to-member transfer & management application",
        "FX international wire transfers",
        "SDK Marketplace products",
        "Q2 Prepaid Cards",
        "Third-party chat integrations",
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
      "A personal project to build something I'd thought about for ages, while doubling as a test for modern AI tooling. A road trip planner that my wife and I had complete control of, while also being free, seemed like a great way to iterate on my work in the future towards something I enjoy. Register a new user, create trips, add stops, and watch it generate the routes, times, and map pins. Image upload and sharing features were also built as a way for us to remember these trips.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Claude Code"],
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
