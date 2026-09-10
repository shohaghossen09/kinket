import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Instrument_Serif, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const serifAccent = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://kineticstudio.dev";
const SITE_NAME = "KINETIC — Creative Technology Studio";
const SITE_DESC =
  "KINETIC is a creative technology studio crafting cinematic digital experiences — web platforms, mobile apps, AI solutions, SaaS products and immersive brand worlds that move people.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "KINETIC — Creative Technology Studio",
    template: "%s | KINETIC",
  },
  description: SITE_DESC,
  keywords: [
    "creative technology studio",
    "digital experiences",
    "web development",
    "mobile app development",
    "AI solutions",
    "SaaS development",
    "UI UX design",
    "e-commerce",
    "SEO digital growth",
    "interactive design",
    "motion design",
  ],
  authors: [{ name: "KINETIC Studio" }],
  creator: "KINETIC Studio",
  publisher: "KINETIC Studio",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "KINETIC",
    title: SITE_NAME,
    description: SITE_DESC,
    locale: "en_US",
    images: [
      {
        url: "/images/work-aether.jpg",
        width: 3000,
        height: 1688,
        alt: "Abstract iridescent liquid metal sculpture — KINETIC creative technology studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@kineticstudio",
    creator: "@kineticstudio",
    title: SITE_NAME,
    description: SITE_DESC,
    images: ["/images/work-aether.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KINETIC Studio",
  url: SITE_URL,
  description: SITE_DESC,
  email: "hello@kineticstudio.dev",
  foundingDate: "2016",
  knowsAbout: [
    "Web Development",
    "Mobile App Development",
    "AI Solutions",
    "SaaS Development",
    "UI/UX Design",
    "E-commerce",
    "SEO & Digital Growth",
  ],
  sameAs: [
    "https://x.com/kineticstudio",
    "https://dribbble.com/kineticstudio",
    "https://www.linkedin.com/company/kineticstudio",
    "https://github.com/kineticstudio",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${display.variable} ${serifAccent.variable} ${sans.variable} ${mono.variable} antialiased bg-background text-foreground`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-accent-foreground"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
