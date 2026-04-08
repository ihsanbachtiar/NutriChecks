import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Download, ChevronDown, Loader2 } from 'lucide-react';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Report() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [range, setRange] = useState('7days');
  const [reportData, setReportData] = useState(null);
  
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
    // Simulasi Fetch Data '/api/report?range=...' menggunakan JWT Token
    const fetchReportData = () => {
      setIsLoading(true);
      
      // Simulasi delay jaringan API
      setTimeout(() => {
        // State Dummy siap digunakan
        const dummyData = {
          summary: {
            avgCalories: 1850,
            weightChange: -1.2,
            targetCompliance: 85
          },
          charts: {
            barLabels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
            barData: [1600, 1850, 1750, 2100, 1800, 2200, 1750],
            targetLine: 1950,
            macroLabels: ['Protein', 'Karbohidrat', 'Lemak'],
            macroData: [30, 45, 25] // Presentase
          },
          history: [
            { id: 1, date: '2026-04-07', name: 'Nasi Goreng Ayam', kalori: 450, protein: 15.5, karbo: 50.2, lemak: 12.0 },
            { id: 2, date: '2026-04-06', name: 'Salad Buah Segar', kalori: 230, protein: 3.5, karbo: 45.0, lemak: 5.0 },
            { id: 3, date: '2026-04-05', name: 'Dada Ayam Bakar', kalori: 320, protein: 35.0, karbo: 5.0, lemak: 8.0 },
            { id: 4, date: '2026-04-04', name: 'Oatmeal Muffin', kalori: 300, protein: 8.0, karbo: 48.0, lemak: 6.0 },
            { id: 5, date: '2026-04-03', name: 'Sate Taichan', kalori: 400, protein: 42.0, karbo: 15.0, lemak: 16.0 },
          ]
        };
        
        setReportData(dummyData);
        setIsLoading(false);
      }, 1200); 
    };

    fetchReportData();
  }, [range]); // Dependency trigegrs re-fetch upon range change

  const handleExportPDF = () => {
    alert('Simulasi: Merender dan Mengunduh Laporan PDF...');
  };

  if (!user) return null;

  // Chart configs
  const barChartData = {
    labels: reportData?.charts?.barLabels || [],
    datasets: [
      {
        type: 'line',
        label: 'Batas Target Kalori (BMR)',
        data: Array(7).fill(reportData?.charts?.targetLine || 0),
        borderColor: 'rgba(239, 68, 68, 0.8)', // Merah
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      },
      {
        type: 'bar',
        label: 'Konsumsi Aktual (Kcal)',
        data: reportData?.charts?.barData || [],
        backgroundColor: 'rgba(16, 185, 129, 0.8)', // Emerald 500
        borderRadius: 6,
        barPercentage: 0.6,
      }
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#cbd5e1', font: { family: 'inherit', size: 13 } }, position: 'top' },
      tooltip: { padding: 10, cornerRadius: 8 }
    },
    scales: {
      y: { 
        grid: { color: 'rgba(51, 65, 85, 0.5)' }, 
        ticks: { color: '#94a3b8' },
        beginAtZero: true 
      },
      x: { 
        grid: { display: false }, 
        ticks: { color: '#94a3b8' } 
      }
    }
  };

  const doughnutData = {
    labels: reportData?.charts?.macroLabels || [],
    datasets: [
      {
        data: reportData?.charts?.macroData || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.9)', // Blue (Protein)
          'rgba(245, 158, 11, 0.9)', // Amber (Karbo)
          'rgba(239, 68, 68, 0.9)',  // Red (Lemak)
        ],
        borderColor: '#020617', // slate-950 border (blend in)
        borderWidth: 4,
        hoverOffset: 6
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { 
        position: 'bottom', 
        labels: { color: '#cbd5e1', padding: 20, font: { size: 13 } } 
      },
    },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white font-sans">
      {/* Komponen Sidebar Aktif di Laporan */}
      <Sidebar activePage="report" user={user} />

      {/* Area Konten Utama */}
      <main className="flex-1 overflow-y-auto relative bg-slate-950 px-6 py-8 md:px-10">
        
        {/* Dekorasi Glow Latar */}
        <div className="fixed top-[-10%] left-[20%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* HEADER LAPORAN */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-5 border-b border-slate-800/60 pb-6 relative z-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-1.5">
              Laporan Nutrisi & Evaluasi
            </h1>
            <p className="text-slate-400 text-sm">
              Pantau histori asupan kalori secara mendalam dan amati grafik gaya hidup Anda.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Dropdown Bergaya Glassmorphism */}
            <div className="relative flex-1 md:flex-none">
              <select 
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="w-full appearance-none bg-white/5 backdrop-blur-md border border-white/20 text-slate-200 px-5 py-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 cursor-pointer pr-12 transition-all hover:bg-white/10"
              >
                <option value="7days" className="bg-slate-900">7 Hari Terakhir</option>
                <option value="30days" className="bg-slate-900">30 Hari Terakhir</option>
                <option value="thismonth" className="bg-slate-900">Bulan Ini</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Tombol PDF Blue Solid */}
            <button 
              onClick={handleExportPDF}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/25 text-sm whitespace-nowrap border-b-2 border-blue-800"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Ekspor PDF</span>
            </button>
          </div>
        </div>

        {/* LOADING STATE - SPINNER */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-72 text-emerald-500 relative z-10 animate-in fade-in">
            <Loader2 className="w-12 h-12 animate-spin mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            <p className="text-slate-400 font-medium tracking-wide">Mengambil data analisis server...</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
            
            {/* TOP ROW: KARTU RINGKASAN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] group">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Rata-Rata Kalori Harian</span>
                <div className="flex items-baseline gap-2 mt-auto">
                  <span className="text-4xl md:text-5xl font-black text-blue-500 group-hover:text-blue-400 transition-colors">{reportData?.summary?.avgCalories}</span>
                  <span className="text-slate-500 font-bold">Kcal</span>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] group">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Perubahan Berat Badan</span>
                <div className="flex items-baseline gap-2 mt-auto">
                  <span className="text-4xl md:text-5xl font-black text-emerald-500 group-hover:text-emerald-400 transition-colors">
                    {reportData?.summary?.weightChange > 0 ? '+' : ''}{reportData?.summary?.weightChange}
                  </span>
                  <span className="text-slate-500 font-bold">kg</span>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] group">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Kepatuhan Target</span>
                <div className="flex items-baseline gap-2 mt-auto">
                  <span className="text-4xl md:text-5xl font-black text-amber-500 group-hover:text-amber-400 transition-colors">{reportData?.summary?.targetCompliance}%</span>
                  <span className="text-slate-500 font-bold">rata-rata</span>
                </div>
              </div>

            </div>

            {/* MIDDLE ROW: AREA GRAFIK */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Bar Chart (Konsumsi Kalori) */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-7 rounded-2xl lg:col-span-2 hover:border-white/20 transition-all shadow-xl">
                <h3 className="text-lg font-bold text-slate-200 mb-6 font-sans flex items-center justify-between">
                  Grafik Konsumsi Aktual vs Target
                  <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full">{range === '7days' ? '1 Minggu' : 'Data'}</span>
                </h3>
                <div className="h-72 w-full">
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
              </div>

              {/* Doughnut Chart (Distribusi Makro) */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-7 rounded-2xl lg:col-span-1 hover:border-white/20 transition-all shadow-xl flex flex-col">
                <h3 className="text-lg font-bold text-slate-200 mb-6 font-sans">
                  Distribusi Nutrisi
                  <span className="block text-xs font-normal text-slate-500 mt-0.5">Proporsi rata-rata asupan makro.</span>
                </h3>
                <div className="flex-1 w-full min-h-[220px] flex justify-center items-center relative">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                  {/* Label Tengah Transparan */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest translate-y-[-10px]">Ratio</span>
                  </div>
                </div>
              </div>

            </div>

            {/* BOTTOM ROW: TABEL RIWAYAT MENDATAL */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:border-white/20 transition-all">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-200">Riwayat Catatan Makanan</h3>
                <button className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors">Lihat Semua →</button>
              </div>
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-900/40 text-xs text-slate-400 border-b border-white/10 uppercase tracking-widest">
                      <th className="py-5 px-6 font-bold w-32">Tanggal</th>
                      <th className="py-5 px-6 font-bold">Nama Hidangan</th>
                      <th className="py-5 px-6 font-bold">Kalori</th>
                      <th className="py-5 px-6 font-bold">Protein</th>
                      <th className="py-5 px-6 font-bold">Karbo</th>
                      <th className="py-5 px-6 font-bold">Lemak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData && reportData.history.map((row, idx, arr) => (
                      <tr 
                        key={row.id} 
                        className={`text-sm md:text-base border-white/5 transition-colors hover:bg-white-[0.04] ${idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-900/30'} ${idx === arr.length - 1 ? 'border-b-0' : 'border-b'}`}
                      >
                        <td className="py-4 px-6 text-slate-400 font-medium whitespace-nowrap">{row.date}</td>
                        <td className="py-4 px-6 text-white font-bold">{row.name}</td>
                        <td className="py-4 px-6 text-slate-300">
                          <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md font-bold shadow-sm">
                            {row.kalori} Kcal
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-300 font-semibold">{row.protein} <span className="text-slate-500 text-xs">g</span></td>
                        <td className="py-4 px-6 text-slate-300 font-semibold">{row.karbo} <span className="text-slate-500 text-xs">g</span></td>
                        <td className="py-4 px-6 text-slate-300 font-semibold">{row.lemak} <span className="text-slate-500 text-xs">g</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
