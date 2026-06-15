# 🔥 KrishNetwork Media API

> Powerful media downloader API for Instagram, YouTube, TikTok, Twitter, Pinterest & Spotify

**Made by:** [Coder~Krish](https://github.com/Xkrishmishra) | **Channel:** [@Krishnetwork](https://t.me/Krishnetwork)

---

## 📡 Endpoints

| Platform | Method | Endpoint |
|---|---|---|
| Root | GET | `/` |
| Instagram Info | GET | `/instagram/info?url=` |
| Instagram Stream | GET | `/instagram/stream?url=` |
| Pinterest Stream | GET | `/pinterest/stream?url=` |
| Spotify Search | GET | `/spotify/search?q=` |
| Spotify Info | GET | `/spotify/info?url=` |
| Spotify Stream | GET | `/spotify/stream?url=` |
| TikTok Download | GET | `/tiktok/download?url=` |
| Twitter/X Download | GET | `/x/download?url=` |
| YouTube Stream | GET | `/youtube/stream?url=` |

---

## 🚀 Deploy on Vercel

1. Fork this repo
2. Go to [vercel.com](https://vercel.com)
3. Import the repo
4. Deploy — done!

---

## 💻 Local Setup

```bash
git clone https://github.com/Xkrishmishra/KrishNetwork-API
cd KrishNetwork-API
npm install
# Install yt-dlp
pip install yt-dlp
npm run dev
```

---

## 📌 Example Usage

```
GET /instagram/info?url=https://www.instagram.com/reel/xxx/
GET /youtube/stream?url=https://youtube.com/watch?v=xxx&quality=720
GET /tiktok/download?url=https://vm.tiktok.com/xxx/
GET /spotify/search?q=Arijit+Singh
GET /x/download?url=https://twitter.com/user/status/xxx
```

---

**© KrishNetwork | Coder~Krish**
