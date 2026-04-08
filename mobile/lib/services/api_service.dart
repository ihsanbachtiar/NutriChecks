import 'package:dio/dio.dart';
import '../config/api_config.dart';
import 'auth_service.dart';

/// Service HTTP client untuk berkomunikasi dengan backend API Nutricheck.
class ApiService {
  late final Dio _dio;
  final AuthService _authService = AuthService();

  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: ApiConfig.baseUrl,
      connectTimeout: Duration(milliseconds: ApiConfig.connectTimeout),
      receiveTimeout: Duration(milliseconds: ApiConfig.receiveTimeout),
      headers: {
        'Content-Type': 'application/json',
      },
    ));

    // Interceptor untuk menambahkan JWT token ke setiap request
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _authService.getToken();
        if (token != null && token.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) {
        return handler.next(error);
      },
    ));
  }

  // ─── POST /api/login ──────────────────────────────────
  Future<Response> login(String email, String password) async {
    return await _dio.post('/login', data: {
      'email': email,
      'password': password,
    });
  }

  // ─── POST /api/register ───────────────────────────────
  Future<Response> register(Map<String, dynamic> data) async {
    return await _dio.post('/register', data: data);
  }

  // ─── GET /api/dashboard ───────────────────────────────
  Future<Response> getDashboard() async {
    return await _dio.get('/dashboard');
  }
}
