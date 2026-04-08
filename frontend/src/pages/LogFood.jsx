import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ChevronLeft, ChevronRight, Search, Trash2, PlusCircle, Loader2 } from 'lucide-react';

export default function LogFood() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Tanggal Hari Ini (Basic YYYY-MM-DD for UI)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Dummy State Data Makanan
  const [foodLogs, setFoodLogs] = useState({
    sarapan: [],
    makanSiang: [],
    makanMalam: [],
    camilan: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (!token || !storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  useEffect(() => {
    // Simulasi Fetch Data '/api/food-logs?date=YYYY-MM-DD'
    const fetchFoodLogs = () => {
      setIsLoading(true);
      
      setTimeout(() => {
        // Data Dummy
        const dummyLogs = {
          sarapan: [
            { id: 1, name: 'Telor Ceplok', portion: '1 Butir (50g)', kalori: 92, protein: 6.3, karbo: 0.4, lemak: 7.3 },
            { id: 2, name: 'Roti Gandum', portion: '2 Lembar (60g)', kalori: 150, protein: 6.0, karbo: 28.0, lemak: 2.0 }
          ],
          makanSiang: [
            { id: 3, name: 'Nasi Putih', portion: '1 Porsi (150g)', kalori: 204, protein: 4.0, karbo: 45.0, lemak: 0.4 },
            { id: 4, name: 'Ayam Bakar Dada', portion: '1 Potong (100g)', kalori: 165, protein: 31.0, karbo: 0.0, lemak: 3.6 }
          ],
          makanMalam: [
            { id: 5, name: 'Salad Sayur', portion: '1 Mangkuk (150g)', kalori: 120, protein: 3.0, karbo: 15.0, lemak: 5.0 }
          ],
          camilan: [
            { id: 6, name: 'Buah Apel', portion: '1 Buah (100g)', kalori: 52, protein: 0.3, karbo: 14.0, lemak: 0.2 }
          ]
        };
        
        setFoodLogs(dummyLogs);
        setIsLoading(false);
      }, 800);
    };

    fetchFoodLogs();
  }, [selectedDate]);

  // Fungsi Dummy Hapus
  const handleDeleteLog = (kategori, id) => {
    setFoodLogs(prev => ({
      ...prev,
      [kategori]: prev[kategori].filter(item => item.id !== id)
    }));
  };

  if (!user) return null;

  // Kalkulasi Ringkasan
  const calculateTotal = (field) => {
    return Object.values(foodLogs).flat().reduce((acc, curr) => acc + curr[field], 0);
  };

  const totalKalori = calculateTotal('kalori');
  const targetKalori = user?.target_kalori || 2000;
  const persenKalori = Math.min((totalKalori / targetKalori) * 100, 100);

  const totalProtein = calculateTotal('protein');
  const totalKarbo = calculateTotal('karbo');
  const totalLemak = calculateTotal('lemak');

  // Hardcode rata-rata target makro harian (Bisa disesuaikan dari user settings)
  const targetProtein = 120;
  const targetKarbo = 250;
  const targetLemak = 60;

  // Komponen Helper untuk Lingkaran Progress
  const CircularProgress = ({ value, max, colorClass, label, unit }) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const percentage = Math.min(value / max, 1);
    const strokeDashoffset = circumference - percentage * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center w-20 h-20 mb-2">
          {/* Background Circle */}
          <svg className="absolute w-full h-full transform -rotate-90">
            <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
            <circle 
              cx="40" cy="40" r={radius} 
              stroke="currentColor" strokeWidth="6" fill="transparent" 
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} 
              strokeLinecap="round" className={`${colorClass} transition-all duration-1000 ease-out`} 
            />
          </svg>
          <div className="flex flex-col items-center justify-center absolute">
            <span className="text-xs font-bold text-white leading-none">{Math.round(max - value)}</span>
            <span className="text-[10px] text-slate-400 font-medium">{unit}</span>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-400 capitalize">{label} (Sisa)</span>
      </div>
    );
  };

  // Komponen Helper untuk render daftar card
  const renderCategoryCard = (title, dataKey) => {
    const data = foodLogs[dataKey];
    return (
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col transition-all hover:border-white/20 shadow-lg overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-white/10 bg-slate-900/40 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-200">{title}</h3>
          <span className="text-sm font-semibold text-emerald-400">
            {data.reduce((acc, curr) => acc + curr.kalori, 0)} Kcal
          </span>
        </div>
        
        {/* List Makanan */}
        <div className="flex-1 p-4 divide-y divide-white/5">
          {data.length === 0 ? (
            <div className="py-6 text-center text-slate-500 text-sm italic">Belum ada makanan dicatat.</div>
          ) : (
            data.map(item => (
              <div key={item.id} className="py-3 flex justify-between items-center group">
                <div className="flex flex-col">
                  <span className="text-slate-200 font-bold">{item.name}</span>
                  <span className="text-slate-400 text-xs">
                    {item.portion} • P: {item.protein}g | K: {item.karbo}g | L: {item.lemak}g
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-400 font-bold text-sm hidden sm:block">{item.kalori} Kcal</span>
                  <button 
                    onClick={() => handleDeleteLog(dataKey, item.id)}
                    className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                    title="Hapus Makanan"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Add Button */}
        <div className="px-6 py-3 border-t border-white/10 bg-slate-900/20 hover:bg-slate-900/40 transition-colors cursor-pointer flex items-center justify-center gap-2 group">
          <PlusCircle className="w-5 h-5 text-emerald-500 group-hover:text-emerald-400 transition-colors" />
          <span className="text-sm font-bold text-emerald-500 group-hover:text-emerald-400 transition-colors">Tambah Makanan</span>
        </div>
      </div>
    );
  };

  // Navigasi Tanggal 
  const ubahTanggal = (hari) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + hari);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white font-sans">
      <Sidebar activePage="log" user={user} />

      <main className="flex-1 overflow-y-auto relative bg-slate-950 px-4 py-8 md:px-8">
        {/* Dekorasi Background */}
        <div className="fixed top-[10%] right-[10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-2 relative z-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
              Buku Harian Nutrisi
            </h1>
            <p className="text-slate-400 text-sm">Catat asupan harian atau lihat historis catatan kalori Anda.</p>
          </div>
          
          {/* Glassmorphism Date Navigator */}
          <div className="flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-1 shadow-lg w-full md:w-auto mt-2 md:mt-0 font-medium text-slate-300">
            <button 
              onClick={() => ubahTanggal(-1)}
              className="p-2 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-6 py-1 select-none flex-1 text-center font-bold tracking-wide">
              {isToday ? 'Hari Ini' : selectedDate}
            </div>
            <button 
              onClick={() => ubahTanggal(1)}
              disabled={isToday} // Jangan sampai masa depan unless user wants to plan
              className={`p-2 rounded-lg transition-colors ${isToday ? 'text-slate-600 cursor-not-allowed' : 'hover:bg-white/10 hover:text-white'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-emerald-500">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="text-slate-400 font-medium">Memuat log makanan Anda...</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500 relative z-10">
            
            {/* TOP SECTION: KARTU RINGKASAN */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-xl hover:border-white/20 transition-all">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                
                {/* Progress Bar Kalori */}
                <div className="flex-1 w-full flex flex-col justify-center">
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <span className="text-slate-400 text-sm font-semibold uppercase tracking-widest block mb-1">Kalori Terpakai</span>
                      <div className="text-4xl md:text-5xl font-black text-white">{Math.round(totalKalori)}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 text-xs font-semibold uppercase tracking-widest block mb-1">Sisa Target</span>
                      <div className="text-2xl font-bold text-emerald-400">{Math.max( targetKalori - totalKalori, 0 )}</div>
                    </div>
                  </div>
                  {/* Outer Bar */}
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                    {/* Inner Bar (Progress) */}
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${persenKalori > 100 ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-400 to-teal-400'}`}
                      style={{ width: `${Math.min(persenKalori, 100)}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-right text-xs font-semibold text-slate-500">Dari batas {targetKalori} Kcal</div>
                </div>

                {/* Garis Pemisah (Desktop) */}
                <div className="hidden lg:block w-px h-24 bg-slate-700/50"></div>

                {/* Lingkaran Makronutrien */}
                <div className="flex items-center justify-around w-full lg:w-auto gap-4 md:gap-8 min-w-[300px]">
                  <CircularProgress value={totalProtein} max={targetProtein} colorClass="text-blue-500" label="Protein" unit="g" />
                  <CircularProgress value={totalKarbo} max={targetKarbo} colorClass="text-amber-500" label="Karbo" unit="g" />
                  <CircularProgress value={totalLemak} max={targetLemak} colorClass="text-rose-500" label="Lemak" unit="g" />
                </div>

              </div>
            </div>

            {/* SEARCH BAR PENCARIAN MANUAL */}
            <div className="relative max-w-2xl mx-auto md:mx-0">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari makanan secara manual jika tidak menggunakan AI..."
                className="w-full block bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl py-3.5 pl-12 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-lg"
              />
              {searchQuery && (
                <div className="absolute top-16 left-0 w-full bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-2xl z-20 animate-in fade-in zoom-in-95">
                  <p className="text-slate-400 text-sm font-medium italic text-center py-2">
                    Simulasi: Menampilkan hasil pencarian untuk "{searchQuery}"...
                  </p>
                </div>
              )}
            </div>

            {/* MAIN SECTION: 4 KARTU KATEGORI MAKANAN */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {renderCategoryCard('🍳 Sarapan', 'sarapan')}
              {renderCategoryCard('🍱 Makan Siang', 'makanSiang')}
              {renderCategoryCard('🍲 Makan Malam', 'makanMalam')}
              {renderCategoryCard('🍿 Camilan', 'camilan')}
            </div>

            {/* Spacer Data */}
            <div className="h-10"></div>
          </div>
        )}
      </main>
    </div>
  );
}
