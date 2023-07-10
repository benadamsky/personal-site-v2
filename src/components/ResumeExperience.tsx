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
}) => {
  return (
    <div>
      <h5 className={`text-2xl font-semibold ${experienceItemClassName}`}>
        {role} — {company}
      </h5>
      {description && <p className="text-lg font-medium">{description}</p>}
      <DateRange start={start} end={end} />
      {children}
    </div>
  );
};

interface ExperienceListProps {
  children: ReactNode;
}

const ExperienceList: FC<ExperienceListProps> = ({ children }) => {
  return <ul className="list-disc ml-4 mt-2 space-y-2">{children}</ul>;
};

const ResumeExperience = () => {
  return (
    <div>
      <h2 className="text-4xl font-semibold mb-8">Experience</h2>
      <div className="space-y-8">
        <ExperienceItem
          role="Software Engineer"
          company="Freeport"
          description="A web3 platform dedicated to simplifying fine art investing"
          start="Dec 2020"
          end="Present"
        >
          <ExperienceList>
            <li>
              Core engineer in the successful launch of a collection of Warhols
              that generated over $150,000 in revenue within the first 6 weeks
            </li>
            <li>
              Designed and delivered extensive platform features end-to-end,
              devised API routes and backend models, and optimized the analytics
              pipeline
            </li>
            <li>
              Engineered sophisticated UI elements in a virtual art gallery that
              seamlessly integrated tokenized real-world assets and NFTs
            </li>
            <li>
              Collaborated closely with the CEO and CTO to ideate and implement
              growth-oriented features, including high impact referral and
              collector programs
            </li>
          </ExperienceList>
        </ExperienceItem>
        <ExperienceItem
          role="Freelance React Developer"
          company="Upwork"
          start="Dec 2018"
          end="Dec 2022"
        >
          <ExperienceList>
            <li>
              Provided freelance services to clients ranging from startups to
              enterprise-level businesses
            </li>
            <li>
              Achieved Top Rated status within the first year on the platform
              and Expert-Vetted shortly after, a distinction representing the
              top 1% of talent
            </li>
            <li>
              Conceptualized and architected dashboards, onboarding flows,
              landing pages, API integrations, and fully responsive interfaces
              for web and native apps
            </li>
            <li>
              Authored industry-spanning web and brand copy for businesses,
              including high profile clients such as Lyft and Carnival Cruise
              Line
            </li>
          </ExperienceList>
        </ExperienceItem>
        <ExperienceItem
          role="Co-Founder, COO"
          company="Kettle"
          description="Online events built for communities"
          start="May 2021"
          end="Jul 2022"
        >
          <ExperienceList>
            <li>
              Oversaw product development from ideation to launch, guided MVP
              iterations, and coordinated user feedback to refine onboarding
              processes
            </li>
            <li>
              Directly oversaw 4 software engineers in a rapid decision making
              environment
            </li>
            <li>
              Developed advanced virtual event software that supported real-time
              activities
            </li>
          </ExperienceList>
        </ExperienceItem>
        <ExperienceItem
          role="Founding Software Engineer"
          company="Branch"
          description="An immersive virtual HQ for remote teams"
          start="Apr 2020"
          end="Jan 2021"
        >
          <ExperienceList>
            <li>
              Developed innovative peer-to-peer spatial audio solutions for
              virtual offices in a dynamic, venture-backed tech startup
            </li>
            <li>
              Part of the core team responsible for an MVP that secured $15.5M in
              funding from investors such as Naval Ravikant, Sahil Lavingia, and
              Homebrew
            </li>
            <li>
              Played a key role in making major architectural decisions of the
              core app and custom style library
            </li>
          </ExperienceList>
        </ExperienceItem>
        <ExperienceItem
          role="Co-Founder, Director of Operations"
          company="Konjure"
          description="A decentralized website builder"
          start="May 2018"
          end="Dec 2019"
        >
          <ExperienceList>
            <li>
              Developed a peer-to-peer website builder that reached finalist
              status in multiple accelerator programs
            </li>
            <li>
              Contributed to the tokenomics of the KONJ token and aided in the
              development of a desktop app for running validator nodes hosted on
              IPFS
            </li>
            <li>
              Recruited for and represented the company at numerous blockchain
              events in NYC and SF
            </li>
          </ExperienceList>
        </ExperienceItem>
        <ExperienceItem
          role="Web & Game Developer"
          company="Self-Employed"
          start="Feb 2014"
          end="Sep 2016"
        >
          <ExperienceList>
            <li>
              Developed websites, configured game servers, and developed game
              plugins as side income while attending high school
            </li>
            <li>
              Contributed to several bootstrapped game and web hosting
              companies, collectively serving thousands of users, later bought
              out by industry-leading competitors
            </li>
          </ExperienceList>
        </ExperienceItem>
      </div>
    </div>
  );
};

export default ResumeExperience;
