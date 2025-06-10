const API_BASE = "https://yt-server-qo6z.onrender.com";

document.getElementById('searchBtn').addEventListener('click', async () => {
  const input = document.getElementById('search').value.trim();
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (!input) return;

  let videos = [];
  const isUrl = input.includes('youtube.com') || input.includes('youtu.be');

  try {
    if (isUrl) {
      const res = await fetch(`${API_BASE}/api/download-info?url=${encodeURIComponent(input)}`);
      const data = await res.json();
      videos = [{ title: data.title, thumbnail: data.thumbnail, url: input }];
    } else {
      const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(input)}`);
      const data = await res.json();
      videos = data;
    }

    videos.forEach(video => {
      const div = document.createElement('div');
      div.className = 'video-result';
      div.innerHTML = `
        <strong>${video.title}</strong><br/>
        <img src="${video.thumbnail || 'https://i.ytimg.com/vi/' + video.videoId + '/hqdefault.jpg'}" />
        <button class="download-btn" data-url="${video.url || 'https://www.youtube.com/watch?v=' + video.videoId}">
          Show Download Options
        </button>
        <div class="formats"></div>
      `;
      resultsDiv.appendChild(div);
    });
  } catch (err) {
    resultsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
  }
});

document.getElementById('results').addEventListener('click', async (e) => {
  if (e.target.classList.contains('download-btn')) {
    const url = e.target.getAttribute('data-url');
    const formatsDiv = e.target.nextElementSibling;
    formatsDiv.innerHTML = 'Loading...';

    try {
      const res = await fetch(`${API_BASE}/api/download-info?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      formatsDiv.innerHTML = '';

      if (data.formats.length === 0) {
        formatsDiv.innerHTML = '<small>No available muxed formats</small>';
        return;
      }

      data.formats.forEach(format => {
        const btn = document.createElement('button');
        btn.className = 'format-option';
        btn.innerText = `${format.ext} - ${format.formatNote || format.quality} - ${format.filesize ? (format.filesize / 1e6).toFixed(1) + 'MB' : 'unknown size'}`;
        btn.onclick = async () => {
          try {
            const res = await fetch(`${API_BASE}/api/download`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                url,
                formatId: format.format_id
              })
            });

            const result = await res.json();
            if (result.success) {
              alert('✅ Download started!');
            } else {
              alert('❌ Failed: ' + result.error);
            }
          } catch (err) {
            alert('❌ Error: ' + err.message);
          }
        };
        formatsDiv.appendChild(btn);
      });
    } catch (err) {
      formatsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
    }
  }
});


























// const API_BASE = "https://your-render-subdomain.onrender.com"; // <- Replace with your real URL

// document.getElementById('searchBtn').addEventListener('click', async () => {
//   const input = document.getElementById('search').value.trim();
//   const resultsDiv = document.getElementById('results');
//   resultsDiv.innerHTML = '';

//   if (!input) return;

//   let videos = [];
//   const isUrl = input.includes('youtube.com') || input.includes('youtu.be');

//   try {
//     if (isUrl) {
//       const res = await fetch(`${API_BASE}/api/download-info?url=${encodeURIComponent(input)}`);
//       const data = await res.json();
//       videos = [{ title: data.title, thumbnail: data.thumbnail, url: input }];
//     } else {
//       const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(input)}`);
//       const data = await res.json();
//       videos = data;
//     }

//     videos.forEach(video => {
//       const div = document.createElement('div');
//       div.className = 'video-result';
//       div.innerHTML = `
//         <strong>${video.title}</strong><br/>
//         <img src="${video.thumbnail || 'https://i.ytimg.com/vi/' + video.videoId + '/hqdefault.jpg'}" />
//         <button class="download-btn" data-url="${video.url || 'https://www.youtube.com/watch?v=' + video.videoId}">
//           Show Download Options
//         </button>
//         <div class="formats"></div>
//       `;
//       resultsDiv.appendChild(div);
//     });
//   } catch (err) {
//     resultsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
//   }
// });

// document.getElementById('results').addEventListener('click', async (e) => {
//   if (e.target.classList.contains('download-btn')) {
//     const url = e.target.getAttribute('data-url');
//     const formatsDiv = e.target.nextElementSibling;
//     formatsDiv.innerHTML = 'Loading...';

//     try {
//       const res = await fetch(`${API_BASE}/api/download-info?url=${encodeURIComponent(url)}`);
//       const data = await res.json();
//       formatsDiv.innerHTML = '';

