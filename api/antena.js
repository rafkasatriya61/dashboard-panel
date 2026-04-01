import { Redis } from '@upstash/redis';

// Hubungkan ke Redis Upstash milik Mas Rafka
const redis = Redis.fromEnv();

export default async function handler(req, res) {
    const passwordRahasia = process.env.API_SECRET_KEY;

    // --- JALUR BOT (POST) ---
    if (req.method === 'POST') {
        const passwordDariBot = req.headers.authorization;

        if (passwordDariBot !== passwordRahasia) {
            return res.status(401).json({ error: 'Password Salah!' });
        }

        try {
            // Simpan data bot ke Redis
            await redis.set('bot_status', req.body);
            return res.status(200).json({ success: true });
        } catch (e) {
            return res.status(500).json({ error: 'Upstash Error: ' + e.message });
        }
    } 
    
    // --- JALUR WEB (GET) ---
    if (req.method === 'GET') {
        try {
            const data = await redis.get('bot_status');
            return res.status(200).json(data || { status: 'offline' });
        } catch (e) {
            return res.status(500).json({ error: 'Upstash Error: ' + e.message });
        }
    }

    return res.status(405).send('Use POST or GET');
}
