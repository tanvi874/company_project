import Script from "next/script";
import FaqClient from "./FaqClient";

// Metadata for FAQ page
export const metadata = {
  title: "FAQ | SetIndiaBiz",
  description:
    "Find answers to frequently asked questions about SetIndiaBiz: company search, director details, subscriptions, and more.",
  alternates: {
    canonical: "/companysearch/faq",
  },
  openGraph: {
    url: "/companysearch/faq",
    type: "website",
    locale: "en_US",
    siteName: "SetIndiaBiz - Online Company Data & Director Search",
    title: "FAQ | SetIndiaBiz",
    description:
      "Access answers to common questions about SetIndiaBiz services, features, and subscription plans.",
    images: [
      {
        url: "https://www.setindiabiz.com/assets/home/ogimage.png",
        width: 1200,
        height: 630,
        alt: "SetIndiaBiz FAQ",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | SetIndiaBiz",
    description:
      "Get answers to frequently asked questions about SetIndiaBiz, company search, director data, and more.",
    images: ["https://www.setindiabiz.com/assets/home/faq-ogimage.png"],
  },
};

export default function Page() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer || "Answer coming soon...",
      },
    })),
  };

  return (
    <>
      <Script
        type="application/ld+json"
        id="faq-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <FaqClient />
    </>
  );
}
