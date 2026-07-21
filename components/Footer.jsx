import { Star } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="w-full max-w-7xl px-4 mx-auto mt-6 py-10">
      <div className="   md:items-center justify-between flex md:flex-row flex-col ">
        <div>
          <Link href={"/"}>
            <h1 className="font-bold cursor-pointer text-white text-2xl md:text-3xl uppercase">
              bhaichara{" "}
              <span className="text-red-600 text-3xl md:text-4xl leading-0">
                .
              </span>
            </h1>
          </Link>
          <h3 className="mt-1  text-neutral-500">
            © 2025 Bhaichara. All rights reserved.
          </h3>
        </div>
        {/* <ul className="md:flex max-md:mt-4 space-x-8 space-y-3 ">
          <li className="hover:underline cursor-pointer underline-offset-2">
            Privacy Polisy
          </li>
          <li className="hover:underline cursor-pointer underline-offset-2">
            About us
          </li>
          <li className="hover:underline cursor-pointer underline-offset-2">
            Conect us
          </li>
        </ul> */}
      </div>
    </div>
  );
};

export default Footer;