//       if (data.formats.length === 0) {
//         formatsDiv.innerHTML = '<small>No available muxed formats</small>';
//         return;
//       }

//       data.formats.forEach(format => {
//         const btn = document.createElement('button');
//         btn.className = 'format-option';
//         btn.innerText = `${format.ext} - ${format.formatNote || format.quality} - ${format.filesize ? (format.filesize / 1e6).toFixed(1) + 'MB' : 'unknown size'}`;
//         btn.onclick = async () => {
//           try {
//             const res = await fetch(`${API_BASE}/api/download`, {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json'
//               },
//               body: JSON.stringify({
//                 url,
//                 formatId: format.format_id
//               })
//             });

//             const result = await res.json();
//             if (result.success) {
//               alert('✅ Download started!');
//             } else {
//               alert('❌ Failed: ' + result.error);
//             }
//           } catch (err) {
//             alert('❌ Error: ' + err.message);
//           }
//         };
//         formatsDiv.appendChild(btn);
//       });
//     } catch (err) {
//       formatsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
//     }
//   }
// });










// Its working for local server
// document.getElementById('searchBtn').addEventListener('click', async () => {
//   const input = document.getElementById('search').value.trim();
//   const resultsDiv = document.getElementById('results');
//   resultsDiv.innerHTML = '';

//   if (!input) return;

//   let videos = [];

//   const isUrl = input.includes('youtube.com') || input.includes('youtu.be');
//   try {
//     if (isUrl) {
//       const res = await fetch(`http://localhost:10000/api/download-info?url=${encodeURIComponent(input)}`);
//       const data = await res.json();
//       videos = [{ title: data.title, thumbnail: data.thumbnail, url: input }];
//     } else {
//       const res = await fetch(`http://localhost:10000/api/search?q=${encodeURIComponent(input)}`);
//       const data = await res.json();
//       videos = data;
//     }

//     videos.forEach(video => {
//       const div = document.createElement('div');
//       div.className = 'video-result';
//       div.innerHTML = `
//         <strong>${video.title}</strong><br/>
//         <img src="${video.thumbnail || 'https://i.ytimg.com/vi/' + video.videoId + '/hqdefault.jpg'}" />
//         <button class="download-btn" data-url="${video.url || 'https://www.youtube.com/watch?v=' + video.videoId}">
//           Show Download Options
//         </button>
//         <div class="formats"></div>
//       `;
//       resultsDiv.appendChild(div);
//     });
//   } catch (err) {
//     resultsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
//   }
// });

// document.getElementById('results').addEventListener('click', async (e) => {
//   if (e.target.classList.contains('download-btn')) {
//     const url = e.target.getAttribute('data-url');
//     const formatsDiv = e.target.nextElementSibling;
//     formatsDiv.innerHTML = 'Loading...';

//     try {
//       const res = await fetch(`http://localhost:10000/api/download-info?url=${encodeURIComponent(url)}`);
//       const data = await res.json();
//       formatsDiv.innerHTML = '';

//       if (data.formats.length === 0) {
//         formatsDiv.innerHTML = '<small>No available muxed formats</small>';
//       }

//       data.formats.forEach(format => {
//         const a = document.createElement('a');
//         a.href = format.url;
//         a.textContent = `Download ${format.quality} (${format.container})`;
//         a.target = '_blank';
//         a.className = 'download-btn';
//         formatsDiv.appendChild(a);
//       });
//     } catch (err) {
//       formatsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
//     }
//   }
// });









// ITS WORKING BUT NOT START DONLODING

// document.getElementById('searchBtn').addEventListener('click', async () => {
//   const input = document.getElementById('search').value.trim();
//   const resultsDiv = document.getElementById('results');
//   resultsDiv.innerHTML = '';

//   if (!input) return;

//   let videos = [];

//   const isUrl = input.includes('youtube.com') || input.includes('youtu.be');
//   try {
//     if (isUrl) {
//       // Direct URL: fetch download info
//       const res = await fetch(`http://localhost:10000/api/download-info?url=${encodeURIComponent(input)}`);
//       const data = await res.json();
//       videos = [{ title: data.title, thumbnail: data.thumbnail, url: input }];
//     } else {
//       // Keyword search
//       const res = await fetch(`http://localhost:10000/api/search?q=${encodeURIComponent(input)}`);
//       const data = await res.json();
//       videos = data;
//     }

