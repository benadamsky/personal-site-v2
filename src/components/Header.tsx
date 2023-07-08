import { Link, Nav, NavItem } from './Nav';

const Header = () => {
  const HEADER = [
    {
      label: 'Connect',
      link: 'mailto:hi@benadamsky.com'
    },
    {
      label: 'Resume',
      link: '#resume-coming-soon'
    }
  ];

  return (
    <header className="relative z-20 w-full flex flex-col sm:flex-row space-y-2 items-center justify-between pt-6 px-0 sm:px-12 xl:px-48">
      <Link
        href="/"
        linkClassName="text-slate-200 text-4xl sm:text-xl font-semibold"
      >
        Ben Adamsky
      </Link>
      <Nav>
        {HEADER.map((item) => (
          <NavItem
            href={item.link}
            linkClassName="text-xl sm:text-lg"
            key={item.label}
          >
            {item.label}
          </NavItem>
        ))}
      </Nav>
    </header>
  );
};

export default Header;
