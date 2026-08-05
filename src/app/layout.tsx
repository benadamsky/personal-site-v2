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
  title: 'Ben Adamsky — I build systems that think',
  description:
    'Ben Adamsky is an engineer and two-time founder, co-founder / CTO of Dreamwork. A decade of shipping end to end, now deep in agentic engineering.',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Ben Adamsky — I build systems that think',
    description:
      'Engineer and two-time founder. Co-founder / CTO of Dreamwork, building agent-first software.',
    url: 'https://www.benadamsky.com',
    siteName: 'Ben Adamsky',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ben Adamsky — I build systems that think',
    description:
      'Engineer and two-time founder. Co-founder / CTO of Dreamwork, building agent-first software.'
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
