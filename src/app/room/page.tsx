import type { Metadata, Viewport } from 'next';
import { Fraunces } from 'next/font/google';
import Room from '@/components/room/Room';

// The serif is only for the room. The plain page uses whatever the device has.
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz', 'SOFT'],
  variable: '--font-serif',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Room',
  alternates: { canonical: '/room' }
};

export const viewport: Viewport = {
  themeColor: '#0b0a0c',
  viewportFit: 'cover'
};

const Home = () => (
  <div className={fraunces.variable}>
    <Room />
    <noscript>
      <p className="room__noscript">
        This is a room you can look around in, and it needs JavaScript.{' '}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">The plain version</a> has everything in it.
      </p>
    </noscript>
  </div>
);

export default Home;
