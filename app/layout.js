import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import ScrollToTop from "@/components/ScrollTop";
import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// ALWAYS use your primary canonical domain (with www if your main site uses www)
const SITE_URL = "https://www.leaftv.fun";

export const metadata = {
  metadataBase: new URL(SITE_URL),

  alternates: {
    canonical: "/",
  },

  title: {
    default: "Bhaichara | Watch & Share Free Videos",
    template: "%s | Watch Free on Bhaichara",
  },

  description:
    "Stream, watch, and share free adult videos on Bhaichara. Enjoy high-quality streaming with no subscription or registration required.",

  keywords: [
    "bhaichara",
    "watch free adult videos",
    "free adult video streaming",
    "hd adult movies",
    "no sign up adult site",
    "indian mms",
  ],

  // Google & SafeSearch Adult Rating Metadata
  other: {
    rating: "adult",
  },

  openGraph: {
    title: "Bhaichara - Watch & Share Free Videos",
    description:
      "Unlimited streaming and sharing of adult videos. No Subscription. Just Play.",
    url: SITE_URL,
    siteName: "Bhaichara",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/ogimg.jpg",
        width: 1200,
        height: 630,
        alt: "Bhaichara Free Streaming Website",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Bhaichara | Watch & Share Free Videos",
    description: "Stream and share free adult videos in HD.",
    images: ["/ogimg.jpg"],
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
  "@type": "WebSite",
  name: "Bhaichara",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?query={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: "dark",
        variables: {
          colorPrimary: "rgb(220 38 38)",
        },
      }}
    >
      <html lang="en" data-scroll-behavior="smooth">
        <head>
          {/* Search Console verification tag */}
          <meta
            name="google-site-verification"
            content="zucoy98lRhLXRncH-YWtrBFIQntWO5YIuJFjlqIyQIk"
          />
          {/* JSON-LD Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body
          className={`${outfit.className} min-h-screen bg-background flex flex-col`}
        >
          <Navbar />
          <ScrollToTop />
          <main className="grow max-md:px-0 px-4 w-full max-md:pb-28">
            {children}
          </main>
          <Footer />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
