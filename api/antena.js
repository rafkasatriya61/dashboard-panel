let botData = { status: 'offline', timestamp: 'Menunggu bot menyala...' };
let actionQueue = []; // 🔥 SISTEM ANTREAN MULTI-DATA 🔥

export default function handler(req, res) {
    if (req.method === 'POST') {
        
        // 1. Web nitip perintah ke Vercel
        if (req.body.action) {
            actionQueue.push(req.body.action); 
            return res.status(200).json({ success: true });
        } 
        
        // 2. Bot lapor mau mati (offline)
        else if (req.body.status === 'offline') {
            botData = { status: 'offline', timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) };
            return res.status(200).json({ success: true });
        }

        // 3. Bot nyetor data + Nanya "Ada titipan perintah gak?"
        else if (req.body.system) {
            botData = req.body; 
            let pendingActions = [...actionQueue]; // Ambil semua titipan
            actionQueue = []; // Kosongin antrean biar gak ke-looping
            return res.status(200).json({ actions: pendingActions }); // Kirim ke bot
        }
        
        return res.status(400).json({ error: "Payload tidak dikenali" });
    } 
    else if (req.method === 'GET') {
        return res.status(200).json(botData);
    }
    return res.status(405).json({ error: "Method Not Allowed" });
}

