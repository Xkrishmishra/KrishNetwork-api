const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      success: false,
      Creator: "https://t.me/Krishnetwork",
      error: "url parameter required. Example: ?url=https://www.instagram.com/reel/xxx/"
    });
  }

  if (!url.includes("instagram.com") && !url.includes("instagr.am")) {
    return res.status(400).json({
      success: false,
      Creator: "https://t.me/Krishnetwork",
      error: "Invalid Instagram URL"
    });
  }

  try {
    const { stdout } = await execAsync(
      `yt-dlp --dump-json --no-download --cookies-from-browser none "${url}" 2>/dev/null || yt-dlp --dump-json --no-download "${url}"`
    );

    const info = JSON.parse(stdout.trim().split("\n")[0]);

    return res.json({
      success: true,
      Creator: "https://t.me/Krishnetwork",
      data: {
        id: info.id,
        title: info.title || "Instagram Media",
        description: info.description || "",
        uploader: info.uploader || info.channel || "",
        uploader_url: info.uploader_url || "",
        thumbnail: info.thumbnail || "",
        duration: info.duration || 0,
        view_count: info.view_count || 0,
        like_count: info.like_count || 0,
        upload_date: info.upload_date || "",
        url: info.url || info.webpage_url || url,
        formats: (info.formats || []).map(f => ({
          format_id: f.format_id,
          ext: f.ext,
          quality: f.quality,
          resolution: f.resolution || `${f.width}x${f.height}`,
          url: f.url
        }))
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      Creator: "https://t.me/Krishnetwork",
      error: "Failed to fetch Instagram info",
      details: err.message
    });
  }
};
