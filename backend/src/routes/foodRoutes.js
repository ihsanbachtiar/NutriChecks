const express = require('express');
const router = express.Router();
const multer = require('multer');
const foodController = require('../controllers/foodController');

// Mengatur penyimpanan RAM Buffer sementara untuk efisiensi File Gambar
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { 
        fileSize: 5 * 1024 * 1024 // Batasi foto maksimam berukuran 5MB
    }
});

// Endpoint route yang dilindungi upload middleware 
// (Menunggu Request Body jenis mutipart/formData ber-key `image`)
router.post('/analyze-food', upload.single('image'), foodController.analyzeFoodImage);

module.exports = router;
