// ✅ Cleaned & Updated server.js:
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const YtDlpWrap = require('yt-dlp-wrap').default;
const ytSearch = require('yt-search');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const ytDlpWrap = new YtDlpWrap("/usr/bin/yt-dlp");

// ✅ Utility: clean YouTube URL
function cleanYouTubeUrl(url) {
  try {
    const parsed = new URL(url);
    const v = parsed.searchParams.get("v");
    if (v) return `https://www.youtube.com/watch?v=${v}`;
    return parsed.origin + parsed.pathname;
  } catch {
    return url;
  }
}

// === Search endpoint ===
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing search query' });

  try {
    const result = await ytSearch(q);
    const videos = result.videos.slice(0, 5).map(v => ({
      title: v.title,
      videoId: v.videoId,
      url: v.url,
      thumbnail: v.thumbnail
    }));
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === Download Info endpoint ===
app.get('/api/download-info', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url' });

  const safeUrl = cleanYouTubeUrl(url);

  try {
    const infoJson = await ytDlpWrap.getVideoInfo(safeUrl);
    const title = infoJson.title;
    const thumbnail = infoJson.thumbnail;
    const formats = infoJson.formats.filter(f => f.acodec !== 'none' && f.vcodec !== 'none');

    res.json({ title, thumbnail, formats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === Download endpoint ===
app.post('/api/download', async (req, res) => {
  const { url, formatId } = req.body;
  if (!url || !formatId) return res.status(400).json({ error: 'Missing url or formatId' });

  const safeUrl = cleanYouTubeUrl(url);
  const outputPath = path.resolve(__dirname, 'downloads');
  if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath);

  const outputFilename = `${Date.now()}-%(title)s.%(ext)s`;

  const process = ytDlpWrap.exec([
    safeUrl,
    '-f', formatId,
    '-o', path.join(outputPath, outputFilename)
  ]);

  process.once('close', (code) => {
    if (code === 0) {
      res.json({ success: true, message: 'Download started' });
    } else {
      res.status(500).json({ error: 'Download failed', code });
    }
  });

  process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
});

// Serve downloads folder (optional)
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});





















// // using render and git global config
// const express = require('express');
// const cors = require('cors');
// const { exec } = require('child_process');
// const YtDlpWrap = require('yt-dlp-wrap').default;
// const ytSearch = require('yt-search');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// const PORT = process.env.PORT || 10000;

// app.use(cors());
// app.use(express.json());

// const ytDlpWrap = new YtDlpWrap("/usr/bin/yt-dlp");

// // === Search endpoint ===
// app.get('/api/search', async (req, res) => {
//   const { q } = req.query;
//   if (!q) return res.status(400).json({ error: 'Missing search query' });

//   try {
//     const result = await ytSearch(q);
//     const videos = result.videos.slice(0, 5).map(v => ({
//       title: v.title,
//       videoId: v.videoId,
//       url: v.url,
//       thumbnail: v.thumbnail
//     }));
//     res.json(videos);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // === Download Info endpoint ===
// app.get('/api/download-info', async (req, res) => {
//   const { url } = req.query;
//   if (!url) return res.status(400).json({ error: 'Missing url' });

//   try {
//     const infoJson = await ytDlpWrap.getVideoInfo(url);
//     const title = infoJson.title;
//     const thumbnail = infoJson.thumbnail;
//     const formats = infoJson.formats.filter(f => f.acodec !== 'none' && f.vcodec !== 'none');

//     res.json({ title, thumbnail, formats });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // === Download endpoint ===
// app.post('/api/download', async (req, res) => {
//   const { url, formatId } = req.body;
//   if (!url || !formatId) return res.status(400).json({ error: 'Missing url or formatId' });

//   const outputPath = path.resolve(__dirname, 'downloads');
//   if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath);

//   const outputFilename = `${Date.now()}-%(title)s.%(ext)s`;

//   const process = ytDlpWrap.exec([
//     url,
//     '-f', formatId,
//     '-o', path.join(outputPath, outputFilename)
//   ]);

//   process.once('close', (code) => {
//     if (code === 0) {
//       res.json({ success: true, message: 'Download started' });
//     } else {
//       res.status(500).json({ error: 'Download failed', code });
//     }
//   });

//   process.stderr.on('data', (data) => {
//     console.error(`stderr: ${data}`);
//   });
// });

// // Serve downloads folder (optional)
// app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// // Start server
// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });

















// // with local server
// // Full working example of a YouTube downloader API using yt-dlp and yt-search
// const express = require('express');
// const cors = require('cors');
// const YtDlpWrap = require('yt-dlp-wrap').default; // 👈 IMPORTANT: .default!
// const ytSearch = require('yt-search');


// const app = express();
// const PORT = 10000;
// // const ytDlpWrap = new YtDlpWrap();
// const ytDlpWrap = new YtDlpWrap();


// app.use(cors());

// // Search videos from keywords
// app.get('/api/search', async (req, res) => {
//   try {
//     const query = req.query.q;
//     const result = await ytSearch(query);
//     const videos = result.videos.slice(0, 5).map(video => ({
//       title: video.title,
//       videoId: video.videoId,
//       thumbnail: video.thumbnail,
//     }));
//     res.json(videos);
//   } catch (err) {
//     res.status(500).json({ error: 'Search failed' });
//   }
// });

// // Get muxed video download links
// app.get('/api/download-info', async (req, res) => {
//   const videoUrl = req.query.url;
//   if (!videoUrl) {
//     return res.status(400).json({ error: 'URL is required' });
//   }

//   try {
//     const info = await ytDlpWrap.getVideoInfo(videoUrl);
//     const muxed = info.formats.filter(
//       f => f.vcodec !== 'none' && f.acodec !== 'none' && f.filesize
//     );

//     const simplified = muxed.map(f => ({
//       quality: f.format_note || `${f.height}p`,
//       container: f.ext,
//       url: f.url,
//     }));

//     res.json({
//       title: info.title,
//       thumbnail: info.thumbnail,
//       formats: simplified,
//     });
//   } catch (err) {
//     console.error('yt-dlp error:', err.message);
//     res.status(500).json({ error: 'Failed to fetch video info' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });
































// const express = require('express');
// const cors = require('cors');
// const ytSearch = require('yt-search');
// const { exec } = require('child_process');

// const app = express();
// const PORT = 10000;

// app.use(cors());

// app.get('/', (req, res) => {
//   res.send('✅ YouTube Downloader API is working!');
// });

// // ✅ YouTube keyword search
// app.get('/api/search', async (req, res) => {
//   const query = req.query.q;
//   if (!query) return res.status(400).json({ error: 'Missing query' });

//   try {
//     const result = await ytSearch(query);
//     const videos = result.videos.slice(0, 10);
//     res.json(videos);
//   } catch (err) {
//     res.status(500).json({ error: 'Search failed', details: err.message });
//   }
// });

// // ✅ Get muxed formats only (no merging needed)
// app.get('/api/download-info', (req, res) => {
//   const url = req.query.url;
//   if (!url) return res.status(400).json({ error: 'Missing URL' });

//   const command = `yt-dlp -J "${url}"`;

//   exec(command, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
//     if (err) {
//       console.error('yt-dlp error:', stderr);
//       return res.status(500).json({ error: 'Failed to fetch video info' });
//     }

//     try {
//       const info = JSON.parse(stdout);

//       // ✅ Only muxed formats (audio + video)
//       const formats = info.formats
//         .filter(f => f.url && f.vcodec !== 'none' && f.acodec !== 'none')
//         .map(f => ({
//           url: f.url,
//           quality: f.format_note || f.quality_label,
//           container: f.ext,
//         }));

//       res.json({
//         title: info.title,
//         thumbnail: info.thumbnail,
//         formats,
//       });
//     } catch (parseErr) {
//       console.error('Parse error:', parseErr);
//       res.status(500).json({ error: 'Error parsing yt-dlp output' });
//     }
//   });
// });

// // ✅ Optional: Direct download stream
// app.get('/api/download', (req, res) => {
//   const url = req.query.url;
//   if (!url) return res.status(400).json({ error: 'Missing URL' });

//   res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
//   res.setHeader('Content-Type', 'video/mp4');

//   const command = `yt-dlp -f best -o - "${url}" | ffmpeg -i pipe:0 -c copy -f mp4 pipe:1`;
//   const process = exec(command, { maxBuffer: 1024 * 1024 * 500 });

//   process.stdout.pipe(res);
//   process.stderr.on('data', data => {
//     console.error('yt-dlp error:', data.toString());
//   });
// });

// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
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
