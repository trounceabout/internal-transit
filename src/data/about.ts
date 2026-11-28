// about.ts — the copy and structure for the About page, kept out of the markup
// so it's easy to edit without touching layout code.

export const intro = {
  lead: "I'm a design engineer in Rock Hill, SC. I started out designing directly in code, so I care as much about how something works as how it looks.",
  body: "I like turning tangled systems into things that feel obvious to use: clearer status, fewer dead ends, and interfaces that explain themselves.",
};

// The quick-facts rows under the intro. `value` is shown uppercase.
export const facts = {
  role: "Design engineer / Product Designer",
  basedIn: "Rock Hill, SC",
  focus:
    "Product framing / UX strategy / Interface design / Systems thinking / Engineering collaboration",
};

export const howIWork = [
  {
    title: "Start with the system",
    body: "Before drawing screens, I map the underlying model: what exists, what changes, and what people need to know about it.",
  },
  {
    title: "Stay close to engineering",
    body: "I design with the build in mind and work alongside engineers early, so what ships matches what was intended.",
  },
  {
    title: "Make it legible",
    body: "Clear beats clever. If an interface needs explaining, I keep working on it until it doesn’t.",
  },
];

export interface Role {
  dates: string;
  title: string;
  description?: string;
  // Case studies tied to this role. `slug` is the project's content id; the
  // name, icon, and colors come from the projects collection, `tagline` is the
  // shorter line shown in this list.
  projects?: { slug: string; tagline: string }[];
}

export interface Company {
  name: string;
  // Time spent at the company, shown in the left column.
  tenure: string;
  // Optional path to a logo image in /public (square, shown in a 40px tile).
  // Without one the tile shows the company's first letter.
  logo?: string;
  // Optional pixel-cornered tile shape drawn behind the logo (also in /public).
  tile?: string;
  roles: Role[];
}

export const workHistory: Company[] = [
  {
    name: "Nexcess (Liquid Web)",
    tenure: "4 yrs",
    logo: "/about/logo-nexcess.svg",
    tile: "/about/tile-nexcess.svg",
    roles: [
      {
        dates: "Apr 2025 – Present",
        title: "Senior Product Designer",
        description:
          "Scaling Undercurrent, our internal design system, and leading end-to-end redesigns of core portal surfaces across server and account management.",
        projects: [
          {
            slug: "ping",
            tagline: "Rethinking how users know what’s going on",
          },
          {
            slug: "watchtower",
            tagline: "Turning empty signals into useful info",
          },
        ],
      },
      {
        dates: "Feb 2024 – Apr 2025",
        title: "UI Design Lead",
        description:
          "Built the foundation of Undercurrent and led UX for a new configuration and checkout experience, plus portal navigation and server management.",
        projects: [
          {
            slug: "undercurrent",
            tagline: "A unified experience underneath it all",
          },
        ],
      },
      {
        dates: "Jul 2023 – Feb 2024",
        title: "Design Team Lead",
        description:
          "Managed two visual designers on the marketing team and coordinated design requests across departments.",
      },
      {
        dates: "Jul 2022 – May 2023",
        title: "Digital Designer",
      },
    ],
  },
  {
    name: "University of South Carolina Aiken",
    tenure: "8.5 yrs",
    logo: "/about/logo-usc.svg",
    tile: "/about/tile-usc.svg",
    roles: [
      {
        dates: "Mar 2021 – Jun 2022",
        title: "Web Manager",
        description:
          "Led selection of a new CMS and the migration of a 3,000+ page website, and built project management systems in Notion.",
      },
      {
        dates: "Aug 2013 – Mar 2021",
        title: "Assistant Director of Athletic Communication",
        description:
          "Produced 400–500 videos a year, served as lead designer for Athletics, and sat on the university rebranding committee.",
      },
    ],
  },
];

// Anchors for the About page's side nav, in page order.
export const sections = [
  { id: "about-me", label: "About me" },
  { id: "how-i-work", label: "How I work" },
  { id: "work-history", label: "Work history" },
  { id: "elsewhere", label: "Elsewhere" },
];
