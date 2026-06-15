const https = require("https");

function spotifySearch(query) {
  return new Promise((resolve, reject) => {
    // Use Spotify's public search (no auth needed for basic search)
    const encoded = encodeURIComponent(query);
    const options = {
      hostname: "api.spotify.com",
      path: `/v1/search?q=${encoded}&type=track&limit=10`,
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.SPOTIFY_TOKEN || ""}`,
        "Content-Type": "application/json"
      }
    };

    // Fallback: use iTunes Search API (no auth needed)
    const itunesOptions = {
      hostname: "itunes.apple.com",
      path: `/search?term=${encoded}&media=music&limit=10`,
      method: "GET"
    };

    const req = https.request(itunesOptions, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          const results = parsed.results.map(track => ({
            id: track.trackId,
            title: track.trackName,
            artist: track.artistName,
            album: track.collectionName,
            duration_ms: track.trackTimeMillis,
            duration: Math.floor(track.trackTimeMillis / 1000) + "s",
            preview_url: track.previewUrl,
            artwork: track.artworkUrl100?.replace("100x100", "600x600"),
            release_date: track.releaseDate,
            genre: track.primaryGenreName
          }));
          resolve(results);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

module.exports = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      Creator: "https://t.me/Krishnetwork",
      error: "q parameter required. Example: ?q=Arijit Singh"
    });
  }

  try {
    const results = await spotifySearch(q);
    return res.json({
      success: true,
      Creator: "https://t.me/Krishnetwork",
      query: q,
      total: results.length,
      results
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      Creator: "https://t.me/Krishnetwork",
      error: "Search failed",
      details: err.message
    });
  }
};
