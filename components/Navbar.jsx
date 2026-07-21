"use client";
import { Search, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
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

          <ul className="hidden md:flex uppercase font-semibold text-white items-center ">
            <Link href={"/"}>
              <li className="cursor-pointer px-6 hover:bg-neutral-900 py-2  transition-colors">
                home
              </li>
            </Link>
            <Link href={"/about"}>
              <li className="cursor-pointer px-6 hover:bg-neutral-900 py-2  transition-colors">
                About
              </li>
            </Link>
            <Link href={"/search"}>
              <li className="flex cursor-pointer px-6 gap-2 hover:bg-neutral-900 py-2  transition-colors">
                <Search className="w-5 h-5" />
              </li>
            </Link>
          </ul>

          <div className="flex items-center gap-4 md:hidden text-white">
            <Link href={"/search"} className="p-1 ">
              <Search className="   cursor-pointer" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2  focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-neutral-800 pb-4 pt-2">
            <ul className="flex flex-col uppercase font-semibold text-white space-y-1">
              <Link href={"/"}>
                <li className="cursor-pointer px-4 hover:bg-neutral-900 py-3  transition-colors">
                  home
                </li>
              </Link>
              <Link href={"/about"}>
                <li className="cursor-pointer px-4 hover:bg-neutral-900 py-3  transition-colors">
                  About
                </li>
              </Link>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
