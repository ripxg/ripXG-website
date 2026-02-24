import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ripXG — AI Agents & Tech for Everyone",
  description: "I build and manage custom AI agents that automate your workflows. Plus: practical guides on AI, observability, and building fast.",
  metadataBase: new URL('https://ripxg.com'),
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: "ripXG — AI Agents & Tech for Everyone",
    description: "I build and manage custom AI agents that automate your workflows. Plus: practical guides on AI, observability, and building fast.",
    type: "website",
    locale: "en_US",
    siteName: "ripXG",
  },
  twitter: {
    card: "summary_large_image",
    title: "ripXG — AI Agents & Tech for Everyone",
    description: "I build and manage custom AI agents that automate your workflows. Plus: practical guides on AI, observability, and building fast.",
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
