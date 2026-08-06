import { Home, Compass, Search, User } from "lucide-react";
import Link from "next/link";
import React from "react";

const Navbar2 = () => {
  const DesktopNavbar = [
    { href: "/", label: "Home", icon: Home },
    { href: "/feed", label: "Feed", icon: Compass },
    { href: "/user", label: "User", icon: User },
  ];

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
          <ul c>
            {DesktopNavbar.map((item, index) => (
              <li key={index} className="flex ">
                <span>{item.icon}</span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar2;
