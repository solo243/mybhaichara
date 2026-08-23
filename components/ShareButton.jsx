"use client";

import React, { useState, useRef, useEffect } from "react";
import { Share, Check } from "lucide-react";

const ShareButton = ({
  title = "Check out this video on Leaftv",
  text = "",
  url,
  className = "",
}) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleShare = async () => {
    const shareUrl =
      url || (typeof window !== "undefined" ? window.location.href : "");

    // 1. Native Web Share API (Mobile devices & supported browsers)
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title,
          text: text || title,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Ignore user cancellation (AbortError), otherwise fall back to clipboard
        if (err?.name === "AbortError") return;
      }
    }

    // 2. Clipboard API fallback (Desktop browsers)
    try {
      if (navigator?.clipboard && window?.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      // Reset existing timer so rapid clicks keep notification fresh
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      setCopied(true);
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleShare}
        aria-label={copied ? "Link copied to clipboard" : "Share this post"}
        className={`bg-neutral-900 hover:bg-neutral-800 transition-colors duration-200 flex items-center gap-2 px-4 py-2 rounded text-text-primary text-sm cursor-pointer select-none active:scale-95 ${className}`}
      >
        {copied ? (
          <>
            <Check size={18} className="text-emerald-400 animate-in fade-in zoom-in duration-150" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Share size={18} />
            <span>Share</span>
          </>
        )}
      </button>

      {/* Accessible floating notification */}
      {copied && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 left-1/2 -translate-x-1/2 bg-accent text-text-primary px-6 py-2 rounded-lg shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 font-medium text-sm select-none"
        >
          Link copied!
        </div>
      )}
    </>
  );
};

export default ShareButton;
