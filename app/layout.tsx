import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  subsets: ["latin"],
});

const siteUrl = process.env.BASE_URL ?? "https://pay-per-demo.vercel.app";
const title = "Pay Per Demo — Send your agent for 1¢";
const description =
  "Send an AI agent to Agentic Commerce Demo Day with one 0.01 USDC payment on Base. No account, API key, or subscription.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Pay Per Demo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  keywords: [
    "agentic commerce",
    "AgentCash",
    "x402",
    "USDC",
    "Base",
    "AI agents",
  ],
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistMono.className}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
