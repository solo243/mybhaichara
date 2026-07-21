import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://www.leaftv.fun/"), // Replace with your actual domain

  // 1. Title: The first thing Google sees.
  title: {
    default: "Bhaichara | Watch & Share Free Videos",
    template: "%s | Watch Free on Bhaichara",
  },

  // 2. Description: The snippet shown under the link in Google.
  description:
    "Stream, watch, and share free adult videos on Bhaichara. Enjoy high-quality streaming with no subscription or registration required.",

  // 3. Keywords: vital for helping search engines understand your niche.
  keywords: [
    "bhaichara",
    "watch free porn",
    "porn sharing website",
    "free adult videos",
    "share videos online",
    "free video streaming",
    "hd adult movies",
    "no sign up adult site",
  ],

  // 4. Open Graph: Controls how your link looks on Facebook/Discord/WhatsApp
  openGraph: {
    title: "Bhaichara - Watch & Share Free Videos",
    description:
      "Unlimited streaming and sharing of adult videos. No Subscription. Just Play.",
    url: "https://www.leaftv.fun/", // Replace with your actual domain
    siteName: "Bhaichara",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/favicon.png", // Update this to your site's Open Graph image
        width: 1200,
        height: 630,
        alt: "Bhaichara Free Streaming Website",
      },
    ],
  },

  // 5. Twitter Card: Controls how it looks on X (Twitter)
  twitter: {
    card: "summary_large_image",
    title: "Bhaichara | Watch & Share Free Videos",
    description: "Stream and share free adult videos in HD.",
    images: ["/favicon.png"], // Reuses the same image
  },

  // 6. Robots: Ensures Google knows it's allowed to index your site
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
export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${outfit.className} min-h-full bg-black flex flex-col`}>
        <Navbar />
        <main className="grow px-4 w-full ">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
