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
  return (
    <>
      <DirectorClient />
    </>
  );
}
