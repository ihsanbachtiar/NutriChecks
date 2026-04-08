class ApiConfig {
  // ╔══════════════════════════════════════════════════════════════╗
  // ║  PENTING: Ganti IP address di bawah sesuai kondisi Anda!     ║
  // ║                                                              ║
  // ║  • Android Emulator → gunakan: 'http://10.0.2.2:5000/api'    ║
  // ║  • HP Fisik (USB/WiFi) → gunakan IP komputer Anda:           ║
  // ║    Cek via cmd: ipconfig → cari IPv4 Address                 ║
  // ║    Contoh: 'http://192.168.1.100:5000/api'                   ║
  // ║                                                              ║
  // ║  HP dan komputer HARUS terhubung ke WiFi yang SAMA!          ║
  // ╚══════════════════════════════════════════════════════════════╝

  // GANTI IP DI BAWAH INI dengan IPv4 address komputer Anda:
  static const String baseUrl = 'http://192.168.0.104:5000/api';
  
  // Timeout dalam milliseconds
  static const int connectTimeout = 15000;
  static const int receiveTimeout = 15000;
}
