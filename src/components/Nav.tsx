import { FC, ReactNode } from 'react';

interface LinkProps {
  href: string;
  children: ReactNode;
  target?: string;
  rel?: string;
  linkClassName?: string;
}

const Link: FC<LinkProps> = ({
  href,
  children,
  target,
  rel,
  linkClassName = 'text-base'
}) => (
  <a
    href={href}
    className={`text-slate-200 hover:text-white duration-200 ${linkClassName}`}
    target={target}
    rel={rel}
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

const NavItem: FC<LinkProps> = (props) => (
  <li>
    <Link {...props}>{props.children}</Link>
  </li>
);

export { Link, Nav, NavItem };
