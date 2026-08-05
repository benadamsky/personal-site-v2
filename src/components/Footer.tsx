import { Nav, NavItem } from './Nav';

const Footer = () => {
  const links = [
    { label: 'GitHub', link: 'https://github.com/benadamsky' },
    { label: 'LinkedIn', link: 'https://linkedin.com/in/benadamsky' },
    { label: 'X', link: 'https://x.com/benadamsky' },
    {
      label: 'Source',
      link: 'https://github.com/benadamsky/personal-site-v2'
    }
  ];

  return (
    <footer className="site-footer">
      <p>
        <span aria-hidden="true">●</span> Transmission continues from New York
      </p>
      <Nav navClassName="footer-links">
        {links.map((item) => (
          <NavItem href={item.link} key={item.label} external>
            {item.label}
          </NavItem>
        ))}
      </Nav>
    </footer>
  );
};

export default Footer;
