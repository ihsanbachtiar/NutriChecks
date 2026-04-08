import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/auth_provider.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen>
    with SingleTickerProviderStateMixin {
  int _currentStep = 1;
  static const int _totalSteps = 7;

  // Form controllers
  final _namaController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _konfirmasiPasswordController = TextEditingController();
  final _usiaController = TextEditingController();
  final _tinggiController = TextEditingController();
  final _beratController = TextEditingController();
  final _targetBeratController = TextEditingController();

  String _tujuan = '';
  String _gender = '';
  String _kecepatan = '';
  String _error = '';
  bool _obscurePassword = true;
  bool _obscureKonfirmasi = true;

  // Animation
  late AnimationController _animController;
  late Animation<double> _fadeAnim;
  late Animation<Offset> _slideAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _fadeAnim =
        Tween<double>(begin: 0, end: 1).animate(CurvedAnimation(parent: _animController, curve: Curves.easeOut));
    _slideAnim = Tween<Offset>(begin: const Offset(0.05, 0), end: Offset.zero)
        .animate(CurvedAnimation(parent: _animController, curve: Curves.easeOut));
    _animController.forward();
  }

  @override
  void dispose() {
    _namaController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _konfirmasiPasswordController.dispose();
    _usiaController.dispose();
    _tinggiController.dispose();
    _beratController.dispose();
    _targetBeratController.dispose();
    _animController.dispose();
    super.dispose();
  }

  void _animateStep() {
    _animController.reset();
    _animController.forward();
  }

  // ─── Validation ────────────────────────────────────────
  bool _validateStep() {
    setState(() => _error = '');
    switch (_currentStep) {
      case 1:
        if (_namaController.text.trim().isEmpty) {
          setState(() => _error = 'Nama lengkap wajib diisi');
          return false;
        }
        if (_emailController.text.trim().isEmpty) {
          setState(() => _error = 'Email wajib diisi');
          return false;
        }
        if (_passwordController.text.isEmpty) {
          setState(() => _error = 'Password wajib diisi');
          return false;
        }
        if (_passwordController.text.length < 6) {
          setState(() => _error = 'Password minimal 6 karakter');
          return false;
        }
        if (_passwordController.text != _konfirmasiPasswordController.text) {
          setState(() => _error = 'Konfirmasi password tidak cocok');
          return false;
        }
        return true;
      case 2:
        if (_tujuan.isEmpty) {
          setState(() => _error = 'Pilih tujuan Anda');
          return false;
        }
        return true;
      case 3:
        if (_gender.isEmpty) {
          setState(() => _error = 'Pilih jenis kelamin Anda');
          return false;
        }
        return true;
      case 4:
        final usia = int.tryParse(_usiaController.text) ?? 0;
        if (usia < 10 || usia > 120) {
          setState(() => _error = 'Masukkan usia yang valid (10–120 tahun)');
          return false;
        }
        return true;
      case 5:
        final tinggi = double.tryParse(_tinggiController.text) ?? 0;
        if (tinggi < 50 || tinggi > 300) {
          setState(() => _error = 'Masukkan tinggi badan yang valid (50–300 cm)');
          return false;
        }
        return true;
      case 6:
        final berat = double.tryParse(_beratController.text) ?? 0;
        final target = double.tryParse(_targetBeratController.text) ?? 0;
        if (berat <= 0) {
          setState(() => _error = 'Masukkan berat badan saat ini');
          return false;
        }
        if (target <= 0) {
          setState(() => _error = 'Masukkan target berat badan');
          return false;
        }
        return true;
      case 7:
        if (_kecepatan.isEmpty) {
          setState(() => _error = 'Pilih kecepatan Anda');
          return false;
        }
        return true;
      default:
        return true;
    }
  }

  void _nextStep() {
    if (_validateStep()) {
      setState(() => _currentStep++);
      _animateStep();
    }
  }

  void _prevStep() {
    if (_currentStep > 1) {
      setState(() {
        _currentStep--;
        _error = '';
      });
      _animateStep();
    }
  }

  Future<void> _handleSubmit() async {
    if (!_validateStep()) return;

    final formData = {
      'nama': _namaController.text.trim(),
      'email': _emailController.text.trim(),
      'password': _passwordController.text,
      'berat_badan': _beratController.text,
      'tinggi_badan': _tinggiController.text,
      'usia': _usiaController.text,
      'gender': _gender,
      'target_berat': _targetBeratController.text,
      'tujuan': _tujuan,
      'kecepatan': _kecepatan,
    };

    final auth = context.read<AuthProvider>();
    final success = await auth.register(formData);
    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Registrasi berhasil! Silakan login.',
              style: GoogleFonts.inter(color: Colors.white)),
          backgroundColor: const Color(0xFF10B981),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          margin: const EdgeInsets.all(16),
        ),
      );
      Navigator.pushReplacementNamed(context, '/login');
    } else if (auth.errorMessage.isNotEmpty) {
      setState(() => _error = auth.errorMessage);
    }
  }

  // ─── Colors ────────────────────────────────────────────
  static const _bgColor = Color(0xFF0A0F1E);
  static const _cardColor = Color(0xFF111827);
  static const _emerald = Color(0xFF10B981);
  static const _emeraldDim = Color(0xFF065F46);
  static const _slate400 = Color(0xFF94A3B8);
  static const _slate600 = Color(0xFF475569);
  static const _slate700 = Color(0xFF334155);
  static const _slate800 = Color(0xFF1E293B);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bgColor,
      body: SafeArea(
        child: Column(
          children: [
            // ─── Progress Bar ──────────────────────────
            _buildProgressBar(),

            // ─── Content ───────────────────────────────
            Expanded(
              child: FadeTransition(
                opacity: _fadeAnim,
                child: SlideTransition(
                  position: _slideAnim,
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    child: Column(
                      children: [
                        // Error
                        if (_error.isNotEmpty) _buildError(),
                        // Step content
                        _buildStepContent(),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            // ─── Navigation Buttons ────────────────────
            _buildNavButtons(),
          ],
        ),
      ),
    );
  }

  // ─── Progress Bar Widget ───────────────────────────────
  Widget _buildProgressBar() {
    final labels = ['Akun', 'Tujuan', 'Gender', 'Usia', 'Tinggi', 'Berat', 'Kecepatan'];
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Row(
        children: List.generate(labels.length * 2 - 1, (i) {
          if (i.isOdd) {
            final stepIdx = i ~/ 2;
            return Expanded(
              child: Container(
                height: 2,
                margin: const EdgeInsets.symmetric(horizontal: 2),
                decoration: BoxDecoration(
                  color: _currentStep > stepIdx + 1 ? _emerald : _slate700,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            );
          }
          final stepNum = i ~/ 2 + 1;
          final isDone = _currentStep > stepNum;
          final isActive = _currentStep == stepNum;
          return Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isDone
                      ? _emerald
                      : isActive
                          ? _emerald.withOpacity(0.2)
                          : _slate800.withOpacity(0.6),
                  border: Border.all(
                    color: isDone
                        ? _emerald
                        : isActive
                            ? _emerald
                            : _slate600.withOpacity(0.5),
                    width: isActive ? 2 : 1,
                  ),
                  boxShadow: isActive
                      ? [BoxShadow(color: _emerald.withOpacity(0.3), blurRadius: 8)]
                      : null,
                ),
                child: Center(
                  child: isDone
                      ? const Icon(Icons.check, color: Colors.white, size: 16)
                      : Text(
                          '$stepNum',
                          style: GoogleFonts.inter(
                            color: isActive ? _emerald : _slate400,
                            fontWeight: FontWeight.w700,
                            fontSize: 12,
                          ),
                        ),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                labels[stepNum - 1],
                style: GoogleFonts.inter(
                  fontSize: 9,
                  fontWeight: FontWeight.w500,
                  color: _currentStep >= stepNum ? _emerald : const Color(0xFF475569),
                ),
              ),
            ],
          );
        }),
      ),
    );
  }

  // ─── Error Message ─────────────────────────────────────
  Widget _buildError() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: const Color(0xFFEF4444).withOpacity(0.12),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFEF4444).withOpacity(0.35)),
      ),
      child: Text(
        _error,
        textAlign: TextAlign.center,
        style: GoogleFonts.inter(color: const Color(0xFFFCA5A5), fontSize: 13),
      ),
    );
  }

  // ─── Step Content ──────────────────────────────────────
  Widget _buildStepContent() {
    switch (_currentStep) {
      case 1:
        return _stepAccount();
      case 2:
        return _stepGoal();
      case 3:
        return _stepGender();
      case 4:
        return _stepAge();
      case 5:
        return _stepHeight();
      case 6:
        return _stepWeight();
      case 7:
        return _stepSpeed();
      default:
        return const SizedBox();
    }
  }

  // ─── Step Header ───────────────────────────────────────
  Widget _stepHeader(IconData icon, String title, String desc) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: _emerald.withOpacity(0.12),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: _emerald.withOpacity(0.2)),
          ),
          child: Icon(icon, color: _emerald, size: 32),
        ),
        const SizedBox(height: 16),
        Text(
          title,
          textAlign: TextAlign.center,
          style: GoogleFonts.inter(
            fontSize: 24,
            fontWeight: FontWeight.w800,
            color: Colors.white,
            letterSpacing: -0.5,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          desc,
          textAlign: TextAlign.center,
          style: GoogleFonts.inter(fontSize: 13, color: _slate400, height: 1.5),
        ),
        const SizedBox(height: 28),
      ],
    );
  }

  // ─── Input Field ───────────────────────────────────────
  Widget _inputField({
    required TextEditingController controller,
    required String label,
    required String hint,
    IconData? icon,
    TextInputType type = TextInputType.text,
    bool obscureText = false,
    Widget? suffix,
    TextAlign textAlign = TextAlign.start,
    double fontSize = 15,
    List<TextInputFormatter>? formatters,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 8),
          child: Text(label,
              style: GoogleFonts.inter(
                  color: const Color(0xFFCBD5E1), fontSize: 13, fontWeight: FontWeight.w500)),
        ),
        TextField(
          controller: controller,
          keyboardType: type,
          obscureText: obscureText,
          textAlign: textAlign,
          inputFormatters: formatters,
          style: GoogleFonts.inter(color: Colors.white, fontSize: fontSize, fontWeight: fontSize > 20 ? FontWeight.w700 : FontWeight.w400),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: GoogleFonts.inter(color: const Color(0xFF64748B), fontSize: fontSize, fontWeight: fontSize > 20 ? FontWeight.w700 : FontWeight.w400),
            prefixIcon: icon != null ? Icon(icon, color: const Color(0xFF64748B), size: 20) : null,
            suffixIcon: suffix,
            filled: true,
            fillColor: _slate800.withOpacity(0.6),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: BorderSide(color: _slate600.withOpacity(0.8)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: BorderSide(color: _slate600.withOpacity(0.8)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: _emerald, width: 1.5),
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          ),
        ),
      ],
    );
  }

  // ─── Option Card ───────────────────────────────────────
  Widget _optionCard({
    required IconData icon,
    required String title,
    String? subtitle,
    required bool selected,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        padding: const EdgeInsets.all(22),
        decoration: BoxDecoration(
          color: selected ? _emerald.withOpacity(0.08) : _slate800.withOpacity(0.4),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: selected ? _emerald : _slate700.withOpacity(0.6),
            width: selected ? 2 : 1,
          ),
          boxShadow: selected
              ? [BoxShadow(color: _emerald.withOpacity(0.15), blurRadius: 16)]
              : null,
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: selected ? _emerald.withOpacity(0.18) : _slate700.withOpacity(0.5),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(icon, color: selected ? _emerald : _slate400, size: 28),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: GoogleFonts.inter(
                fontWeight: FontWeight.w700,
                fontSize: 16,
                color: Colors.white,
              ),
            ),
            if (subtitle != null) ...[
              const SizedBox(height: 4),
              Text(subtitle, style: GoogleFonts.inter(fontSize: 12, color: _slate400)),
            ],
            if (selected) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: _emerald,
                  shape: BoxShape.circle,
                  boxShadow: [BoxShadow(color: _emerald.withOpacity(0.4), blurRadius: 6)],
                ),
                child: const Icon(Icons.check, color: Colors.white, size: 14),
              ),
            ],
          ],
        ),
      ),
    );
  }

  // ─── Step 1: Account ───────────────────────────────────
  Widget _stepAccount() {
    return Column(
      children: [
        _stepHeader(Icons.eco_rounded, 'Buat Akun Anda',
            'Lengkapi informasi akun untuk memulai perjalanan nutrisi Anda.'),
        _inputField(
          controller: _namaController,
          label: 'Nama Lengkap',
          hint: 'Masukkan nama lengkap',
          icon: Icons.person_outline_rounded,
        ),
        const SizedBox(height: 14),
        _inputField(
          controller: _emailController,
          label: 'Email',
          hint: 'nama@email.com',
          icon: Icons.email_outlined,
          type: TextInputType.emailAddress,
        ),
        const SizedBox(height: 14),
        _inputField(
          controller: _passwordController,
          label: 'Password',
          hint: 'Minimal 6 karakter',
          icon: Icons.lock_outline_rounded,
          obscureText: _obscurePassword,
          suffix: IconButton(
            icon: Icon(
              _obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
              color: const Color(0xFF64748B),
              size: 20,
            ),
            onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
          ),
        ),
        const SizedBox(height: 14),
        _inputField(
          controller: _konfirmasiPasswordController,
          label: 'Konfirmasi Password',
          hint: 'Ketik ulang password',
          icon: Icons.lock_outline_rounded,
          obscureText: _obscureKonfirmasi,
          suffix: IconButton(
            icon: Icon(
              _obscureKonfirmasi ? Icons.visibility_off_outlined : Icons.visibility_outlined,
              color: const Color(0xFF64748B),
              size: 20,
            ),
            onPressed: () => setState(() => _obscureKonfirmasi = !_obscureKonfirmasi),
          ),
        ),
      ],
    );
  }

  // ─── Step 2: Goal ──────────────────────────────────────
  Widget _stepGoal() {
    return Column(
      children: [
        _stepHeader(Icons.flag_rounded, 'Apa tujuan utama Anda?',
            'Pilihan ini akan membantu kami menyesuaikan target kalori harian Anda.'),
        Row(
          children: [
            Expanded(
              child: _optionCard(
                icon: Icons.trending_up_rounded,
                title: 'Menaikkan',
                subtitle: 'Berat Badan',
                selected: _tujuan == 'menaikkan berat badan',
                onTap: () => setState(() => _tujuan = 'menaikkan berat badan'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _optionCard(
                icon: Icons.trending_down_rounded,
                title: 'Menurunkan',
                subtitle: 'Berat Badan',
                selected: _tujuan == 'menurunkan berat badan',
                onTap: () => setState(() => _tujuan = 'menurunkan berat badan'),
              ),
            ),
          ],
        ),
      ],
    );
  }

  // ─── Step 3: Gender ────────────────────────────────────
  Widget _stepGender() {
    return Column(
      children: [
        _stepHeader(Icons.people_outline_rounded, 'Apa jenis kelamin Anda?',
            'Informasi ini penting untuk perhitungan BMR (Basal Metabolic Rate).'),
        Row(
          children: [
            Expanded(
              child: _optionCard(
                icon: Icons.male_rounded,
                title: 'Laki-laki',
                selected: _gender == 'laki-laki',
                onTap: () => setState(() => _gender = 'laki-laki'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _optionCard(
                icon: Icons.female_rounded,
                title: 'Perempuan',
                selected: _gender == 'perempuan',
                onTap: () => setState(() => _gender = 'perempuan'),
              ),
            ),
          ],
        ),
      ],
    );
  }

  // ─── Step 4: Age ───────────────────────────────────────
  Widget _stepAge() {
    return Column(
      children: [
        _stepHeader(Icons.calendar_today_rounded, 'Berapa usia Anda?',
            'Usia Anda digunakan untuk kalkulasi kebutuhan kalori harian.'),
        _inputField(
          controller: _usiaController,
          label: 'Usia (tahun)',
          hint: '25',
          type: TextInputType.number,
          textAlign: TextAlign.center,
          fontSize: 36,
          formatters: [FilteringTextInputFormatter.digitsOnly],
          suffix: Padding(
            padding: const EdgeInsets.only(right: 16, top: 14),
            child: Text('tahun', style: GoogleFonts.inter(color: _slate400, fontSize: 14)),
          ),
        ),
        const SizedBox(height: 12),
        Text('Rentang valid: 10 – 120 tahun',
            style: GoogleFonts.inter(fontSize: 11, color: const Color(0xFF64748B))),
      ],
    );
  }

  // ─── Step 5: Height ────────────────────────────────────
  Widget _stepHeight() {
    return Column(
      children: [
        _stepHeader(Icons.straighten_rounded, 'Berapa tinggi badan Anda?',
            'Informasi ini digunakan untuk menghitung BMI Anda.'),
        _inputField(
          controller: _tinggiController,
          label: 'Tinggi Badan',
          hint: '170',
          type: const TextInputType.numberWithOptions(decimal: true),
          textAlign: TextAlign.center,
          fontSize: 36,
          suffix: Padding(
            padding: const EdgeInsets.only(right: 16, top: 14),
            child: Text('cm', style: GoogleFonts.inter(color: _slate400, fontSize: 14)),
          ),
        ),
        const SizedBox(height: 12),
        Text('Contoh: 170.5',
            style: GoogleFonts.inter(fontSize: 11, color: const Color(0xFF64748B))),
      ],
    );
  }

  // ─── Step 6: Weight ────────────────────────────────────
  Widget _stepWeight() {
    return Column(
      children: [
        _stepHeader(Icons.monitor_weight_outlined, 'Berapa berat badan Anda?',
            'Masukkan berat badan awal dan target yang ingin Anda capai.'),
        _inputField(
          controller: _beratController,
          label: 'Berat Badan Saat Ini',
          hint: '65',
          type: const TextInputType.numberWithOptions(decimal: true),
          textAlign: TextAlign.center,
          fontSize: 28,
          suffix: Padding(
            padding: const EdgeInsets.only(right: 16, top: 10),
            child: Text('kg', style: GoogleFonts.inter(color: _slate400, fontSize: 14)),
          ),
        ),
        const SizedBox(height: 16),
        _inputField(
          controller: _targetBeratController,
          label: 'Target Berat Badan',
          hint: '60',
          type: const TextInputType.numberWithOptions(decimal: true),
          textAlign: TextAlign.center,
          fontSize: 28,
          suffix: Padding(
            padding: const EdgeInsets.only(right: 16, top: 10),
            child: Text('kg', style: GoogleFonts.inter(color: _slate400, fontSize: 14)),
          ),
        ),
      ],
    );
  }

  // ─── Step 7: Speed ─────────────────────────────────────
  Widget _stepSpeed() {
    final options = [
      {'value': '0.25', 'label': 'Perlahan', 'desc': 'Target 0.25 kg / minggu', 'icon': Icons.speed},
      {'value': '0.5', 'label': 'Normal', 'desc': 'Target 0.5 kg / minggu', 'icon': Icons.speed},
      {'value': '1', 'label': 'Cepat', 'desc': 'Target 1 kg / minggu', 'icon': Icons.speed},
    ];

    return Column(
      children: [
        _stepHeader(Icons.speed_rounded, 'Pilih kecepatan Anda',
            'Ini adalah langkah terakhir. Pilihan ini akan menentukan target kalori harian Anda.'),
        ...options.map((opt) {
          final isSelected = _kecepatan == opt['value'];
          return Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: GestureDetector(
              onTap: () => setState(() => _kecepatan = opt['value'] as String),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: isSelected ? _emerald.withOpacity(0.08) : _slate800.withOpacity(0.4),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(
                    color: isSelected ? _emerald : _slate700.withOpacity(0.6),
                    width: isSelected ? 2 : 1,
                  ),
                  boxShadow: isSelected
                      ? [BoxShadow(color: _emerald.withOpacity(0.15), blurRadius: 15)]
                      : null,
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isSelected ? _emerald.withOpacity(0.18) : _slate700.withOpacity(0.5),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Icon(opt['icon'] as IconData,
                          color: isSelected ? _emerald : _slate400, size: 24),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(opt['label'] as String,
                              style: GoogleFonts.inter(
                                  fontWeight: FontWeight.w700, fontSize: 15, color: Colors.white)),
                          const SizedBox(height: 2),
                          Text(opt['desc'] as String,
                              style: GoogleFonts.inter(fontSize: 12, color: _slate400)),
                        ],
                      ),
                    ),
                    if (isSelected)
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: _emerald,
                          shape: BoxShape.circle,
                          boxShadow: [BoxShadow(color: _emerald.withOpacity(0.4), blurRadius: 6)],
                        ),
                        child: const Icon(Icons.check, color: Colors.white, size: 16),
                      ),
                  ],
                ),
              ),
            ),
          );
        }),
      ],
    );
  }

  // ─── Navigation Buttons ────────────────────────────────
  Widget _buildNavButtons() {
    final auth = context.watch<AuthProvider>();
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 12, 24, 20),
      decoration: BoxDecoration(
        color: _bgColor,
        border: Border(top: BorderSide(color: _slate700.withOpacity(0.4))),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Back / Login button
          if (_currentStep > 1)
            TextButton.icon(
              onPressed: _prevStep,
              icon: const Icon(Icons.arrow_back_rounded, size: 18),
              label: Text('Kembali', style: GoogleFonts.inter(fontSize: 13)),
              style: TextButton.styleFrom(
                foregroundColor: const Color(0xFFCBD5E1),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(color: _slate700.withOpacity(0.5)),
                ),
              ),
            )
          else
            TextButton.icon(
              onPressed: () => Navigator.pushReplacementNamed(context, '/login'),
              icon: const Icon(Icons.arrow_back_rounded, size: 18),
              label: Text('Login', style: GoogleFonts.inter(fontSize: 13)),
              style: TextButton.styleFrom(
                foregroundColor: const Color(0xFFCBD5E1),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(color: _slate700.withOpacity(0.5)),
                ),
              ),
            ),

          // Next / Submit button
          if (_currentStep < _totalSteps)
            ElevatedButton.icon(
              onPressed: _nextStep,
              icon: Text('Lanjutkan',
                  style: GoogleFonts.inter(fontWeight: FontWeight.w600, fontSize: 13)),
              label: const Icon(Icons.arrow_forward_rounded, size: 18),
              style: ElevatedButton.styleFrom(
                backgroundColor: _emerald,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                elevation: 6,
                shadowColor: _emerald.withOpacity(0.35),
              ),
            )
          else
            ElevatedButton.icon(
              onPressed: auth.isLoading ? null : _handleSubmit,
              icon: auth.isLoading
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(
                          strokeWidth: 2, valueColor: AlwaysStoppedAnimation(Colors.white)))
                  : Text('Selesai',
                      style: GoogleFonts.inter(fontWeight: FontWeight.w600, fontSize: 13)),
              label: auth.isLoading
                  ? const SizedBox.shrink()
                  : const Icon(Icons.check_rounded, size: 18),
              style: ElevatedButton.styleFrom(
                backgroundColor: _emerald,
                foregroundColor: Colors.white,
                disabledBackgroundColor: _emerald.withOpacity(0.5),
                padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                elevation: 6,
                shadowColor: _emerald.withOpacity(0.35),
              ),
            ),
        ],
      ),
    );
  }
}
