"use client";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import {
  Search,
  Home,
  User,
  Compass,
  Bell,
  NewspaperIcon,
  User2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Navbar = () => {
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  const isActive = (path) => pathname === path;
  const isPostPage = pathname?.startsWith("/post");

  const NavigationItemDesktop = [
    { href: "/", label: "Home", icon: Home },
    { href: "/feed", label: "Feed", icon: Compass },
    { href: "/search", label: "search", icon: Search },
  ];

  const NavigationItemMobile = [
    { href: "/", label: "Home", icon: Home },
    { href: "/feed", label: "Feed", icon: Compass },
    { href: "/search", label: "Search", icon: Search },
    { href: "/user", label: "User", icon: User },
  ];
  return (
    <>
      {/* Top Navbar */}
      <header className="sticky w-full bg-black/95 border-neutral-800 backdrop-blur-xl px-4 top-0 border-b transition-colors duration-300 z-50">
        <nav className="max-w-7xl mx-auto">
          <div className="flex h-16 items-center justify-between">
            <Link
              href={"/"}
              className="font-bold cursor-pointer text-white text-2xl md:text-3xl uppercase"
            >
              bhaichara{" "}
              <span className="text-red-600 text-3xl md:text-4xl leading-0">
                .
              </span>
            </Link>

            {/* Desktop links */}
            <ul className="hidden md:flex space-x-2 uppercase font-semibold text-white items-center">
              {NavigationItemDesktop.map((item) => (
                <Link key={item.href} href={item.href}>
                  <li
                    className={`flex items-center gap-2 cursor-pointer px-6 py-2 transition-colors ${
                      isActive(item.href)
                        ? "bg-neutral-900 "
                        : "hover:bg-neutral-900"
                    }`}
                  >
                    <item.icon size={20} />
                    {item.label === "Search" ? (
                      <Search className="w-4 h-4" />
                    ) : (
                      item.label
                    )}
                  </li>
                </Link>
              ))}

              {/* <div className="p-2.5 ml-2   rounded-full">
                <Bell size={22} color="white" className="cursor-pointer" />
              </div> */}
              <Link
                href={"/user"}
                className="flex border ml-2 border-neutral-700  cursor-pointer hover:bg-surface-hover items-center p-2 bg-surface rounded-full"
              >
                <User2 size={23} />
              </Link>
            </ul>
            <div className="p-2.5 ml-2 md:hidden   rounded-full">
              <Bell size={22} color="white" className="cursor-pointer" />
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Tab Bar */}
      {!isPostPage && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-neutral-800 pb-[env(safe-area-inset-bottom)]">
          <ul className="flex items-center justify-around h-16">
            {NavigationItemMobile.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} className="flex-1 ">
                  <li className="flex flex-col items-center justify-center gap-1 py-2">
                    <Icon
                      size={22}
                      strokeWidth={active ? 2.5 : 1.8}
                      className={active ? "text-red-600" : "text-neutral-400"}
                    />
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wide ${
                        active ? "text-red-600" : "text-neutral-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  </li>
                </Link>
              );
            })}
          </ul>
        </nav>
      )}
    </>
  );
};

export default Navbar;
