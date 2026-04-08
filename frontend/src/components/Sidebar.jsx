import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faUtensils, faChartLine, faCameraRetro, faSignOutAlt, faList, faLightbulb } from '@fortawesome/free-solid-svg-icons';

/**
 * Sidebar reusable untuk seluruh halaman NutriCheck.
 * @param {string} activePage - Halaman yang sedang aktif ('dashboard' | 'log' | 'upload' | null)
 * @param {object|null} user - Data user dari localStorage/API (null = belum login)
 */
export default function Sidebar({ activePage = null, user = null }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Data profil default jika user belum login
  const profileName = user?.nama || 'Guest';
  const profileNrp = user?.nrp || '';
  const profileAvatar = user?.avatar || `https://ui-avatars.com/api/?name=G&background=334155&color=94a3b8`;
  const isLoggedIn = !!user;

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: faChartPie, path: '/dashboard' },
    { key: 'menu', label: 'Menu Makanan', icon: faList, path: '/food-menu' },
    { key: 'log', label: 'Log Makanan', icon: faUtensils, path: '/log-food' },
    { key: 'report', label: 'Laporan', icon: faChartLine, path: '/report' },
    { key: 'rekomendasi', label: 'Rekomendasi', icon: faLightbulb, path: '/recommendations' },
    { key: 'upload', label: 'Upload with AI', icon: faCameraRetro, path: '/upload-food' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-900/80 backdrop-blur-md border-r border-slate-700/50 flex-col justify-between hidden md:flex z-10">
      <div>
        {/* Avatar Profile Section */}
        <div className="p-6 border-b border-slate-700/50 flex items-center space-x-4">
          <div className="relative">
            <img
              src={profileAvatar}
              alt="Avatar"
              className="w-12 h-12 rounded-full border-2 border-slate-700 object-cover"
            />
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${isLoggedIn ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
          </div>
          <div>
            <h2 className="font-bold text-slate-100">{profileName}</h2>
            {profileNrp && <p className="text-xs text-slate-400">{profileNrp}</p>}
            <p className={`text-xs font-semibold mt-0.5 ${isLoggedIn ? 'text-emerald-500' : 'text-slate-500'}`}>
              {isLoggedIn ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-4 space-y-2 mt-2">
          {navItems.map((item) => {
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700/50 mb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg font-medium transition-colors"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
