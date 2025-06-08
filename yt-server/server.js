// const express = require('express');
// const ytdl = require('ytdl-core');
// const cors = require('cors');

// const app = express();
// app.use(cors());

// app.get('/api/download', async (req, res) => {
//   const url = req.query.url;

//   if (!ytdl.validateURL(url)) {
//     return res.status(400).json({ error: 'Invalid YouTube URL' });
//   }

//   const info = await ytdl.getInfo(url);
//   const formats = ytdl.filterFormats(info.formats, 'videoandaudio');

//   const response = formats.map(format => ({
//     quality: format.qualityLabel,
//     format: format.container,
//     downloadUrl: format.url
//   }));

//   res.json({ title: info.videoDetails.title, qualities: response });
// });

// const PORT = 3000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));








// ✅ SOLUTION: Switch to a working public API (no decryption needed)
// Let’s fix this quickly by using a stable public API instead of ytdl-core.

// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');

// const app = express();
// const PORT = 3000;

// app.use(cors());

// app.get('/api/download', async (req, res) => {
//   const videoUrl = req.query.url;

//   if (!videoUrl) return res.status(400).json({ error: 'URL is required' });

//   try {
//     // Use a third-party service like SnapAPI (no need to extract manually)
//     const apiUrl = `https://snapapi.online/api/analyze?url=${encodeURIComponent(videoUrl)}`;

//     const response = await axios.get(apiUrl);
//     const data = response.data;

//     res.json(data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch video data' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });












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




// const app = express();
// app.use(cors());

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

// app.listen(3000, () => {
//   console.log('✅ Server running on http://localhost:3000');
// });













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


























const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const ytSearch = require('yt-search');

const app = express();
app.use(cors());

// 🎯 Download video file
app.get('/api/download', async (req, res) => {
  const videoURL = req.query.url;

  if (!ytdl.validateURL(videoURL)) {
    return res.status(400).send('Invalid YouTube URL');
  }

  try {
    const info = await ytdl.getInfo(videoURL);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');

    res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);

    ytdl(videoURL, { format: 'mp4' }).pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Download failed');
  }
});

// 🔍 Search by query
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const result = await ytSearch(query);
    const videos = result.videos.slice(0, 10).map(video => ({
      videoId: video.videoId,
      title: video.title,
      thumbnail: video.thumbnail
    }));

    res.json(videos);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});




// // 🧠 Fetch video metadata + formats
// app.get('/api/download-info', async (req, res) => {
//   const videoURL = req.query.url;

//   if (!ytdl.validateURL(videoURL)) {
//     return res.status(400).send('Invalid YouTube URL');
//   }

//   try {
//     const info = await ytdl.getInfo(videoURL);
//     const formats = info.formats
//       .filter(f => f.hasVideo && f.hasAudio && f.container === 'mp4' && f.qualityLabel)
//       .map(f => ({
//         qualityLabel: f.qualityLabel,
//         container: f.container,
//         url: f.url
//       }));

//     res.json({
//       title: info.videoDetails.title,
//       thumbnail: info.videoDetails.thumbnails.pop().url,
//       formats
//     });
//   } catch (err) {
//     console.error('Download info error:', err);
//     res.status(500).json({ error: 'Could not retrieve download info' });
//   }
// });




// ✅ Updated /api/download-info for Clean Quality Options

// 📺 Clean download options with unique quality labels and AV only
app.get('/api/download-info', async (req, res) => {
  const videoURL = req.query.url;

  if (!ytdl.validateURL(videoURL)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    const info = await ytdl.getInfo(videoURL);

    // Filter only mp4 formats with both video+audio
    const filteredFormats = info.formats.filter(f =>
      f.hasVideo && f.hasAudio && f.container === 'mp4' && f.qualityLabel
    );

    // Deduplicate by qualityLabel
    const uniqueByQuality = {};
    filteredFormats.forEach(f => {
      if (!uniqueByQuality[f.qualityLabel]) {
        uniqueByQuality[f.qualityLabel] = {
          qualityLabel: f.qualityLabel,
          itag: f.itag,
          url: f.url
        };
      }
    });

    const formats = Object.values(uniqueByQuality);

    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails.at(-1).url,
      formats
    });

  } catch (err) {
    console.error('Info error:', err);
    res.status(500).json({ error: 'Could not retrieve download info' });
  }
});







app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
