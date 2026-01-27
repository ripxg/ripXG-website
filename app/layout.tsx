import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ripXG - AI for everyone. Do more (and fast) with tech hacks.",
  description: "Go fast and do more with tech hacks. Automate everything. Personal blog and insights from ripXG on observability, AI agents, SRE, and building systems that scale.",
  metadataBase: new URL('https://ripxg.com'),
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: "ripXG - AI for everyone. Do more (and fast) with tech hacks.",
    description: "Go fast and do more with tech hacks. Automate everything. Personal blog and insights from ripXG on observability, AI agents, SRE, and building systems that scale.",
    type: "website",
    locale: "en_US",
    siteName: "ripXG",
  },
  twitter: {
    card: "summary_large_image",
    title: "ripXG - AI for everyone. Do more (and fast) with tech hacks.",
    description: "Go fast and do more with tech hacks. Automate everything. Personal blog and insights from ripXG on observability, AI agents, SRE, and building systems that scale.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
