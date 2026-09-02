export interface Job {
  role: string;
  company: string;
  tagline?: string;
  start: string;
  end: string;
  notes: string[];
}

export const jobs: Job[] = [
  {
    role: 'Co-Founder, CTO',
    company: 'Ponder',
    tagline: 'Dreamwork, an agent-first job search platform',
    start: 'Dec 2023',
    end: 'Present',
    notes: []
  },
  {
    role: 'Software Engineer',
    company: 'Freeport',
    tagline: 'Fractional fine art investing',
    start: 'Dec 2022',
    end: 'Apr 2024',
    notes: [
      'Core engineer on a Warhol collection launch that did over $150k in its first six weeks',
      'Shipped features end to end: API routes, backend models, analytics pipeline',
      'Built the interactive pieces of a virtual gallery mixing tokenized real-world art and NFTs',
      'Worked directly with the CEO and CTO on referral and collector programs'
    ]
  },
  {
    role: 'Freelance React Developer',
    company: 'Upwork',
    start: 'Dec 2018',
    end: 'Dec 2022',
    notes: [
      'Clients from seed-stage startups to enterprise',
      'Top Rated in year one, Expert-Vetted shortly after (top 1% on the platform)',
      'Dashboards, onboarding flows, landing pages, API integrations, web and native UIs',
      'Wrote web and brand copy for clients including Lyft and Carnival Cruise Line'
    ]
  },
  {
    role: 'Co-Founder, COO',
    company: 'Kettle',
    tagline: 'Online events built for communities',
    start: 'May 2021',
    end: 'Jul 2022',
    notes: [
      'Ran product from idea to launch and through MVP iterations',
      'Managed four engineers',
      'Real-time virtual event software'
    ]
  },
  {
    role: 'Founding Software Engineer',
    company: 'Branch',
    tagline: 'A virtual HQ for remote teams',
    start: 'Apr 2020',
    end: 'Jan 2021',
    notes: [
      'Peer-to-peer spatial audio for virtual offices',
      'Core team on the MVP that raised $15.5M from Naval Ravikant, Sahil Lavingia, and Homebrew',
      'Architecture of the core app and the style library'
    ]
  },
  {
    role: 'Co-Founder, Director of Operations',
    company: 'Konjure',
    tagline: 'A decentralized website builder',
    start: 'May 2018',
    end: 'Dec 2019',
    notes: [
      'Peer-to-peer website builder, finalist in multiple accelerators',
      'Tokenomics for KONJ and a desktop app for IPFS validator nodes',
      'Represented the company at blockchain events in NYC and SF'
    ]
  },
  {
    role: 'Web & Game Developer',
    company: 'Self-employed',
    start: 'Feb 2014',
    end: 'Sep 2016',
    notes: [
      'Websites, game servers, and game plugins as side income in high school',
      'Contributed to bootstrapped game and web hosts serving thousands of users, later acquired'
    ]
  }
];
