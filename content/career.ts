export type CareerEntry = {
  company: string;
  role: string;
  start: string;        // ISO yyyy-mm
  end: string;          // ISO yyyy-mm or "present"
  oneLine: string;
};

export const careerEntries: CareerEntry[] = [
  {
    company: "Trabian",
    role: "Senior Developer",
    start: "2021-07",
    end: "2026-02",
    oneLine:
      "Led full-stack development of WCAG-compliant fintech applications across 70+ financial institutions; integrated SSOs and third-party services via the Q2 SDK platform.",
  },
  {
    company: "Q2 Software",
    role: "Web Developer",
    start: "2011-10",
    end: "2021-07",
    oneLine:
      "Built and maintained accessibility-compliant web applications for financial institutions, served millions of end users; led the support queue with 90%+ satisfaction.",
  },
];
