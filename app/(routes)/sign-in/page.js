// app/(routes)/sign-in/page.js
import Script from "next/script";
import LoginSection from "./SignInClient";

export const metadata = {
  title: "Sign In | SetIndiaBiz",
  description:
    "Access your SetIndiaBiz account to manage company registrations, director details, and compliance services. Sign in securely with email, password, or Google.",
  alternates: {
    canonical: "/companysearch/sign-in",
  },
  openGraph: {
    url: "/companysearch/sign-in",
    type: "website",
    locale: "en_US",
    siteName: "SetIndiaBiz - Online Tax & Compliance Services",
    title: "Sign In | SetIndiaBiz",
    description:
      "Secure login to SetIndiaBiz to access your account, company services, and compliance tools.",
    images: [
      {
        url: "https://www.setindiabiz.com/assets/home/ogimage.png",
        width: 1200,
        height: 630,
        alt: "SetIndiaBiz Sign In",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In | SetIndiaBiz",
    description:
      "Login to SetIndiaBiz for company registrations, compliance management, and director details.",
    images: ["https://www.setindiabiz.com/assets/home/ogimage.png"],
  },
};

export default function Page() {
  const signInSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Sign In - SetIndiaBiz",
    url: typeof window !== "undefined" ? window.location.href : "",
    description:
      "Sign-in page for SetIndiaBiz where users can access their accounts using email/password or Google.",
    potentialAction: {
      "@type": "LoginAction",
      target: typeof window !== "undefined" ? window.location.href : "",
      name: "User Sign In",
    },
  };

  return (
    <>
      <Script
        type="application/ld+json"
        id="sign-in-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(signInSchema) }}
      />
      <LoginSection />
    </>
  );
}
