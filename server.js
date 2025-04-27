const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/api/video', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.json({ status: 'error', message: 'No URL provided.' });

    const info = await ytdl.getInfo(url);
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

    const info = await ytdl.getInfo(url);
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