//     videos.forEach(video => {
//       const div = document.createElement('div');
//       div.className = 'video-result';
//       div.innerHTML = `
//         <strong>${video.title}</strong><br/>
//         <img src="${video.thumbnail || 'https://i.ytimg.com/vi/' + video.videoId + '/hqdefault.jpg'}" />
//         <button class="download-btn" data-url="https://www.youtube.com/watch?v=${video.videoId || video.url}">
//           Show Download Options
//         </button>
//         <div class="formats"></div>
//       `;
//       resultsDiv.appendChild(div);
//     });
//   } catch (err) {
//     resultsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
//   }
// });

// // Handle download button clicks
// document.getElementById('results').addEventListener('click', async (e) => {
//   if (e.target.classList.contains('download-btn')) {
//     const url = e.target.getAttribute('data-url');
//     const formatsDiv = e.target.nextElementSibling;
//     formatsDiv.innerHTML = 'Loading...';

//     try {
//       const res = await fetch(`http://localhost:10000/api/download-info?url=${encodeURIComponent(url)}`);
//       const data = await res.json();
//       formatsDiv.innerHTML = '';

//       if (data.formats.length === 0) {
//         formatsDiv.innerHTML = '<small>No available muxed formats</small>';
//       }

//       data.formats.forEach(format => {
//         const a = document.createElement('a');
//         a.href = format.url;
//         a.textContent = `Download ${format.quality} (${format.container})`;
//         a.target = '_blank';
//         a.className = 'download-btn';
//         formatsDiv.appendChild(a);
//       });
//     } catch (err) {
//       formatsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
//     }
//   }
// });















// const API_BASE = "https://yt-server-qo6z.onrender.com";

// document.getElementById('searchBtn').addEventListener('click', async () => {
//   const query = document.getElementById('urlInput').value.trim();
//   const results = document.getElementById('results');
//   results.innerHTML = 'Loading...';

//   const ytUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

//   if (ytUrlRegex.test(query)) {
//     // It's a direct YouTube video URL
//     try {
//       const res = await fetch(`${API_BASE}/api/download-info?url=${encodeURIComponent(query)}`);
//       const data = await res.json();

//       if (data.error) {
//         results.innerHTML = `Error: ${data.error}`;
//         return;
//       }

//       results.innerHTML = `
//         <div class="video-item">
//           <img src="${data.thumbnail}" alt="Thumbnail">
//           <strong>${data.title}</strong>
//         </div>
//         <div><b>Select Quality to Download:</b></div>
//       `;

//       data.formats.forEach(format => {
//         const btn = document.createElement('button');
//         btn.textContent = `${format.qualityLabel || format.quality} (${format.container})`;
//         btn.onclick = () => window.open(format.url, '_blank');
//         results.appendChild(btn);
//       });
//     } catch (err) {
//       results.innerHTML = 'Error fetching video info.';
//     }
//   } else {
//     // It's a search term
//     try {
//       const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`);
//       const data = await res.json();

//       if (!Array.isArray(data)) {
//         results.innerHTML = 'Unexpected response format.';
//         return;
//       }

//       results.innerHTML = '';

//       data.forEach(video => {
//         const div = document.createElement('div');
//         div.className = 'video-item';

//         const thumb = document.createElement('img');
//         thumb.src = video.thumbnail;

//         const title = document.createElement('strong');
//         title.textContent = video.title;

//         const btn = document.createElement('button');
//         btn.textContent = 'Download';
//         btn.onclick = async () => {
//           results.innerHTML = 'Loading download options...';
//           try {
//             const infoRes = await fetch(`${API_BASE}/api/download-info?url=https://www.youtube.com/watch?v=${video.videoId}`);
//             const info = await infoRes.json();

//             if (info.error) {
//               results.innerHTML = `Error: ${info.error}`;
//               return;
//             }

//             results.innerHTML = `
//               <div class="video-item">
//                 <img src="${info.thumbnail}" alt="Thumbnail">
//                 <strong>${info.title}</strong>
//               </div>
//               <div><b>Select Quality to Download:</b></div>
//             `;

//             info.formats.forEach(format => {
//               const b = document.createElement('button');
//               b.textContent = `${format.qualityLabel || format.quality} (${format.container})`;
//               b.onclick = () => window.open(format.url, '_blank');
//               results.appendChild(b);
//             });
//           } catch (err) {
//             results.innerHTML = 'Error loading download info.';
//           }
//         };

//         div.appendChild(thumb);
//         div.appendChild(title);
//         div.appendChild(btn);
//         results.appendChild(div);
//       });
//     } catch (err) {
//       results.innerHTML = 'Error fetching search results.';
//     }
//   }
// });
