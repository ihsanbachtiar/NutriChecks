class UserModel {
  final int id;
  final String nama;
  final String email;
  final double? targetKalori;

  UserModel({
    required this.id,
    required this.nama,
    required this.email,
    this.targetKalori,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? 0,
      nama: json['nama'] ?? '',
      email: json['email'] ?? '',
      targetKalori: json['target_kalori'] != null
          ? double.tryParse(json['target_kalori'].toString())
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nama': nama,
      'email': email,
      'target_kalori': targetKalori,
    };
  }
}
