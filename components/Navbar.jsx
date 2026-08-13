"use client";
import {
  Search,
  Home,
  User,
  Compass,
  User2,
  Menu,
  X,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavigationItemDesktop = [
    { href: "/", label: "Home", icon: Home },
    // { href: "/feed", label: "Feed", icon: Compass },
    { href: "/about", label: "about", icon: Search },
  ];

  const NavigationItemMobile = [
    { href: "/", label: "Home", icon: Home },
    // { href: "/feed", label: "Feed", icon: Compass },
    { href: "/about", label: "about", icon: Info },

    // { href: "/user", label: "Profile", icon: User },
  ];

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky w-full bg-background border-border backdrop-blur-xl top-0 border-b transition-colors duration-300 z-50">
      <nav className="max-w-7xl mx-auto px-2">
        <div className="flex h-16 items-center justify-between">
          {/* Logo area */}
          <div className="flex items-center">
            <Link
              href={"/"}
              className="font-bold cursor-pointer text-text-primary text-2xl md:text-3xl uppercase"
            >
              leaftv{" "}
              <span className="text-primary text-3xl md:text-4xl leading-0">
                .
              </span>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden  lg:flex flex-1 w-full max-w-2xl mx-8 items-center px-4 h-10 bg-surface border border-border  overflow-hidden transition-all  ">
            <Search className="text-text-secondary w-5 h-5 mr-2" />
            <input
              type="text"
              placeholder="search video..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full h-full outline-none bg-transparent text-text-primary placeholder:text-text-secondary"
            />
          </div>

          {/* Desktop links */}
          <ul className="hidden lg:flex space-x-4 uppercase font-semibold text-text-primary items-center">
            {NavigationItemDesktop.map((item) => (
              <Link key={item.href} href={item.href}>
                <li className="flex items-center gap-1 cursor-pointer px-4 py-2 transition-colors hover:bg-surface-hover ">
                  {item.label === "Search" ? (
                    <Search className="w-4 h-4" />
                  ) : (
                    item.label
                  )}
                </li>
              </Link>
            ))}

            {/* <Link
              href={"/user"}
              className="flex border ml-2 border-border cursor-pointer hover:bg-surface-hover items-center p-2 bg-surface rounded-full transition-colors"
            >
              <User2 size={23} />
            </Link> */}
          </ul>

          {/* Mobile Top Actions */}
          <div className="flex items-center lg:hidden space-x-2">
            <Link
              href={"/search"}
              className="p-2 rounded-full hover:bg-surface-hover transition-colors"
            >
              <Search size={22} className="text-text-primary" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full hover:bg-surface-hover transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-text-primary" />
              ) : (
                <Menu
                  size={24}
                  className={`transition-all duration-300 ease-in-out text-text-primary ${
                    isMobileMenuOpen
                      ? "opacity-0 rotate-90 scale-50"
                      : "opacity-100 rotate-0 scale-100"
                  }`}
                />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div
          className={`lg:hidden absolute top-16 left-0 w-full bg-background border-b border-border shadow-lg transition-all duration-300 ease-in-out origin-top ${
            isMobileMenuOpen
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 -translate-y-4 invisible"
          }`}
        >
          {/* Mobile Search Input */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center px-4 h-12 bg-surface border border-border  overflow-hidden">
              <Search className="text-text-secondary w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="search video..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full h-full outline-none bg-transparent text-md text-text-primary placeholder:text-text-secondary"
              />
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <ul className="flex flex-col py-2">
            {NavigationItemMobile.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 text-text-primary hover:bg-surface-hover transition-colors uppercase font-semibold text-md"
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
