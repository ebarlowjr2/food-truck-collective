import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Absolute base for OG/Twitter image + canonical URLs. Defaults to the real
// domain in production so shared links resolve on onthecurb.app (not a
// *.vercel.app URL). Override with NEXT_PUBLIC_SITE_URL if the domain changes.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production" ? "https://onthecurb.app" : "http://localhost:3000");

const title = "OnTheCurb — Find Food Trucks in Central Alabama";
const description =
  "Find central Alabama food trucks in real time on a live map, book them for private events, and get compliance resources for vendors.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: "OnTheCurb",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-cream">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
