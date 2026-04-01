import { createClient } from '@vercel/kv';

// Konfigurasi khusus buat KV_REDIS_URL punya Mas Rafka
const kv = createClient({
  url: process.env.KV_REDIS_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.KV_REDIS_REST_API_TOKEN,
});

export default async function handler(req, res) {
    // JALUR BOT (POST)
    if (req.method === 'POST') {
        if (req.headers.authorization !== process.env.API_SECRET_KEY) {
            return res.status(401).json({ error: 'Password Salah!' });
        }
        try {
            await kv.set('bot_status', req.body);
            return res.status(200).json({ success: true });
        } catch (e) {
            return res.status(500).json({ error: 'Gagal Tulis Redis: ' + e.message });
        }
    } 
    
    // JALUR WEB (GET)
    if (req.method === 'GET') {
        try {
            const data = await kv.get('bot_status');
            return res.status(200).json(data || { status: 'offline' });
        } catch (e) {
            return res.status(500).json({ error: 'Gagal Baca Redis: ' + e.message });
        }
    }

    return res.status(405).send('Gunakan POST atau GET');
}
