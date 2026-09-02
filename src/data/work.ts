export interface Job {
  company: string;
  role: string;
  years: string;
  line: string;
  url?: string;
}

// Now: what is on the monitor.
export const now = {
  company: 'Ponder',
  project: 'Dreamwork',
  url: 'https://dreamwork.ai',
  // TODO(ben): rewrite in your voice.
  lines: [
    'Dreamwork is an agent-first job search platform. Co-founder and CTO since December 2023.',
    'Most days are spent on the agent runtime, the matching pipeline, and the parts of the product that make a job hunt feel less like a second job.'
  ]
};

// Then: the sheet in the desk drawer. One sentence each, oldest last.
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
