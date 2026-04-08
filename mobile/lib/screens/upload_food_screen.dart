import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';

class UploadFoodScreen extends StatefulWidget {
  const UploadFoodScreen({super.key});

  @override
  State<UploadFoodScreen> createState() => _UploadFoodScreenState();
}

class _UploadFoodScreenState extends State<UploadFoodScreen>
    with SingleTickerProviderStateMixin {
  File? _imageFile;
  bool _isLoading = false;
  final ImagePicker _picker = ImagePicker();
  late AnimationController _animController;
  late Animation<double> _fadeAnim;

  // ─── Colors ────────────────────────────────────────────
  static const _bgColor = Color(0xFF0A0F1E);
  static const _cardColor = Color(0xFF111827);
  static const _emerald = Color(0xFF10B981);
  static const _blue = Color(0xFF3B82F6);
  static const _slate400 = Color(0xFF94A3B8);
  static const _slate700 = Color(0xFF334155);
  static const _slate800 = Color(0xFF1E293B);

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _fadeAnim = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeOut),
    );
    _animController.forward();
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final XFile? picked = await _picker.pickImage(
        source: source,
        maxWidth: 1200,
        maxHeight: 1200,
        imageQuality: 85,
      );
      if (picked != null) {
        setState(() => _imageFile = File(picked.path));
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Gagal mengambil gambar',
              style: GoogleFonts.inter(color: Colors.white)),
          backgroundColor: const Color(0xFFEF4444),
          behavior: SnackBarBehavior.floating,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          margin: const EdgeInsets.all(16),
        ),
      );
    }
  }

  void _handleAnalyze() {
    if (_imageFile == null) return;
    setState(() => _isLoading = true);
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Simulasi: Makanan berhasil dianalisis dengan AI!',
                style: GoogleFonts.inter(color: Colors.white)),
            backgroundColor: _emerald,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12)),
            margin: const EdgeInsets.all(16),
          ),
        );
        Navigator.pop(context);
      }
    });
  }

  void _clearImage() {
    setState(() => _imageFile = null);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bgColor,
      body: Stack(
        children: [
          // ─── Main Content ────────────────────────────
          FadeTransition(
            opacity: _fadeAnim,
            child: SafeArea(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    const SizedBox(height: 16),

                    // ─── Header ────────────────────────
                    Text(
                      'UPLOAD WITH AI',
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: _emerald,
                        letterSpacing: 2,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Analisis Makanan Baru',
                      style: GoogleFonts.inter(
                        fontSize: 26,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 32),

                    // ─── Upload Card ───────────────────
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: _cardColor.withOpacity(0.8),
                        borderRadius: BorderRadius.circular(20),
                        border:
                            Border.all(color: _slate700.withOpacity(0.5)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.3),
                            blurRadius: 30,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          // Image area
                          GestureDetector(
                            onTap: () => _showPickerModal(),
                            child: Container(
                              height: 260,
                              width: double.infinity,
                              decoration: BoxDecoration(
                                color: _imageFile != null
                                    ? _emerald.withOpacity(0.05)
                                    : _slate800.withOpacity(0.4),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: _imageFile != null
                                      ? _emerald.withOpacity(0.5)
                                      : _slate700.withOpacity(0.6),
                                  width: 2,
                                  strokeAlign: BorderSide.strokeAlignCenter,
                                ),
                              ),
                              child: _imageFile != null
                                  ? ClipRRect(
                                      borderRadius:
                                          BorderRadius.circular(14),
                                      child: Image.file(
                                        _imageFile!,
                                        fit: BoxFit.cover,
                                        width: double.infinity,
                                        height: double.infinity,
                                      ),
                                    )
                                  : Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Container(
                                          padding:
                                              const EdgeInsets.all(18),
                                          decoration: BoxDecoration(
                                            color: _slate700
                                                .withOpacity(0.5),
                                            shape: BoxShape.circle,
                                          ),
                                          child: Icon(
                                            Icons
                                                .cloud_upload_outlined,
                                            color: _emerald,
                                            size: 40,
                                          ),
                                        ),
                                        const SizedBox(height: 16),
                                        RichText(
                                          text: TextSpan(
                                            children: [
                                              TextSpan(
                                                text: 'Pilih gambar',
                                                style:
                                                    GoogleFonts.inter(
                                                  color: _emerald,
                                                  fontWeight:
                                                      FontWeight.w600,
                                                  fontSize: 14,
                                                ),
                                              ),
                                              TextSpan(
                                                text:
                                                    ' atau ambil foto',
                                                style:
                                                    GoogleFonts.inter(
                                                  color:
                                                      const Color(0xFFCBD5E1),
                                                  fontSize: 14,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                        const SizedBox(height: 6),
                                        Text(
                                          'Mendukung file PNG, JPG, dan WEBP',
                                          style: GoogleFonts.inter(
                                            color: const Color(0xFF64748B),
                                            fontSize: 11,
                                          ),
                                        ),
                                      ],
                                    ),
                            ),
                          ),
                          const SizedBox(height: 16),

                          // File info
                          if (_imageFile != null) ...[
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 14, vertical: 12),
                              decoration: BoxDecoration(
                                color: _slate800.withOpacity(0.6),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                    color: _slate700.withOpacity(0.5)),
                              ),
                              child: Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(6),
                                    decoration: BoxDecoration(
                                      color: _emerald.withOpacity(0.15),
                                      borderRadius:
                                          BorderRadius.circular(6),
                                      border: Border.all(
                                          color:
                                              _emerald.withOpacity(0.3)),
                                    ),
                                    child: const Icon(
                                        Icons.image_rounded,
                                        color: _emerald,
                                        size: 18),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Text(
                                      _imageFile!.path.split('/').last,
                                      overflow: TextOverflow.ellipsis,
                                      style: GoogleFonts.inter(
                                          color:
                                              const Color(0xFFCBD5E1),
                                          fontSize: 12),
                                    ),
                                  ),
                                  GestureDetector(
                                    onTap: _clearImage,
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 10, vertical: 6),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFEF4444)
                                            .withOpacity(0.1),
                                        borderRadius:
                                            BorderRadius.circular(6),
                                      ),
                                      child: Text(
                                        'Hapus',
                                        style: GoogleFonts.inter(
                                          color:
                                              const Color(0xFFF87171),
                                          fontSize: 11,
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 16),
                          ],

                          // Submit button
                          SizedBox(
                            width: double.infinity,
                            height: 52,
                            child: ElevatedButton(
                              onPressed: (_imageFile != null &&
                                      !_isLoading)
                                  ? _handleAnalyze
                                  : null,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: _blue,
                                foregroundColor: Colors.white,
                                disabledBackgroundColor:
                                    _blue.withOpacity(0.4),
                                shape: RoundedRectangleBorder(
                                  borderRadius:
                                      BorderRadius.circular(14),
                                ),
                                elevation: 8,
                                shadowColor:
                                    _blue.withOpacity(0.3),
                              ),
                              child: Text(
                                _imageFile != null
                                    ? 'Analisis Sekarang'
                                    : 'Pilih Foto Terlebih Dahulu',
                                style: GoogleFonts.inter(
                                  fontWeight: FontWeight.w700,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 20),

                          // Back button
                          Container(
                            padding: const EdgeInsets.only(top: 16),
                            decoration: BoxDecoration(
                              border: Border(
                                top: BorderSide(
                                    color: _slate800.withOpacity(0.6)),
                              ),
                            ),
                            child: Center(
                              child: GestureDetector(
                                onTap: () => Navigator.pop(context),
                                child: Text(
                                  '← Kembali ke Dashboard',
                                  style: GoogleFonts.inter(
                                    color: _slate400,
                                    fontSize: 13,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // ─── Loading Overlay ─────────────────────────
          if (_isLoading)
            Container(
              color: const Color(0xFF0F172A).withOpacity(0.95),
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const SizedBox(
                      width: 56,
                      height: 56,
                      child: CircularProgressIndicator(
                        strokeWidth: 3,
                        valueColor: AlwaysStoppedAnimation(_emerald),
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text(
                      'Menganalisis Makanan dengan AI...',
                      style: GoogleFonts.inter(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Sistem sedang mendeteksi porsi dan kalori makanan Anda',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        color: _slate400,
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  // ─── Image Source Picker Modal ──────────────────────────
  void _showPickerModal() {
    showModalBottomSheet(
      context: context,
      backgroundColor: _cardColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 20, 24, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: _slate700,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 20),
              Text(
                'Pilih Sumber Gambar',
                style: GoogleFonts.inter(
                  color: Colors.white,
                  fontWeight: FontWeight.w700,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                    child: _sourceButton(
                      icon: Icons.camera_alt_rounded,
                      label: 'Kamera',
                      onTap: () {
                        Navigator.pop(ctx);
                        _pickImage(ImageSource.camera);
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _sourceButton(
                      icon: Icons.photo_library_rounded,
                      label: 'Galeri',
                      onTap: () {
                        Navigator.pop(ctx);
                        _pickImage(ImageSource.gallery);
                      },
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _sourceButton(
      {required IconData icon,
      required String label,
      required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 24),
        decoration: BoxDecoration(
          color: _slate800.withOpacity(0.5),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: _slate700.withOpacity(0.6)),
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: _emerald.withOpacity(0.12),
                shape: BoxShape.circle,
                border: Border.all(color: _emerald.withOpacity(0.2)),
              ),
              child: Icon(icon, color: _emerald, size: 28),
            ),
            const SizedBox(height: 12),
            Text(
              label,
              style: GoogleFonts.inter(
                color: Colors.white,
                fontWeight: FontWeight.w600,
                fontSize: 13,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
