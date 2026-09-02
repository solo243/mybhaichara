export default function manifest() {
  return {
    name: "Leaftv - Watch & Share Free Videos",
    short_name: "Leaftv",
    description:
      "Stream, watch, and share free videos on Leaftv with high quality video streaming and zero subscription.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#e50914",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
