import { MetadataRoute } from 'next';
import { baseUrl } from '@/util/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/map`,
      lastModified: new Date(),
    },
  ];
}
