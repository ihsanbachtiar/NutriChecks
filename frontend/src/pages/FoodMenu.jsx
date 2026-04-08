import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Search, Loader2, Plus } from 'lucide-react';

export default function FoodMenu() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [dummyFoods, setDummyFoods] = useState([]);

  const navigate = useNavigate();

  const filterChips = [
    'Semua', 
    'Tinggi Protein', 
    'Rendah Karbo', 
    'Rendah Lemak', 
    'Sarapan', 
    'Makan Malam'
  ];

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
    // Simulasi Fetch API ke '/api/food-database'
    const fetchCatalog = () => {
      setIsLoading(true);
      setTimeout(() => {
        setDummyFoods([
          {
            id: 1,
            name: 'Oatmeal Berry Madu',
            kalori: 250,
            protein: 8,
            karbo: 45,
            lemak: 4,
            kategori: ['Sarapan', 'Rendah Lemak'],
            image: 'https://cdn.phototourl.com/free/2026-04-07-75a5b628-029b-4936-ac8f-a7830d33df1d.jpg'
          },
          {
            id: 2,
            name: 'Dada Ayam Bumbu Herb',
            kalori: 165,
            protein: 31,
            karbo: 0,
            lemak: 3.6,
            kategori: ['Makan Malam', 'Tinggi Protein', 'Rendah Karbo'],
            image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: 3,
            name: 'Avocado Toast Spesial',
            kalori: 320,
            protein: 10,
            karbo: 35,
            lemak: 18,
            kategori: ['Sarapan'],
            image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: 4,
            name: 'Salmon Grill Mentega',
            kalori: 350,
            protein: 35,
            karbo: 2,
            lemak: 22,
            kategori: ['Makan Malam', 'Tinggi Protein', 'Rendah Karbo'],
            image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: 5,
            name: 'Salad Quinoa Hijau',
            kalori: 210,
            protein: 8,
            karbo: 38,
            lemak: 5,
            kategori: ['Rendah Lemak', 'Makan Malam'],
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: 6,
            name: 'Steak Sapi Pilihan',
            kalori: 540,
            protein: 45,
            karbo: 25,
            lemak: 28.1,
            kategori: ['Makan Malam', 'Tinggi Protein', 'Rendah Karbo'],
            image: 'https://cdn.phototourl.com/free/2026-04-07-e15bb10c-24da-45ff-a6f0-b0b194790c6b.jpg'
          },
          {
            id: 7,
            name: 'Nigiri Sushi Sederhana',
            kalori: 120,
            protein: 10,
            karbo: 12,
            lemak: 4.5,
            kategori: ['Rendah Lemak'],
            image: 'https://cdn.phototourl.com/free/2026-04-07-8e82af9f-c749-42ec-be19-364ced92b5f6.jpg'
          }
        ]);
        setIsLoading(false);
      }, 1000); // 1 detik loading
    };
    fetchCatalog();
  }, []);

  // Logika Filter
  const filteredFoods = dummyFoods.filter((food) => {
    // 1. Filter Pencarian Teks
    const isMatchSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Filter Kategori Chip
    const isMatchCategory = activeCategory === 'Semua' || food.kategori.includes(activeCategory);

    return isMatchSearch && isMatchCategory;
  });

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white font-sans">
      <Sidebar activePage="menu" user={user} />

      <main className="flex-1 overflow-y-auto relative bg-slate-950 px-5 pt-8 pb-12 md:px-10">
        {/* Glow Latar */}
        <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
              Eksplorasi Menu & Rekomendasi
            </h1>
            <p className="text-slate-400 font-medium">Temukan makanan yang lezat dan sesuai dengan target kalori Anda hari ini.</p>
          </div>

          {/* TOP SECTION: SEARCH & FILTER CHIPS */}
          <div className="mb-10 space-y-5">
            {/* Search Bar Glassmorphism */}
            <div className="relative w-full max-w-3xl">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-emerald-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari referensi makanan sehat, misal: 'Salmon' atau 'Salad'..."
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-14 pr-6 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-lg"
              />
            </div>

            {/* Scrollable Filter Chips */}
            <div className="flex -mx-5 px-5 md:mx-0 md:px-0 overflow-x-auto pb-2 scrollbar-hide space-x-3">
              {filterChips.map(chip => (
                <button
                  key={chip}
                  onClick={() => setActiveCategory(chip)}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-300 shadow-sm ${
                    activeCategory === chip
                      ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/30'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN SECTION: KARTU GRID MAKANAN */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20 text-emerald-500">
              <Loader2 className="w-12 h-12 animate-spin mb-4 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <p className="text-slate-400 font-medium">Memuat katalog database makanan...</p>
            </div>
          ) : (
            <>
              {filteredFoods.length === 0 ? (
                <div className="text-center bg-white/5 border border-white/10 rounded-3xl p-12 mt-8">
                  <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-300 mb-2">Makanan tidak ditemukan</h3>
                  <p className="text-slate-500">Coba gunakan kata kunci berbeda atau ubah kategori filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                  {filteredFoods.map(food => (
                    <div 
                      key={food.id}
                      className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col group hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] transition-all duration-300"
                    >
                      {/* Image Area */}
                      <div className="h-44 w-full relative overflow-hidden">
                        <img 
                          src={food.image} 
                          alt={food.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                      </div>

                      {/* Content Area */}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-lg text-white leading-tight line-clamp-2 pr-2">{food.name}</h3>
                          <div className="flex-shrink-0 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center">
                            <span className="text-emerald-400 font-black text-sm">{food.kalori}</span>
                            <span className="text-emerald-500/70 text-[10px] uppercase font-bold ml-1">Kcal</span>
                          </div>
                        </div>

                        {/* Macros Pills */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          <div className="bg-teal-500/10 border border-teal-500/30 px-2 py-1 rounded text-xs font-semibold text-teal-400">
                            P: {food.protein}g
                          </div>
                          <div className="bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded text-xs font-semibold text-amber-400">
                            K: {food.karbo}g
                          </div>
                          <div className="bg-rose-500/10 border border-rose-500/30 px-2 py-1 rounded text-xs font-semibold text-rose-400">
                            L: {food.lemak}g
                          </div>
                        </div>

                        {/* Action Button */}
                        <button className="mt-auto w-full flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white hover:border-blue-500 py-3 rounded-xl font-bold transition-all duration-300 group/btn">
                          <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-300" />
                          Tambah ke Log
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
