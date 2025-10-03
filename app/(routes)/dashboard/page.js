import DashboardClient from './DashboardClient';

// Metadata for SEO
export const metadata = {
  title: 'Dashboard | SetIndiaBiz',
  description:
    'View your SetIndiaBiz dashboard: track your contact unlock payments, view director unlock history, and manage your account securely.',
  alternates: {
    canonical: '/companysearch/dashboard',
  },
  openGraph: {
    url: '/companysearch/dashboard',
    type: 'website',
    locale: 'en_US',
    siteName: 'SetIndiaBiz - Online Tax & Compliance Services',
    title: 'Dashboard | SetIndiaBiz',
    description:
      'Access your SetIndiaBiz dashboard to track payment history, unlock company director contacts, and manage your account securely.',
    images: [
      {
        url: 'https://www.setindiabiz.com/assets/home/ogimage.png',
        width: 1200,
        height: 630,
        alt: 'SetIndiaBiz Dashboard',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashboard | SetIndiaBiz',
    description:
      'Check your payment history and unlocked director contacts instantly on your SetIndiaBiz dashboard. Secure and reliable business compliance tracking.',
    images: ['https://www.setindiabiz.com/assets/home/ogimage.png'],
  },
};

export default function Page() {
  return <DashboardClient />;
}
