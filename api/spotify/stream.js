const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      success: false,
      Creator: "https://t.me/Krishnetwork",
      error: "url parameter required. Example: ?url=https://open.spotify.com/track/xxx"
    });
  }

  if (!url.includes("spotify.com")) {
    return res.status(400).json({
      success: false,
      Creator: "https://t.me/Krishnetwork",
      error: "Invalid Spotify URL"
    });
  }

  try {
    const { stdout } = await execAsync(
      `yt-dlp -g --no-warnings -f "bestaudio" "${url}"`
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
      error: "Failed to get Spotify stream",
      details: err.message
    });
  }
};
