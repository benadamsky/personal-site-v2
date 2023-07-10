import { FC, ReactNode } from 'react';

interface NavLinkProps {
  href: string;
  children: ReactNode;
  external?: boolean;
  linkClassName?: string;
}

const NavLink: FC<NavLinkProps> = ({
  href,
  children,
  external,
  linkClassName = 'text-base'
}) => (
  <a
    href={href}
    className={`hover:text-white hover:underline hover:underline-offset-4 duration-200 ${linkClassName}`}
    target={external ? '_blank' : '_self'}
    rel={external ? 'noopener noreferrer' : ''}
  >
    {children}
  </a>
);

interface NavProps {
  children: ReactNode;
  navClassName?: string;
}

const Nav: FC<NavProps> = ({ children, navClassName = 'space-x-8' }) => (
  <nav>
    <ul className={`flex items-center ${navClassName}`}>{children}</ul>
  </nav>
);

const NavItem: FC<NavLinkProps> = (props) => (
  <li>
    <NavLink {...props}>{props.children}</NavLink>
  </li>
);

export { Nav, NavLink, NavItem };
