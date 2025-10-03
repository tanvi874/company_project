// This is a Server Component (no "use client" directive)
import React from "react";
import axios from "axios";
import CompanyClient from "./CompanyClient"; // Assuming CompanyClient.js is in the same directory
import { API_PREFIX } from "lib/api-modifier";

// Constants defined directly in the server component for generateMetadata
const COMPANY_API_URL =
  process.env.NEXT_PUBLIC_COMPANY_API_URL || `${API_PREFIX}/company/getcompany`;
const PUBLIC_MCA_API_URL =
  process.env.NEXT_PUBLIC_MCA_API_URL || `${API_PREFIX}/public/mca`;

// Utility function defined directly in the server component for generateMetadata
function slugify(text) {
  if (!text) return "no-name";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export async function generateMetadata({ params: paramsPromise }) { // Rename to indicate it might be a promise
  const params = await paramsPromise; // Await the params object as suggested by the error
  const cin = params.cin ? decodeURIComponent(params.cin) : null;
  const slugNameParam = params.name ? decodeURIComponent(params.name) : "company";

  let companyNameForMeta = slugify(slugNameParam).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  let companyDescriptionForMeta = `View details for company with CIN: ${cin || 'N/A'}.`;
  let pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/companysearch/company/${slugify(slugNameParam)}/${cin || ''}`;

  if (cin) {
    try {
      // Attempt to fetch minimal data for metadata from your primary API
      // Request only necessary fields like company name and a short description
      const response = await axios.get(COMPANY_API_URL, {
        params: { cin, fields: 'company,CompanyName,mainDivisionDescription' }
      });

      if (response.data?.success && response.data.companyDetails) {
        const details = response.data.companyDetails;
        companyNameForMeta = details.company || details.CompanyName || companyNameForMeta;
        companyDescriptionForMeta = details.mainDivisionDescription
                                      ? `Learn about ${companyNameForMeta}: ${details.mainDivisionDescription.substring(0, 120)}... (CIN: ${cin})`
                                      : `Find information about ${companyNameForMeta} (CIN: ${cin}), including registration, directors, and more.`;
      } else {
        // Fallback to public API if primary API fails or doesn't return data
         const publicResponse = await axios.get(PUBLIC_MCA_API_URL, { params: { cin } });
         if (publicResponse.data?.success && Array.isArray(publicResponse.data.data) && publicResponse.data.data.length > 0) {
            const publicDetails = publicResponse.data.data[0];
            companyNameForMeta = publicDetails.CompanyName || companyNameForMeta;
            // You might want a more generic description if only public data is available
            companyDescriptionForMeta = `Explore official details for ${companyNameForMeta}, CIN: ${cin}.`;
        }
      }
    } catch (error) {
      console.warn(`Metadata fetch error for ${cin}: ${error.message}. Using fallback metadata.`);
      // Fallback if both API calls fail or if CIN is not present
    }
  }

  return {
    title: `${companyNameForMeta} - | CIN: ${cin || 'N/A'}`,
    description: companyDescriptionForMeta.substring(0, 160), // Keep descriptions concise for meta tags
    keywords: [companyNameForMeta, cin, 'company profile', 'corporate data', 'mca data', 'indian company'].filter(Boolean).join(', '),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${companyNameForMeta} - Company Information`,
      description: companyDescriptionForMeta.substring(0, 200), // OG descriptions can be slightly longer
      url: pageUrl,
      siteName: 'Online Tax and Compliance Services for Startups and Small Business | Setindiabiz', // Replace with your actual site name
      type: 'profile', // or 'article' or 'website' depending on the content
      images: [
        {
          url: 'https://www.setindiabiz.com/assets/home/ogimage.png',
          width: 1200,
          height: 630,
          alt: `Profile of ${companyNameForMeta}`,
          type: 'image/png',
        },
      ],
    },
    
    // twitter: {
    //   card: 'summary_large_image',
    //   title: `${companyNameForMeta} - Company Information`,
    //   description: companyDescriptionForMeta.substring(0, 200),
    //   // images: ['your-default-twitter-image.jpg'], // Optional
    // },
  };
}

// This is the Server Component that Next.js will render for the route.
export default function CompanyPage() {
  // CompanyClient will use the useParams hook internally to get the route params.
  return <CompanyClient />;
}
