import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// ZCORE Vault status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    device: 'Android 14 (arm64-v8a)',
    kernel: 'Linux localhost 5.15.137-android14-g0192837',
    termuxVersion: '0.118.1',
    rcloneVersion: 'v1.68.0-termux',
    vault: {
      path: '/data/data/com.termux/files/home/ZCORE-Vault',
      mounted: true,
      remote: 'crypt_zcore:zcore_vault',
      cloudBackend: 'gd_zcore:zcore_vault',
      filesCount: 1247,
      totalBytes: 4509715660, // 4.2 GB
      encryption: 'AES-256-GCM + XChaCha20-Poly1305',
      kdf: 'scrypt N=16384 r=8 p=1',
      fuseBinary: '/data/data/com.termux/files/usr/bin/fusermount3',
    },
    system: {
      cpuUsage: '0.00',
      ramUsage: '75%',
      battery: '94% (AC)',
      uptime: '14d 6h 32m',
    },
  });
});

// Setup Vite middleware in dev or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ZCORE Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[ZCORE Server] Startup failure:', err);
});
