import Redis from 'ioredis';

// Koneksi Langsung ke RedisLabs Mas Rafka
const redis = new Redis(process.env.KV_REDIS_URL);

export default async function handler(req, res) {
    const passwordRahasia = process.env.API_SECRET_KEY;

    if (req.method === 'POST') {
        if (req.headers.authorization !== passwordRahasia) {
            return res.status(401).json({ error: 'Password Salah!' });
        }
        try {
            // Simpan data sebagai string agar aman di RedisLabs
            await redis.set('bot_status', JSON.stringify(req.body));
            return res.status(200).json({ success: true });
        } catch (e) {
            return res.status(500).json({ error: 'Redis Error: ' + e.message });
        }
    } 
    
    if (req.method === 'GET') {
        try {
            const data = await redis.get('bot_status');
            if (!data) return res.status(200).json({ status: 'offline' });
            return res.status(200).json(JSON.parse(data));
        } catch (e) {
            return res.status(500).json({ error: 'Redis Error: ' + e.message });
        }
    }

    return res.status(405).send('Use POST/GET')
      ;
}
