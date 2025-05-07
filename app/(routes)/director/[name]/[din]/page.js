// This is a Server Component (no "use client" directive)
import React from "react";
import axios from "axios";
import DirectorClient from "./DirectorClient"; // Import the client component


const DIRECTOR_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/company/getdirector`; 

// Utility function for slugifying text (can be shared or redefined)
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

export async function generateMetadata({ params: paramsPromise }) {
  const params = await paramsPromise; // Await the params object
  const din = params.din ? decodeURIComponent(params.din) : null;
  const slugNameParam = params.name ? decodeURIComponent(params.name) : "director";

  let directorNameForMeta = "Director Profile";
  let directorDescriptionForMeta = `View profile for director with DIN: ${din || 'N/A'}.`;
  let pageUrl = `${DIRECTOR_API_URL}/director/${slugify(slugNameParam)}/${din || ''}`;

  if (din) {
    try {
      const response = await axios.get(DIRECTOR_API_URL, {
        params: { din, fields: 'DirectorFirstName,DirectorLastName,DirectorDesignation' }
      });

      if (response.data?.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
        const details = response.data.data[0];
        const firstName = details.DirectorFirstName || "";
        const lastName = details.DirectorLastName || "";
        directorNameForMeta = `${firstName} ${lastName}`.trim() || directorNameForMeta;
        directorDescriptionForMeta = `Profile of ${directorNameForMeta}, ${details.DirectorDesignation || 'Director'}. DIN: ${din}. Learn about their associations and professional background.`;
      } else {
        console.warn(`Metadata: No director details found for DIN ${din} from ${DIRECTOR_API_URL}. Using fallback.`);
      }
    } catch (error) {
      console.warn(`Metadata fetch error for director DIN ${din}: ${error.message}. Using fallback metadata.`);
    }
  }

  return {
    title: `${directorNameForMeta} - Director Profile | DIN: ${din || 'N/A'}`,
    description: directorDescriptionForMeta.substring(0, 160),
    keywords: [directorNameForMeta, din, 'director profile', 'corporate leadership', 'company director', 'board member'].filter(Boolean).join(', '),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${directorNameForMeta} - Director Information`,
      description: directorDescriptionForMeta.substring(0, 200),
      url: pageUrl,
      siteName: 'YourSiteName', // Replace with your actual site name
      type: 'profile',
      profile: {
        firstName: directorNameForMeta.split(' ')[0] || "",
        lastName: directorNameForMeta.split(' ').slice(1).join(' ') || "",
      },
    },
  };
}

export default function DirectorPage() {
  return <DirectorClient />;
}
