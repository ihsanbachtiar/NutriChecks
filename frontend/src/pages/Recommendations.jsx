import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Loader2, Plus, Sparkles, CheckCircle2, Flame, Award } from 'lucide-react';

export default function Recommendations() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Makan Siang');
  const [dummyRecommendations, setDummyRecommendations] = useState([]);
  
  const navigate = useNavigate();

  const tabs = ['Sarapan', 'Makan Siang', 'Makan Malam', 'Camilan Sehat'];

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
    // Simulasi Fetch Data dari '/api/recommendations?time=XYZ'
    const fetchRecommendations = () => {
      setIsLoading(true);
      setTimeout(() => {
        setDummyRecommendations([
          // SARAPAN
          {
            id: 1,
            nama: 'Oatmeal Buah Berry',
            waktu: 'Sarapan',
            kalori: 250,
            protein: 8,
            alasan_rekomendasi: 'Kaya akan serat lambat cerna, sangat cocok menahan laparmu sampai siang tanpa membuat kalori membengkak.',
            match_score: 98,
            badge: 'Cocok (98%)',
            gambar: 'https://cdn.phototourl.com/free/2026-04-07-97a350e3-c8f2-4d11-bfaf-476f781d05ad.jpg'
          },
          {
            id: 2,
            nama: 'Omelet Putih Telur Sayur',
            waktu: 'Sarapan',
            kalori: 180,
            protein: 22,
            alasan_rekomendasi: 'Ekstra rendah kalori tapi menyumbang 22g protein segar untuk mereparasi otot Anda pagi ini.',
            match_score: 85,
            badge: 'Tinggi Protein',
            gambar: 'https://cdn.phototourl.com/free/2026-04-07-8f8eafb2-50c7-4b3b-b590-4df15f142f73.jpg'
          },

          // MAKAN SIANG
          {
            id: 3,
            nama: 'Salad Dada Ayam Quinoa',
            waktu: 'Makan Siang',
            kalori: 410,
            protein: 38,
            alasan_rekomendasi: 'Sempurna untuk langsung menutup sisa 450 Kcal harianmu. Menyumbang 38g Protein dari sisa target nutrisimu.',
            match_score: 95,
            badge: 'Perfect Match',
            gambar: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: 4,
            nama: 'Salmon Panggang Lemon',
            waktu: 'Makan Siang',
            kalori: 360,
            protein: 32,
            alasan_rekomendasi: 'Lemak sehat Omega-3 di dalamnya akan melengkapi target rasio lemak harianmu tanpa melebihi batas Karbo.',
            match_score: 90,
            badge: 'Lemak Sehat',
            gambar: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80'
          },

          // MAKAN MALAM
          {
            id: 5,
            nama: 'Sup Sayur Miso Bening',
            waktu: 'Makan Malam',
            kalori: 120,
            protein: 10,
            alasan_rekomendasi: 'Pilihan paling logis untuk malam hari. Menghangatkan perut dengan kalori minim (hanya 120 Kcal) agar diet tetap sukses.',
            match_score: 92,
            badge: 'Rendah Kalori',
            gambar: 'https://cdn.phototourl.com/free/2026-04-07-a7e757ca-1804-4b12-8257-3ce988e4c2e7.jpg'
          },
          {
            id: 6,
            nama: 'Steak Dada Ayam Rebus',
            waktu: 'Makan Malam',
            kalori: 250,
            protein: 45,
            alasan_rekomendasi: 'Mengejar defisit protein? 45g Protein murni dalam hidangan ini akan mereset metabolisme tidurmu.',
            match_score: 88,
            badge: 'Cocok (88%)',
            gambar: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80'
          },

          // CAMILAN
          {
            id: 7,
            nama: 'Greek Yogurt Raspberry',
            waktu: 'Camilan Sehat',
            kalori: 150,
            protein: 14,
            alasan_rekomendasi: 'Kelebihan gula dari camilan biasa terhindari dengan yogurt ini. 99% persentase kecocokan dengan dietmu!',
            match_score: 99,
            badge: 'Sangat Cocok',
            gambar: 'https://cdn.phototourl.com/free/2026-04-07-7ec2bb4b-1b03-4166-afc9-44e55e5bdc6c.jpg'
          },
          {
            id: 8,
            nama: 'Kacang Almond Panggang',
            waktu: 'Camilan Sehat',
            kalori: 160,
            protein: 6,
            alasan_rekomendasi: 'Camilan renyah yang 100% mengisi sisa ruang lemak sehatmu hari ini. Jangan ragu memakannya.',
            match_score: 85,
            badge: 'Snack Sehat',
            gambar: 'https://cdn.phototourl.com/free/2026-04-07-55b544e3-abec-467f-b0c8-b228fdd54004.jpg'
          }
        ]);
        setIsLoading(false);
      }, 700);
    };

    fetchRecommendations();
  }, [activeTab]); // Memicu re-fetch/simulasi loading tiap pindah Tab

  // Logika Filter by Tab
  const filteredRecommendations = dummyRecommendations.filter(rec => rec.waktu === activeTab);

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white font-sans">
      <Sidebar activePage="rekomendasi" user={user} />

      <main className="flex-1 overflow-y-auto relative bg-slate-950 px-5 pt-8 pb-12 md:px-10">
        {/* Glow Latar Atas */}
        <div className="absolute top-0 right-[20%] w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* HEADER SECTION */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/40">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Rekomendasi Cerdas AI
            </h1>
          </div>

          {/* BANNER GLASSMORPHISM LEBAR */}
          <div className="w-full bg-white/5 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 md:p-8 mb-10 shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden group">
            {/* Animasi Glow Di Dalam Banner */}
            <div className="absolute -left-[50px] top-0 bottom-0 w-[150px] bg-emerald-400/20 blur-3xl skew-x-[-30deg] pointer-events-none transition-transform duration-[2000ms] group-hover:translate-x-[1500px]"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
              <div className="text-center md:text-left">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs md:text-sm mb-1 block">Sisa Kalori Anda Hari Ini:</span>
                <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                  450 <span className="text-xl md:text-2xl text-emerald-500 font-bold">Kcal</span>
                </div>
              </div>
              <div className="max-w-md bg-slate-900/60 p-4 rounded-2xl border border-slate-700/50">
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  Berikut adalah pilihan makanan yang <b>paling cocok</b> untuk memenuhi target makronutrien Anda tanpa melebihi sisa batas kalori agar diet Anda tetap stabil.
                </p>
              </div>
            </div>
          </div>

          {/* TAB NAVIGASI WAKTU MAKAN */}
          <div className="flex flex-wrap gap-2 mb-8 bg-slate-900/50 p-2 rounded-2xl border border-white/5 inline-flex">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* MAIN SECTION: GRID REKOMENDASI PINTAR */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20 text-emerald-500 animate-in fade-in">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p className="text-slate-400 font-medium">AI sedang memfilter menu {activeTab.toLowerCase()} terbaik...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              
              {filteredRecommendations.map(rec => (
                <div 
                  key={rec.id}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden flex flex-col group hover:border-emerald-500/40 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] transition-all duration-300 relative"
                >
                  {/* BADGE BEST MATCH PINTAR */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-emerald-500/90 backdrop-blur border border-emerald-400 text-white px-3 py-1.5 rounded-full shadow-lg">
                    {rec.match_score >= 95 ? <Award className="w-3.5 h-3.5" /> : <Flame className="w-3.5 h-3.5" />}
                    <span className="text-xs font-extrabold tracking-wide">{rec.badge}</span>
                  </div>

                  {/* GAMBAR MAKANAN */}
                  <div className="h-48 w-full relative overflow-hidden">
                    <img 
                      src={rec.gambar} 
                      alt={rec.nama} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    
                    {/* Floating Calories Insight */}
                    <div className="absolute bottom-3 left-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">{rec.kalori}</span>
                      <span className="text-sm font-bold text-slate-300">Kcal</span>
                    </div>
                  </div>

                  {/* KONTEN KARTU */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-xl text-white mb-3 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                      {rec.nama}
                    </h3>
                    
                    {/* Alasan Kecocokan Makro */}
                    <div className="bg-slate-900/50 border border-slate-700/50 p-3.5 rounded-xl mb-6 flex items-start gap-3 flex-1">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-300 leading-relaxed font-medium">
                        {rec.alasan_rekomendasi}
                      </p>
                    </div>

                    {/* ACTION BUTTON PENUH */}
                    <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.98] text-white py-3.5 rounded-xl font-bold tracking-wide shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 group/btn">
                      <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-300" />
                      Konsumsi Ini
                    </button>
                  </div>
                </div>
              ))}
              
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
