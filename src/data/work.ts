export interface Job {
  company: string;
  role: string;
  /** Short span for the sheet on the pinboard, e.g. "2022 to 2024". */
  years: string;
  /** Full span for the resume, e.g. "Dec 2022 - Apr 2024". */
  dates: string;
  /** One sentence for the pinboard. */
  line: string;
  /** What the company is, for the resume. */
  blurb?: string;
  /** Resume-only bullets that add to `line`, not repeat it. Short. */
  bullets: string[];
  url?: string;
}

// Now: what is on the monitor.
export const now = {
  company: 'Dreamwork',
  project: 'Dreamwork',
  role: 'Co-founder, CTO',
  dates: '2026 - now',
  url: 'https://www.dreamworkhq.com',
  blurb: "A job search that doesn't hate you",
  lines: ["A job search that doesn't hate you.", 'Co-founder + CTO, 2026 to now.']
};

// Then: the sheet pinned to the board. One sentence each, oldest last.
export const history: Job[] = [
  {
    company: 'Ponder',
    role: 'Co-founder, CTO',
    years: '2023 to 2026',
    dates: 'Dec 2023 - 2026',
    line: 'Social surveys and prediction games on Farcaster. 100k+ users, 590k on-chain votes.',
    blurb: 'Social surveys and prediction games on Farcaster',
    // Votes, voters, and wallets are from PostHog (live SDK data, Jun 2025 to
    // Feb 2026). The 100k users figure is Ben's and Colin's.
    bullets: ['590k on-chain votes from 21k people, 42k wallets set up in-app']
  },
  {
    company: 'Freeport',
    role: 'Software engineer',
    years: '2022 to 2024',
    dates: 'Dec 2022 - Apr 2024',
    line: 'Fractional fine art. Built the launch that sold a collection of Warhols in six weeks, and the virtual gallery that hung them.',
    blurb: 'Fractional fine art',
    bullets: [
      'The Warhol launch did $150k+ in its first six weeks',
      'Platform features end to end: API routes, backend models, the analytics pipeline',
      'Growth work w/ the CEO + CTO: referrals, collector programs'
    ]
  },
  {
    company: 'Upwork',
    role: 'Freelance React developer',
    years: '2018 to 2022',
    dates: 'Dec 2018 - Dec 2022',
    line: 'Four years of dashboards, onboarding flows, and interfaces for startups through enterprises, plus web and brand copy for clients like Lyft and Carnival.',
    bullets: [
      'Top Rated in year one, Expert-Vetted after that (top 1% on the platform)',
      'Dashboards, onboarding flows, landing pages, API integrations, and responsive interfaces for web and native apps',
      'Web and brand copy for businesses, including Lyft and Carnival Cruise Line'
    ]
  },
  {
    company: 'Kettle',
    role: 'Co-founder, COO',
    years: '2021 to 2022',
    dates: 'May 2021 - Jul 2022',
    line: 'Online events built for communities. Ran product from idea to launch with a team of four engineers.',
    blurb: 'Online events for communities',
    bullets: ['Built virtual event software with real-time activities']
  },
  {
    company: 'Branch',
    role: 'Founding engineer',
    years: '2020 to 2021',
    dates: 'Apr 2020 - Jan 2021',
    line: 'A virtual HQ for remote teams. Peer-to-peer spatial audio, and the MVP that raised $15.5M.',
    blurb: 'A virtual HQ for remote teams',
    bullets: [
      'Core team on the MVP that raised $15.5M (Naval Ravikant, Sahil Lavingia, Homebrew)',
      'Major architectural decisions for the core app and the custom style library'
    ]
  },
  {
    company: 'Konjure',
    role: 'Co-founder, Director of Operations',
    years: '2018 to 2019',
    dates: 'May 2018 - Dec 2019',
    line: 'A decentralized website builder on IPFS. Finalist in several accelerators.',
    blurb: 'A decentralized website builder on IPFS',
    bullets: [
      'KONJ tokenomics + a desktop app for running validator nodes on IPFS',
      'Recruited for and represented the company at blockchain events in NYC and SF'
    ]
  },
  {
    company: 'Self-employed',
    role: 'Web and game developer',
    years: '2014 to 2016',
    dates: 'Feb 2014 - Sep 2016',
    line: 'Websites, game servers, and plugins for bootstrapped hosts, as side income in high school.',
    bullets: ['Those hosts served thousands of users and were later bought out by bigger competitors']
  }
];

export const education = {
  school: 'Rutgers, New Brunswick',
  line: 'Coursework toward a B.S. in Computer Science',
  dates: 'Sep 2016 - Jun 2018'
};

export const projects = [
  {
    name: 'Cryo Protocol Atlas',
    line: 'Literature pipeline that picks the next cryopreservation experiment worth running',
    url: 'https://github.com/benadamsky/cryo-protocol-atlas'
  },
  {
    name: 'Tech Internships 2027',
    line: 'US tech internships for 2026 to 2027, updated daily on GitHub',
    url: 'https://github.com/dreamworkhq/Tech-Internships-2027'
  },
  {
    name: 'Libs vs Cons',
    line: 'A satirical card game, launched on Kickstarter',
    url: 'https://www.kickstarter.com/projects/kaimicahmills/libs-vs-cons-a-card-game-about-political-stereotyp'
  }
];
