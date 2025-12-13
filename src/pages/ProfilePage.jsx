import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Edit, Camera, User, History, Shield, Lock, Laptop, 
  CheckCircle, AlertTriangle, LogIn, Menu, Settings, X, Bell, Search
} from 'lucide-react';
import { mockCropBatches, mockIrrigationEvents } from '../data/mockData';
import { getActiveCropBatches, countOverdueIrrigation } from '../utils/calculations';

function ProfilePage() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Elçin Məmmədov',
    phone: '+994 50 123 45 67',
    email: 'elcin.m@agropro.az',
    timezone: 'GMT+04:00',
    language: 'az'
  });

  const [notifications, setNotifications] = useState({
    irrigation: true,
    cropStatus: true,
    importErrors: false
  });

  const [theme, setTheme] = useState('dark');
  const [twoFactor, setTwoFactor] = useState(false);

  const activeCropBatches = getActiveCropBatches(mockCropBatches);
  const overdueCount = countOverdueIrrigation(activeCropBatches, mockIrrigationEvents);

  // Get current date for header
  const currentDate = new Date();
  const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('az-AZ', dateOptions);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#142210] text-white">
      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        fixed lg:static
        w-72 h-full bg-[#142210] border-r border-[#24381e]
        px-4 py-6 z-30 transition-transform duration-300
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 mb-10">
          <Link to="/" className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#46ec13] to-green-800 flex items-center justify-center text-black text-2xl">
              🌾
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-lg font-bold leading-none tracking-tight">AgroPro</h1>
              <span className="text-xs text-gray-400 font-medium mt-1">Fermer İdarəetmə</span>
            </div>
          </Link>
          <button 
            className="lg:hidden ml-auto text-gray-400"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all ${
              location.pathname === '/dashboard'
                ? 'bg-[#46ec13] text-black shadow-[0_0_15px_rgba(70,236,19,0.3)] font-bold'
                : 'text-gray-400 hover:text-white hover:bg-[#24381e]'
            }`}
          >
            <span className="text-xl">📊</span>
            <span className="text-sm font-medium">İdarə Paneli</span>
          </Link>
          <Link
            to="/fields"
            className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all ${
              location.pathname.startsWith('/fields')
                ? 'bg-[#46ec13] text-black shadow-[0_0_15px_rgba(70,236,19,0.3)] font-bold'
                : 'text-gray-400 hover:text-white hover:bg-[#24381e]'
            }`}
          >
            <span className="text-xl">🗺️</span>
            <span className="text-sm font-medium">Sahələr</span>
          </Link>
          <Link
            to="/crop-batches"
            className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all ${
              location.pathname === '/crop-batches'
                ? 'bg-[#46ec13] text-black shadow-[0_0_15px_rgba(70,236,19,0.3)] font-bold'
                : 'text-gray-400 hover:text-white hover:bg-[#24381e]'
            }`}
          >
            <span className="text-xl">🌿</span>
            <span className="text-sm font-medium">Məhsul Partiyaları</span>
          </Link>
          <Link
            to="/irrigation"
            className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all ${
              location.pathname === '/irrigation'
                ? 'bg-[#46ec13] text-black shadow-[0_0_15px_rgba(70,236,19,0.3)] font-bold'
                : 'text-gray-400 hover:text-white hover:bg-[#24381e]'
            }`}
          >
            <span className="text-xl">💧</span>
            <span className="text-sm font-medium">Suvarma</span>
            {overdueCount > 0 && (
              <span className="ml-auto bg-red-500/20 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {overdueCount}
              </span>
            )}
          </Link>
          <Link
            to="/notes"
            className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all ${
              location.pathname === '/notes'
                ? 'bg-[#46ec13] text-black shadow-[0_0_15px_rgba(70,236,19,0.3)] font-bold'
                : 'text-gray-400 hover:text-white hover:bg-[#24381e]'
            }`}
          >
            <span className="text-xl">📝</span>
            <span className="text-sm font-medium">Qeydlər</span>
          </Link>
          <Link
            to="/data-import"
            className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all ${
              location.pathname === '/data-import'
                ? 'bg-[#46ec13] text-black shadow-[0_0_15px_rgba(70,236,19,0.3)] font-bold'
                : 'text-gray-400 hover:text-white hover:bg-[#24381e]'
            }`}
          >
            <span className="text-xl">📤</span>
            <span className="text-sm font-medium">Məlumat İdxalı</span>
          </Link>
          
          <div className="mt-auto pt-4 border-t border-[#24381e]">
            <Link
              to="/profile"
              className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all ${
                location.pathname === '/profile'
                  ? 'bg-[#46ec13] text-black shadow-[0_0_15px_rgba(70,236,19,0.3)] font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-[#24381e]'
              }`}
            >
              <User size={20} />
              <span className="text-sm font-medium">Profil</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 py-4 border-b border-[#24381e] bg-[#142210]/95 backdrop-blur">
          <button 
            className="lg:hidden p-2 text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* Weather & Date */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#24381e]/50 px-4 py-2 rounded-full border border-white/5">
              <span className="text-yellow-400">☀️</span>
              <span className="text-sm font-semibold tracking-tight">Bakı, 24°C</span>
            </div>
            <div className="text-sm text-gray-400 font-medium">{formattedDate}</div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-4 lg:mx-12">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#46ec13] transition-colors" size={18} />
              <input
                type="text"
                placeholder="Axtarış..."
                className="w-full pl-10 pr-3 py-2.5 bg-[#1c2e17] border border-transparent rounded-full text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-[#24381e] focus:border-[#46ec13]/50 focus:ring-1 focus:ring-[#46ec13]/50 text-sm transition-all"
              />
            </div>
          </div>

          {/* Actions & Profile */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button className="relative p-2 rounded-full text-gray-400 hover:text-white hover:bg-[#24381e] transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#142210]"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-[#24381e]">
              <Link to="/profile" className="text-right hidden sm:block hover:opacity-80 transition-opacity">
                <div className="text-sm font-bold leading-none">Fermer</div>
                <div className="text-xs text-[#46ec13] mt-1 leading-none">İstifadəçi</div>
              </Link>
              <Link to="/profile" className="w-10 h-10 rounded-full bg-[#24381e] border border-white/10 overflow-hidden hover:border-[#46ec13]/50 transition-colors">
                <div className="w-full h-full bg-gradient-to-br from-[#46ec13]/20 to-green-800/20 flex items-center justify-center text-xl">
                  👤
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-[1000px] mx-auto flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">Profil</h1>
              <p className="text-gray-400 text-base">Hesabınızı və şəxsi parametrlərinizi idarə edin</p>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-[#1c2e17] rounded-2xl p-6 border border-white/5 shadow-lg">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-[#142210] shadow-xl bg-[#24381e] flex items-center justify-center text-4xl">
                      👤
                    </div>
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-[#46ec13] rounded-full border-4 border-[#142210]" title="Aktiv"></div>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-2xl font-bold leading-tight">Elçin Məmmədov</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-[#24381e] text-white text-xs font-semibold px-2 py-0.5 rounded border border-white/5">
                        Aqronom
                      </span>
                      <span className="text-gray-400 text-sm">| {formData.email}</span>
                    </div>
                    <p className="text-[#46ec13] text-sm font-medium mt-1">Status: Aktiv</p>
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button className="flex-1 md:flex-none h-10 px-4 bg-[#24381e] hover:bg-[#1c2e17] text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 border border-white/5">
                    <Edit size={18} />
                    <span>Profilə düzəliş et</span>
                  </button>
                  <button className="flex-1 md:flex-none h-10 px-4 bg-[#46ec13] hover:bg-[#36b80f] text-black text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(70,236,19,0.3)]">
                    <Camera size={18} />
                    <span>Şəkli dəyiş</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Forms */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Personal Info */}
                <div className="bg-[#1c2e17] rounded-2xl border border-white/5 overflow-hidden">
                  <div className="p-4 border-b border-white/5 bg-[#24381e]/30">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <User className="text-[#46ec13]" size={20} />
                      Şəxsi Məlumatlar
                    </h3>
                  </div>
                  <div className="p-6 flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <label className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-gray-300">Tam Ad</span>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full bg-[#24381e] border border-white/5 rounded-lg h-11 px-4 text-white focus:ring-1 focus:ring-[#46ec13] focus:border-[#46ec13] placeholder:text-gray-500 outline-none transition-all"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-gray-300">Telefon nömrəsi</span>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-[#24381e] border border-white/5 rounded-lg h-11 px-4 text-white focus:ring-1 focus:ring-[#46ec13] focus:border-[#46ec13] placeholder:text-gray-500 outline-none transition-all"
                        />
                      </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <label className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-gray-300">E-poçt</span>
                        <div className="relative">
                          <input
                            type="email"
                            value={formData.email}
                            readOnly
                            className="w-full bg-[#24381e]/50 border border-white/5 rounded-lg h-11 px-4 text-gray-400 cursor-not-allowed outline-none"
                          />
                          <Lock className="absolute right-3 top-2.5 text-gray-400" size={18} />
                        </div>
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-gray-300">Saat qurşağı</span>
                        <select
                          name="timezone"
                          value={formData.timezone}
                          onChange={handleInputChange}
                          className="w-full bg-[#24381e] border border-white/5 rounded-lg h-11 px-4 text-white focus:ring-1 focus:ring-[#46ec13] focus:border-[#46ec13] outline-none transition-all cursor-pointer"
                        >
                          <option value="GMT+04:00">(GMT+04:00) Bakı</option>
                          <option value="GMT+03:00">(GMT+03:00) İstanbul</option>
                          <option value="GMT+00:00">(GMT+00:00) London</option>
                        </select>
                      </label>
                    </div>
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-gray-300">Dil</span>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="w-full bg-[#24381e] border border-white/5 rounded-lg h-11 px-4 text-white focus:ring-1 focus:ring-[#46ec13] focus:border-[#46ec13] outline-none transition-all cursor-pointer"
                      >
                        <option value="az">Azərbaycan</option>
                        <option value="en">English</option>
                        <option value="ru">Русский</option>
                      </select>
                    </label>
                    <div className="pt-2 flex justify-end">
                      <button className="h-10 px-6 bg-[#46ec13] hover:bg-[#36b80f] text-black font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(70,236,19,0.3)]">
                        Yadda saxla
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="bg-[#1c2e17] rounded-2xl border border-white/5 overflow-hidden">
                  <div className="p-4 border-b border-white/5 bg-[#24381e]/30">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Settings className="text-[#46ec13]" size={20} />
                      Tərcihlər
                    </h3>
                  </div>
                  <div className="p-6 flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                      <span className="text-sm font-bold text-gray-300">Bildirişlər</span>
                      <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={notifications.irrigation}
                            onChange={() => handleNotificationChange('irrigation')}
                            className="w-5 h-5 rounded text-[#46ec13] bg-[#24381e] border-white/5 focus:ring-0"
                          />
                          <span className="text-gray-400 group-hover:text-white transition-colors">
                            Suvarma xəbərdarlıqları
                          </span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={notifications.cropStatus}
                            onChange={() => handleNotificationChange('cropStatus')}
                            className="w-5 h-5 rounded text-[#46ec13] bg-[#24381e] border-white/5 focus:ring-0"
                          />
                          <span className="text-gray-400 group-hover:text-white transition-colors">
                            Kritik məhsul statusu
                          </span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={notifications.importErrors}
                            onChange={() => handleNotificationChange('importErrors')}
                            className="w-5 h-5 rounded text-[#46ec13] bg-[#24381e] border-white/5 focus:ring-0"
                          />
                          <span className="text-gray-400 group-hover:text-white transition-colors">
                            Məlumat idxalı xətaları
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="h-px bg-white/5 w-full"></div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-300">Mövzu</span>
                        <span className="text-gray-400 text-xs">Tətbiqin görünüşünü dəyişin</span>
                      </div>
                      <div className="flex bg-[#24381e] rounded-lg p-1 border border-white/5">
                        <button
                          onClick={() => setTheme('dark')}
                          className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                            theme === 'dark' ? 'bg-[#1c2e17] text-white shadow-sm' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          Qaranlıq
                        </button>
                        <button
                          onClick={() => setTheme('light')}
                          className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                            theme === 'light' ? 'bg-[#1c2e17] text-white shadow-sm' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          İşıqlı
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Log */}
                <div className="bg-[#1c2e17] rounded-2xl border border-white/5 overflow-hidden">
                  <div className="p-4 border-b border-white/5 bg-[#24381e]/30 flex justify-between items-center">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <History className="text-[#46ec13]" size={20} />
                      Fəaliyyət Tarixçəsi
                    </h3>
                    <Link to="/dashboard" className="text-[#46ec13] text-xs font-bold hover:underline">
                      Tam tarixçəyə bax
                    </Link>
                  </div>
                  <div className="divide-y divide-white/5">
                    <div className="p-4 flex gap-4 items-start">
                      <div className="bg-[#24381e] p-2 rounded-full text-gray-400">
                        <LogIn size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Uğurlu giriş</span>
                        <span className="text-gray-400 text-xs">IP: 192.168.1.1 • Windows Chrome</span>
                        <span className="text-gray-400 text-xs mt-1">10 dəqiqə əvvəl</span>
                      </div>
                    </div>
                    <div className="p-4 flex gap-4 items-start">
                      <div className="bg-[#24381e] p-2 rounded-full text-gray-400">
                        <Edit size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Profil şəkli yeniləndi</span>
                        <span className="text-gray-400 text-xs mt-1">2 saat əvvəl</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Security & Role */}
              <div className="flex flex-col gap-6">
                {/* System Role */}
                <div className="bg-gradient-to-br from-[#1c2e17] to-[#142210] rounded-2xl border border-white/5 p-6 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-6xl text-[#46ec13]">🎖️</span>
                  </div>
                  <h3 className="text-lg font-bold mb-4">Sistem Rolu</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#46ec13]/20 text-[#46ec13] p-2 rounded-lg text-2xl">
                      🌾
                    </div>
                    <div>
                      <p className="font-bold">Aqronom</p>
                      <p className="text-gray-400 text-xs">Tam idarəetmə icazəsi</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {['Sahə monitorinqi', 'Suvarma idarəetməsi', 'Hesabat ixracı'].map((perm, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-400 text-sm">
                        <CheckCircle className="text-[#46ec13]" size={16} />
                        {perm}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Account & Security */}
                <div className="bg-[#1c2e17] rounded-2xl border border-white/5 overflow-hidden">
                  <div className="p-4 border-b border-white/5 bg-[#24381e]/30">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Shield className="text-[#46ec13]" size={20} />
                      Təhlükəsizlik
                    </h3>
                  </div>
                  <div className="p-5 flex flex-col gap-6">
                    {/* Change Password */}
                    <div className="flex flex-col gap-3">
                      <span className="text-sm font-bold text-gray-300">Şifrəni dəyiş</span>
                      <input
                        type="password"
                        placeholder="Cari şifrə"
                        className="w-full bg-[#24381e] border border-white/5 rounded-lg h-10 px-3 text-white text-sm focus:ring-1 focus:ring-[#46ec13] focus:border-[#46ec13] placeholder:text-gray-500 outline-none"
                      />
                      <input
                        type="password"
                        placeholder="Yeni şifrə"
                        className="w-full bg-[#24381e] border border-white/5 rounded-lg h-10 px-3 text-white text-sm focus:ring-1 focus:ring-[#46ec13] focus:border-[#46ec13] placeholder:text-gray-500 outline-none"
                      />
                      <button className="text-[#46ec13] text-sm font-bold self-start hover:underline">
                        Şifrəni yenilə
                      </button>
                    </div>
                    <div className="h-px bg-white/5 w-full"></div>

                    {/* 2FA Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col max-w-[70%]">
                        <span className="text-sm font-bold text-gray-300">İki faktorlu təsdiqləmə</span>
                        <span className="text-gray-400 text-xs">Giriş zamanı əlavə təhlükəsizlik</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={twoFactor}
                          onChange={() => setTwoFactor(!twoFactor)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#24381e] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#46ec13]"></div>
                      </label>
                    </div>
                    <div className="h-px bg-white/5 w-full"></div>

                    {/* Active Sessions */}
                    <div className="flex flex-col gap-3">
                      <span className="text-sm font-bold text-gray-300">Aktiv Sessiyalar</span>
                      <div className="flex items-center gap-3 bg-[#24381e] p-3 rounded-lg border border-white/5">
                        <Laptop className="text-gray-400" size={20} />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold">Bakı, AZ</span>
                          <span className="text-gray-400 text-[10px]">Chrome on Windows • Hazırda aktiv</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/5 overflow-hidden">
              <div className="p-4 border-b border-red-500/20 bg-red-500/10">
                <h3 className="text-red-400 text-lg font-bold flex items-center gap-2">
                  <AlertTriangle size={20} />
                  Təhlükəli Zona
                </h3>
              </div>
              <div className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex flex-col gap-1">
                  <h4 className="font-medium">Hesabı dondur</h4>
                  <p className="text-gray-400 text-sm">
                    Hesabınızı müvəqqəti olaraq deaktiv edin. İstənilən vaxt bərpa edə bilərsiniz.
                  </p>
                </div>
                <button className="whitespace-nowrap px-4 py-2 bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500/10 font-bold rounded-lg transition-colors text-sm">
                  Hesabı dondur
                </button>
              </div>
              <div className="h-px bg-red-500/20 w-full mx-6 max-w-[calc(100%-48px)]"></div>
              <div className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex flex-col gap-1">
                  <h4 className="font-medium">Bütün cihazlardan çıxış et</h4>
                  <p className="text-gray-400 text-sm">
                    Cari sessiya daxil olmaqla bütün aktiv sessiyaları sonlandırın.
                  </p>
                </div>
                <button className="whitespace-nowrap px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors text-sm shadow-sm shadow-red-500/20">
                  Çıxış et
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
