import pages from '../data/programmatic-pages.json';

const BASE_URL = 'https://tools.getfitai.io';

const corePages = [
  '/',
  '/tools',
  '/humanizer',
  '/ai-humanizer',
  '/ai-detector',
  '/grammar-checker',
  '/paraphraser',
  '/summarizer',
  '/improver',
  '/expander',
  '/shortener',
  '/translator',
  '/smart-rewriter',
  '/polish-email',
  '/rewrite-essay',
  '/pricing',
  '/privacy',
  '/contact',
];

const today = new Date().toISOString().split('T')[0];

const urlXml = (loc, changefreq = 'weekly', priority = '0.8') => {
  // Ensure trailing slash for all non-root paths
  const url = loc === '/' ? '/' : loc.endsWith('/') ? loc : `${loc}/`;
  return `  <url>\n    <loc>${BASE_URL}${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
};

export const GET = async () => {
  const urls = [];

  // Core pages — homepage gets highest priority
  const coreSet = new Set(corePages);
  for (const slug of corePages) {
    const priority = slug === '/' ? '1.0' : '0.9';
    const freq = slug === '/' ? 'daily' : 'weekly';
    urls.push(urlXml(slug, freq, priority));
  }

  // All programmatic pages (skip any already in core pages)
  for (const page of pages) {
    const slug = `/${page.slug}`;
    if (!coreSet.has(slug)) {
      urls.push(urlXml(slug, 'weekly', '0.7'));
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
