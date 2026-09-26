import { MetadataRoute } from 'next';
import { DEFAULT_COURSES } from '@/lib/courses-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://digital-skills-academy-nu.vercel.app';

  const courseUrls: MetadataRoute.Sitemap = DEFAULT_COURSES.map((course) => ({
    url: `${baseUrl}/courses/${course.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...courseUrls,
  ];
}
