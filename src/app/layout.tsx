import './globals.css';
import { Fraunces } from 'next/font/google';

const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz', 'SOFT'],
  variable: '--font-serif'
});

export const metadata = {
  title: 'Ben Adamsky',
  description: 'A room, a desk, a cat, some books, and the work.'
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" className={fraunces.variable}>
    <body>{children}</body>
  </html>
);

export default RootLayout;
