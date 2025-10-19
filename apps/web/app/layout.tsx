import type { Metadata } from 'next';
import './globals.css';

const SITE_TITLE = 'Abhinav Pandey — Portfolio (Coming Soon)';
const SITE_DESCRIPTION =
  'Design portfolio experience in progress. Follow along as the CMS and web client come online.';

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  viewport: 'width=device-width, initial-scale=1',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
