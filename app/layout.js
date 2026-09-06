import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollTop";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-outfit",
});

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://leaftv.fun"
).replace(/\/$/, "");

export const viewport = {
  themeColor: "#e50914",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Leaftv Watch Desi Leaks, MMS and Videos for free",
    template: "%s | Watch Free on Leaftv",
  },

  description:
    "Watch Desi Videos , Leaks and MMS for free on Leaftv without signup desi leaks and bhabhi chudai videos and viral reel and viral leaks",

  keywords: [
    "Leaftv",
    "leaks",
    "Leaks",
    "Desi",
    "desi",
    "chudai",
    "sex",
    "mms",
    "nude",
    "nude desi",
    "desi girlfriend",
    "live",
    "bhabhi",
    "leaftv",
    "leaftv fun",
  ],

  alternates: {
    canonical: SITE_URL,
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  manifest: "/manifest.webmanifest",

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Leaftv",
  },

  verification: {
    google: "zucoy98lRhLXRncH-YWtrBFIQntWO5YIuJFjlqIyQIk",
    other: {
      "msvalidate.01": "98F78FD53BF15D3110DC00676A1C4974",
    },
  },

  other: {
    rating: "adult",
  },

  openGraph: {
    title: "Leaftv Watch Desi Leaks, MMS and Videos for free",
    description:
      "Watch Desi Videos , Leaks and MMS for free on Leaftv without signup desi leaks and bhabhi chudai videos and viral reel and viral leaks",
    url: SITE_URL,
    siteName: "Leaftv",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/ogimg.png",
        width: 1200,
        height: 630,
        alt: "Leaftv Free Video Streaming",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Leaftv Watch Desi Leaks, MMS and Videos for free",
    description:
      "Watch Desi Videos , Leaks and MMS for free on Leaftv without signup desi leaks and bhabhi chudai videos and viral reel and viral leaks",
    images: ["/ogimg.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Leaftv",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/ogimg.png`,
        width: 1200,
        height: 630,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Leaftv",
      description:
        "Watch Desi Videos, Leaks and MMS for free on Leaftv without signup.",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/search?query={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={outfit.variable}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <title>Leaftv Watch Desi Leaks, MMS and Videos for free</title>
      </head>

      <body
        className={`${outfit.className} min-h-screen bg-background flex flex-col antialiased`}
      >
        <Navbar />
        <ScrollToTop />
        <main className="grow pt-16 max-md:px-0 px-4 w-full max-md:pb-8">
          {children}
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
