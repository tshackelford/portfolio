export type CareerEntry = {
  company: string;
  /** Roles held at this company, most recent first. */
  roles: string[];
  start: string;        // ISO yyyy-mm
  end: string;          // ISO yyyy-mm or "present"
  oneLine: string;
};

export const careerEntries: CareerEntry[] = [
  {
    company: "Trabian",
    roles: ["Senior Developer"],
    start: "2021-07",
    end: "2026-02",
    oneLine:
      "Worked across both Drupal and the Q2 SDK platform at Trabian, building accessible web experiences and member-facing banking products for financial institutions. Owned projects end to end and helped wherever the team needed depth, from architecture to the last accessibility detail.",
  },
  {
    company: "Q2 Software",
    roles: ["Senior Web Developer", "Web Developer"],
    start: "2011-10",
    end: "2021-07",
    oneLine:
      "Delivered a wide range of front-end work for financial institutions, from marketing websites and online banking themes to third-party integrations and whatever the next priority demanded. Ran the team's support queue at 90%+ satisfaction and gladly served as the go-to liaison for other teams.",
  },
];
