const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

/**
 * Menghitung Basal Metabolic Rate (BMR) berdasarkan Rumus Mifflin-St Jeor.
 * Rumus Laki-laki : (10 × berat) + (6.25 × tinggi) - (5 × usia) + 5
 * Rumus Perempuan : (10 × berat) + (6.25 × tinggi) - (5 × usia) - 161
 */
const calculateBMR = (berat, tinggi, usia, gender) => {
    const bb = parseFloat(berat);
    const tb = parseFloat(tinggi);
    const u = parseInt(usia);

    if (gender === 'laki-laki') {
        return (10 * bb) + (6.25 * tb) - (5 * u) + 5;
    } else if (gender === 'perempuan') {
        return (10 * bb) + (6.25 * tb) - (5 * u) - 161;
    }
    return 0;
};

/**
 * Menghitung target kalori harian berdasarkan BMR, tujuan, dan kecepatan.
 * 
 * TDEE (Total Daily Energy Expenditure) = BMR × 1.2 (asumsi sedentary/aktivitas ringan)
 * 1 kg lemak tubuh ≈ 7700 kalori
 * Defisit/surplus harian = (kecepatan_kg_per_minggu × 7700) / 7
 * 
 * Contoh:
 *   - Perlahan  (0.25 kg/minggu) → ±275 kal/hari
 *   - Normal    (0.5  kg/minggu) → ±550 kal/hari
 *   - Cepat     (1    kg/minggu) → ±1100 kal/hari
 */
const calculateTargetKalori = (berat, tinggi, usia, gender, tujuan, kecepatan) => {
    const bmr = calculateBMR(berat, tinggi, usia, gender);
    const tdee = bmr * 1.2; // Sedentary activity multiplier
    const kecepatanFloat = parseFloat(kecepatan) || 0.5;
    const dailyAdjustment = (kecepatanFloat * 7700) / 7;

    if (tujuan === 'menurunkan berat badan') {
        return Math.round(tdee - dailyAdjustment);
    } else if (tujuan === 'menaikkan berat badan') {
        return Math.round(tdee + dailyAdjustment);
    }
    return Math.round(tdee); // fallback
};

// Endpoint Register
exports.register = async (req, res) => {
    try {
        const { nama, email, password, berat_badan, tinggi_badan, usia, gender, target_berat, tujuan, kecepatan } = req.body;

        // Validasi field input kosong
        if (!nama || !email || !password || !berat_badan || !tinggi_badan || !usia || !gender || !target_berat) {
            return res.status(400).json({ message: 'Semua field wajib diisi' });
        }

        if (!tujuan || !kecepatan) {
            return res.status(400).json({ message: 'Tujuan dan kecepatan wajib dipilih' });
        }

        // Cek apakah email sudah dipakai (terdaftar) sebelumnya
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email sudah terdaftar. Silakan gunakan email lain.' });
        }

        // Kalkulasi target_kalori otomatis berdasarkan BMR, tujuan, dan kecepatan
        const target_kalori = calculateTargetKalori(
            berat_badan, tinggi_badan, usia, gender.toLowerCase(), tujuan.toLowerCase(), kecepatan
        );

        // Hashing password dengan bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Menyiapkan insert query MySQL
        const query = `
            INSERT INTO users 
            (nama, email, password, berat_badan, tinggi_badan, usia, gender, target_berat, target_kalori, tujuan, kecepatan)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            nama, email, hashedPassword, 
            berat_badan, tinggi_badan, usia, gender.toLowerCase(), 
            target_berat, target_kalori, tujuan.toLowerCase(), parseFloat(kecepatan)
        ];

        // Eksekusi insert into db
        const [result] = await db.query(query, values);

        return res.status(201).json({
            message: 'Registrasi berhasil',
            data: {
                id: result.insertId,
                nama,
                email,
                target_kalori
            }
        });

    } catch (error) {
        console.error('Register Error:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server saat registrasi' });
    }
};

// Endpoint Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan password wajib diisi' });
        }

        // Ambil data user yang memiliki email terkait
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        const user = users[0];

        // Membandingkan plain password dengan hashedPassword di DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        // Buat payload token dan token JWT (Berlaku untuk 24 jam)
        const payload = {
            id: user.id,
            email: user.email,
            nama: user.nama
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

        return res.status(200).json({
            message: 'Login berhasil',
            token,
            user: {
                id: user.id,
                nama: user.nama,
                email: user.email,
                target_kalori: user.target_kalori
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server saat login' });
    }
};
