import './globals.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900']
});

export const metadata = {
  title: 'Ben Adamsky',
  description: 'Building stuff - 2x founder, software engineer'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${poppins.className} h-full`}>{children}</body>
    </html>
  );
}