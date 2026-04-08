require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const foodRoutes = require('./src/routes/foodRoutes');

const app = express();

// Konfigurasi Middleware
app.use(cors());                 // Mengizinkan komunikasi lintas domain (dari frontend ke backend)
app.use(express.json());         // Agar server dapat membaca Request Body berformat JSON

// Menggunakan Routes API
app.use('/api', authRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', foodRoutes);

// Endpoint Health Check
app.get('/', (req, res) => {
    res.send('✅ Server API Backend Nutricheck telah aktif!');
});

// Menentukan Port
const PORT = process.env.PORT || 5000;

// Menjalankan Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server berjalan pada URL http://localhost:${PORT}`);
    console.log(`📱 Untuk akses dari HP, gunakan: http://<IP-Komputer>:${PORT}`);
});
