const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      success: false,
      Creator: "https://t.me/Krishnetwork",
      error: "url parameter required. Example: ?url=https://www.tiktok.com/@user/video/xxx"
    });
  }

  if (!url.includes("tiktok.com") && !url.includes("vm.tiktok.com")) {
    return res.status(400).json({
      success: false,
      Creator: "https://t.me/Krishnetwork",
      error: "Invalid TikTok URL"
    });
  }

  try {
    const { stdout } = await execAsync(
      `yt-dlp --dump-json --no-download "${url}"`
    );
    const info = JSON.parse(stdout.trim().split("\n")[0]);

    const { stdout: streamOut } = await execAsync(
      `yt-dlp -g --no-warnings -f "best[ext=mp4]/best" "${url}"`
    );
    const streamUrl = streamOut.trim().split("\n")[0];

    return res.json({
      success: true,
      Creator: "https://t.me/Krishnetwork",
      data: {
        id: info.id,
        title: info.title || info.description || "TikTok Video",
        author: info.uploader || info.channel || "",
        duration: info.duration || 0,
        view_count: info.view_count || 0,
        like_count: info.like_count || 0,
        comment_count: info.comment_count || 0,
        thumbnail: info.thumbnail || "",
        download_url: streamUrl,
        source: url
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      Creator: "https://t.me/Krishnetwork",
      error: "Failed to fetch TikTok video",
      details: err.message
    });
  }
};
