import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pay Per Demo",
  description:
    "Pay once to attend virtual demos. No account, API key, or subscription.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
