// app/sitemap.js
export default async function sitemap() {
  const baseUrl = "https://leaftv.fun";

  // 1. Helper function to create the clean URL text
  const slugify = (value) => {
    if (!value) return "video";
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");
  };

  // 2. Static Pages
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // 3. Dynamic Post Pages
  let postRoutes = [];

  try {
    const response = await fetch(`${baseUrl}/api/home`);

    if (response.ok) {
      const result = await response.json();

      if (result.success && result.data) {
        postRoutes = result.data.map((video) => {
          
          // FIX: Generate the slug from the title, and grab the ID
          const slug = slugify(video.title);
          const id = video._id || video.id;

          return {
            // This now creates the perfect /post/12345/video-title URL
            url: `${baseUrl}/post/${id}/${slug}`,
            lastModified: new Date(video.updatedAt || new Date()),
            changeFrequency: "weekly",
            priority: 0.8,
          };
        });
      }
    }
  } catch (error) {
    console.error("Failed to fetch videos for sitemap:", error);
  }

  // 4. Return the combined routes
  return [...staticRoutes, ...postRoutes];
}