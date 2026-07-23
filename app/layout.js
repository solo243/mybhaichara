import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import ScrollToTop from "@/components/ScrollTop";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  // FIXED: Aligned with your sitemap (no 'www'). Consistency here is critical.
  metadataBase: new URL("https://leaftv.fun"),

  // NEW: Sets the root domain as the master copy to prevent duplicate content penalties
  alternates: {
    canonical: "/",
  },

  title: {
    default: "Bhaichara | Watch & Share Free Videos",
    template: "%s | Watch Free on Bhaichara",
  },

  description:
    "Stream, watch, and share free adult videos on Bhaichara. Enjoy high-quality streaming with no subscription or registration required.",

  // Note: Google ignores keywords, but smaller search engines still use them.
  keywords: [
    "bhaichara",
    "watch free porn",
    "porn sharing website",
    "free adult videos",
    "share videos online",
    "free video streaming",
    "hd adult movies",
    "no sign up adult site",
    "indian mms",
    "indian porn",
  ],

  // NEW: Crucial for your niche. Protects you from silent SafeSearch de-indexing.
  other: {
    rating: "adult",
  },

  openGraph: {
    title: "Bhaichara - Watch & Share Free Videos",
    description:
      "Unlimited streaming and sharing of adult videos. No Subscription. Just Play.",
    url: "https://leaftv.fun/",
    siteName: "Bhaichara",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/ogimg.jpg", // Create a 1200x630 image and put it in your /public folder
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
    images: ["/og-image.jpg"], // Matches the OpenGraph image
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
// Add this right before export default function RootLayout
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Bhaichara",
  url: "https://leaftv.fun/",
  potentialAction: {
    "@type": "SearchAction",
    // This MUST exactly match your actual search route
    target: "https://leaftv.fun/search?query={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};
export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="en" data-scroll-behavior="smooth">
      <head>
        <meta
          name="google-site-verification"
          content="zucoy98lRhLXRncH-YWtrBFIQntWO5YIuJFjlqIyQIk"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${outfit.className} min-h-full bg-black flex flex-col`}>
        <Navbar />
        <ScrollToTop />
        <main className="grow px-4 w-full ">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
