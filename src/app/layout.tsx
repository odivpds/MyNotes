import type { Metadata, Viewport } from "next";
import { Comic_Neue, Space_Grotesk, Space_Mono, Press_Start_2P } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const comicNeue = Comic_Neue({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const pixelFont = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const viewport: Viewport = {
  themeColor: "#E6B905",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "NOPEPADS",
  description: "A brutally awesome markdown notebook",
  icons: {
    icon: '/nopePadsLogo3d.png',
    apple: '/nopePadsLogo.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NOPEPADS",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${comicNeue.variable} ${spaceGrotesk.variable} ${spaceMono.variable} ${pixelFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
