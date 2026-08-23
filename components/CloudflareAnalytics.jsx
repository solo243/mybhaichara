"use client";

import React from "react";
import Script from "next/script";

/**
 * Cloudflare Web Analytics Component
 *
 * Provides privacy-first, cookie-less website analytics (Pageviews, Visitors,
 * Core Web Vitals, Referrers) directly to your Cloudflare dashboard.
 *
 * @param {string} [token] - Optional Cloudflare Web Analytics site token.
 *                           Defaults to process.env.NEXT_PUBLIC_CF_BEACON_TOKEN.
 */
export default function CloudflareAnalytics({ token }) {
  const beaconToken = token || process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

  if (!beaconToken) {
    return null;
  }

  return (
    <Script
      id="cloudflare-web-analytics"
      strategy="afterInteractive"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: beaconToken })}
    />
  );
}
