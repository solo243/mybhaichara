"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Home, Menu, X, Info } from "lucide-react";

const NAV_ITEMS_DESKTOP = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Info },
];

const NAV_ITEMS_MOBILE = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Info },
];

const Navbar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e);
    }
  };

  return (
    <header className="fixed w-full bg-background/90 border-border backdrop-blur-xl top-0 border-b transition-colors duration-300 z-50">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo area */}
          <div className="flex items-center">
            <Link
              href="/"
              className="font-bold cursor-pointer text-text-primary text-2xl md:text-3xl uppercase tracking-wider select-none"
            >
              leaftv
              <span className="text-primary text-3xl md:text-4xl leading-none">
                .
              </span>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex flex-1 w-full max-w-2xl mx-8 items-center px-4 h-10 bg-surface border border-border overflow-hidden transition-all focus-within:border-text-secondary"
          >
            <Search className="text-text-secondary w-5 h-5 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="search video..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-full outline-none bg-transparent text-text-primary placeholder:text-text-secondary text-sm"
            />
          </form>

          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex space-x-2 uppercase font-semibold text-text-primary items-center text-sm">
            {NAV_ITEMS_DESKTOP.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 px-4 py-2  transition-colors hover:bg-surface-hover cursor-pointer"
                >
                  {/* <item.icon className="w-4 h-4 text-text-secondary" /> */}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Actions */}
          <div className="flex items-center lg:hidden space-x-2">
            <Link
              href="/search"
              aria-label="Search"
              className="p-2  hover:bg-surface-hover transition-colors"
            >
              <Search size={22} className="text-text-primary" />
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="p-2  hover:bg-surface-hover transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-text-primary" />
              ) : (
                <Menu size={24} className="text-text-primary" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-background border-b border-border shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Mobile Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="p-4 border-b border-border"
          >
            <div className="flex items-center px-4 h-12 bg-surface border border-border  overflow-hidden focus-within:border-text-secondary">
              <Search className="text-text-secondary w-5 h-5 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="search video..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-full outline-none bg-transparent text-sm text-text-primary placeholder:text-text-secondary"
              />
            </div>
          </form>

          {/* Mobile Navigation Links */}
          <ul className="flex flex-col py-2">
            {NAV_ITEMS_MOBILE.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 text-text-primary hover:bg-surface-hover transition-colors uppercase font-semibold text-sm"
                >
                  <item.icon size={20} className="text-text-secondary" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
