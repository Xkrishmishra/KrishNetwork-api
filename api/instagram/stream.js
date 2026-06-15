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
      `yt-dlp -g --no-warnings -f "best[ext=mp4]/best" "${url}"`
    );

    const streamUrl = stdout.trim().split("\n")[0];

    return res.json({
      success: true,
      Creator: "https://t.me/Krishnetwork",
      stream_url: streamUrl,
      source: url
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      Creator: "https://t.me/Krishnetwork",
      error: "Failed to get stream URL",
      details: err.message
    });
  }
};
