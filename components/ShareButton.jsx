"use client";

import React, { useState } from "react";
import { Share } from "lucide-react";

const ShareButton = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = window.location.href;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <button
        onClick={handleCopy}
        className="bg-neutral-900 hover:bg-neutral-800 transition flex items-center gap-2 px-4 py-2 rounded text-white text-sm cursor-pointer"
      >
        <Share size={18} />
        Share
      </button>

      {copied && (
        <div className="fixed top-20  flex text-center left-1/2 -translate-x-1/2 bg-accent text-white px-7 py-2 rounded-lg shadow-lg z-50">
          Link copied!
        </div>
      )}
    </>
  );
};

export default ShareButton;
