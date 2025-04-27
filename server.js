const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const BASE_API = 'https://pipedapi.kavin.rocks'; // Fastest & Free forever API

app.get('/api/video', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.json({ status: 'error', message: 'No URL provided.' });

    const videoId = new URL(url).searchParams.get('v');
    if (!videoId) return res.json({ status: 'error', message: 'Invalid URL.' });

    const { data } = await axios.get(`${BASE_API}/streams/${videoId}`);
    const { videoStreams, thumbnailUrl } = data;

    res.json({
      status: 'ok',
      thumbnail: thumbnailUrl,
      formats: videoStreams.map(v => ({
        quality: v.quality,
        url: v.url
      }))
    });
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.json({ status: 'error', message: 'Failed to fetch video info.' });
  }
});

app.get('/api/audio', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.json({ status: 'error', message: 'No URL provided.' });

    const videoId = new URL(url).searchParams.get('v');
    if (!videoId) return res.json({ status: 'error', message: 'Invalid URL.' });

    const { data } = await axios.get(`${BASE_API}/streams/${videoId}`);
    const { audioStreams, thumbnailUrl } = data;

    res.json({
      status: 'ok',
      thumbnail: thumbnailUrl,
      url: audioStreams[0].url // highest quality audio
    });
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.json({ status: 'error', message: 'Failed to convert to audio.' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
