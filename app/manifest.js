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
        src: "/ogimg.png",
        sizes: "1200x630",
        type: "image/png",
      },
    ],
  };
}
