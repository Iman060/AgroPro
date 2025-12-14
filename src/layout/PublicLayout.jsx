import { Outlet, Link, useLocation } from 'react-router-dom';

function PublicLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              🌾 AqroVix
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    location.pathname === '/'
                      ? 'bg-slate-700 text-green-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Ana Səhifə
                </Link>
                <Link
                  to="/about"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    location.pathname === '/about'
                      ? 'bg-slate-700 text-green-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Haqqımızda
                </Link>
                <Link
                  to="/contact"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    location.pathname === '/contact'
                      ? 'bg-slate-700 text-green-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Əlaqə
                </Link>
              </div>
              <Link
                to="/profile"
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              >
                Giriş
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;

