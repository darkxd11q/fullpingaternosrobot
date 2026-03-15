const express = require('express');
const app = express();

// Render, Railway, Heroku gibi platformlarda PORT env değişkeni kullanılır
const port = process.env.PORT || 3000;

// UptimeRobot ve cron-job.org HEAD isteklerini de destekler
app.head('/', (req, res) => {
  res.sendStatus(200);
});

// Ana sayfa — UptimeRobot, cron-job.org, freshping vb.
app.get('/', (req, res) => {
  console.log(`[${new Date().toISOString()}] Ping alındı: ${req.headers['user-agent'] || 'bilinmeyen'}`);
  res.status(200).send('Bot çalışıyor! 🤖');
});

// /ping endpoint'i — bazı monitoring servisleri bunu tercih eder
app.get('/ping', (req, res) => {
  console.log(`[${new Date().toISOString()}] /ping — ${req.headers['user-agent'] || 'bilinmeyen'}`);
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// /health endpoint'i — JSON döndürür, daha gelişmiş monitoring araçları için
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// HEAD /ping ve HEAD /health de desteklenir
app.head('/ping', (req, res) => res.sendStatus(200));
app.head('/health', (req, res) => res.sendStatus(200));

function keep_alive() {
  app.listen(port, () => {
    console.log(`[keep_alive] Sunucu http://0.0.0.0:${port} adresinde çalışıyor`);
    console.log(`[keep_alive] UptimeRobot / cron-job için bu URL'yi kullan: http://<host>:${port}/ping`);
  });
}

module.exports = { keep_alive };