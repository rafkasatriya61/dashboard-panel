import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // 🟢 JIKA BOT MENGIRIM DATA (Metode POST)
    if (req.method === 'POST') {
        if (req.headers.authorization !== process.env.API_SECRET_KEY) {
            return res.status(401).json({ error: 'Password Salah!' });
        }
        try {
            await kv.set('bot_status', req.body);
            return res.status(200).json({ success: true, message: 'Data masuk!' });
        } catch (error) {
            return res.status(500).json({ error: 'Gagal simpan ke KV' });
        }
    } 
    // 🔵 JIKA WEBSITE MEMINTA DATA (Metode GET)
    else if (req.method === 'GET') {
        try {
            const data = await kv.get('bot_status');
            if (!data) return res.status(200).json({ status: 'offline' });
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ status: 'offline' });
        }
    } 
    // 🔴 SELAIN ITU TOLAK
    else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }

}
