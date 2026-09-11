import './globals.css';
import type { Metadata } from 'next';
import { me } from '@/data/me';

export const metadata: Metadata = {
  metadataBase: new URL(me.site),
  title: { default: me.name, template: `%s · ${me.name}` },
  description: me.description,
  openGraph: {
    type: 'website',
    siteName: me.name,
    title: me.name,
    description: me.description
  },
  twitter: { card: 'summary_large_image' }
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body>{children}</body>
  </html>
);

export default RootLayout;
