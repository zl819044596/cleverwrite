import pages from '../data/programmatic-pages.json';

const BASE_URL = 'https://tools.getfitai.io';

const corePages = [
  '/',
  '/tools',
  '/humanizer',
  '/ai-detector',
  '/grammar-checker',
  '/paraphraser',
  '/summarizer',
  '/improver',
  '/expander',
  '/shortener',
];

const today = new Date().toISOString().split('T')[0];

const urlXml = (loc, changefreq = 'weekly', priority = '0.8') =>
  `  <url>\n    <loc>${BASE_URL}${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

export const GET = async () => {
  const urls = [];

  // Core pages — homepage gets highest priority
  for (const slug of corePages) {
    const priority = slug === '/' ? '1.0' : '0.9';
    const freq = slug === '/' ? 'daily' : 'weekly';
    urls.push(urlXml(slug, freq, priority));
  }

  // All programmatic pages
  for (const page of pages) {
    urls.push(urlXml(`/${page.slug}`, 'weekly', '0.7'));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
