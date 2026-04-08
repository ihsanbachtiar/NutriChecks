class DashboardModel {
  final DashboardUser user;
  final PlanningData planning;
  final CaloriesData calories;
  final WeightProgressData weightProgress;
  final MacrosData macros;

  DashboardModel({
    required this.user,
    required this.planning,
    required this.calories,
    required this.weightProgress,
    required this.macros,
  });

  factory DashboardModel.fromJson(Map<String, dynamic> json) {
    return DashboardModel(
      user: DashboardUser.fromJson(json['user'] ?? {}),
      planning: PlanningData.fromJson(json['planning'] ?? {}),
      calories: CaloriesData.fromJson(json['calories'] ?? {}),
      weightProgress: WeightProgressData.fromJson(json['weightProgress'] ?? {}),
      macros: MacrosData.fromJson(json['macros'] ?? {}),
    );
  }
}

class DashboardUser {
  final String nama;
  final String nrp;
  final String status;
  final String avatar;

  DashboardUser({
    required this.nama,
    required this.nrp,
    required this.status,
    required this.avatar,
  });

  factory DashboardUser.fromJson(Map<String, dynamic> json) {
    return DashboardUser(
      nama: json['nama'] ?? '',
      nrp: json['nrp'] ?? '',
      status: json['status'] ?? 'Offline',
      avatar: json['avatar'] ?? '',
    );
  }
}

class PlanningData {
  final int goalWeeks;
  final String weightPerWeekChange;
  final String totalWeightChange;

  PlanningData({
    required this.goalWeeks,
    required this.weightPerWeekChange,
    required this.totalWeightChange,
  });

  factory PlanningData.fromJson(Map<String, dynamic> json) {
    return PlanningData(
      goalWeeks: json['goalWeeks'] ?? 0,
      weightPerWeekChange: json['weightPerWeekChange']?.toString() ?? '0',
      totalWeightChange: json['totalWeightChange']?.toString() ?? '0',
    );
  }
}

class CaloriesData {
  final int target;
  final int bmr;

  CaloriesData({required this.target, required this.bmr});

  factory CaloriesData.fromJson(Map<String, dynamic> json) {
    return CaloriesData(
      target: json['target'] ?? 0,
      bmr: json['bmr'] ?? 0,
    );
  }
}

class WeightProgressData {
  final List<String> labels;
  final List<double> data;
  final double targetWeight;
  final double todayWeight;
  final String startWeightDate;
  final double startWeight;

  WeightProgressData({
    required this.labels,
    required this.data,
    required this.targetWeight,
    required this.todayWeight,
    required this.startWeightDate,
    required this.startWeight,
  });

  factory WeightProgressData.fromJson(Map<String, dynamic> json) {
    return WeightProgressData(
      labels: List<String>.from(json['labels'] ?? []),
      data: (json['data'] as List?)
              ?.map((e) => double.tryParse(e.toString()) ?? 0.0)
              .toList() ??
          [],
      targetWeight: double.tryParse(json['targetWeight']?.toString() ?? '0') ?? 0,
      todayWeight: double.tryParse(json['todayWeight']?.toString() ?? '0') ?? 0,
      startWeightDate: json['startWeightDate'] ?? '',
      startWeight: double.tryParse(json['startWeight']?.toString() ?? '0') ?? 0,
    );
  }
}

class MacrosData {
  final int protein;
  final int carbs;
  final int fat;

  MacrosData({required this.protein, required this.carbs, required this.fat});

  factory MacrosData.fromJson(Map<String, dynamic> json) {
    return MacrosData(
      protein: json['protein'] ?? 0,
      carbs: json['carbs'] ?? 0,
      fat: json['fat'] ?? 0,
    );
  }
}
