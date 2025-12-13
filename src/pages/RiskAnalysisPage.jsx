import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, Search, Bell, HelpCircle, AlertTriangle, TrendingUp,
  CloudRain, Sun, User, Activity, CheckCircle, X, AlertCircle
} from 'lucide-react';
import { mockCropBatches, mockIrrigationEvents } from '../data/mockData';
import { getActiveCropBatches, countOverdueIrrigation } from '../utils/calculations';

const kpiCards = [
  {
    title: 'Aktiv Kritik Risklər',
    value: '12',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    borderColor: 'border-red-500/30',
    trend: '+20% keçən həftəyə görə',
    trendColor: 'text-red-400',
    bgIcon: '⚠️',
    glowColor: 'from-red-500/5'
  },
  {
    title: 'Hava Riskləri',
    value: '5',
    icon: CloudRain,
    iconColor: 'text-yellow-500',
    borderColor: 'border-yellow-500/30',
    trend: 'Yeni qasırğa xəbərdarlığı',
    trendColor: 'text-gray-400',
    bgIcon: '⛈️',
    glowColor: 'from-yellow-500/5'
  },
  {
    title: 'Təsdiqlənməmiş',
    value: '3',
    icon: AlertCircle,
    iconColor: 'text-gray-400',
    borderColor: 'border-slate-800',
    trend: 'Təcili baxılmalı',
    trendColor: 'text-green-500',
    bgIcon: '💬',
    glowColor: 'from-white/0'
  },
  {
    title: 'Eskalasiya Edilmiş',
    value: '2',
    icon: Bell,
    iconColor: 'text-red-500',
    borderColor: 'border-red-500',
    trend: 'Rəhbərliyə bildirilib',
    trendColor: 'text-red-300',
    bgIcon: '🔔',
    special: true,
    glowColor: 'from-red-500/10'
  }
];

const temperatureData = [
  { crop: 'Pomidor', limit: '>32°C', current: '34°C', status: 'critical', color: 'text-red-500' },
  { crop: 'Üzüm', limit: '>30°C', current: '29°C', status: 'warning', color: 'text-yellow-500' },
  { crop: 'Taxıl', limit: '>28°C', current: '24°C', status: 'safe', color: 'text-green-500' },
  { crop: 'Pambıq', limit: '>35°C', current: '30°C', status: 'safe', color: 'text-green-500' },
  { crop: 'Badam', limit: '<5°C', current: '6°C', status: 'warning', color: 'text-yellow-500' }
];

const alerts = [
  {
    id: 1,
    field: 'Sahə A-12 (Pambıq)',
    reason: 'Zərərverici artımı (Kritik hədd)',
    date: '15.05.2024 - 08:30',
    action: 'Dərhal pestisid çiləmə əməliyyatına başlayın və təsir zonasını izolyasiya edin. Bu xəbərdarlığa 4 saat ərzində cavab verilməyib.',
    status: 'escalated',
    icon: '📍',
    statusText: 'Təsdiqlənməyib'
  },
  {
    id: 2,
    field: 'Sahə B-04 (Üzüm)',
    reason: 'Gecə şaxtası gözlənilir',
    date: '16.05.2024 - 14:15',
    action: 'Sahəni termal örtüklərlə qoruyun və istilik sistemlərini aktivləşdirin.',
    status: 'acknowledged',
    icon: '❄️',
    statusText: 'Oxunub'
  },
  {
    id: 3,
    field: 'Sahə C-01 (Taxıl)',
    reason: 'Torpaq nəmliyi aşağıdır',
    date: '14.05.2024 - 09:00',
    action: 'Əlavə suvarma həyata keçirildi.',
    status: 'completed',
    icon: '✓',
    statusText: 'Tamamlanıb'
  }
];

