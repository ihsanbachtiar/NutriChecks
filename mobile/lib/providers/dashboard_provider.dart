import 'package:flutter/material.dart';
import '../models/dashboard_model.dart';
import '../services/api_service.dart';

/// Provider untuk mengelola state dashboard (fetch data nutrisi).
class DashboardProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();

  bool _isLoading = false;
  String _errorMessage = '';
  DashboardModel? _data;

  bool get isLoading => _isLoading;
  String get errorMessage => _errorMessage;
  DashboardModel? get data => _data;

  // ─── Fetch Dashboard Data ─────────────────────────────
  Future<void> fetchDashboard() async {
    _isLoading = true;
    _errorMessage = '';
    notifyListeners();

    try {
      final response = await _apiService.getDashboard();
      _data = DashboardModel.fromJson(response.data);
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _errorMessage = 'Gagal memuat data dashboard.';
      _isLoading = false;
      notifyListeners();
    }
  }
}
