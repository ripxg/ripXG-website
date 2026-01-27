import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RipXG - Observability Advisor | AI Agent Specialist",
  description: "Personal blog and insights from Jeff Chau on observability, AI agents, SRE, and building systems that scale.",
  metadataBase: new URL('https://ripxg.com'),
  openGraph: {
    title: "RipXG - Observability Advisor | AI Agent Specialist",
    description: "Personal blog and insights from Jeff Chau on observability, AI agents, SRE, and building systems that scale.",
    type: "website",
    locale: "en_US",
    siteName: "RipXG",
  },
  twitter: {
    card: "summary_large_image",
    title: "RipXG - Observability Advisor | AI Agent Specialist",
    description: "Personal blog and insights from Jeff Chau on observability, AI agents, SRE, and building systems that scale.",
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
