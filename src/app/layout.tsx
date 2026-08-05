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
  title: 'Ben Adamsky — Co-founder & CTO of Dreamwork',
  description:
    'Ben Adamsky builds companies from the code up. Co-founder & CTO of Dreamwork. Previously founding engineer at Branch, top 1% on Upwork, and core engineer at Freeport.',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Ben Adamsky — Co-founder & CTO of Dreamwork',
    description:
      'Building companies from the code up. Founding engineer at Branch, top 1% on Upwork, core engineer at Freeport.',
    url: 'https://www.benadamsky.com',
    siteName: 'Ben Adamsky',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ben Adamsky — Co-founder & CTO of Dreamwork',
    description:
      'Building companies from the code up. Founding engineer at Branch, top 1% on Upwork, core engineer at Freeport.'
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
