import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes"; // 1. Fixed import path
import React from "react";

const UserPage = () => {
  return (
    // 3. Fixed the h-full* typo (changed to flex-1 to fill available space)
    <div className="flex w-full flex-1">
      <div className="flex flex-col max-w-7xl pt-14 items-center mx-auto w-full flex-1">
        <SignIn
          appearance={{
            baseTheme: dark, // 2. Changed 'theme' to 'baseTheme'
          }}
        />
      </div>
    </div>
  );
};

export default UserPage;
