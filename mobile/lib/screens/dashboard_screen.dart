import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fl_chart/fl_chart.dart';
import '../providers/auth_provider.dart';
import '../providers/dashboard_provider.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen>
    with SingleTickerProviderStateMixin {
  int _currentNavIndex = 0;
  late AnimationController _animController;
  late Animation<double> _fadeAnim;

  // ─── Colors ────────────────────────────────────────────
  static const _bgColor = Color(0xFF0A0F1E);
  static const _cardColor = Color(0xFF111827);
  static const _emerald = Color(0xFF10B981);
  static const _blue = Color(0xFF3B82F6);
  static const _teal = Color(0xFF14B8A6);
  static const _amber = Color(0xFFF59E0B);
  static const _red = Color(0xFFEF4444);
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

    // Fetch dashboard data
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<DashboardProvider>().fetchDashboard();
    });
    _animController.forward();
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  void _handleLogout() async {
    await context.read<AuthProvider>().logout();
    if (mounted) Navigator.pushReplacementNamed(context, '/login');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bgColor,
      body: Consumer<DashboardProvider>(
        builder: (context, dashProvider, _) {
          if (dashProvider.isLoading || dashProvider.data == null) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const SizedBox(
                    width: 40,
                    height: 40,
                    child: CircularProgressIndicator(
                      strokeWidth: 3,
                      valueColor: AlwaysStoppedAnimation(_emerald),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text('Loading Data...',
                      style: GoogleFonts.inter(
                          color: Colors.white, fontWeight: FontWeight.w600)),
                ],
              ),
            );
          }

          final data = dashProvider.data!;
          return FadeTransition(
            opacity: _fadeAnim,
            child: SafeArea(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // ─── Header ───────────────────────────
                    _buildHeader(data.user.nama),
                    const SizedBox(height: 24),

                    // ─── Action Buttons ───────────────────
                    _buildActionButtons(),
                    const SizedBox(height: 24),

                    // ─── Planning & Calorie Cards ─────────
                    _buildPlanningCard(data.planning),
                    const SizedBox(height: 14),
                    _buildCalorieCard(data.calories),
                    const SizedBox(height: 24),

                    // ─── Weight Progress Chart ────────────
                    _buildWeightChart(data.weightProgress),
                    const SizedBox(height: 24),

                    // ─── Macro Cards ──────────────────────
                    _buildMacroCards(data.macros),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          );
        },
      ),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  // ─── Header ────────────────────────────────────────────
  Widget _buildHeader(String nama) {
    final firstName = nama.split(' ').first;
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Hello, $firstName! 👋',
              style: GoogleFonts.inter(
                fontSize: 24,
                fontWeight: FontWeight.w800,
                color: Colors.white,
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Ringkasan kemajuan nutrisi Anda hari ini.',
              style: GoogleFonts.inter(fontSize: 12, color: _slate400),
            ),
          ],
        ),
        GestureDetector(
          onTap: _handleLogout,
          child: Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: _red.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: _red.withOpacity(0.25)),
            ),
            child: const Icon(Icons.logout_rounded, color: _red, size: 20),
          ),
        ),
      ],
    );
  }

  // ─── Action Buttons ────────────────────────────────────
  Widget _buildActionButtons() {
    return Row(
      children: [
        Expanded(
          child: GestureDetector(
            onTap: () => Navigator.pushNamed(context, '/upload-food'),
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 14),
              decoration: BoxDecoration(
                color: _blue,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: _blue.withOpacity(0.3),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.camera_alt_rounded,
                      color: Colors.white, size: 18),
                  const SizedBox(width: 8),
                  Text(
                    'Lacak Makanan (AI)',
                    style: GoogleFonts.inter(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(width: 10),
        Container(
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
          decoration: BoxDecoration(
            color: _slate800.withOpacity(0.5),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: _slate700.withOpacity(0.6)),
          ),
          child: Row(
            children: [
              const Icon(Icons.monitor_weight_outlined,
                  color: Color(0xFFE2E8F0), size: 18),
              const SizedBox(width: 8),
              Text(
                'Catat BB',
                style: GoogleFonts.inter(
                  color: const Color(0xFFE2E8F0),
                  fontWeight: FontWeight.w600,
                  fontSize: 13,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // ─── Planning Card ─────────────────────────────────────
  Widget _buildPlanningCard(planning) {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: _cardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '${planning.goalWeeks} weeks goal',
            style: GoogleFonts.inter(
                color: _slate400, fontWeight: FontWeight.w500, fontSize: 13),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${planning.totalWeightChange} kg',
                style: GoogleFonts.inter(
                  fontSize: 34,
                  fontWeight: FontWeight.w800,
                  color: _emerald,
                  letterSpacing: -1,
                ),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: _slate800.withOpacity(0.6),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  '${planning.weightPerWeekChange} kg / week',
                  style: GoogleFonts.inter(
                      color: _slate400,
                      fontSize: 11,
                      fontWeight: FontWeight.w600),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: LinearProgressIndicator(
              value: 0.33,
              backgroundColor: _slate800,
              valueColor: const AlwaysStoppedAnimation(_emerald),
              minHeight: 6,
            ),
          ),
        ],
      ),
    );
  }

  // ─── Calorie Card ──────────────────────────────────────
  Widget _buildCalorieCard(calories) {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: _cardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Target Kalori Harian',
            style: GoogleFonts.inter(
                color: _slate400, fontWeight: FontWeight.w500, fontSize: 13),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.baseline,
                textBaseline: TextBaseline.alphabetic,
                children: [
                  Text(
                    '${calories.target}',
                    style: GoogleFonts.inter(
                      fontSize: 34,
                      fontWeight: FontWeight.w800,
                      color: _blue,
                      letterSpacing: -1,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Text('Kcal',
                      style: GoogleFonts.inter(
                          color: _slate400, fontWeight: FontWeight.w500)),
                ],
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                decoration: BoxDecoration(
                  color: _emerald.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: _emerald.withOpacity(0.3)),
                ),
                child: Text(
                  'BMR: ${calories.bmr} Kcal',
                  style: GoogleFonts.inter(
                    color: _emerald.withOpacity(0.9),
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: LinearProgressIndicator(
              value: 0.0,
              backgroundColor: _slate800,
              valueColor: AlwaysStoppedAnimation(_blue.withOpacity(0.8)),
              minHeight: 6,
            ),
          ),
        ],
      ),
    );
  }

  // ─── Weight Chart ──────────────────────────────────────
  Widget _buildWeightChart(weightProgress) {
    final spots = <FlSpot>[];
    for (int i = 0; i < weightProgress.data.length; i++) {
      spots.add(FlSpot(i.toDouble(), weightProgress.data[i]));
    }

    final targetSpots = <FlSpot>[];
    for (int i = 0; i < weightProgress.data.length; i++) {
      targetSpots.add(FlSpot(i.toDouble(), weightProgress.targetWeight));
    }

    double minY = 60.0;
    double maxY = 100.0;

    if (weightProgress.data.isNotEmpty) {
      minY = weightProgress.data.first;
      maxY = weightProgress.targetWeight;

      for (var w in weightProgress.data) {
        if (w < minY) minY = w;
        if (w > maxY) maxY = w;
      }
      if (weightProgress.targetWeight < minY) minY = weightProgress.targetWeight;
      if (weightProgress.targetWeight > maxY) maxY = weightProgress.targetWeight;

      minY -= 2;
      maxY += 2;
    }

    return Container(
      padding: const EdgeInsets.all(22),
      decoration: _cardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Weight Progress',
                style: GoogleFonts.inter(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: Colors.white),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: _slate800.withOpacity(0.8),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: _slate700.withOpacity(0.8)),
                ),
                child: Text(
                  'Last 30 Days',
                  style: GoogleFonts.inter(
                      color: const Color(0xFFCBD5E1),
                      fontSize: 10,
                      fontWeight: FontWeight.w500),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          SizedBox(
            height: 200,
            child: LineChart(
              LineChartData(
                minX: 0,
                maxX: spots.isEmpty ? 0 : (spots.length - 1).toDouble(),
                minY: minY,
                maxY: maxY,
                gridData: FlGridData(
                  show: true,
                  drawVerticalLine: false,
                  horizontalInterval: 2,
                  getDrawingHorizontalLine: (value) => FlLine(
                    color: _slate700.withOpacity(0.3),
                    strokeWidth: 1,
                  ),
                ),
                titlesData: FlTitlesData(
                  leftTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 40,
                      interval: 2,
                      getTitlesWidget: (val, meta) => Text(
                        '${val.toInt()}',
                        style: GoogleFonts.inter(
                            color: _slate400, fontSize: 10),
                      ),
                    ),
                  ),
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 30,
                      interval: 1,
                      getTitlesWidget: (val, meta) {
                        final idx = val.toInt();
                        if (idx >= 0 &&
                            idx < weightProgress.labels.length &&
                            idx % 2 == 0) {
                          return Padding(
                            padding: const EdgeInsets.only(top: 8),
                            child: Text(
                              weightProgress.labels[idx],
                              style: GoogleFonts.inter(
                                  color: _slate400, fontSize: 9),
                            ),
                          );
                        }
                        return const SizedBox.shrink();
                      },
                    ),
                  ),
                  topTitles: const AxisTitles(
                      sideTitles: SideTitles(showTitles: false)),
                  rightTitles: const AxisTitles(
                      sideTitles: SideTitles(showTitles: false)),
                ),
                borderData: FlBorderData(show: false),
                lineBarsData: [
                  // Weight line
                  LineChartBarData(
                    spots: spots,
                    isCurved: true,
                    color: _blue,
                    barWidth: 3,
                    isStrokeCapRound: true,
                    dotData: FlDotData(
                      show: true,
                      getDotPainter: (spot, pct, bar, idx) =>
                          FlDotCirclePainter(
                        radius: 4,
                        color: _blue,
                        strokeWidth: 2,
                        strokeColor: Colors.white,
                      ),
                    ),
                    belowBarData: BarAreaData(
                      show: true,
                      color: _blue.withOpacity(0.08),
                    ),
                  ),
                  // Target line (dashed)
                  LineChartBarData(
                    spots: targetSpots,
                    isCurved: false,
                    color: _emerald,
                    barWidth: 2,
                    dashArray: [5, 5],
                    dotData: const FlDotData(show: false),
                  ),
                ],
                lineTouchData: LineTouchData(
                  touchTooltipData: LineTouchTooltipData(
                    tooltipBgColor:
                        const Color(0xFF0F172A).withOpacity(0.9),
                    tooltipRoundedRadius: 8,
                    getTooltipItems: (touchedSpots) => touchedSpots
                        .map((spot) => LineTooltipItem(
                              '${spot.y.toStringAsFixed(1)} kg',
                              GoogleFonts.inter(
                                color: Colors.white,
                                fontWeight: FontWeight.w600,
                                fontSize: 12,
                              ),
                            ))
                        .toList(),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.only(top: 16),
            decoration: BoxDecoration(
              border: Border(
                  top: BorderSide(color: _slate800.withOpacity(0.6))),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('TODAY',
                        style: GoogleFonts.inter(
                            color: _slate400,
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            letterSpacing: 1.5)),
                    const SizedBox(height: 4),
                    RichText(
                      text: TextSpan(children: [
                        TextSpan(
                          text: '${weightProgress.todayWeight}',
                          style: GoogleFonts.inter(
                              fontSize: 22,
                              fontWeight: FontWeight.w900,
                              color: Colors.white),
                        ),
                        TextSpan(
                          text: ' kg',
                          style: GoogleFonts.inter(
                              fontSize: 15, color: _slate400),
                        ),
                      ]),
                    ),
                  ],
                ),
                Container(
                    width: 1, height: 40, color: _slate700.withOpacity(0.5)),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(weightProgress.startWeightDate.toUpperCase(),
                        style: GoogleFonts.inter(
                            color: _slate400,
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            letterSpacing: 1.5)),
                    const SizedBox(height: 4),
                    RichText(
                      text: TextSpan(children: [
                        TextSpan(
                          text: '${weightProgress.startWeight}',
                          style: GoogleFonts.inter(
                              fontSize: 22,
                              fontWeight: FontWeight.w900,
                              color: Colors.white),
                        ),
                        TextSpan(
                          text: ' kg',
                          style: GoogleFonts.inter(
                              fontSize: 15, color: _slate400),
                        ),
                      ]),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ─── Macro Cards ───────────────────────────────────────
  Widget _buildMacroCards(macros) {
    return Row(
      children: [
        Expanded(
            child: _macroCard(
                Icons.restaurant_rounded, '${macros.protein}g', 'Protein', _teal)),
        const SizedBox(width: 10),
        Expanded(
            child: _macroCard(
                Icons.bakery_dining_rounded, '${macros.carbs}g', 'Karbo', _amber)),
        const SizedBox(width: 10),
        Expanded(
            child: _macroCard(
                Icons.water_drop_rounded, '${macros.fat}g', 'Lemak', _red)),
      ],
    );
  }

  Widget _macroCard(IconData icon, String value, String label, Color color) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: _cardColor.withOpacity(0.8),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: _slate700.withOpacity(0.5)),
        boxShadow: [
          BoxShadow(color: color.withOpacity(0.05), blurRadius: 15),
        ],
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
              border: Border.all(color: color.withOpacity(0.3)),
            ),
            child: Icon(icon, color: color, size: 22),
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: GoogleFonts.inter(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: color,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label.toUpperCase(),
            style: GoogleFonts.inter(
              color: _slate400,
              fontSize: 10,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  // ─── Bottom Nav ────────────────────────────────────────
  Widget _buildBottomNav() {
    return Container(
      decoration: BoxDecoration(
        color: _cardColor.withOpacity(0.95),
        border: Border(top: BorderSide(color: _slate700.withOpacity(0.4))),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _navItem(Icons.dashboard_rounded, 'Dashboard', 0),
              _navItem(Icons.restaurant_menu_rounded, 'Log Makanan', 1),
              _navItem(Icons.camera_alt_rounded, 'Upload AI', 2),
            ],
          ),
        ),
      ),
    );
  }

  Widget _navItem(IconData icon, String label, int index) {
    final isActive = _currentNavIndex == index;
    return GestureDetector(
      onTap: () {
        if (index == 2) {
          Navigator.pushNamed(context, '/upload-food');
        } else {
          setState(() => _currentNavIndex = index);
        }
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            color: isActive ? _emerald : _slate400,
            size: 22,
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: GoogleFonts.inter(
              color: isActive ? _emerald : _slate400,
              fontSize: 10,
              fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
            ),
          ),
        ],
      ),
    );
  }

  // ─── Card Decoration Helper ────────────────────────────
  BoxDecoration _cardDecoration() {
    return BoxDecoration(
      color: _cardColor.withOpacity(0.8),
      borderRadius: BorderRadius.circular(18),
      border: Border.all(color: _slate700.withOpacity(0.5)),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.2),
          blurRadius: 20,
          offset: const Offset(0, 6),
        ),
      ],
    );
  }
}
