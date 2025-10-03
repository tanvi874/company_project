import Script from "next/script";
import UnlockSection from "./UnlockClient";

export const metadata = {
  title: "Unlock Contact | SetIndiaBiz",
  description:
    "Search company directors by DIN or name with Director Connect. Instantly unlock verified mobile numbers and email addresses by paying securely online. Get contact details delivered instantly with confirmation email.",
  alternates: {
    canonical: "/companysearch/unlock-contact",
  },
  openGraph: {
    url: "/companysearch/unlock-contact",
    type: "website",
    locale: "en_US",
    siteName: "SetIndiaBiz - Online Tax & Compliance Services",
    title: "Unlock Contact | SetIndiaBiz",
    description:
      "Use Director Connect to search directors by DIN or name. Unlock mobile numbers and email addresses instantly after secure payment. Details are shown on-screen and sent via email confirmation.",
    images: [
      {
        url: "https://www.setindiabiz.com/assets/home/ogimage.png",
        width: 1200,
        height: 630,
        alt: "SetIndiaBiz Unlock Contact",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unlock Contact | SetIndiaBiz",
    description:
      "Search company directors by DIN or name, then pay securely to unlock verified contact numbers and emails. Instant access with confirmation email.",
    images: ["https://www.setindiabiz.com/assets/home/ogimage.png"],
  },
};

export default function Page() {
  const unlockServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Director Contact Unlock Service",
    description:
      "Unlock director contact details (mobile & email) instantly by paying ₹100 per director.",
    provider: {
      "@type": "Organization",
      name: "SetIndiaBiz",
      url: "https://www.setindiabiz.com",
      logo: "https://www.setindiabiz.com/assets/logo.webp",
    },
    offers: {
      "@type": "Offer",
      url: "https://www.setindiabiz.com/unlock-contact",
      priceCurrency: "INR",
      price: "100",
      availability: "https://schema.org/InStock",
    },
  };

  const unlockFAQSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I unlock director contact details?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Search for a director by DIN or name, then proceed with the payment form to unlock mobile and email instantly.",
        },
      },
      {
        "@type": "Question",
        name: "How much does it cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Each director contact unlock costs ₹100. Payment is required to view the contact details.",
        },
      },
      {
        "@type": "Question",
        name: "Will I receive a confirmation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, after payment, you will get a confirmation email along with unlocked contact details.",
        },
      },
      {
        "@type": "Question",
        name: "Can I unlock multiple contacts in bulk?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we offer special bulk purchase options for multiple director contacts.",
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="unlock-service-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(unlockServiceSchema)}
      </Script>

      <Script
        id="unlock-faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(unlockFAQSchema)}
      </Script>
      <UnlockSection />
    </>
  );
}
