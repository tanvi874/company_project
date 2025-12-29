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



export default function DirectorPage() {
  // const personSchema = {
  //   "@context": "https://schema.org",
  //   "@type": "Person",
  //   name: directorFullName,
  //   identifier: primaryDirectorRecord?.DirectorDIN || undefined,
  //   jobTitle: "Director",
  //   worksFor: [
  //     ...associatedCompanies.map((company) => ({
  //       "@type": "Organization",
  //       name: company.company,
  //       identifier: company.cin || undefined,
  //       url: company.cin
  //         ? `https://www.setindiabiz.com/company/${company.cin}`
  //         : undefined,
  //     })),
  //     ...associatedLLPs.map((llp) => ({
  //       "@type": "Organization",
  //       name: llp.company,
  //       identifier: llp.llpin || undefined,
  //       url: llp.llpin
  //         ? `https://www.setindiabiz.com/llp/${llp.llpin}`
  //         : undefined,
  //     })),
  //   ],
  //   address: {
  //     "@type": "PostalAddress",
  //     streetAddress: primaryDirectorRecord?.DirectorPresentAddressLine1 || "",
  //     addressLocality: primaryDirectorRecord?.DirectorPresentCity || "",
  //     addressRegion: primaryDirectorRecord?.DirectorPresentState || "",
  //     postalCode: primaryDirectorRecord?.DirectorPresentPincode || "",
  //     addressCountry: primaryDirectorRecord?.companyOrigin || "India",
  //   },
  //   email: primaryDirectorRecord?.DirectorEmailAddress
  //     ? "mailto:" + primaryDirectorRecord.DirectorEmailAddress
  //     : undefined,
  //   telephone: primaryDirectorRecord?.DirectorMobileNumber || undefined,
  //   description: primaryDirectorRecord?.description || undefined,
  // };

  return (
    <>
      {/* <Script type="application/ld+json" id="director-schema" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}/> */}
      <DirectorClient />
    </>
  );
}
