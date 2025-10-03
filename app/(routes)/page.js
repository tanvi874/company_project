import Script from "next/script";
import Home from "./HomeClient";

export const metadata = {
  title: "SetIndiaBiz - Indian Company & Director Insights",
  description:
    "Search Indian companies and directors. Access company financials, directors info, CIN/DIN lookup.",
  keywords: ["Indian Companies", "Directors", "CIN Lookup", "DIN Lookup"],
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "SetIndiaBiz - Indian Company & Director Insights",
    description:
      "Search Indian companies and directors. Access company financials, directors info, CIN/DIN lookup.",
    url: "./",
    siteName: "SetIndiaBiz",
    images: [
      {
        url: "https://www.setindiabiz.com/assets/home/ogimage.png",
        width: 1200,
        height: 630,
        alt: "SetIndiaBiz OG Image",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SetIndiaBiz - Indian Company & Director Insights",
    description:
      "Search Indian companies and directors. Access company financials, directors info, CIN/DIN lookup.",
    images: ["https://www.setindiabiz.com/assets/home/ogimage.png"],
  },
};

export default function Page() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SetIndiaBiz",
    url: "https://www.setindiabiz.com",
    logo: "https://www.setindiabiz.com/assets/logo.webp",
    sameAs: [
      "https://www.facebook.com/setindiabiz",
      "https://www.linkedin.com/company/setindiabiz",
      "https://twitter.com/setindiabiz",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-XXXXXXXXXX",
        contactType: "Customer Support",
        email: "help@setindiabiz.com",
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.setindiabiz.com",
    },
    headline: "SetIndiaBiz - Company & Director Insights",
    image: [
      "https://www.setindiabiz.com/assets/company-name-search/directors.webp",
    ],
    datePublished: "2024-01-01T08:00:00+08:00",
    dateModified: "2025-01-01T09:00:00+08:00",
    author: {
      "@type": "Organization",
      name: "SetIndiaBiz",
    },
    publisher: {
      "@type": "Organization",
      name: "SetIndiaBiz",
      logo: {
        "@type": "ImageObject",
        url: "https://www.setindiabiz.com/assets/logo.webp",
      },
    },
    description:
      "SetIndiaBiz provides comprehensive information on Indian companies and directors. Search by company name, CIN, director name, or DIN to access insights and director contact information.",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What can I find on SetIndiaBiz?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SetIndiaBiz provides comprehensive data on Indian companies and directors, including incorporation details, director profiles.",
        },
      },
      {
        "@type": "Question",
        name: "How do I search for companies and directors?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can search for companies and directors using the search bar on our homepage. Enter the company name, CIN, or director name/DIN to get started.",
        },
      },
      {
        "@type": "Question",
        name: "Is the basic company profile free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we offer a basic company profile for free, which includes essential details. More in-depth information is available with our premium subscriptions.",
        },
      },
      {
        "@type": "Question",
        name: "How do I contact SetIndiaBiz's support team?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can contact our support team via email at help@setindiabiz.com or through the contact form on our website.",
        },
      },
    ],
  };

  return (
    <>
      <Script
        strategy="beforeInteractive"
        async
        type="application/ld+json"
        id="organization-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        strategy="beforeInteractive"
        async
        type="application/ld+json"
        id="article-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        strategy="beforeInteractive"
        async
        type="application/ld+json"
        id="faq-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Home />
    </>
  );
}
