import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import RealtimeProvider from "@/components/RealtimeProvider";

const font = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LEO - Modern Logistics",
  description: "Next-gen courier and customer experience",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${font.variable} font-sans antialiased bg-[#F5F5F4] text-[#111827] min-h-screen`} suppressHydrationWarning>
        <RealtimeProvider>
          {children}
        </RealtimeProvider>
      </body>
    </html>
  );
}
