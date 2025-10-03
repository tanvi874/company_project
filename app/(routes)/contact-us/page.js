import Image from "next/image";
import { MapPin, Phone, Mail, Copy, MessageCircle } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

export const metadata = {
  title: "Contact Us | Setindiabiz",
  description:
    "Get in touch with Setindiabiz. Reach out via phone, email, WhatsApp, or visit our corporate office in Noida. We're here to help with RoC compliance and business services.",
  alternates: {
    canonical: "/companysearch/contact-us",
  },
  openGraph: {
    url: "/companysearch/contact-us",
    type: "website",
    locale: "en_US",
    siteName: "Setindiabiz - Online Tax & Compliance Services",
    title: "Contact Us | Setindiabiz",
    description:
      "Contact Setindiabiz for queries about RoC compliance, company registration, GST, LLP, and trademark services.",
    images: [
      {
        url: "https://www.setindiabiz.com/assets/home/ogimage.png",
        width: 1200,
        height: 630,
        alt: "Setindiabiz - Contact Page",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Setindiabiz",
    description:
      "Reach out to Setindiabiz via phone, email, or WhatsApp. Visit our corporate office in Noida for assistance.",
    images: ["https://www.setindiabiz.com/assets/home/ogimage.png"],
  },
};

const ContactPage = () => {
  return (
    <>
      <Script
        type="application/ld+json"
        id="contact-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Setindiabiz",
            url: "https://www.setindiabiz.com",
            logo: "https://www.setindiabiz.com/assets/home/ogimage.png",
            sameAs: [
              "https://www.facebook.com/Setindiabiz",
              "https://twitter.com/Setindiabiz",
              "https://www.linkedin.com/company/setindiabiz",
            ],
            contactPoint: [
              {
                "@type": "ContactPoint",
                telephone: "+91-9899600605",
                contactType: "customer support",
                areaServed: "IN",
                availableLanguage: "en",
              },
              {
                "@type": "ContactPoint",
                email: "help@setindiabiz.com",
                contactType: "customer support",
                areaServed: "IN",
                availableLanguage: "en",
              },
              {
                "@type": "ContactPoint",
                contactType: "WhatsApp support",
                telephone: "+91-9899600605",
                areaServed: "IN",
                availableLanguage: "en",
                url: "https://api.whatsapp.com/send/?phone=919899600605",
              },
            ],
            address: {
              "@type": "PostalAddress",
              streetAddress: "A-34, Sector 2",
              addressLocality: "Noida",
              addressRegion: "Uttar Pradesh",
              postalCode: "201301",
              addressCountry: "IN",
            },
          }),
        }}
      />

      <main className="min-h-screen flex-1">
        <div>
          <section>
            <div className="relative h-14 overflow-hidden md:h-16">
              <div className="absolute bottom-0 left-0 right-0 top-0 -z-20 bg-gradient-to-r from-midnight-blue to-navy-blue"></div>
            </div>
          </section>

          <section className="wrapper mt-10">
            <div className="container">
              <div className="space-y-4">
                <div className="border-l-[6px] border-primary bg-muted p-6">
                  <h1 className="text-2xl font-bold tracking-tighter md:text-3xl">
                    Get in touch
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground md:text-base/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                  {`Have questions or need assistance? We'd love to hear from you. Here's how you can reach us...`}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8 bg-muted">
            <div className="wrapper flex flex-col-reverse gap-12 rounded-md px-4 pb-20 pt-10 md:px-16 lg:flex-row lg:items-center lg:gap-6">
              {/* Google Map Section */}
              <div className="w-full overflow-hidden rounded-xl border shadow-sm">
                <iframe
                  width="100%"
                  height="380px"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.4528734389423!2d77.31272299999999!3d28.586187799999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce59f0421017f%3A0x4d1e3a7abc9c4532!2sSETINDIABIZ%20-%20Company%20Registration%2C%20LLP%20Registration%2C%20Trademark%2C%20GST%20and%20Company%20Annual%20Return%20Filing!5e0!3m2!1sen!2sin!4v1694072970970!5m2!1sen!2sin"
                  allowFullScreen
                  loading="lazy"
                  title="Google Map Location of Office"
                ></iframe>
              </div>

              {/* Contact Info Section */}
              <div className="w-full space-y-8">
                <div>
                  <Image
                    alt="FileSure Logo"
                    width={160}
                    height={100}
                    className="mx-auto bg-black rounded p-2"
                    src="https://www.setindiabiz.com/assets/images/setindiabiz-white-logo.png"
                  />
                  <p className="mt-2 text-balance text-center text-sm opacity-90">
                    {`India's first platform dedicated to simplifying RoC Compliance for company owners and compliance professionals`}
                  </p>

                  {/* Address Block */}
                  <div className="mx-auto mt-4 flex max-w-md flex-col items-center gap-4 rounded-md bg-background p-4 shadow md:flex-row">
                    <span className="flex-center size-14 flex-shrink-0 rounded-full shadow-md">
                      <MapPin
                        className="size-8 text-primary"
                        aria-hidden="true"
                      />
                    </span>
                    <p className="flex flex-col gap-1.5 text-center text-sm opacity-90 md:text-left">
                      <strong className="text-base">CORPORATE OFFICE:</strong>
                      <strong>SetIndiaBiz Private Limited</strong>
                      <span>A-34, Sector 2, Noida, Uttar Pradesh - 201301</span>
                    </p>
                  </div>

                  {/* Contact Methods Grid */}
                  <div className="mx-auto mt-6 w-full max-w-4xl px-4">
                    <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
                      {/* Phone */}
                      <div className="flex flex-col items-center">
                        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted-foreground">
                          <Phone
                            className="size-6 text-primary-foreground"
                            aria-hidden="true"
                          />
                        </div>
                        <h3 className="mb-2 text-base font-bold uppercase">
                          Phone
                        </h3>
                        <p className="mb-2 text-sm text-muted-foreground">
                          +91-9899600605
                        </p>
                      </div>

                      {/* Email */}
                      <div className="flex flex-col items-center">
                        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted-foreground">
                          <Mail
                            className="size-6 text-primary-foreground"
                            aria-hidden="true"
                          />
                        </div>
                        <h3 className="mb-2 text-base font-bold uppercase">
                          Email
                        </h3>
                        <p className="mb-2 text-sm text-muted-foreground">
                          help@setindiabiz.com
                        </p>
                      </div>

                      {/* WhatsApp */}
                      <div className="flex flex-col items-center">
                        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted-foreground">
                          <MessageCircle
                            className="size-6 text-primary-foreground"
                            aria-hidden="true"
                          />
                        </div>
                        <h3 className="mb-2 text-base font-bold uppercase">
                          WhatsApp
                        </h3>
                        <Link
                          href={
                            "https://api.whatsapp.com/send/?phone=919899600605"
                          }
                        >
                          <p className="mb-2 text-sm text-muted-foreground">
                            Start Chat
                          </p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default ContactPage;
