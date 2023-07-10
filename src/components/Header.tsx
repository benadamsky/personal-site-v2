import { Nav, NavItem } from './Nav';

const Header = () => {
  const HEADER = [
    {
      label: 'Connect',
      link: 'mailto:hi@benadamsky.com'
    },
    {
      label: 'Resume',
      link: '/resume'
    }
  ];

  return (
    <header className="z-20 absolute top-0 w-full flex flex-col sm:flex-row space-y-2 items-center justify-between pt-6 px-0 sm:px-12 xl:px-48">
      <a
        href="/"
        className="text-4xl sm:text-xl font-semibold hover:text-white duration-200"
      >
        Ben Adamsky
      </a>
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
