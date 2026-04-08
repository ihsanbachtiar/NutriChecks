exports.getDashboardData = async (req, res) => {
  try {
    // Data statis/mock ini dibuat presisi mengacu pada kebutuhan UI mockup
    // Pada pengembangan aslinya, data ini ditarik dari DB memakai relasi "req.user.id"
    const mockData = {
      user: {
        nama: req.user.nama || 'Ahmad R.',
        nrp: 'NRP 123456',
        status: 'Online',
        avatar: 'https://ui-avatars.com/api/?name=Ahmad+R&background=10b981&color=fff'
      },
      planning: {
        goalWeeks: 12,
        weightPerWeekChange: "+0.5",
        totalWeightChange: "+6.0"
      },
      calories: {
        target: 2168,
        bmr: 1734
      },
      weightProgress: {
        labels: ['Jan 01', 'Jan 15', 'Feb 01', 'Feb 15', 'Mar 01', 'Mar 15', 'Apr 01'],
        data: [65.0, 65.5, 66.2, 66.8, 67.5, 68.0, 68.2],
        targetWeight: 71.0,
        todayWeight: 68.2,
        startWeightDate: 'Apr 01',
        startWeight: 74.2 
      },
      macros: {
        protein: 136,
        carbs: 271,
        fat: 60
      }
    };
    
    return res.status(200).json(mockData);
  } catch (error) {
    console.error("Dashboard API Error: ", error);
    return res.status(500).json({ message: 'Terjadi kesalahan internal pada server' });
  }
};
