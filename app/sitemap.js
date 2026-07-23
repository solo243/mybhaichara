export default async function sitemap() {
  const baseUrl = "https://leaftv.fun";

  // 1. Static Pages
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

  // 2. Dynamic Post Pages
  let postRoutes = [];

  try {
    // Fetch data from your home API endpoint
    const response = await fetch(`${baseUrl}/api/home`, {
      // Cache this for 1 hour so Googlebot doesn't spam your API
      // next: { revalidate: 3600 },
    });

    if (response.ok) {
      const result = await response.json();

      // Check if success is true and data array exists
      if (result.success && result.data) {
        postRoutes = result.data.map((video) => ({
          // Using the slug from your JSON for the URL
          url: `${baseUrl}/post/${video.slug}`,
          // Using the updatedAt field from your JSON
          lastModified: new Date(video.updatedAt),
          changeFrequency: "weekly",
          priority: 0.8,
        }));
      }
    }
  } catch (error) {
    console.error("Failed to fetch videos for sitemap:", error);
  }

  // 3. Return the combined routes
  return [...staticRoutes, ...postRoutes];
}
