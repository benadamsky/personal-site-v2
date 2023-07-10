import { FC, ReactNode } from 'react';
import { NavLink } from '@/components/Nav';
import { DateRange } from './DateRange';

interface SidebarItemProps {
  title: string;
  children: ReactNode;
  sidebarItemClassName?: string;
}

const SidebarItem: FC<SidebarItemProps> = ({
  title,
  children,
  sidebarItemClassName = 'mb-1'
}) => {
  return (
    <div>
      <h5 className={`text-2xl font-semibold mb-1 ${sidebarItemClassName}`}>
        {title}
      </h5>
      {children}
    </div>
  );
};

interface ProjectItemProps {
  title: string;
  children: ReactNode;
}

const ProjectItem: FC<ProjectItemProps> = ({ title, children }) => {
  return (
    <div className="my-1">
      <p className="font-medium text-lg">{title}</p>
      {children}
    </div>
  );
};

const ResumeSidebar = () => {
  return (
    <div className="space-y-8 lg:space-y-16">
      <SidebarItem title="Contact">
        <NavLink href="/" linkClassName="block underline underline-offset-4">
          benadamsky.com
        </NavLink>
        <NavLink
          href="mailto:hi@benadamsky.com"
          linkClassName="block underline underline-offset-4 mt-0.5"
        >
          hi@benadamsky.com
        </NavLink>
      </SidebarItem>
      <SidebarItem title="Skills">
        <p>
          HTML, CSS, Tailwind CSS
          <br />
          JavaScript, TypeScript
          <br />
          React.js, Next.js, Node.js
          <br />
          Storybook
          <br />
          REST API, Webhooks
          <br />
          PostgreSQL, Prisma
          <br />
          Vercel, AWS
          <br />
          ESLint, Prettier, Jest
        </p>
      </SidebarItem>
      <SidebarItem title="Projects">
        <ProjectItem title="Surveycaster">
          <NavLink
            href="https://github.com/benadamsky/surveycaster"
            linkClassName="underline underline-offset-4 hover:text-white duration-200"
            external
          >
            Open source
          </NavLink>{' '}
          bot dedicated to driving engagement on Farcaster
        </ProjectItem>
        <ProjectItem title="Libs vs Cons">
          A satirical card game that debuted on{' '}
          <NavLink
            href="https://www.kickstarter.com/projects/kaimicahmills/libs-vs-cons-a-card-game-about-political-stereotyp"
            linkClassName="underline underline-offset-4 hover:text-white duration-200"
            external
          >
            Kickstarter
          </NavLink>
        </ProjectItem>
      </SidebarItem>
      <SidebarItem title="Education" sidebarItemClassName="mb-0">
        <DateRange start="Sep 2016" end="Jun 2018" />
        <p className="mt-2">Coursework toward B.S. in Computer Science</p>
        <p>Rutgers, The State University of New Jersey, New Brunswick</p>
      </SidebarItem>
      <div className="text-center lg:text-left">
        <a
          href="/resume.pdf"
          download="BenAdamsky-Resume.pdf"
          className="bg-slate-100 hover:bg-white duration-200 py-4 px-6 text-black rounded-md block lg:inline-block"
        >
          Download PDF
        </a>
      </div>
    </div>
  );
};

export default ResumeSidebar;
