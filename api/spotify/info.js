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
      `yt-dlp --dump-json --no-download "${url}"`
    );
    const info = JSON.parse(stdout.trim().split("\n")[0]);

    return res.json({
      success: true,
      Creator: "https://t.me/Krishnetwork",
      data: {
        id: info.id,
        title: info.title,
        artist: info.artist || info.uploader || "",
        album: info.album || "",
        duration: info.duration,
        thumbnail: info.thumbnail,
        url: info.webpage_url || url
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      Creator: "https://t.me/Krishnetwork",
      error: "Failed to fetch Spotify info",
      details: err.message
    });
  }
};
