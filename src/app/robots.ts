import type { MetadataRoute } from 'next';
import { me } from '@/data/me';

const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: '*', allow: '/' },
  sitemap: `${me.site}/sitemap.xml`
});

export default robots;
