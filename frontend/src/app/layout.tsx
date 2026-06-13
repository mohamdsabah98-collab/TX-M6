import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'TX-M6 - File Hosting & Sharing',
  description: 'Modern, fast, and secure file hosting and sharing platform inspired by MediaFire and Google Drive',
  keywords: 'file hosting, file sharing, storage, cloud storage',
  authors: [{ name: 'TX-M6 Team' }],
  openGraph: {
    title: 'TX-M6 - File Hosting & Sharing',
    description: 'Modern, fast, and secure file hosting and sharing platform',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
