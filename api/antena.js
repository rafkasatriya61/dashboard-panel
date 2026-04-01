import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    const passwordRahasia = process.env.API_SECRET_KEY;

    if (req.method === 'POST') {
        if (req.headers.authorization !== passwordRahasia) {
            return res.status(401).json({ error: 'Password Salah!' });
        }
        try {
            await kv.set('bot_status', req.body);
            return res.status(200).json({ success: true });
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    } 
    
    if (req.method === 'GET') {
        try {
            const data = await kv.get('bot_status');
            return res.status(200).json(data || { status: 'offline' });
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }

    return res.status(405).send('Use POST or GET');
}

