import Header from '../components/Header';
import Footer from '../components/Footer';
import "./globals.css";
import { AuthProvider } from 'context/AuthContext';

export const metadata = {
  metadataBase: new URL("https://www.setindiabiz.com"),
  title: "Setindiabiz: Expert CA, CS, Legal & CFO Services | Online",
  description: "Setindiabiz is a platform that connects clients with a network of experts, such as Chartered Accountants, Company Secretaries, Cost and Management Accountants, CPAs, Valuers, Insolvency Professionals, Lawyers, and Other Consultants.",
  icons: {
    icon: 'https://www.setindiabiz.com/assets/company-name-search/favicon.webp',
  },
  robots: {
    follow: false,
    index: false,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  openGraph: {
    url: "./",
    locale: "en_US",
    type: "article",
    siteName:
      "Online Tax and Compliance Services for Startups and Small Business | Setindiabiz",
    images: [
      {
        url: "https://www.setindiabiz.com/assets/home/ogimage.png",
        width: 1200,
        height: 630,
        alt: "setindiabiz",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@setindiabiz",
    creator: "@setindiabiz",
  },
};


export default function RootLayout({ children }) {
  return (
  <html lang="en" suppressHydrationWarning>
    <body suppressHydrationWarning>
      <AuthProvider>
        <Header />
        {children}
        <Footer />
      </AuthProvider>
    </body>
  </html>
  );
}
