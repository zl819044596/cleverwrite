const BASE_URL = 'https://tools.getfitai.io';

const corePages = [
  { loc: '/', freq: 'daily', priority: '1.0' },
  { loc: '/tools/', freq: 'weekly', priority: '0.9' },
  { loc: '/humanizer/', freq: 'weekly', priority: '0.9' },
  { loc: '/ai-detector/', freq: 'weekly', priority: '0.9' },
  { loc: '/grammar-checker/', freq: 'weekly', priority: '0.9' },
  { loc: '/paraphraser/', freq: 'weekly', priority: '0.9' },
  { loc: '/summarizer/', freq: 'weekly', priority: '0.9' },
  { loc: '/improver/', freq: 'weekly', priority: '0.9' },
  { loc: '/expander/', freq: 'weekly', priority: '0.9' },
  { loc: '/shortener/', freq: 'weekly', priority: '0.9' },
];

export const GET = async () => {
  const today = new Date().toISOString().split('T')[0];
  const urlTags = corePages.map(p => {
    const prio = p.loc === '/' ? '1.0' : p.priority;
    return `  <url>
    <loc>${BASE_URL}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${prio}</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlTags.join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
