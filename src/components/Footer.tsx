import { Nav, NavLink, NavItem } from './Nav';

const Footer = () => {
  const FOOTER = [
    {
      label: 'GitHub',
      link: 'https://github.com/benadamsky'
    },
    {
      label: 'LinkedIn',
      link: 'https://linkedin.com/in/benadamsky'
    },
    {
      label: 'Farcaster',
      link: 'https://warpcast.com/ba'
    }
  ];

  return (
    <footer className="z-20 absolute bottom-0 w-full flex flex-col-reverse sm:flex-row justify-between items-center pb-6 px-12 xl:px-48">
      <NavLink
        href="https://github.com/benadamsky/personal-site-v2"
        linkClassName="text-slate-400 text-sm hover:text-slate-300 underline underline-offset-4 mt-3 sm:mt-0"
        external
      >
        View Source Code
      </NavLink>
      <Nav navClassName="space-x-6 sm:space-x-4">
        {FOOTER.map((item) => (
          <NavItem
            href={item.link}
            linkClassName="text-lg sm:text-base"
            key={item.label}
            external
          >
            {item.label}
          </NavItem>
        ))}
      </Nav>
    </footer>
  );
};

export default Footer;
