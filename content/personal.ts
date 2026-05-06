export type PersonalTopic = {
  id: "travel" | "gardening" | "camping";
  title: string;
  body: string;
};

export const heroTagline =
  "Quietly building accessible, high-performance web applications. Thirteen years in fintech and counting.";

export const aboutBody = [
  "I've spent thirteen years building software for financial institutions — the kind of work where small details matter to a lot of people. Lately I'm focused on React and TypeScript, design systems, and the quiet craft of making complex tools feel obvious.",
  "I care about accessibility, mentorship, and writing code that the next person can change without fear. I've led documentation initiatives, mentored junior engineers, and worked closely with designers and product partners to ship work I'm proud of.",
];

export const personalTopics: PersonalTopic[] = [
  {
    id: "travel",
    title: "Travel",
    body: "I keep a running list of places I want to see and slowly cross them off. Mountains, deserts, and the long drives in between are usually involved.",
  },
  {
    id: "gardening",
    title: "Gardening",
    body: "A backyard project that became a habit. I like the patience of it, and the small wins of something growing because you paid attention.",
  },
  {
    id: "camping",
    title: "Camping",
    body: "Tents, fires, no cell service. The kind of weekend that makes Monday feel survivable.",
  },
];
