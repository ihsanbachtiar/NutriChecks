import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UploadCloud, Image as ImageIcon, Loader2, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function UploadFood() {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!imageFile) return;
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze-food', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysisResult(response.data.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Gagal terhubung ke server AI saat ini.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white font-sans">
      
      {/* Sidebar — Upload with AI aktif */}
      <Sidebar activePage="upload" user={user} />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex flex-col items-center justify-center text-white backdrop-blur-md">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 rounded-full w-24 h-24"></div>
            <Loader2 className="w-20 h-20 text-emerald-400 animate-spin relative z-10" />
            <Sparkles className="w-8 h-8 text-amber-300 absolute -top-2 -right-2 animate-pulse" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Scanning Nutrisi dengan AI...
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-sm text-center">
            Membedah porsi gambar, menganalisis struktur kimia, dan menghitung kalori serta lemak...
          </p>
        </div>
      )}

      {/* Area Konten Utama */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Background Image Makanan Sehat */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-60 mix-blend-overlay"
          style={{ backgroundImage: `url('/bg-food.png')` }}
        ></div>
        {/* Overlay gelap gradasi */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950"></div>

        {/* Konten di atas overlay */}
        <div className="relative z-10 flex flex-col items-center justify-start py-12 md:py-16 min-h-full px-6">
          
          {/* Judul Halaman */}
          <div className="text-center mb-10 mt-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Powered by AI Vision</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-3">Foto Makanan Anda</h1>
            <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">
              Unggah gambar makanan Anda dan biarkan AI kami mengalkulasi nama serta kandungan nutrisinya secara otomatis.
            </p>
          </div>

          {/* Wrapper Konten (Upload Card / Result Card) */}
          {analysisResult ? (
            
            /* ======== TAMPILAN KARTU HASIL ======== */
            <div className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-xl border-2 border-emerald-500/30 p-6 md:p-10 rounded-3xl shadow-2xl transition-all transform scale-100 opacity-100 animate-in fade-in zoom-in duration-500 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8 relative z-10">
                {/* Foto Preview */}
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800 flex-shrink-0 relative group">
                  <img src={previewUrl} alt="Analyzed" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-center pb-3">
                    <div className="flex items-center gap-1.5 bg-emerald-500/90 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow border border-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Berhasil Dipindai
                    </div>
                  </div>
                </div>
                
                {/* Info Makanan Pokok */}
                <div className="flex-1 text-center md:text-left mt-2">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1.5">Makanan Terdeteksi</h3>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white capitalize mb-4 leading-tight">{analysisResult.nama_makanan}</h2>
                  
                  {/* Highlight Kalori */}
                  <div className="inline-flex items-end gap-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 px-5 py-3 rounded-2xl">
                    <span className="text-4xl font-black text-emerald-400 leading-none">{analysisResult.kalori}</span>
                    <span className="text-sm font-bold text-slate-400 mb-1">Kkal / porsi</span>
                  </div>
                </div>
              </div>

              {/* Grid 3 Makroutama */}
              <div className="grid grid-cols-3 gap-3 md:gap-5 mb-10 relative z-10">
                <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 p-4 md:p-6 rounded-2xl flex flex-col justify-center items-center group hover:bg-slate-800/80 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mb-3 shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
                  <span className="text-slate-400 text-xs md:text-sm font-semibold mb-1">Protein</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl md:text-3xl font-bold text-white">{analysisResult.protein}</span>
                    <span className="text-xs text-slate-500">g</span>
                  </div>
                </div>
                
                <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 p-4 md:p-6 rounded-2xl flex flex-col justify-center items-center group hover:bg-slate-800/80 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-amber-400 mb-3 shadow-[0_0_10px_rgba(251,191,36,0.8)]"></div>
                  <span className="text-slate-400 text-xs md:text-sm font-semibold mb-1">Karbo</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl md:text-3xl font-bold text-white">{analysisResult.karbohidrat}</span>
                    <span className="text-xs text-slate-500">g</span>
                  </div>
                </div>

                <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 p-4 md:p-6 rounded-2xl flex flex-col justify-center items-center group hover:bg-slate-800/80 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-red-400 mb-3 shadow-[0_0_10px_rgba(248,113,113,0.8)]"></div>
                  <span className="text-slate-400 text-xs md:text-sm font-semibold mb-1">Lemak</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl md:text-3xl font-bold text-white">{analysisResult.lemak}</span>
                    <span className="text-xs text-slate-500">g</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full">
                <button 
                  onClick={clearImage} 
                  className="flex-1 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white py-4 rounded-2xl font-bold transition-all"
                >
                  Analisis Foto Lainnya
                </button>
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-[0.98] text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/25"
                >
                  Kembali ke Dashboard
                </button>
              </div>
            </div>

          ) : (
            
            /* ======== TAMPILAN KARTU UPLOAD ======== */
            <div className="w-full max-w-xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-8 md:p-10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-all hover:border-slate-600/60">
              
              {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-red-400 text-sm font-bold mb-0.5">Analisis Gagal</h4>
                    <p className="text-red-200/80 text-xs leading-relaxed">{error}</p>
                  </div>
                </div>
              )}

              {/* Custom File Upload Area */}
              <div className="mb-8 relative">
                <label
                  htmlFor="food-image-upload"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center w-full h-72 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${
                    previewUrl
                      ? 'border-emerald-500/50 bg-emerald-500/5'
                      : 'border-slate-600 hover:border-emerald-400 bg-slate-800/40 hover:bg-slate-800/80'
                  }`}
                >
                  {previewUrl ? (
                    <div className="w-full h-full p-2.5 relative group overflow-hidden">
                      <img
                        src={previewUrl}
                        alt="Preview Makanan"
                        className="w-full h-full object-cover rounded-2xl shadow-lg border border-slate-700/50"
                      />
                      <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl m-2.5 backdrop-blur-sm">
                        <p className="font-bold text-white tracking-wide border border-white/20 px-6 py-2.5 rounded-xl bg-white/10 shadow-lg">
                          Klik untuk Mengganti
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="bg-slate-800 p-5 rounded-2xl mb-5 shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-slate-700">
                        <UploadCloud className="w-10 h-10 text-emerald-400" />
                      </div>
                      <p className="mb-2 text-base text-slate-200">
                        <span className="font-extrabold text-emerald-400">Pilih gambar</span> atau tarik file
                      </p>
                      <p className="text-xs text-slate-500 font-medium tracking-wide">Maksimal 5MB (PNG, JPG, WEBP)</p>
                    </div>
                  )}
                  <input
                    id="food-image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>

                {/* Info File Terpilih & Tombol Hapus */}
                {previewUrl && (
                  <div className="absolute -bottom-4 bg-slate-800 border border-slate-700 py-2 px-4 rounded-xl flex items-center justify-between w-[90%] left-[5%] shadow-xl">
                    <div className="flex items-center space-x-2 overflow-hidden mr-3">
                      <ImageIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-xs text-slate-300 font-medium truncate">{imageFile?.name}</span>
                    </div>
                    <button
                      onClick={(e) => { e.preventDefault(); clearImage(); }}
                      className="text-[10px] uppercase tracking-wider text-red-400 hover:text-red-300 font-bold px-2 py-1 bg-red-500/10 rounded transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>

              {/* Tombol Submit Utama */}
              <button
                onClick={handleUpload}
                disabled={!imageFile || isLoading}
                className={`w-full py-4 rounded-2xl font-bold tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${
                  previewUrl 
                  ? 'bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-white hover:shadow-emerald-500/25' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                {previewUrl && <Sparkles className="w-5 h-5" />}
                {previewUrl ? 'Proses dan Analisis Gizi' : 'Belum Ada Foto'}
              </button>
            </div>
          )}

          {/* Footer Back Button (hanya tampil kalau di mode unggah) */}
          {!analysisResult && (
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-8 text-sm font-semibold text-slate-500 hover:text-emerald-400 transition-colors uppercase tracking-widest"
            >
              Kembali
            </button>
          )}

        </div>
      </main>
    </div>
  );
}
