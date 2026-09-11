export interface Job {
  company: string;
  role: string;
  years: string;
  line: string;
  url?: string;
}

export const projects = [
  {
    id: 'dreamwork',
    name: 'dreamwork',
    phase: 'building now',
    role: 'co-founder & cto',
    url: 'https://www.dreamworkhq.com',
    lines: [
      'currently getting people jobs.',
      'i build the systems that find good roles and match them to the right people. less time job hunting, more time on whatever comes next.'
    ],
    links: [
      { label: 'the hiring index', url: 'https://www.dreamworkhq.com/research' }
    ]
  },
  {
    id: 'ponder',
    name: 'ponder',
    phase: 'previously',
    role: 'co-founder & cto',
    url: 'https://ponder.social',
    lines: [
      'surveys and social prediction games on farcaster. a product built around figuring out what everyone else thinks.',
      // Lifetime audience supplied by Ben; the payout is the narrower game-era
      // figure in Colin's December 2025 public retrospective. Keep them distinct.
      'we reached hundreds of thousands of people across ponder. the prediction game alone paid out more than $500,000 between players.'
    ],
    links: [
      { label: 'a look back', url: 'https://farcaster.xyz/cojo.eth/0x1955533a' }
    ]
  }
] as const;

// Earlier roles. Shared by the pinboard and the plain HTML page.
export const history: Job[] = [
  {
    company: 'Freeport',
    role: 'Software engineer',
    years: '2022 to 2024',
    line: 'Fractional fine art. Built the launch that sold a collection of Warhols in six weeks, and the virtual gallery that hung them.'
  },
  {
    company: 'Upwork',
    role: 'Freelance React developer',
    years: '2018 to 2022',
    line: 'Four years of dashboards, onboarding flows, and interfaces for clients from seed stage to Lyft and Carnival.'
  },
  {
    company: 'Kettle',
    role: 'Co-founder, COO',
    years: '2021 to 2022',
    line: 'Online events built for communities. Ran product from idea to launch with a team of four engineers.'
  },
  {
    company: 'Branch',
    role: 'Founding engineer',
    years: '2020 to 2021',
    line: 'A virtual HQ for remote teams. Peer-to-peer spatial audio, and the MVP that raised $15.5M.'
  },
  {
    company: 'Konjure',
    role: 'Co-founder',
    years: '2018 to 2019',
    line: 'A decentralized website builder on IPFS. Finalist in several accelerators.'
  },
  {
    company: 'Self-employed',
    role: 'Web and game developer',
    years: '2014 to 2016',
    line: 'Websites, game servers, and plugins for bootstrapped hosts, as side income in high school.'
  }
];
