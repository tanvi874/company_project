import React from "react";
import axios from "axios";
import DirectorClient from "./DirectorClient";
import { API_PREFIX } from "../../../../../lib/api-modifier";
import Script from "next/script";

const DIRECTOR_API_URL = `https://company-project-beryl.vercel.app${API_PREFIX}/company/getdirector`;
// `https://company-project-beryl.vercel.app/api/company/getdirector`;

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
  const slugNameParam = params.name
    ? decodeURIComponent(params.name)
    : "director";

  let directorNameForMeta = "Director Profile";
  let directorDescriptionForMeta = `View profile for director with DIN: ${
    din || "N/A"
  }.`;
  let pageUrl = `${DIRECTOR_API_URL}/companysearch/director/${slugify(
    slugNameParam
  )}/${din || ""}`;

  if (din) {
    try {
      const response = await axios.get(DIRECTOR_API_URL, {
        params: {
          din,
          fields: "DirectorFirstName,DirectorLastName,DirectorDesignation",
        },
      });

      if (
        response.data?.success &&
        Array.isArray(response.data.data) &&
        response.data.data.length > 0
      ) {
        const details = response.data.data[0];
        const firstName = details.DirectorFirstName || "";
        const lastName = details.DirectorLastName || "";
        directorNameForMeta =
          `${firstName} ${lastName}`.trim() || directorNameForMeta;
        directorDescriptionForMeta = `Profile of ${directorNameForMeta}, ${
          details.DirectorDesignation || "Director"
        }. DIN: ${din}. Learn about their associations and professional background.`;
      } else {
        console.warn(
          `Metadata: No director details found for DIN ${din} from ${DIRECTOR_API_URL}. Using fallback.`
        );
      }
    } catch (error) {
      console.warn(
        `Metadata fetch error for director DIN ${din}: ${error.message}. Using fallback metadata.`
      );
    }
  }

  return {
    title: `${directorNameForMeta} - Director Profile | DIN: ${din || "N/A"}`,
    description: directorDescriptionForMeta.substring(0, 160),
    keywords: [
      directorNameForMeta,
      din,
      "director profile",
      "corporate leadership",
      "company director",
      "board member",
    ]
      .filter(Boolean)
      .join(", "),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${directorNameForMeta} - Director Information`,
      description: directorDescriptionForMeta.substring(0, 200),
      url: pageUrl,
      siteName:
        "Online Tax and Compliance Services for Startups and Small Business | Setindiabiz",
      type: "profile",
      profile: {
        firstName: directorNameForMeta.split(" ")[0] || "",
        lastName: directorNameForMeta.split(" ").slice(1).join(" ") || "",
      },
      images: [
        {
          url: "https://www.setindiabiz.com/assets/home/ogimage.png",
          width: 1200,
          height: 630,
          alt: `${directorNameForMeta} - Director Profile`,
        },
      ],
    },
  };
}

export default function DirectorPage() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: directorFullName,
    identifier: primaryDirectorRecord?.DirectorDIN || undefined,
    jobTitle: "Director",
    worksFor: [
      ...associatedCompanies.map((company) => ({
        "@type": "Organization",
        name: company.company,
        identifier: company.cin || undefined,
        url: company.cin
          ? `https://www.setindiabiz.com/company/${company.cin}`
          : undefined,
      })),
      ...associatedLLPs.map((llp) => ({
        "@type": "Organization",
        name: llp.company,
        identifier: llp.llpin || undefined,
        url: llp.llpin
          ? `https://www.setindiabiz.com/llp/${llp.llpin}`
          : undefined,
      })),
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: primaryDirectorRecord?.DirectorPresentAddressLine1 || "",
      addressLocality: primaryDirectorRecord?.DirectorPresentCity || "",
      addressRegion: primaryDirectorRecord?.DirectorPresentState || "",
      postalCode: primaryDirectorRecord?.DirectorPresentPincode || "",
      addressCountry: primaryDirectorRecord?.companyOrigin || "India",
    },
    email: primaryDirectorRecord?.DirectorEmailAddress
      ? "mailto:" + primaryDirectorRecord.DirectorEmailAddress
      : undefined,
    telephone: primaryDirectorRecord?.DirectorMobileNumber || undefined,
    description: primaryDirectorRecord?.description || undefined,
  };

  return (
    <>
      <Script
        type="application/ld+json"
        id="director-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <DirectorClient />
    </>
  );
}
