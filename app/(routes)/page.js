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
  return <Home />;
}
