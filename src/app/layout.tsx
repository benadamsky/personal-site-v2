import './globals.css';
import { IBM_Plex_Mono, Manrope } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap'
});

export const metadata = {
  metadataBase: new URL('https://www.benadamsky.com'),
  title: 'Ben Adamsky — Building paths through uncertainty',
  description:
    'Ben Adamsky is a software developer and co-founder / CTO of Dreamwork. He builds products for the moments when people, work, and technology need a way forward.',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Ben Adamsky — Building paths through uncertainty',
    description:
      'Software developer and co-founder / CTO of Dreamwork, building the paths that make hard next moves obvious.',
    url: 'https://www.benadamsky.com',
    siteName: 'Ben Adamsky',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ben Adamsky — Building paths through uncertainty',
    description:
      'Software developer and co-founder / CTO of Dreamwork, building the paths that make hard next moves obvious.'
  }
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${plexMono.variable}`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
