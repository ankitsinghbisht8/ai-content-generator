import type { Metadata } from "next";
import { Inter,Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crescent",
  description: "Create high-quality, engaging, and SEO-optimized content in seconds with our advanced AI content generator. Trusted by 10,000+ creators worldwide.",
  icons: {
    icon: [
      { url: "/logoCrescent.png", type: "image/png" },
      { url: "/logoCrescent.svg", type: "image/svg+xml" }
    ],
    shortcut: "/logoCrescent.png",
    apple: "/logoCrescent.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
    </ClerkProvider>
  );
}
