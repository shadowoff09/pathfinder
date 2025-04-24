import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Geist, Geist_Mono, Onest } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";
import Metrics from "@/components/metrics/Metrics";
import DonationDialog from "@/components/DonationDialog";
import { Toaster } from "sonner";

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
  title: "Pathfinder",
  description: "Pathfinder",
  icons: [
    { rel: "icon", url: "/images/favicon.ico" },
  ],
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
        <DonationDialog showButton={false} />
        <Toaster />
      </body>
    </html>
  );
}
