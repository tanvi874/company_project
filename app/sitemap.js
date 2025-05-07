// Set NEXT_PUBLIC_BASE_URL in your .env.local file (e.g., NEXT_PUBLIC_BASE_URL=https://www.setindiabiz.com)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function getCompanyUrls() {
  try {
    const response = await fetch(`${BASE_URL}/api/sitemap/companies`, {
      next: { revalidate: 3600 } // Optional: revalidate data every hour
    });

    if (!response.ok) {
      console.error(`Sitemap: Failed to fetch company data. Status: ${response.status}`);
      return [];
    }

    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      console.error('Sitemap: Company data from API is not in the expected format.', result);
      return [];
    }

    return result.data.map(company => ({
      url: `${BASE_URL}/companies/${company.cin}`, // Path for company pages
      lastModified: company.lastUpdated ? new Date(company.lastUpdated).toISOString() : new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Sitemap: Error fetching company URLs:', error);
    return [];
  }
}

async function getDirectorUrls() {
  try {
    const response = await fetch(`${BASE_URL}/api/sitemap/directors`, {
      next: { revalidate: 7200 } // Optional: revalidate data every 2 hours
    });

    if (!response.ok) {
      console.error(`Sitemap: Failed to fetch director data. Status: ${response.status}`);
      return [];
    }

    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      console.error('Sitemap: Director data from API is not in the expected format.', result);
      return [];
    }

    return result.data.map(director => ({
      url: `${BASE_URL}/directors/${director.din}`, // Path for director pages
      lastModified: director.lastUpdated ? new Date(director.lastUpdated).toISOString() : new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Sitemap: Error fetching director URLs:', error);
    return [];
  }
}

export default async function sitemap() {
  const companyUrls = await getCompanyUrls();
  const directorUrls = await getDirectorUrls();

  // Define your static pages
  const staticPages = [
    { url: `${BASE_URL}/`, lastModified: new Date().toISOString(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.7 }, // Adjusted path based on d:\CompanyWebsite\app\(routes)\about\page.js
    { url: `${BASE_URL}/contact-us`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.5 },
    // Add other static pages from your site
  ];

  return [
    ...staticPages,
    ...companyUrls,
    ...directorUrls,
  ];
}