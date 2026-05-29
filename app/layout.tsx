import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Dr. Saad Al Ghanam — Therapy Sessions',
  description: 'Book a therapy session with Dr. Saad Al Ghanam. View available slots, book online, and pay securely.',
  openGraph: {
    title: 'Dr. Saad Al Ghanam — Therapy Sessions',
    description: 'Book a therapy session with Dr. Saad Al Ghanam online.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              background: '#1e293b',
              color: '#f8fafc',
            },
          }}
        />
      </body>
    </html>
  );
}
