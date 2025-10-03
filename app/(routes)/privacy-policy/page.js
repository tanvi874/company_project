import Link from "next/link";
import Script from "next/script";
import React from "react";

export const metadata = {
  title: "Privacy Policy | Setindiabiz",
  description:
    "Read Setindiabiz's Privacy Policy. Learn how we collect, use, and protect your personal information and maintain confidentiality.",
  alternates: {
    canonical: "/companysearch/privacy-policy",
  },
  openGraph: {
    url: "/companysearch/privacy-policy",
    type: "website",
    locale: "en_US",
    siteName: "Setindiabiz - Online Tax & Compliance Services",
    title: "Privacy Policy | Setindiabiz",
    description:
      "Setindiabiz explains how user data is collected, stored, and used while ensuring privacy and security of your information.",
    images: [
      {
        url: "https://www.setindiabiz.com/assets/home/ogimage.png",
        width: 1200,
        height: 630,
        alt: "Setindiabiz - Privacy Policy",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Setindiabiz",
    description:
      "Learn about Setindiabiz's privacy practices, data protection measures, and how we handle your personal information.",
    images: ["https://www.setindiabiz.com/assets/home/ogimage.png"],
  },
};

const page = () => {
  return (
    <div>
      <Script
        type="application/ld+json"
        id="privacy-policy-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Privacy Policy | Setindiabiz",
            url: "https://www.setindiabiz.com/companysearch/privacy-policy",
            description:
              "Read Setindiabiz's Privacy Policy. Learn how we collect, use, and protect your personal information and maintain confidentiality.",
            inLanguage: "en",
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://www.setindiabiz.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Privacy Policy",
                  item: "https://www.setindiabiz.com/companysearch/privacy-policy",
                },
              ],
            },
            mainEntity: {
              "@type": "Organization",
              name: "Setindiabiz",
              url: "https://www.setindiabiz.com",
              logo: "https://www.setindiabiz.com/assets/home/ogimage.png",
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  email: "help@setindiabiz.com",
                  contactType: "customer support",
                  areaServed: "IN",
                  availableLanguage: "en",
                },
              ],
            },
          }),
        }}
      />
      <main className="container mx-auto">
        <div className="wrapper mb-16 mt-10">
          <h1 className="mb-8 text-2xl font-bold pt-20">Privacy Policy</h1>

          {/* Table of Contents */}
          <section className="rounded-lg border-l-[6px] border-primary bg-gray-100 bg-muted p-6">
            <h2 className="mb-4 text-sm font-bold md:text-lg">
              Table of Contents
            </h2>
            <ul className="space-y-2 text-sm md:text-base">
              <li>
                <Link
                  className="text-blue-500 hover:underline"
                  href="#introduction"
                >
                  Introduction
                </Link>
              </li>
              <li>
                <Link
                  className="text-blue-500 hover:underline"
                  href="#data-collection-and-use"
                >
                  Data Collection and Use
                </Link>
              </li>
              <li>
                <Link
                  className="text-blue-500 hover:underline"
                  href="#data-sharing-and-disclosure"
                >
                  Data Sharing and Disclosure
                </Link>
              </li>
              <li>
                <Link
                  className="text-blue-500 hover:underline"
                  href="#cookies-and-tracking-technologies"
                >
                  Cookies and Tracking Technologies
                </Link>
              </li>
              <li>
                <Link
                  className="text-blue-500 hover:underline"
                  href="#third-party-links"
                >
                  Third-Party Links
                </Link>
              </li>
              <li>
                <Link
                  className="text-blue-500 hover:underline"
                  href="#rights-of-users"
                >
                  Rights of Users
                </Link>
              </li>
              <li>
                <Link
                  className="text-blue-500 hover:underline"
                  href="#security"
                >
                  Security
                </Link>
              </li>
              <li>
                <Link
                  className="text-blue-500 hover:underline"
                  href="#changes-to-this-policy"
                >
                  Changes to This Policy
                </Link>
              </li>
              <li>
                <Link
                  className="text-blue-500 hover:underline"
                  href="#contact-us"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </section>

          {/* Policy Sections */}
          <div className="mt-4">
            <section id="introduction" className="mb-4">
              <h2 className="mb-4 pt-6 text-xl font-bold">Introduction</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
                Welcome to SetIndiaBiz Website. We connect company owners with
                chartered accountants and company secretaries to help file their
                pending forms and ensure compliance. This Privacy Policy
                provides details about how we collect, use, disclose, and
                safeguard your information when you access our services.
              </p>
            </section>

            <section id="data-collection-and-use">
              <h2 className="mb-4 pt-6 text-xl font-bold">
                Data Collection and Use
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
                We may collect the following information:
              </p>
              <ul className="ml-6 list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400 md:text-base">
                <li>
                  <strong>Information You Provide Directly:</strong> We may
                  collect personal and business information you provide directly
                  to us, such as when you create an account, fill out a form, or
                  communicate with us. This includes, but is not limited to,
                  your name, email address, company name, and other relevant
                  details.
                </li>
                <li>
                  <strong>Automatically Collected Information:</strong> We may
                  automatically collect certain information about your device
                  and usage of our services, including IP addresses, browser
                  type, and information about your interactions with our
                  platform.
                </li>
                <li>
                  <strong>How We Use Your Information:</strong> We use the
                  information we collect to provide, maintain, and improve our
                  services, process transactions, send notifications, respond to
                  inquiries, and for other business purposes.
                </li>
              </ul>
            </section>

            <section id="data-sharing-and-disclosure">
              <h2 className="mb-4 pt-6 text-xl font-bold">
                Data Sharing and Disclosure
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
                We do not sell or rent your personal information to third
                parties. However, we may share your information:
              </p>
              <ul className="ml-6 list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400 md:text-base">
                <li>
                  With service providers who perform functions on our behalf.
                </li>
                <li>
                  In connection with, or during negotiations of, any merger,
                  sale of company assets, financing, or acquisition of all or a
                  portion of our business by another company.
                </li>
                <li>As required by law or in response to legal processes.</li>
              </ul>
            </section>

            <section id="cookies-and-tracking-technologies">
              <h2 className="mb-4 pt-6 text-xl font-bold">
                Cookies and Tracking Technologies
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
                We use cookies and other tracking technologies to collect
                information about your usage and preferences. This helps us
                enhance and personalize your experience on our platform.
              </p>
            </section>

            <section id="third-party-links">
              <h2 className="mb-4 pt-6 text-xl font-bold">Third-Party Links</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
                Our platform may contain links to third-party websites. We are
                not responsible for the privacy practices or content of these
                external sites.
              </p>
            </section>

            <section id="rights-of-users">
              <h2 className="mb-4 pt-6 text-xl font-bold">Rights of Users</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
                You may have certain rights related to your personal data, such
                as accessing, correcting, or deleting your data. Please contact
                us if you have requests or questions regarding your rights.
              </p>
            </section>

            <section id="security">
              <h2 className="mb-4 pt-6 text-xl font-bold">Security</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
                We implement a variety of security measures to safeguard your
                personal information. While we strive to protect your data, we
                cannot guarantee its absolute security.
              </p>
            </section>

            <section id="changes-to-this-policy">
              <h2 className="mb-4 pt-6 text-xl font-bold">
                Changes to This Policy
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
                We may update our Privacy Policy from time to time. We will
                notify users of significant changes and encourage you to review
                this policy periodically.
              </p>
            </section>

            <section id="contact-us">
              <h2 className="mb-4 pt-6 text-xl font-bold">Contact Us</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
                If you have any questions about this Privacy Policy, please
                contact us at
                <Link
                  className="ml-1 text-blue-500 hover:underline"
                  href="mailto:help@setindiabiz.com"
                >
                  help@setindiabiz.com
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default page;
