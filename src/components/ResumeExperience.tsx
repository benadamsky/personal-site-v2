import { FC, ReactNode } from 'react';
import { DateRange, DateRangeProps } from './DateRange';

interface ExperienceItemProps {
  role: string;
  company: string;
  description?: string;
  start: DateRangeProps['start'];
  end: DateRangeProps['end'];
  children: ReactNode;
  experienceItemClassName?: string;
}

const ExperienceItem: FC<ExperienceItemProps> = ({
  role,
  company,
  description,
  start,
  end,
  children,
  experienceItemClassName = 'mb-1'
}) => (
  <div>
    <h5 className={`text-2xl font-semibold ${experienceItemClassName}`}>
      {role} — {company}
    </h5>
    {description && <p className="text-lg font-medium">{description}</p>}
    <DateRange start={start} end={end} />
    {children}
  </div>
);

interface ExperienceListProps {
  items: string[];
}

const ExperienceList: FC<ExperienceListProps> = ({ items }) => (
  <ul className="list-disc ml-4 mt-2 space-y-2">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

const experiences = [
  {
    role: 'Co-Founder, CTO',
    company: 'Ponder',
    description: 'A web3 social survey platform',
    start: 'Dec 2023',
    end: 'Present',
    items: []
  },
  {
    role: 'Software Engineer',
    company: 'Freeport',
    description: 'A web3 platform dedicated to simplifying fine art investing',
    start: 'Dec 2022',
    end: 'Apr 2024',
    items: [
      'Core engineer in the successful launch of a collection of Warhols that generated over $150,000 in revenue within the first 6 weeks',
      'Designed and delivered extensive platform features end-to-end, devised API routes and backend models, and optimized the analytics pipeline',
      'Engineered sophisticated UI elements in a virtual art gallery that seamlessly integrated tokenized real-world assets and NFTs',
      'Collaborated closely with the CEO and CTO to ideate and implement growth-oriented features, including high impact referral and collector programs'
    ]
  },
  {
    role: 'Freelance React Developer',
    company: 'Upwork',
    start: 'Dec 2018',
    end: 'Dec 2022',
    items: [
      'Provided freelance services to clients ranging from startups to enterprise-level businesses',
      'Achieved Top Rated status within the first year on the platform and Expert-Vetted shortly after, a distinction representing the top 1% of talent',
      'Conceptualized and architected dashboards, onboarding flows, landing pages, API integrations, and fully responsive interfaces for web and native apps',
      'Authored industry-spanning web and brand copy for businesses, including high profile clients such as Lyft and Carnival Cruise Line'
    ]
  },
  {
    role: 'Co-Founder, COO',
    company: 'Kettle',
    description: 'Online events built for communities',
    start: 'May 2021',
    end: 'Jul 2022',
    items: [
      'Oversaw product development from ideation to launch, guided MVP iterations, and coordinated user feedback to refine onboarding processes',
      'Directly oversaw 4 software engineers in a rapid decision-making environment',
      'Developed advanced virtual event software that supported real-time activities'
    ]
  },
  {
    role: 'Founding Software Engineer',
    company: 'Branch',
    description: 'An immersive virtual HQ for remote teams',
    start: 'Apr 2020',
    end: 'Jan 2021',
    items: [
      'Developed innovative peer-to-peer spatial audio solutions for virtual offices in a dynamic, venture-backed tech startup',
      'Part of the core team responsible for an MVP that secured $15.5M in funding from investors such as Naval Ravikant, Sahil Lavingia, and Homebrew',
      'Played a key role in making major architectural decisions of the core app and custom style library'
    ]
  },
  {
    role: 'Co-Founder, Director of Operations',
    company: 'Konjure',
    description: 'A decentralized website builder',
    start: 'May 2018',
    end: 'Dec 2019',
    items: [
      'Developed a peer-to-peer website builder that reached finalist status in multiple accelerator programs',
      'Contributed to the tokenomics of the KONJ token and aided in the development of a desktop app for running validator nodes hosted on IPFS',
      'Recruited for and represented the company at numerous blockchain events in NYC and SF'
    ]
  },
  {
    role: 'Web & Game Developer',
    company: 'Self-Employed',
    start: 'Feb 2014',
    end: 'Sep 2016',
    items: [
      'Developed websites, configured game servers, and developed game plugins as side income while attending high school',
      'Contributed to several bootstrapped game and web hosting companies, collectively serving thousands of users, later bought out by industry-leading competitors'
    ]
  }
];

const ResumeExperience: FC = () => (
  <div>
    <h2 className="text-4xl font-semibold mb-3">Experience</h2>
    <div className="space-y-8">
      {experiences.map(({ role, company, description, start, end, items }) => (
        <ExperienceItem
          key={role + company}
          role={role}
          company={company}
          description={description}
          start={start}
          end={end}
        >
          {items.length > 0 && <ExperienceList items={items} />}
        </ExperienceItem>
      ))}
    </div>
  </div>
);

export default ResumeExperience;
