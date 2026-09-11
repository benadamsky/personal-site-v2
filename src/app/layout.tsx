import './globals.css';
import localFont from 'next/font/local';

const fraunces = localFont({
  src: './fonts/fraunces-latin.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-serif'
});

export const metadata = {
  metadataBase: new URL('https://www.benadamsky.com'),
  title: 'Ben Adamsky',
  description:
    'I build software and companies. Currently getting people jobs at Dreamwork. Previously Ponder.'
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" className={fraunces.variable}>
    <body>{children}</body>
  </html>
);

export default RootLayout;
