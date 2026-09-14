import type { MetadataRoute } from 'next';
import { me } from '@/data/me';

const sitemap = (): MetadataRoute.Sitemap => [
  { url: `${me.site}/`, changeFrequency: 'weekly', priority: 1 },
  { url: `${me.site}/room`, changeFrequency: 'weekly', priority: 0.8 }
];

export default sitemap;
