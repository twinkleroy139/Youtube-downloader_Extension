// ✅ The Real Problem
// You're probably stripping query params incorrectly or validating 
// YouTube URLs too strictly. 
// That’s why even valid links return "Invalid YouTube URL".

// 🔧 Fix your server.js
// Here’s the correct and fixed version of the GET /api/download-info route:


const express = require("express");
const ytdl = require("@distube/ytdl-core");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

// ✅ Utility to clean and validate YouTube URLs
function cleanYouTubeUrl(url) {
  try {
    const parsedUrl = new URL(url);

    if (
      parsedUrl.hostname.includes("youtube.com") ||
      parsedUrl.hostname.includes("youtu.be")
    ) {
      // Get the full watch URL with only the video ID
      const videoId =
        parsedUrl.hostname === "youtu.be"
          ? parsedUrl.pathname.slice(1)
          : parsedUrl.searchParams.get("v");

      if (!videoId) return null;

      return `https://www.youtube.com/watch?v=${videoId}`;
    }

    return null;
  } catch (e) {
    return null;
  }
}

// ✅ API endpoint
app.get("/api/download-info", async (req, res) => {
  const originalUrl = req.query.url;
  const cleanedUrl = cleanYouTubeUrl(originalUrl);

  if (!cleanedUrl) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  try {
    const info = await ytdl.getInfo(cleanedUrl);
    const formats = ytdl.filterFormats(info.formats, "audioandvideo");

    const videoInfo = {
      title: info.videoDetails.title,
      author: info.videoDetails.author.name,
      duration: info.videoDetails.lengthSeconds,
      formats: formats.map((f) => ({
        quality: f.qualityLabel,
        itag: f.itag,
        container: f.container,
        size: f.contentLength,
        url: f.url,
      })),
    };

    res.json(videoInfo);
  } catch (err) {
    console.error("Download info error:", err.message);
    res.status(500).json({ error: "Failed to fetch video info" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});































// // ✅ Fix Options
// // Option 1: Use Only ytdl-core (Recommended for Local Use)
// // Instead of relying on snapapi.online, 
// // use ytdl-core (as you had before). 
// // Here's a simple, working server.js example using only ytdl-core:

// // server.js
// const express = require('express');
// const cors = require('cors');
// // const ytdl = require('ytdl-core');
// // After:
// const ytdl = require('@distube/ytdl-core');



// // 2. Update server.js to Include a Search Route
// // Here's the updated version of your server.js with both download 
// // and search functionality:

// // server.js
// const express = require('express');
// const cors = require('cors');
// const ytdl = require('@distube/ytdl-core');
// const ytSearch = require('yt-search'); // 👈 Add this

// const app = express();
// app.use(cors());

// // 🎯 Download Endpoint
// app.get('/api/download', async (req, res) => {
//   const videoURL = req.query.url;
  
//   if (!ytdl.validateURL(videoURL)) {
//     return res.status(400).send('Invalid YouTube URL');
//   }

//   try {
//     const info = await ytdl.getInfo(videoURL);
//     const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
    
//     res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);

//     ytdl(videoURL, {
//       format: 'mp4'
//     }).pipe(res);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Download failed');
//   }
// });

// // 🔍 Search Endpoint
// // app.get('/api/search', async (req, res) => {
// //   const query = req.query.q;
// //   if (!query) {
// //     return res.status(400).json({ error: 'Query parameter is required' });
// //   }

// //   try {
// //     const result = await ytSearch(query);
// //     const videos = result.videos.slice(0, 10); // return first 10 videos
// //     res.json(videos);
// //   } catch (err) {
// //     console.error('Search error:', err);
// //     res.status(500).json({ error: 'Search failed' });
// //   }
// // });




// app.get('/api/search', async (req, res) => {
//   const query = req.query.q;
//   if (!query) {
//     return res.status(400).json({ error: 'Query parameter is required' });
//   }

//   try {
//     const result = await ytSearch(query);
//     const videos = result.videos.slice(0, 10).map(video => ({
//       id: video.videoId,
//       title: video.title,
//       thumbnail: video.thumbnail,
//       url: video.url
//     }));

//     res.json({ results: videos }); // ✅ fixed structure
//   } catch (err) {
//     console.error('Search error:', err);
//     res.status(500).json({ error: 'Search failed' });
//   }
// });




// app.listen(3000, () => {
//   console.log('✅ Server running on http://localhost:3000');
// });


















// const express = require('express');
// const cors = require('cors');
// const ytdl = require('@distube/ytdl-core');
// const ytSearch = require('yt-search');

// const app = express();
// app.use(cors());

// // Download video file (direct streaming)
// app.get('/api/download', async (req, res) => {
//   const videoURL = req.query.url;

//   if (!ytdl.validateURL(videoURL)) {
//     return res.status(400).send('Invalid YouTube URL');
//   }

//   try {
//     const info = await ytdl.getInfo(videoURL);
//     const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');

//     res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);

//     ytdl(videoURL, { format: 'mp4' }).pipe(res);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Download failed');
//   }
// });

// // Search videos by query
// app.get('/api/search', async (req, res) => {
//   const query = req.query.q;
//   if (!query) {
//     return res.status(400).json({ error: 'Query parameter is required' });
//   }

//   try {
//     const result = await ytSearch(query);
//     const videos = result.videos.slice(0, 10).map(video => ({
//       videoId: video.videoId,
//       title: video.title,
//       thumbnail: video.thumbnail
//     }));

//     res.json(videos);
//   } catch (err) {
//     console.error('Search error:', err);
//     res.status(500).json({ error: 'Search failed' });
//   }
// });

// // Get video info + quality formats (mp4 with video+audio)
// app.get('/api/download-info', async (req, res) => {
//   const videoURL = req.query.url;

//   if (!ytdl.validateURL(videoURL)) {
//     return res.status(400).json({ error: 'Invalid YouTube URL' });
//   }

//   try {
//     const info = await ytdl.getInfo(videoURL);

//     const filteredFormats = info.formats.filter(f =>
//       f.hasVideo && f.hasAudio && f.container === 'mp4' && f.qualityLabel
//     );

//     const uniqueByQuality = {};
//     filteredFormats.forEach(f => {
//       if (!uniqueByQuality[f.qualityLabel]) {
//         uniqueByQuality[f.qualityLabel] = {
//           qualityLabel: f.qualityLabel,
//           itag: f.itag,
//           url: f.url
//         };
//       }
//     });

//     const formats = Object.values(uniqueByQuality);

//     res.json({
//       title: info.videoDetails.title,
//       thumbnail: info.videoDetails.thumbnails.at(-1).url,
//       formats
//     });
//   } catch (err) {
//     console.error('Info error:', err);
//     res.status(500).json({ error: 'Could not retrieve download info' });
//   }
// });

// app.listen(3000, () => {
//   console.log('✅ Server running on http://localhost:3000');
// });




















// const express = require('express');
// const cors = require('cors');
// const ytdl = require('@distube/ytdl-core');
// const ytSearch = require('yt-search');

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());

// // Test root route
// app.get('/', (req, res) => {
//   res.send('🟢 YouTube Downloader API is running');
// });

// // Route: Search YouTube
// app.get('/api/search', async (req, res) => {
//   const query = req.query.q;
//   console.log('🔍 Search called with:', query);

//   if (!query) return res.status(400).json({ error: 'Missing query' });

//   try {
//     const result = await ytSearch(query);
//     const videos = result.videos.slice(0, 5).map(video => ({
//       title: video.title,
//       videoId: video.videoId,
//       thumbnail: video.thumbnail,
//       duration: video.timestamp
//     }));
//     res.json(videos);
//   } catch (err) {
//     console.error('Search failed:', err.message);
//     res.status(500).json({ error: 'Search failed' });
//   }
// });



// // Route: Download info
// app.get('/api/download-info', async (req, res) => {
//   try {
//     let videoUrl = decodeURIComponent(req.query.url || '');

//     // ✅ Strip off any ?si=... or other query params
//     videoUrl = videoUrl.split('&')[0].split('?')[0];

//     if (!ytdl.validateURL(videoUrl)) {
//       return res.status(400).json({ error: 'Invalid YouTube URL' });
//     }

//     const info = await ytdl.getInfo(videoUrl);

//     const formats = info.formats
//       .filter(f => f.hasVideo && f.hasAudio && f.container === 'mp4' && f.qualityLabel)
//       .map(f => ({
//         url: f.url,
//         qualityLabel: f.qualityLabel,
//         container: f.container,
//         mimeType: f.mimeType
//       }));

//     res.json({
//       title: info.videoDetails.title,
//       thumbnail: info.videoDetails.thumbnails?.[0]?.url || '',
//       formats
//     });
//   } catch (err) {
//     console.error('Download info error:', err.message);
//     res.status(500).json({ error: 'Failed to fetch video info' });
//   }
// });




// // Start server
// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });
