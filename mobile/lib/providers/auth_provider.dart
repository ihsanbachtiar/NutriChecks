import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';

/// Provider untuk mengelola state autentikasi (login, register, logout).
class AuthProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  final AuthService _authService = AuthService();

  bool _isLoading = false;
  String _errorMessage = '';
  UserModel? _user;
  bool _isAuthenticated = false;

  bool get isLoading => _isLoading;
  String get errorMessage => _errorMessage;
  UserModel? get user => _user;
  bool get isAuthenticated => _isAuthenticated;

  // ─── Check Auth Status ────────────────────────────────
  Future<void> checkAuth() async {
    final isLoggedIn = await _authService.isLoggedIn();
    if (isLoggedIn) {
      _user = await _authService.getUser();
      _isAuthenticated = true;
    } else {
      _isAuthenticated = false;
      _user = null;
    }
    notifyListeners();
  }

  // ─── Login ────────────────────────────────────────────
  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _errorMessage = '';
    notifyListeners();

    try {
      final response = await _apiService.login(email, password);
      final data = response.data;

      if (data['token'] != null) {
        await _authService.saveToken(data['token']);
        _user = UserModel.fromJson(data['user']);
        await _authService.saveUser(_user!);
        _isAuthenticated = true;
        _isLoading = false;
        notifyListeners();
        return true;
      }

      _errorMessage = data['message'] ?? 'Login gagal';
      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _errorMessage = _extractErrorMessage(e);
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // ─── Register ─────────────────────────────────────────
  Future<bool> register(Map<String, dynamic> formData) async {
    _isLoading = true;
    _errorMessage = '';
    notifyListeners();

    try {
      await _apiService.register(formData);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = _extractErrorMessage(e);
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // ─── Logout ───────────────────────────────────────────
  Future<void> logout() async {
    await _authService.clearAll();
    _user = null;
    _isAuthenticated = false;
    _errorMessage = '';
    notifyListeners();
  }

  // ─── Clear Error ──────────────────────────────────────
  void clearError() {
    _errorMessage = '';
    notifyListeners();
  }

  // ─── Helper ───────────────────────────────────────────
  String _extractErrorMessage(dynamic e) {
    if (e is Exception) {
      try {
        final dynamic error = e;
        if (error.response?.data != null) {
          return error.response.data['message'] ?? 'Terjadi kesalahan';
        }
      } catch (_) {}
    }
    return 'Tidak dapat terhubung ke server. Pastikan backend sedang berjalan.';
  }
}
