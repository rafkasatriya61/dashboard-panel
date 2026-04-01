import { createClient } from '@vercel/kv';

// KODE SAKTI: Otomatis nyari jalan ke Redis kamu lewat KV_REDIS_URL
const kv = createClient({
  url: process.env.KV_REDIS_URL, // Ini nembak kunci otomatis di screenshot kamu
});

export default async function handler(req, res) {
    const passwordTersimpan = process.env.API_SECRET_KEY;

    // --- JALUR BOT (POST) ---
    if (req.method === 'POST') {
        const passwordDariBot = req.headers.authorization;

        if (passwordDariBot !== passwordTersimpan) {
            return res.status(401).json({ error: 'Password Salah!', lu_ngirim: passwordDariBot });
        }

        try {
            await kv.set('bot_status', req.body);
            return res.status(200).json({ success: true });
        } catch (e) {
            return res.status(500).json({ error: 'Database Error: ' + e.message });
        }
    } 
    
    // --- JALUR WEB (GET) ---
    if (req.method === 'GET') {
        try {
            const data = await kv.get('bot_status');
            return res.status(200).json(data || { status: 'offline' });
        } catch (e) {
            return res.status(500).json({ error: 'Database Error: ' + e.message });
        }
    }

    return res.status(405).send('Use POST or GET');
}
