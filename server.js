const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Set default ytdl-core options
const ytdlOptions = {
  requestOptions: {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36",
      "accept-language": "en-US,en;q=0.9"
    }
  }
};

app.get('/api/video', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.json({ status: 'error', message: 'No URL provided.' });

    const info = await ytdl.getInfo(url, ytdlOptions);
    const formats = info.formats.filter(f => f.hasVideo && f.hasAudio && f.container === 'mp4');

    res.json({
      status: 'ok',
      thumbnail: info.videoDetails.thumbnails.pop().url,
      formats: formats.map(f => ({
        quality: f.qualityLabel,
        url: f.url
      }))
    });
  } catch (err) {
    console.error(err);
    res.json({ status: 'error', message: 'Failed to fetch video info.' });
  }
});

app.get('/api/audio', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.json({ status: 'error', message: 'No URL provided.' });

    const info = await ytdl.getInfo(url, ytdlOptions);
    const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });

    res.json({
      status: 'ok',
      thumbnail: info.videoDetails.thumbnails.pop().url,
      url: audioFormat.url
    });
  } catch (err) {
    console.error(err);
    res.json({ status: 'error', message: 'Failed to convert to audio.' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
