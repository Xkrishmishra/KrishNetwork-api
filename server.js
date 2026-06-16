const express = require("express");
const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// ── ROOT ──
app.get("/", (req, res) => {
  res.json({
    Creator: "https://t.me/Krishnetwork",
    Developer: "Coder~Krish | github.com/Xkrishmishra",
    message: "KrishNetwork API is live! 🔥",
    available_endpoints: {
      instagram: ["/instagram/info?url=", "/instagram/stream?url="],
      youtube: ["/youtube/stream?url="],
      tiktok: ["/tiktok/download?url="],
      spotify: ["/spotify/search?q=", "/spotify/info?url=", "/spotify/stream?url="],
      twitter: ["/x/download?url="],
      pinterest: ["/pinterest/stream?url="]
    }
  });
});

// ── INSTAGRAM INFO ──
app.get("/instagram/info", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ success: false, error: "url required" });
  try {
    const { stdout } = await execAsync(`yt-dlp --dump-json --no-download "${url}"`);
    const info = JSON.parse(stdout.trim().split("\n")[0]);
    res.json({
      success: true,
      Creator: "https://t.me/Krishnetwork",
      data: {
        id: info.id,
        title: info.title || "Instagram Media",
        description: info.description || "",
        uploader: info.uploader || "",
        thumbnail: info.thumbnail || "",
        duration: info.duration || 0,
        view_count: info.view_count || 0,
        like_count: info.like_count || 0,
        upload_date: info.upload_date || "",
        url: info.webpage_url || url
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, Creator: "https://t.me/Krishnetwork", error: err.message });
  }
});

// ── INSTAGRAM STREAM ──
app.get("/instagram/stream", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ success: false, error: "url required" });
  try {
    const { stdout } = await execAsync(`yt-dlp -g --no-warnings -f "best[ext=mp4]/best" "${url}"`);
    res.json({ success: true, Creator: "https://t.me/Krishnetwork", stream_url: stdout.trim().split("\n")[0] });
  } catch (err) {
    res.status(500).json({ success: false, Creator: "https://t.me/Krishnetwork", error: err.message });
  }
});

// ── YOUTUBE STREAM ──
app.get("/youtube/stream", async (req, res) => {
  const { url, quality } = req.query;
  if (!url) return res.status(400).json({ success: false, error: "url required" });
  let format = "best[ext=mp4]/best";
  if (quality === "audio") format = "bestaudio";
  else if (quality === "360") format = "best[height<=360]";
  else if (quality === "480") format = "best[height<=480]";
  else if (quality === "720") format = "best[height<=720]";
  else if (quality === "1080") format = "best[height<=1080]";
  try {
    const { stdout: infoOut } = await execAsync(`yt-dlp --dump-json --no-download "${url}"`);
    const info = JSON.parse(infoOut.trim().split("\n")[0]);
    const { stdout: streamOut } = await execAsync(`yt-dlp -g --no-warnings -f "${format}" "${url}"`);
    res.json({
      success: true,
      Creator: "https://t.me/Krishnetwork",
      data: {
        id: info.id,
        title: info.title,
        channel: info.channel || "",
        duration: info.duration,
        thumbnail: info.thumbnail || "",
        stream_url: streamOut.trim().split("\n")[0],
        quality: quality || "best"
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, Creator: "https://t.me/Krishnetwork", error: err.message });
  }
});

// ── TIKTOK DOWNLOAD ──
app.get("/tiktok/download", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ success: false, error: "url required" });
  try {
    const { stdout } = await execAsync(`yt-dlp --dump-json --no-download "${url}"`);
    const info = JSON.parse(stdout.trim().split("\n")[0]);
    const { stdout: streamOut } = await execAsync(`yt-dlp -g --no-warnings -f "best[ext=mp4]/best" "${url}"`);
    res.json({
      success: true,
      Creator: "https://t.me/Krishnetwork",
      data: {
        id: info.id,
        title: info.title || info.description || "TikTok Video",
        author: info.uploader || "",
        duration: info.duration || 0,
        thumbnail: info.thumbnail || "",
        download_url: streamOut.trim().split("\n")[0]
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, Creator: "https://t.me/Krishnetwork", error: err.message });
  }
});

// ── SPOTIFY SEARCH ──
app.get("/spotify/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ success: false, error: "q required" });
  try {
    const fetch = require("node-fetch");
    const encoded = encodeURIComponent(q);
    const response = await fetch(`https://itunes.apple.com/search?term=${encoded}&media=music&limit=10`);
    const data = await response.json();
    const results = data.results.map(track => ({
      id: track.trackId,
      title: track.trackName,
      artist: track.artistName,
      album: track.collectionName,
      duration: Math.floor(track.trackTimeMillis / 1000) + "s",
      preview_url: track.previewUrl,
      artwork: track.artworkUrl100?.replace("100x100", "600x600"),
      release_date: track.releaseDate,
      genre: track.primaryGenreName
    }));
    res.json({ success: true, Creator: "https://t.me/Krishnetwork", query: q, total: results.length, results });
  } catch (err) {
    res.status(500).json({ success: false, Creator: "https://t.me/Krishnetwork", error: err.message });
  }
});

// ── SPOTIFY INFO ──
app.get("/spotify/info", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ success: false, error: "url required" });
  try {
    const { stdout } = await execAsync(`yt-dlp --dump-json --no-download "${url}"`);
    const info = JSON.parse(stdout.trim().split("\n")[0]);
    res.json({ success: true, Creator: "https://t.me/Krishnetwork", data: { id: info.id, title: info.title, artist: info.artist || "", album: info.album || "", duration: info.duration, thumbnail: info.thumbnail } });
  } catch (err) {
    res.status(500).json({ success: false, Creator: "https://t.me/Krishnetwork", error: err.message });
  }
});

// ── SPOTIFY STREAM ──
app.get("/spotify/stream", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ success: false, error: "url required" });
  try {
    const { stdout } = await execAsync(`yt-dlp -g --no-warnings -f "bestaudio" "${url}"`);
    res.json({ success: true, Creator: "https://t.me/Krishnetwork", stream_url: stdout.trim().split("\n")[0] });
  } catch (err) {
    res.status(500).json({ success: false, Creator: "https://t.me/Krishnetwork", error: err.message });
  }
});

// ── TWITTER/X DOWNLOAD ──
app.get("/x/download", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ success: false, error: "url required" });
  try {
    const { stdout } = await execAsync(`yt-dlp --dump-json --no-download "${url}"`);
    const info = JSON.parse(stdout.trim().split("\n")[0]);
    const { stdout: streamOut } = await execAsync(`yt-dlp -g --no-warnings -f "best[ext=mp4]/best" "${url}"`);
    res.json({
      success: true,
      Creator: "https://t.me/Krishnetwork",
      data: {
        id: info.id,
        title: info.title || "",
        uploader: info.uploader || "",
        thumbnail: info.thumbnail || "",
        duration: info.duration || 0,
        download_url: streamOut.trim().split("\n")[0]
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, Creator: "https://t.me/Krishnetwork", error: err.message });
  }
});

// ── PINTEREST STREAM ──
app.get("/pinterest/stream", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ success: false, error: "url required" });
  try {
    const { stdout } = await execAsync(`yt-dlp -g --no-warnings -f "best[ext=mp4]/best" "${url}"`);
    res.json({ success: true, Creator: "https://t.me/Krishnetwork", stream_url: stdout.trim().split("\n")[0] });
  } catch (err) {
    res.status(500).json({ success: false, Creator: "https://t.me/Krishnetwork", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 KrishNetwork API running on port ${PORT}`);
});
