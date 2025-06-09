// ✅ 1. YouTube URL search not working
// Cause: Your popup.js sends all input to /api/search, even if it's a full YouTube URL like https://www.youtube.com/watch?v=....

// But /api/search only works for search terms — not direct video URLs.

// ✅ Fix:
// Update your popup.js to detect a YouTube URL and skip search when it's a link:


// document.getElementById('searchBtn').addEventListener('click', async () => {
//   const query = document.getElementById('searchInput').value.trim();
//   const results = document.getElementById('results');
//   results.innerHTML = 'Loading...';

//   const isYoutubeURL = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(query);

//   if (isYoutubeURL) {
//     // Direct link → show 1 download button
//     results.innerHTML = '';
//     const btn = document.createElement('button');
//     btn.textContent = "Download Video";
//     btn.onclick = () => window.open(`http://localhost:3000/api/download?url=${encodeURIComponent(query)}`, '_blank');
//     results.appendChild(btn);
//     return;
//   }

//   // Otherwise → treat as search term
//   try {
//     const res = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(query)}`);
//     if (!res.ok) throw new Error('Server error');

//     const data = await res.json();
//     results.innerHTML = '';

//     data.results.forEach(video => {
//       const div = document.createElement('div');
//       div.className = 'video-item';

//       const img = document.createElement('img');
//       img.src = video.thumbnail;
//       img.alt = video.title;

//       const title = document.createElement('strong');
//       title.textContent = video.title;

//       const btn = document.createElement('button');
//       btn.textContent = "Download";
//       btn.addEventListener('click', () => {
//         window.open(`http://localhost:3000/api/download?url=${encodeURIComponent(video.url)}`, '_blank');
//       });

//       div.appendChild(img);
//       div.appendChild(title);
//       div.appendChild(btn);

//       results.appendChild(div);
//     });
//   } catch (err) {
//     console.error(err);
//     results.innerHTML = 'Error fetching search results.';
//   }
// });






// document.getElementById('searchBtn').addEventListener('click', async () => {
//   const query = document.getElementById('searchInput').value.trim();
//   const results = document.getElementById('results');
//   results.innerHTML = 'Loading...';

//   const isYoutubeURL = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(query);

//   if (isYoutubeURL) {
//     // Direct download for YouTube URL
//     results.innerHTML = '';
//     const btn = document.createElement('button');
//     btn.textContent = "Download Video";
//     btn.addEventListener('click', () => {
//       window.open(`http://localhost:3000/api/download?url=${encodeURIComponent(query)}`, '_blank');
//     });
//     results.appendChild(btn);
//     return;
//   }

//   // Handle as a search term
//   try {
//     const res = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(query)}`);
//     if (!res.ok) throw new Error('Server error');

//     const data = await res.json();
//     results.innerHTML = '';

//     data.results.forEach(video => {
//       const div = document.createElement('div');
//       div.className = 'video-item';

//       const img = document.createElement('img');
//       img.src = video.thumbnail;
//       img.alt = video.title;
//       img.style.width = '100%';

//       const title = document.createElement('strong');
//       title.textContent = video.title;

//       const btn = document.createElement('button');
//       btn.textContent = "Download";
//       btn.addEventListener('click', () => {
//         window.open(`http://localhost:3000/api/download?url=${encodeURIComponent(video.url)}`, '_blank');
//       });

//       div.appendChild(img);
//       div.appendChild(title);
//       div.appendChild(btn);

//       results.appendChild(div);
//     });
//   } catch (err) {
//     console.error(err);
//     results.innerHTML = 'Error fetching search results.';
//   }
// });

























const API_BASE = "https://yt-server-qo6z.onrender.com";

document.getElementById('searchBtn').addEventListener('click', async () => {
  const query = document.getElementById('searchInput').value.trim();
  const results = document.getElementById('results');
  results.innerHTML = 'Loading...';
  const inputUrl = document.getElementById("urlInput").value.trim();
  cleanUrl = inputUrl.split("&")[0].split("?")[0];
  fetch(`https://yt-server-qo6z.onrender.com/api/download-info?url=${encodeURIComponent(inputUrl)}`)


  const ytUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

  if (ytUrlRegex.test(query)) {
    try {
      const res = await fetch(`${API_BASE}/api/download-info?url=${encodeURIComponent(query)}`);
      const data = await res.json();

      results.innerHTML = `
        <div class="video-item">
          <img src="${data.thumbnail}" alt="Thumbnail">
          <strong>${data.title}</strong>
        </div>
        <div><b>Select Quality to Download:</b></div>
      `;

      data.formats.forEach(format => {
        const btn = document.createElement('button');
        btn.textContent = `${format.qualityLabel} (${format.container})`;
        btn.onclick = () => window.open(format.url, '_blank');
        results.appendChild(btn);
      });
    } catch (err) {
      results.innerHTML = 'Error fetching video info.';
    }
  } else {
    try {
      const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      results.innerHTML = '';
      data.forEach(video => {cd
        const div = document.createElement('div');
        div.className = 'video-item';

        const thumb = document.createElement('img');
        thumb.src = video.thumbnail;

        const title = document.createElement('strong');
        title.textContent = video.title;

        const btn = document.createElement('button');
        btn.textContent = 'Download';
        btn.onclick = async () => {
          results.innerHTML = 'Loading download options...';

          // When clicking "Download" on search results
        const infoRes = await fetch(`${API_BASE}/api/download-info?url=https://www.youtube.com/watch?v=${video.videoId}`);

          
          const info = await infoRes.json();

          results.innerHTML = `
            <div class="video-item">
              <img src="${info.thumbnail}" alt="Thumbnail">
              <strong>${info.title}</strong>
            </div>
            <div><b>Select Quality to Download:</b></div>
          `;

          info.formats.forEach(format => {
            const b = document.createElement('button');
            b.textContent = `${format.qualityLabel} (${format.container})`;
            b.onclick = () => window.open(format.url, '_blank');
            results.appendChild(b);
          });
        };

        div.appendChild(thumb);
        div.appendChild(title);
        div.appendChild(btn);
        results.appendChild(div);
      });
    } catch (err) {
      results.innerHTML = 'Error fetching search results.';
    }
  }
});
