const { GoogleGenerativeAI } = require("@google/generative-ai");

// Inisialisasi API Geminii menggunakan API Key dari .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeFoodImage = async (req, res) => {
  try {
    // 1. Validasi Keberadaan Input File
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Tidak ada file gambar yang diunggah." });
    }

    // 2. Validasi Ekstensi/MIME Type (Hanya izinkan JPEG, PNG, WEBP)
    const validMimes = ["image/jpeg", "image/png", "image/webp"];
    if (!validMimes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        success: false, 
        message: "Format gambar tidak didukung. Harap unggah format JPEG, PNG, atau WEBP." 
      });
    }

    // 3. Konversi buffer file memori dari Multer ke dalam format objek yang bisa dibaca Gemini
    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: req.file.mimetype,
      },
    };

    // 4. Inisialisasi Model AI Generatif (Sesuai dengan versi yang tersedia di Google AI Studio)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 5. Prompt Instruksi Ketat (Strict Instructions) untuk Output JSON Murni
    const prompt = `Anda adalah seorang ahli nutrisi dan AI penganalisis gambar.
Tugas Anda adalah mematuhi instruksi secara ketat. Anda HANYA boleh membalas dengan sebuah JSON murni (tanpa dibungkus tag markdown, tanpa tambahan string/kalimat pengantar atau penutup).

Lihat gambar yang dilampirkan:

Skenario A - BUKAN MAKANAN:
Jika gambar di atas BUKAN MAKANAN (misalnya manusia, pemandangan, laptop, struk/kartu, mobil, logo, objek abstrak, dsb):
Kembalikan persis JSON di bawah ini:
{
  "success": false,
  "message": "Gambar yang diunggah bukan gambar makanan. Silakan unggah foto makanan yang jelas."
}

Skenario B - ITU ADALAH MAKANAN:
Jika gambar tersebut adalah makanan minuman yang valid:
Tebak nama makanan tersebut dan berikan perkiraan kandungan makronutrisi (jumlah kalori, protein, karbohidrat, dan lemak per porsi standar makanan tersebut). Semua angka nutrisi harus berformat "number" (tanpa ekstensi satuan seperti g/kkal).
Kembalikan persis JSON di bawah ini:
{
  "success": true,
  "data": {
     "nama_makanan": "Nasi Goreng Ayam",
     "kalori": 450,
     "protein": 15.5,
     "karbohidrat": 50.2,
     "lemak": 12.0
  }
}

INGAT: Kirimkan 1 objek JSON saja dan jangan gunakan format markdown \`\`\`json.`;

    // 6. Jalankan Proses Analisis AI
    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();

    // 7. Sanitasi Hasil (Menghapus markdown atau whitespace kalau AI "bandel" membandelkannya)
    const jsonString = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error("Gagal melakukan parsing output AI JSON:", responseText);
      return res.status(500).json({ 
        success: false, 
        message: "AI memberikan output yang tidak dapat dipahami. Mohon coba gambar lain." 
      });
    }

    // 8. Tentukan Respon Akhir Sesuai Skenario Makanan (Benar / Salah) 
    if (jsonResponse.success === false) {
      return res.status(400).json(jsonResponse); 
    }

    return res.status(200).json(jsonResponse); // Berhasil

  } catch (error) {
    console.error("Error analyzing food image:", error);
    
    // Penanganan apabila Timeout atau Invalid API Key
    if (error.message && error.message.includes("API key")) {
      return res.status(500).json({ success: false, message: "Server kehilangan izin API Key Generative AI." });
    }

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server AI saat membedah / menganalisis foto tersebut.",
    });
  }
};
