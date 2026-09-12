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
  /** Resume bullets. */
  bullets: string[];
  url?: string;
}

// Now: what is on the monitor.
export const now = {
  company: 'Dreamwork',
  project: 'Dreamwork',
  role: 'Co-founder, CTO',
  dates: '2026 - now',
  url: 'https://dreamwork.ai',
  blurb: 'An agent-first job search platform',
  // TODO(ben): rewrite in your voice.
  lines: [
    'Dreamwork is an agent-first job search platform. I am the co-founder and CTO.',
    'Most days are spent on the agent runtime, the matching pipeline, and the parts of the product that make a job hunt feel less like a second job.'
  ]
};

// Then: the sheet pinned to the board. One sentence each, oldest last.
export const history: Job[] = [
  {
    company: 'Ponder',
    role: 'Co-founder, CTO',
    years: '2023 to 2026',
    dates: 'Dec 2023 - 2026',
    url: 'https://weponder.io',
    line: 'Social surveys and prediction games on Farcaster. Over 100,000 users; the prediction game took 590,000 on-chain votes.',
    blurb: 'Social surveys and prediction games on Farcaster',
    // The vote, voter, and wallet figures are from PostHog (live SDK data,
    // Jun 2025 to Feb 2026). The 100,000 users figure is Ben's and Colin's.
    bullets: [
      'Grew to over 100,000 users on Farcaster',
      'Built the prediction game: 590,000 on-chain votes from 21,000 voters, with 42,000 wallets set up through the app'
    ]
  },
  {
    company: 'Freeport',
    role: 'Software engineer',
    years: '2022 to 2024',
    dates: 'Dec 2022 - Apr 2024',
    line: 'Fractional fine art. Built the launch that sold a collection of Warhols in six weeks, and the virtual gallery that hung them.',
    blurb: 'A platform for fractional fine art investing',
    bullets: [
      'Core engineer on the launch of a collection of Warhols that generated over $150,000 in revenue within the first six weeks',
      'Designed and delivered platform features end-to-end: API routes, backend models, and the analytics pipeline',
      'Built the virtual art gallery that hung tokenized real-world assets alongside NFTs',
      'Worked with the CEO and CTO on growth features, including the referral and collector programs'
    ]
  },
  {
    company: 'Upwork',
    role: 'Freelance React developer',
    years: '2018 to 2022',
    dates: 'Dec 2018 - Dec 2022',
    line: 'Four years of dashboards, onboarding flows, and interfaces for clients from seed stage to Lyft and Carnival.',
    bullets: [
      'Freelanced for clients from seed-stage startups to enterprises',
      'Top Rated within the first year, then Expert-Vetted, a distinction for the top 1% of talent on the platform',
      'Designed and built dashboards, onboarding flows, landing pages, API integrations, and responsive interfaces for web and native apps',
      'Wrote web and brand copy for businesses, including Lyft and Carnival Cruise Line'
    ]
  },
  {
    company: 'Kettle',
    role: 'Co-founder, COO',
    years: '2021 to 2022',
    dates: 'May 2021 - Jul 2022',
    line: 'Online events built for communities. Ran product from idea to launch with a team of four engineers.',
    blurb: 'Online events built for communities',
    bullets: [
      'Ran product from idea to launch: MVP iterations, user feedback, and the onboarding flow',
      'Managed four software engineers',
      'Built virtual event software with real-time activities'
    ]
  },
  {
    company: 'Branch',
    role: 'Founding engineer',
    years: '2020 to 2021',
    dates: 'Apr 2020 - Jan 2021',
    line: 'A virtual HQ for remote teams. Peer-to-peer spatial audio, and the MVP that raised $15.5M.',
    blurb: 'An immersive virtual HQ for remote teams',
    bullets: [
      'Built peer-to-peer spatial audio for virtual offices',
      'Part of the core team behind the MVP that raised $15.5M from investors including Naval Ravikant, Sahil Lavingia, and Homebrew',
      'Made the major architectural decisions for the core app and the custom style library'
    ]
  },
  {
    company: 'Konjure',
    role: 'Co-founder',
    years: '2018 to 2019',
    dates: 'May 2018 - Dec 2019',
    line: 'A decentralized website builder on IPFS. Finalist in several accelerators.',
    blurb: 'A decentralized website builder',
    bullets: [
      'Built a peer-to-peer website builder that reached finalist status in multiple accelerator programs',
      'Contributed to the tokenomics of the KONJ token and to a desktop app for running validator nodes on IPFS',
      'Recruited for and represented the company at blockchain events in NYC and SF'
    ]
  },
  {
    company: 'Self-employed',
    role: 'Web and game developer',
    years: '2014 to 2016',
    dates: 'Feb 2014 - Sep 2016',
    line: 'Websites, game servers, and plugins for bootstrapped hosts, as side income in high school.',
    bullets: [
      'Built websites, configured game servers, and wrote game plugins as side income during high school',
      'Contributed to several bootstrapped game and web hosting companies serving thousands of users, later bought out by larger competitors'
    ]
  }
];

export const skills = [
  'TypeScript, JavaScript',
  'React, Next.js, Node.js',
  'PostgreSQL, Prisma',
  'REST APIs, webhooks',
  'HTML, CSS',
  'Vercel, AWS'
];

export const education = {
  school: 'Rutgers, The State University of New Jersey, New Brunswick',
  line: 'Coursework toward a B.S. in Computer Science',
  dates: 'Sep 2016 - Jun 2018'
};

export const projects = [
  {
    name: 'Surveycaster',
    line: 'Open source bot for driving engagement on Farcaster',
    url: 'https://github.com/benadamsky/surveycaster'
  },
  {
    name: 'Libs vs Cons',
    line: 'A satirical card game that debuted on Kickstarter',
    url: 'https://www.kickstarter.com/projects/kaimicahmills/libs-vs-cons-a-card-game-about-political-stereotyp'
  }
];
