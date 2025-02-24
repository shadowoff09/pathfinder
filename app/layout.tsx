import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Geist, Geist_Mono, Onest } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";
import Metrics from "@/components/metrics/Metrics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pathfinder.shadowdev.xyz"),
  title: "Pathfinder",
  description: "Pathfinder is a tool that helps you find the best path for your journey.",
  icons: [
    { rel: "icon", url: "/images/favicon.ico" },
  ],
  openGraph: {
    url: "https://pathfinder.shadowdev.xyz",
    siteName: "Pathfinder",
    title: "Pathfinder",
    description: "Pathfinder is a tool that helps you find the best path for your journey.",
    images: "/banner.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pathfinder",
    description: "Pathfinder is a tool that helps you find the best path for your journey.",
    images: "/banner.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${onest.variable} antialiased font-onest`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
        <Metrics />
        <Analytics />
      </body>
    </html>
  );
}
