// pages/api/gallery.js
// Fetches images from Cloudinary by tag — no manual link updates needed!

export default async function handler(req, res) {
  const { tag } = req.query;

  if (!tag) {
    return res.status(400).json({ error: "Tag parameter is required" });
  }

  const allowedTags = ["pov", "t2a", "nsr"];
  if (!allowedTags.includes(tag)) {
    return res.status(400).json({ error: "Invalid tag" });
  }

  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Use Cloudinary's resources_by_tag REST endpoint
    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/by_tag/${tag}?max_results=50&resource_type=image`,
      {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudinary API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Return only what the frontend needs
    const images = data.resources.map((img) => ({
      id: img.public_id,
      url: img.secure_url,
      width: img.width,
      height: img.height,
      // Generate a smaller thumbnail URL via Cloudinary transformations
      thumb: img.secure_url.replace(
        "/upload/",
        "/upload/w_800,c_limit,q_auto,f_auto/"
      ),
    }));

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate"); // cache 5 min
    return res.status(200).json({ images });
  } catch (error) {
    console.error("Cloudinary fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch images" });
  }
}
