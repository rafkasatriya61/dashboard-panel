import { Redis } from '@upstash/redis';

// Mas Rafka, pastikan nama KV_REDIS_URL ini sama dengan yang ada di Environment Variables kamu!
const redis = new Redis({
  url: process.env.KV_REDIS_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.KV_REDIS_REST_API_TOKEN || "token_manual_kalo_perlu"
});

export default async function handler(req, res) {
    const passwordRahasia = process.env.API_SECRET_KEY;

    if (req.method === 'POST') {
        if (req.headers.authorization !== passwordRahasia) {
            return res.status(401).json({ error: 'Password Salah!' });
        }
        try {
            await redis.set('bot_status', req.body);
            return res.status(200).json({ success: true });
        } catch (e) {
            return res.status(500).json({ error: 'Redis Error: ' + e.message });
        }
    } 
    
    if (req.method === 'GET') {
        try {
            const data = await redis.get('bot_status');
            return res.status(200).json(data || { status: 'offline' });
        } catch (e) {
            return res.status(500).json({ error: 'Redis Error: ' + e.message });
        }
    }

    return res.status(405).send('Use POST/GET');
}
