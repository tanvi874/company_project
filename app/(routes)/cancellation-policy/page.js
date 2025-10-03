import Link from "next/link";
import Script from "next/script";
import React from "react";

export const metadata = {
  title: "Cancellation Policy | Setindiabiz",
  description:
    "Read Setindiabiz's Cancellation Policy. Learn about conditions for cancellations, non-cancellable services, refund processes, and how we handle policy changes.",
  alternates: {
    canonical: "/companysearch/cancellation-policy",
  },
  openGraph: {
    url: "/companysearch/cancellation-policy",
    type: "website",
    locale: "en_US",
    siteName: "Setindiabiz - Online Tax & Compliance Services",
    title: "Cancellation Policy | Setindiabiz",
    description:
      "Setindiabiz provides clarity on service cancellations, conditions, refunds, and policy updates for our customers.",
    images: [
      {
        url: "https://www.setindiabiz.com/assets/home/ogimage.png",
        width: 1200,
        height: 630,
        alt: "Setindiabiz - Cancellation Policy",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cancellation Policy | Setindiabiz",
    description:
      "Understand Setindiabiz's cancellation terms, non-cancellable services, and refund procedures.",
    images: ["https://www.setindiabiz.com/assets/home/ogimage.png"],
  },
};

const CancellationPolicyPage = () => {
  return (
    <>
      <Script
        type="application/ld+json"
        id="cancellation-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: "Setindiabiz",
                url: "https://www.setindiabiz.com",
                logo: "https://www.setindiabiz.com/assets/home/ogimage.png",
                sameAs: [
                  "https://www.facebook.com/Setindiabiz",
                  "https://twitter.com/Setindiabiz",
                  "https://www.linkedin.com/company/setindiabiz",
                ],
              },
              {
                "@type": "WebPage",
                name: "Cancellation Policy | Setindiabiz",
                url: "https://www.setindiabiz.com/companysearch/cancellation-policy",
                description:
                  "Read Setindiabiz's Cancellation Policy. Learn about conditions for cancellations, non-cancellable services, refund processes, and how we handle policy changes.",
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
                      name: "Cancellation Policy",
                      item: "https://www.setindiabiz.com/companysearch/cancellation-policy",
                    },
                  ],
                },
                author: {
                  "@type": "Organization",
                  name: "Setindiabiz",
                  url: "https://www.setindiabiz.com",
                },
              },
            ],
          }),
        }}
      />
      <main className="container mx-auto">
        <div className="wrapper mb-16 mt-10">
          <h1 className="mb-8 text-2xl font-bold pt-20">Cancellation Policy</h1>

          {/* Table of Contents */}
          <section className="rounded-lg border-l-[6px] border-primary bg-gray-100 bg-muted p-6 ">
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
                  href="#cancellation-conditions"
                >
                  Cancellation Conditions
                </Link>
              </li>
              <li>
                <Link
                  className="text-blue-500 hover:underline"
                  href="#non-cancellable-services"
                >
                  Non-Cancellable Services
                </Link>
              </li>
              <li>
                <Link
                  className="text-blue-500 hover:underline"
                  href="#process-for-cancellation"
                >
                  Process for Cancellation
                </Link>
              </li>
              <li>
                <Link
                  className="text-blue-500 hover:underline"
                  href="#refund-for-cancellations"
                >
                  Refund for Cancellations
                </Link>
              </li>
              <li>
                <Link
                  className="text-blue-500 hover:underline"
                  href="#changes-to-cancellation-policy"
                >
                  Changes to Cancellation Policy
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
                At SetIndiaBiz, we strive to provide exceptional services to our
                customers. We understand that circumstances may arise where you
                need to cancel a service. This Cancellation Policy outlines the
                terms and conditions under which cancellations can be made and
                the process for doing so.
              </p>
            </section>

            <section id="cancellation-conditions" className="mb-4">
              <h2 className="mb-4 pt-6 text-xl font-bold">
                Cancellation Conditions
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
                Cancellations are permitted under the following conditions:
              </p>
              <ul className="ml-6 list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400 md:text-base">
                {" "}
                {/* Added space-y-1 */}
                <li>
                  <strong>Before Service Initiation:</strong> You may cancel
                  your service request before it has been initiated by our
                  chartered accountants or company secretaries. If the service
                  has already begun, cancellation may not be possible.
                </li>
                <li>
                  <strong>Within 24 Hours of Payment:</strong> If you wish to
                  cancel your service request within 24 hours of making the
                  payment, you may be eligible for a full refund, provided the
                  service has not yet commenced.
                </li>
              </ul>
            </section>

            <section id="non-cancellable-services" className="mb-4">
              <h2 className="mb-4 pt-6 text-xl font-bold">
                Non-Cancellable Services
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
                Certain services may not be eligible for cancellation, including
                but not limited to:
              </p>
              <ul className="ml-6 list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400 md:text-base">
                {" "}
                {/* Added space-y-1 */}
                <li>Services that have already been initiated or completed.</li>
                <li>
                  Customized services that are tailored specifically to your
                  requirements.
                </li>
                <li>
                  Situations where the cancellation is requested beyond the
                  allowable timeframe.
                </li>
              </ul>
            </section>

            <section id="process-for-cancellation" className="mb-4">
              <h2 className="mb-4 pt-6 text-xl font-bold">
                Process for Cancellation
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
                To request a cancellation:
              </p>
              <ul className="ml-6 list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400 md:text-base">
                <li>
                  Contact our support team at
                  <Link
                    className="text-blue-500 hover:underline ml-1 mr-1"
                    href="mailto:help@setindiabiz.com"
                  >
                    help@setindiabiz.com
                  </Link>
                  with your cancellation request, including your order details
                  and reason for cancellation.
                </li>
                <li>
                  Our team will review your request and respond within 3
                  business days to confirm the cancellation status and any
                  applicable refunds.
                </li>
              </ul>
            </section>

            <section id="refund-for-cancellations" className="mb-4">
              <h2 className="mb-4 pt-6 text-xl font-bold">
                Refunds for Cancellations
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
                If your cancellation request is approved:
              </p>
              <ul className="ml-6 list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400 md:text-base">
                <li>
                  <strong>Full Refund:</strong> A full refund will be issued if
                  the service has not yet commenced.
                </li>
                <li>
                  <strong>Partial Refund:</strong> If the service has partially
                  commenced, a prorated refund may be issued based on the work
                  completed.
                </li>
              </ul>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 md:text-base">
                Refunds will be processed through the original payment method,
                including payment gateways like Razorpay or SBI Net Banking.
                Please allow up to 5 business days for the refund to reflect in
                your account.
              </p>
            </section>

            <section id="changes-to-cancellation-policy" className="mb-4">
              <h2 className="mb-4 pt-6 text-xl font-bold">
                Changes to Cancellation Policy
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
                SetIndiaBiz reserves the right to modify this Cancellation
                Policy at any time. Any changes will be effective immediately
                upon posting, and we will notify users of significant changes.
              </p>
            </section>

            <section id="contact-us" className="mb-4">
              <h2 className="mb-4 pt-6 text-xl font-bold">Contact Us</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
                If you have any questions about this Cancellation Policy, please
                contact us at
                <Link
                  className="text-blue-500 hover:underline ml-1"
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
    </>
  );
};

export default CancellationPolicyPage;
