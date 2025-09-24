const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/companysearch';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*', // Applies to all web crawlers
        // allow: '/',     // Allow crawling of all content by default
        // Add disallow rules if you have specific paths you want to block
        disallow: '/',
        // disallow: '/private-area/',
      },
      // You can add more specific rules for other user agents if needed
      // {
      //   userAgent: 'Googlebot-Image',
      //   disallow: ['/images-to-block/'],
      // },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`, // Points to your generated sitemap
  };
}