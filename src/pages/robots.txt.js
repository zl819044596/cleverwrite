export const GET = async () => {
  const body = `User-agent: *
Allow: /
Sitemap: https://tools.getfitai.io/sitemap-index.xml`;

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};
