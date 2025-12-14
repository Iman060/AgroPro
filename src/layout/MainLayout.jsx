import { Outlet, Link, useLocation } from 'react-router-dom';

function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/profile" className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              🌾 AqroVix
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
                <Link
                  to="/profile"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    location.pathname === '/profile'
                      ? 'bg-slate-700 text-green-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Profil
                </Link>
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    location.pathname === '/dashboard'
                      ? 'bg-slate-700 text-green-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  İdarə Paneli
                </Link>
                <Link
                  to="/fields"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    location.pathname.startsWith('/fields')
                      ? 'bg-slate-700 text-green-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sahələr
                </Link>
              </div>
              <Link
                to="/"
                className="px-3 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
              >
                Ana Səhifə
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;

