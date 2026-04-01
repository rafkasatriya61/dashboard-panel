// File: api/antena.js (Berada di Vercel / backend kamu)

let botData = { status: 'offline', timestamp: 'Menunggu bot menyala...' };
let actionQueue = null; // Tempat nyimpen perintah saklar/klik dari Web

export default function handler(req, res) {
    // 1. JIKA ADA POST REQUEST (Dari Bot atau dari Web)
    if (req.method === 'POST') {
        
        // A. JIKA WEB NGIRIM PERINTAH KLIK/SAKLAR
        if (req.body.action) {
            actionQueue = req.body.action; // Simpan perintahnya di antrean
            return res.status(200).json({ success: true, message: "Perintah masuk antrean." });
        } 
        
        // B. JIKA BOT NGIRIM DATA STATUS TIAP 5 DETIK
        else if (req.body.system && req.body.database) {
            botData = req.body; // Simpan data terbaru bot
            
            // Cek apakah ada antrean perintah dari web?
            let pendingAction = actionQueue;
            actionQueue = null; // Hapus antrean setelah diberikan ke bot (Biar nggak looping terus)
            
            // Balas request bot dengan perintah yang antre
            return res.status(200).json({ action: pendingAction });
        }
        
        return res.status(400).json({ error: "Payload tidak dikenali" });
    } 
    
    // 2. JIKA ADA GET REQUEST (Web minta data buat nampilin Dashboard)
    else if (req.method === 'GET') {
        return res.status(200).json(botData);
    }
    
    return res.status(405).json({ error: "Method Not Allowed" });
}
