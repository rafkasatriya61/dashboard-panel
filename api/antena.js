import { createClient } from '@vercel/kv';

export default async function handler(req, res) {
    // 1. Hubungkan ke Redis pakai URL yang ada di screenshot kamu tadi
    const kv = createClient({
        url: process.env.KV_REDIS_URL,
    });

    const passwordRahasia = process.env.API_SECRET_KEY;

    // --- JALUR BOT (POST) ---
    if (req.method === 'POST') {
        const passwordDariBot = req.headers.authorization;

        if (passwordDariBot !== passwordRahasia) {
            return res.status(401).json({ error: 'Password Salah!' });
        }

        try {
            // Kita pakai stringify biar datanya aman pas masuk Redis
            await kv.set('bot_status', JSON.stringify(req.body));
            return res.status(200).json({ success: true });
        } catch (e) {
            return res.status(500).json({ error: 'Gagal Tulis: ' + e.message });
        }
    } 
    
    // --- JALUR WEB (GET) ---
    if (req.method === 'GET') {
        try {
            const data = await kv.get('bot_status');
            if (!data) return res.status(200).json({ status: 'offline' });
            
            // Kalau datanya string, kita balikin jadi JSON lagi
            const finalData = typeof data === 'string' ? JSON.parse(data) : data;
            return res.status(200).json(finalData);
        } catch (e) {
            return res.status(500).json({ error: 'Gagal Baca: ' + e.message });
        }
    }

    return res.status(405).send('Use POST/GET');
}
