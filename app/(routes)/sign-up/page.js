// app/(routes)/sign-up/page.js
import SignUpSection from "./SignUpClient";

export const metadata = {
  title: "Sign Up | SetIndiaBiz",
  description: "Create your SetIndiaBiz account to access company search, compliance services, and business solutions. Sign up with email or Google.",
  alternates: {
    canonical: "/companysearch/sign-up",
  },
  openGraph: {
    url: "/companysearch/sign-up",
    type: "website",
    locale: "en_US",
    siteName: "SetIndiaBiz - Online Tax & Compliance Services",
    title: "Sign Up | SetIndiaBiz",
    description: "Register for a free SetIndiaBiz account to explore business compliance services. Sign up with email or Google for quick access.",
    images: [
      {
        url: "https://www.setindiabiz.com/assets/home/ogimage.png",
        width: 1200,
        height: 630,
        alt: "SetIndiaBiz Sign Up",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up | SetIndiaBiz",
    description: "Join SetIndiaBiz to access company search and compliance services. Sign up easily with email or Google.",
    images: [
      "https://www.setindiabiz.com/assets/home/ogimage.png",
    ],
  },
};

export default function Page() {
  return <SignUpSection />;
}
