import Header from '../components/Header';
import Footer from '../components/Footer';
import "./globals.css";
import { AuthProvider } from 'context/AuthContext';

export const metadata = {
  title: "Setindiabiz: Expert CA, CS, Legal & CFO Services | Online",
  description: "Setindiabiz is a platform that connects clients with a network of experts, such as Chartered Accountants, Company Secretaries, Cost and Management Accountants, CPAs, Valuers, Insolvency Professionals, Lawyers, and Other Consultants.",  
  icons: {
    icon: 'https://www.setindiabiz.com/assets/company-name-search/favicon.webp',
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
