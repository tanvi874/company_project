// app/(routes)/sign-up/page.js
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
  return <UnlockSection />;
}
