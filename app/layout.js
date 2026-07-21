import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Bhaichara",
  description: "Porn should be free",
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${outfit.className} min-h-full bg-black flex flex-col`}>
        <Navbar />
        <main className="grow px-4 w-full ">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
