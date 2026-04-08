import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, UploadCloud } from 'lucide-react';

export default function Upload() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
              Dashboard <span className="text-emerald-400">Nutricheck</span>
            </h1>
            <p className="text-slate-400 text-sm">Pusat kontrol kalori dan analisis nutrisi harian.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 border border-slate-700 rounded-xl text-sm font-medium transition-all"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>

        {/* Bodi */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Kolom 1 (Profil Info) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl col-span-1 lg:col-span-1">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Profil Anda</h2>
            <p className="text-2xl font-bold text-white mb-6 capitalize">{user.nama}</p>
            
            <div className="space-y-4 text-sm text-slate-300 mb-8">
              <div className="flex flex-col">
                <span className="text-slate-500 text-xs mb-1">Email Saat Ini</span>
                <span className="text-slate-200 font-medium">{user.email}</span>
              </div>
            </div>

            <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl shadow-inner relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl"></div>
              <p className="text-xs text-emerald-400 uppercase font-bold tracking-wider mb-2">Target Kalori Harian (BMR)</p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black text-emerald-400">{user.target_kalori}</p>
                <span className="text-sm font-semibold text-emerald-500/70">Kkal</span>
              </div>
            </div>
          </div>

          {/* Kolom 2 (Upload Area Placeholder) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl col-span-1 lg:col-span-2 flex flex-col items-center justify-center min-h-[400px] border-dashed text-center">
            <div className="bg-slate-800/50 p-5 rounded-full mb-6 relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
              <UploadCloud className="w-12 h-12 text-emerald-400 relative z-10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Analisis Makanan Berbasis Foto</h3>
            <p className="text-slate-400 text-sm max-w-sm mb-8 text-center">
              Akses kecerdasan buatan Nutricheck untuk mulai menganalisis kalori harian Anda lewat tangkapan layar makanan di piring.
            </p>
            <button 
              onClick={() => navigate('/upload-food')}
              className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-500/30"
            >
              Coba Deteksi Kalori
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