export default function RiskAnalysisPage() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeCropBatches = getActiveCropBatches(mockCropBatches);
  const overdueCount = countOverdueIrrigation(activeCropBatches, mockIrrigationEvents);

  // Get current date for header
  const currentDate = new Date();
  const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('az-AZ', dateOptions);

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
            <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-[#24381e] transition-colors">
              <HelpCircle size={20} />
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

        {/* Scrollable Main Area */}
        <div className="flex-1 overflow-y-auto bg-[#142210] p-4 md:p-8">
          <div className="max-w-[1200px] mx-auto flex flex-col gap-8 pb-10">
            {/* Page Header */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Activity className="text-[#46ec13]" size={32} />
                <h1 className="text-3xl md:text-4xl font-black tracking-tight">Kritik Risk Analizi</h1>
              </div>
              <p className="text-gray-400 text-base md:text-lg max-w-2xl">
                Hava əsaslı, məhsula özəl və davranışa uyğun risk monitorinqi və qərar dəstək sistemi.
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    className={`bg-[#1c2e17] p-6 rounded-2xl border border-white/5 ${card.borderColor} transition-all group relative overflow-hidden ${
                      card.special ? 'bg-red-900/10 border-red-500 shadow-lg shadow-red-500/10' : ''
                    }`}
                  >
                    <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${card.glowColor} rounded-full blur-2xl group-hover:opacity-100 transition-all`}></div>
                    {card.special && (
                      <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    )}
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl">
                      {card.bgIcon}
                    </div>
                    <div className="flex items-start justify-between relative z-10 mb-4">
                      <div className="p-3 bg-[#24381e] rounded-xl">
                        <Icon className={card.iconColor} size={24} />
                      </div>
                    </div>
                    <div className="relative z-10">
                      <p className={`text-sm font-medium uppercase tracking-wider mb-2 ${card.special ? 'text-red-200 font-bold' : 'text-gray-400'}`}>
                        {card.title}
                      </p>
                      <p className="text-3xl font-bold mb-2">{card.value}</p>
                      <div className={`flex items-center gap-1 text-sm font-medium ${card.trendColor}`}>
                        {idx === 0 && <TrendingUp size={16} />}
                        {idx === 2 && <AlertCircle size={16} />}
                        <span>{card.trend}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Weather Scenarios & Temperature Table */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Weather Impact Scenarios */}
              <div className="xl:col-span-2 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Hava Təsiri (Ssenarilər)</h2>
                  <button className="text-sm text-[#46ec13] hover:text-[#36b80f] font-medium">
                    Bütün bölgələr
                  </button>
                </div>

                {/* Scenario 1 */}
                <div className="rounded-2xl bg-[#1c2e17] border border-white/5 overflow-hidden">
                  <div className="p-4 border-b border-white/5 bg-[#24381e]/50 flex flex-wrap gap-4 justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                        <CloudRain size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold">Güclü Yağış</h3>
                        <p className="text-gray-400 text-xs">Bölgə: Şəki-Zaqatala zonası</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase">
                      Yüksək Risk
                    </div>
                  </div>
                  <div className="p-4 flex flex-col sm:flex-row gap-6">
                    <div className="flex-1 flex flex-col gap-3">
                      <p className="text-sm text-gray-400">Təsirə məruz qalan məhsullar:</p>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 rounded bg-[#142210] text-xs border border-white/5">Taxıl</span>
                        <span className="px-2 py-1 rounded bg-[#142210] text-xs border border-white/5">Kartof</span>
                      </div>
                    </div>
                    <div className="flex-[2] flex flex-col gap-3">
                      <p className="text-sm text-gray-400">Profilaktik Tədbirlər:</p>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="mt-1 w-4 h-4 rounded border-white/5 bg-[#142210] text-[#46ec13] focus:ring-[#46ec13] focus:ring-offset-0"
                        />
                        <span className="text-sm group-hover:text-[#46ec13] transition-colors">
                          Drenaj kanallarının təmizlənməsini yoxlayın
                        </span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="mt-1 w-4 h-4 rounded border-white/5 bg-[#142210] text-[#46ec13] focus:ring-[#46ec13] focus:ring-offset-0"
                        />
                        <span className="text-sm group-hover:text-[#46ec13] transition-colors">
                          Saha işlərinin dayandırılması barədə xəbərdarlıq göndərin
                        </span>
                      </label>
                      <div className="pt-2">
                        <button className="px-4 py-2 rounded-lg bg-[#46ec13]/10 text-[#46ec13] hover:bg-[#46ec13]/20 text-sm font-bold transition-colors">
                          Tamamlanmış kimi qeyd et
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scenario 2 */}
                <div className="rounded-2xl bg-[#1c2e17] border border-white/5 overflow-hidden">
                  <div className="p-4 border-b border-white/5 bg-[#24381e]/50 flex flex-wrap gap-4 justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                        <Sun size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold">Quraqlıq və İstilik</h3>
                        <p className="text-gray-400 text-xs">Bölgə: Aran zonası</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold uppercase">
                      Orta Risk
                    </div>
                  </div>
                  <div className="p-4 flex flex-col sm:flex-row gap-6">
                    <div className="flex-1 flex flex-col gap-3">
                      <p className="text-sm text-gray-400">Təsirə məruz qalan məhsullar:</p>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 rounded bg-[#142210] text-xs border border-white/5">Pambıq</span>
                        <span className="px-2 py-1 rounded bg-[#142210] text-xs border border-white/5">Qarğıdalı</span>
                      </div>
                    </div>
                    <div className="flex-[2] flex flex-col gap-3">
                      <p className="text-sm text-gray-400">Profilaktik Tədbirlər:</p>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="mt-1 w-4 h-4 rounded border-white/5 bg-[#142210] text-[#46ec13] focus:ring-[#46ec13] focus:ring-offset-0"
                        />
                        <span className="text-sm group-hover:text-[#46ec13] transition-colors">
                          Suvarma qrafikini intensivləşdirin
                        </span>
                      </label>
                      <div className="pt-2">
                        <button className="px-4 py-2 rounded-lg bg-[#142210] text-gray-400 hover:text-white border border-white/5 text-sm font-medium transition-colors">
                          İcrada...
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Temperature Table */}
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">Temperatur Risk Hədləri</h2>
                <div className="rounded-2xl bg-[#1c2e17] border border-white/5 overflow-hidden flex-1">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#24381e] text-gray-400 font-medium border-b border-white/5">
                      <tr>
                        <th className="px-4 py-3">Məhsul</th>
                        <th className="px-4 py-3">Limit</th>
                        <th className="px-4 py-3">Cari</th>
                        <th className="px-4 py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {temperatureData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#24381e]/50 transition-colors">
                          <td className="px-4 py-3 font-medium">{row.crop}</td>
                          <td className="px-4 py-3 text-gray-400">{row.limit}</td>
                          <td className={`px-4 py-3 font-bold ${row.color}`}>{row.current}</td>
                          <td className="px-4 py-3 text-right">
                            <span className={`inline-block w-2 h-2 rounded-full ${
                              row.status === 'critical' ? 'bg-red-500 animate-pulse' :
                              row.status === 'warning' ? 'bg-yellow-500' : 'bg-[#46ec13]'
                            }`}></span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold">Xəbərdarlıq və Fermer Cavabı</h2>
              <div className="flex flex-col gap-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-2xl p-5 flex flex-col md:flex-row gap-6 relative bg-[#1c2e17] border ${
                      alert.status === 'escalated'
                        ? 'border-2 border-red-600 shadow-lg shadow-red-500/10'
                        : alert.status === 'completed'
                        ? 'border-white/5 opacity-60 hover:opacity-100 transition-opacity'
                        : 'border-white/5'
                    }`}
                  >
                    {alert.status === 'escalated' && (
                      <div className="absolute -top-3 -right-3 md:right-auto md:-left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                        <AlertCircle size={14} />
                        ESKALASİYA
                      </div>
                    )}
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-2xl ${
                        alert.status === 'escalated' ? 'bg-red-900/50 border border-red-500' :
                        alert.status === 'acknowledged' ? 'bg-yellow-900/20 border border-yellow-500/50' :
                        'bg-[#142210] border border-white/5'
                      }`}>
                        {alert.icon}
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold">{alert.field}</h3>
                        <p className={`font-medium ${
                          alert.status === 'escalated' ? 'text-red-400' :
                          alert.status === 'acknowledged' ? 'text-yellow-400' : 'text-gray-400'
                        }`}>
                          Səbəb: {alert.reason}
                        </p>
                        <p className="text-gray-400 text-sm">Göndərilmə tarixi: {alert.date}</p>
                      </div>
                    </div>
                    <div className="flex-1 border-l border-white/5 pl-0 md:pl-6 border-t md:border-t-0 pt-4 md:pt-0">
                      <p className="text-xs text-gray-400 uppercase font-bold mb-2">
                        Tövsiyə olunan tədbir
                      </p>
                      <p className={`text-sm leading-relaxed ${alert.status === 'completed' ? 'text-gray-400' : 'text-white'}`}>
                        {alert.action}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 justify-center min-w-[160px]">
                      {alert.status === 'escalated' && (
                        <>
                          <div className="flex items-center gap-2 text-red-500 text-sm font-medium mb-1">
                            <X size={16} />
                            <span>{alert.statusText}</span>
                          </div>
                          <button className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all shadow-lg hover:shadow-red-900/50">
                            Tədbiri Təsdiqlə
                          </button>
                        </>
                      )}
                      {alert.status === 'acknowledged' && (
                        <>
                          <div className="flex items-center gap-2 text-[#46ec13] text-sm font-medium mb-1">
                            <CheckCircle size={16} />
                            <span>{alert.statusText}</span>
                          </div>
                          <button className="w-full py-2.5 rounded-lg bg-[#46ec13] text-black font-bold text-sm hover:bg-[#36b80f] transition-colors">
                            Tədbir Görülüb
                          </button>
                        </>
                      )}
                      {alert.status === 'completed' && (
                        <div className="w-full py-2 rounded-lg bg-[#142210] text-gray-400 font-medium text-sm text-center border border-white/5 cursor-default">
                          {alert.statusText}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

