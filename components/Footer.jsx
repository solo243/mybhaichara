import Link from "next/link";
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full max-w-7xl px-4 mx-auto mt-auto py-10 border-t border-border/40">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/" className="inline-block">
            <div className="font-bold cursor-pointer text-text-primary text-2xl md:text-3xl uppercase tracking-wider">
              Leaftv
              <span className="text-primary text-3xl md:text-4xl leading-none">
                .
              </span>
            </div>
          </Link>
          <h3 className="mt-1 text-sm text-neutral-400">
            © {currentYear} Leaftv. All rights reserved.
          </h3>
        </div>

        <div className="flex items-center gap-6 text-sm text-neutral-400">
          <Link
            href="/about"
            className="hover:text-text-primary transition-colors"
          >
            About & Disclaimer
          </Link>
          <Link
            href="/search"
            className="hover:text-text-primary transition-colors"
          >
            Search
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
