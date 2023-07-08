import { Link, Nav, NavItem } from './Nav';

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
    <footer className="relative h-[calc(100%-100px)] sm:h-[calc(100%-60px)] w-full flex flex-col-reverse sm:flex-row sm:justify-between items-center sm:items-end pb-6 px-12 xl:px-48">
      <Link
        href="https://github.com/benadamsky/personal-site-v2"
        rel="noopener noreferrer"
        target="_blank"
        linkClassName="text-gray-400 text-sm hover:text-gray-300 underline underline-offset-4 mt-3 sm:mt-0"
      >
        View Source Code
      </Link>
      <Nav navClassName="space-x-6 sm:space-x-4">
        {FOOTER.map((item) => (
          <NavItem
            href={item.link}
            rel="noopener noreferrer"
            target="_blank"
            linkClassName="text-lg sm:text-base"
            key={item.label}
          >
            {item.label}
          </NavItem>
        ))}
      </Nav>
    </footer>
  );
};

export default Footer;
