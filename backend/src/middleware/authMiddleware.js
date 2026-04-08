const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Mengambil token dari head Authorization Bearer {token}
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
  
  try {
    // Verifikasi validitas JWT
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Sesi token sudah kedaluwarsa atau tidak valid.' });
  }
};
