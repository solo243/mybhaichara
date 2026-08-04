"use client";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import { Search, Home,  User, Compass,  Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Navbar = () => {
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  const isActive = (path) => pathname === path;
  const isPostPage = pathname?.startsWith("/post");

  const navItems = [
    // { href: "/", label: "Home", icon: Home },
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
            <ul className="hidden md:flex uppercase font-semibold text-white items-center">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <li
                    className={`flex items-center gap-2 cursor-pointer px-6 py-2 transition-colors ${
                      isActive(item.href)
                        ? "bg-neutral-900 "
                        : "hover:bg-neutral-900"
                    }`}
                  >
                    {item.label === "Search" ? (
                      <Search className="w-5 h-5" />
                    ) : (
                      item.label
                    )}
                  </li>
                </Link>
              ))}
              {/* <li className="pl-6">
                {isSignedIn ? (
                  <UserButton />
                ) : (
                  <SignInButton mode="modal">
                    <button className="px-4 py-2 bg-red-600 rounded-md text-sm hover:bg-red-700 transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                )}
              </li> */}
            </ul>

            {/* Mobile top-right: profile or sign in */}
            {/* <div className="flex items-center gap-4 md:hidden text-white">
              {isSignedIn ? (
                <UserButton />
              ) : (
                <SignInButton mode="modal">
                  <button className="px-3 py-1.5 bg-red-600 rounded-md text-xs font-semibold">
                    Sign In
                  </button>
                </SignInButton>
              )}
            </div> */}
            <div className="p-2.5 md:hidden  rounded-full">
              <Bell size={22} color="white" className="cursor-pointer"/>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Tab Bar */}
      {!isPostPage && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-neutral-800 pb-[env(safe-area-inset-bottom)]">
          <ul className="flex items-center justify-around h-16">
            {navItems.map((item) => {
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
