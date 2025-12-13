import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Plus, Search, Droplet, Wind, AlertTriangle, Eye, Calendar,
  ChevronDown, History, X, ThumbsUp, Reply, Send, Save,
  Bold, Italic, List, Image, Link2, Settings, Menu, Bell, User,
  Wheat, Sprout, BarChart3, Map, FileText, Upload, Sun, UserCircle
} from 'lucide-react';
import { mockCropBatches, mockIrrigationEvents } from '../data/mockData';
import { getActiveCropBatches, countOverdueIrrigation } from '../utils/calculations';

const records = [
  {
    id: 1,
    type: 'irrigation',
    icon: Droplet,
    color: 'text-green-500 bg-green-500/20',
    title: 'Pomidor sahəsi - Aşağı nəmlik',
    description: '3-cü sektorda torpaq nəmliyi kritik səviyyədən aşağı düşüb. Təcili suvarma tələb olunur.',
    time: '10:45',
    tags: ['#sahə3', '#suvarma'],
    active: true
  },
  {
    id: 2,
    type: 'disease',
    icon: AlertTriangle,
    color: 'text-red-400 bg-red-900/30',
    title: 'Yarpaqlarda saralma müşahidəsi',
    description: 'Qərb tərəfdəki cərgələrdə yarpaq uclarında saralma var. Azot çatışmazlığı şübhəsi.',
    time: 'Dünən',
    tags: ['#xəstəlik', '#pomidor'],
    active: false
  },
  {
    id: 3,
    type: 'fertilizer',
    icon: Wind,
    color: 'text-blue-400 bg-blue-900/30',
    title: 'Planlı Gübrələmə - NPK',
    description: 'Bütün sahəyə NPK gübrəsi tətbiq edildi. Doza: 50 kq/ha.',
    time: '12 Okt',
    tags: ['#gübrə', '#planlı'],
    active: false
  },
  {
    id: 4,
    type: 'observation',
    icon: Eye,
    color: 'text-purple-400 bg-purple-900/30',
    title: 'Ümumi sahə yoxlaması',
    description: 'Həftəlik rutin yoxlama keçirildi. Hər şey qaydasındadır.',
    time: '10 Okt',
    tags: ['#rutin'],
    active: false
  }
];

const filterButtons = [
  { label: 'Hamısı', icon: null, active: true },
  { label: 'Suvarma', icon: Droplet },
  { label: 'Gübrələmə', icon: Wind },
  { label: 'Xəstəlik', icon: AlertTriangle, color: 'text-red-400' },
  { label: 'Müşahidə', icon: Eye }
];

export default function NotesPage() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(records[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Hamısı');
  const [formData, setFormData] = useState({
    title: 'Pomidor sahəsi - Aşağı nəmlik',
    type: 'watering',
    datetime: '2023-10-24T10:45',
    field: 'field3',
    tags: ['#sahə3', '#suvarma'],
    content: '3-cü sektorda torpaq nəmliyi kritik səviyyədən aşağı düşüb. Sensor oxunuşları 15% göstərir (Norma: 25-30%). \nTəklif olunan tədbirlər:\n1. Təcili damlama suvarma sistemini işə salmaq.\n2. 2 saat ərzində davam etdirmək.\n3. Sabah səhər təkrar yoxlama.'
  });

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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#46ec13] to-green-800 flex items-center justify-center text-black">
              <Wheat size={24} />
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
            <BarChart3 size={20} />
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
            <Map size={20} />
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
            <Sprout size={20} />
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
            <Droplet size={20} />
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
            <FileText size={20} />
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
            <Upload size={20} />
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
              <Sun size={18} className="text-yellow-400" />
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
                <div className="w-full h-full bg-gradient-to-br from-[#46ec13]/20 to-green-800/20 flex items-center justify-center">
                  <User size={20} />
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page Header */}
          <div className="flex flex-col px-6 lg:px-10 py-5 gap-6 border-b border-[#24381e] bg-[#142210]/95">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black tracking-tight">Qeydlərin İdarə Edilməsi</h2>
                <p className="text-gray-400 text-sm mt-1">Bütün müşahidələr, suvarma və xəstəlik qeydləri</p>
              </div>
              <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-[#46ec13] hover:bg-[#36b80f] text-black text-sm font-bold transition-all shadow-lg shadow-[#46ec13]/15">
                <Plus size={20} />
                <span>Yeni Qeyd</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[280px] max-w-md h-10 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400 group-focus-within:text-[#46ec13] transition-colors" size={20} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full h-full pl-10 pr-3 py-2 bg-[#1c2e17] border border-[#24381e] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#46ec13] focus:border-[#46ec13] text-sm transition-all"
                  placeholder="Qeydləri axtarın (başlıq, teq, növ)..."
                />
              </div>
              <div className="w-px h-8 bg-[#24381e] hidden sm:block"></div>
              <div className="flex items-center gap-2 overflow-x-auto">
                {filterButtons.map((btn, idx) => {
                  const Icon = btn.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveFilter(btn.label)}
                      className={`px-4 h-8 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                        btn.active || activeFilter === btn.label
                          ? 'bg-white text-black font-bold'
                          : 'bg-[#1c2e17] border border-[#24381e] hover:border-gray-400 text-gray-400 hover:text-white'
                      }`}
                    >
                      {Icon && <Icon size={16} className={btn.color} />}
                      {btn.label}
                    </button>
                  );
                })}
              </div>
              <button className="ml-auto flex items-center gap-2 px-3 py-2 rounded-lg border border-[#24381e] bg-[#1c2e17] text-gray-400 hover:text-white hover:border-gray-400 transition-colors">
                <Calendar size={18} />
                <span className="text-xs font-medium">Bu Ay</span>
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden p-6 pt-4 gap-6">
            {/* Records List */}
            <div className="w-full max-w-[420px] flex flex-col gap-3 overflow-y-auto pr-2">
              {records.map((record) => {
                const Icon = record.icon;
                return (
                  <div
                    key={record.id}
                    onClick={() => setSelectedRecord(record)}
                    className={`group relative p-4 rounded-xl cursor-pointer transition-all ${
                      record.active || selectedRecord.id === record.id
                        ? 'bg-[#1c2e17] border border-[#46ec13]/50 shadow-lg'
                        : 'bg-[#1c2e17] border border-[#24381e] hover:border-[#24381e] hover:bg-[#24381e]'
                    }`}
                  >
                    <div className="absolute top-4 right-4 text-xs font-medium text-gray-400">
                      {record.time}
                    </div>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${record.color}`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm truncate pr-8">
                          {record.title}
                        </h3>
                        <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                          {record.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {record.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-[#24381e] text-gray-400 text-[10px] font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detail Panel */}
            <div className="flex-1 flex flex-col bg-[#1c2e17] rounded-xl border border-[#24381e] shadow-lg overflow-hidden">
              {/* Panel Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#24381e]">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Redaktə Rejimi
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#46ec13]/20 text-[#46ec13] text-[10px] font-bold uppercase border border-[#46ec13]/20">
                    Aktiv
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/20 transition-colors">
                    <X size={20} />
                  </button>
                  <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#24381e] transition-colors">
                    <History size={20} />
                  </button>
                  <div className="h-4 w-px bg-[#24381e] mx-1"></div>
                  <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#24381e] transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Scrollable Form */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-3xl mx-auto flex flex-col gap-8">
                  {/* Title Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
                      Başlıq
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-transparent border-0 border-b border-[#24381e] focus:border-[#46ec13] focus:ring-0 text-2xl font-bold text-white placeholder-gray-500 px-0 py-2 transition-all"
                      placeholder="Qeyd başlığını daxil edin..."
                    />
                  </div>

                  {/* Farmer Observation Alert */}
                  <div className="rounded-xl border border-[#46ec13]/30 bg-[#46ec13]/10 p-5 flex items-start gap-4 shadow-lg shadow-[#46ec13]/5">
                    <div className="p-3 bg-[#46ec13]/20 rounded-full text-[#46ec13] shrink-0">
                      <Eye size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="text-[#46ec13] font-bold text-base flex items-center gap-2">
                          <UserCircle size={20} className="inline mr-1" /> Fermer Müşahidəsi
                        </h4>
                        <span className="text-[10px] font-bold bg-[#46ec13]/10 text-[#46ec13] px-2 py-1 rounded-full border border-[#46ec13]/20">
                          Aktiv Bildiriş
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                        Birbaşa sahə təcrübəsinə əsaslanan fermerlər tərəfindən bildirilmişdir (sensorla aşkar edilməyib).
                      </p>
                    </div>
                  </div>

                  {/* Farmer Observations Section */}
                  <div className="flex flex-col gap-5 border-b border-[#24381e] pb-8">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold">Fermer Müşahidələri və Müzakirələr</h3>
                        <p className="text-gray-400 text-xs mt-1">
                          Təcrübə, görmə, iybilmə və sahə intuisiyasına əsaslanan erkən xəbərdarlıqlar
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#24381e] border border-[#24381e]">
                        <span className="text-[14px] text-[#46ec13]">👥</span>
                        <span className="text-[11px] font-medium text-gray-400">
                          3 fermer bənzər müşahidə bildirdi
                        </span>
                      </div>
                    </div>

                    {/* Timeline Item */}
                    <div className="flex flex-col gap-4 pl-4 border-l-2 border-[#24381e]">
                      <div className="flex flex-col bg-[#24381e]/50 border border-[#46ec13]/30 rounded-xl p-5 shadow-md relative">
                        <div className="absolute -left-[25px] top-6 w-4 h-4 rounded-full bg-[#46ec13] border-4 border-[#142210] z-10"></div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#1c2e17] border border-[#24381e]"></div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold">Elvin Məmmədov</p>
                                <span className="px-2 py-0.5 rounded bg-[#46ec13]/20 text-[#46ec13] text-[10px] font-bold uppercase tracking-wider border border-[#46ec13]/10">
                                  İnsan Müşahidəsi
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-400 mt-0.5">Baş Aqronom • 10:45</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#142210]/50 rounded-lg p-3 border border-[#24381e]/50 mb-3">
                          <p className="text-gray-200 text-sm leading-relaxed">
                            Torpağın səthi quru görünsə də, bitkilərin kök ətrafında nəmlik hiss olunur. 
                            Yarpaqlarda solğunluq yoxdur, amma torpağın rəngi biraz açıqdır. Məncə sensorlar 
                            düzgün oxumur, vizual olaraq suvarma hələlik təcili deyil.
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <button className="text-xs font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                            <ThumbsUp size={16} /> Faydalı (2)
                          </button>
                          <button className="text-xs font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                            <Reply size={16} /> Cavabla
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Add Comment Box */}
                    <div className="mt-2 bg-[#1c2e17] border border-[#24381e] rounded-xl p-5 shadow-lg">
                      <label className="text-xs font-bold uppercase text-[#46ec13] tracking-wider mb-3 block flex items-center gap-2">
                        <Plus size={16} />
                        Fermer Müşahidəsi Əlavə Et
                      </label>
                      <textarea
                        className="w-full bg-[#142210] border border-[#24381e] rounded-lg p-4 text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-[#46ec13] focus:border-[#46ec13] transition-all resize-none min-h-[100px]"
                        placeholder="Sensorların aşkar edə bilmədiyi, sahədə müşahidə etdiyiniz halları təsvir edin..."
                      ></textarea>
                      <div className="flex items-center justify-between mt-4">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="rounded border-[#24381e] bg-[#142210] text-[#46ec13] focus:ring-0 w-4 h-4"
                          />
                          <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">
                            Bu, fermer əsaslı müşahidədir
                          </span>
                        </label>
                        <button className="bg-[#46ec13] hover:bg-[#36b80f] text-black text-sm font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-[#46ec13]/30 transition-all flex items-center gap-2">
                          <Send size={18} />
                          Müşahidəni Paylaş
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sensor Data Section */}
                  <div className="flex flex-col gap-2 flex-1 min-h-[150px]">
                    <label className="text-xs font-semibold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                      <Settings size={14} />
                      Sensor Məlumatları və Texniki Təsvir
                    </label>
                    <div className="flex flex-col w-full h-full bg-[#142210] border border-[#24381e] rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-[#46ec13] focus-within:border-[#46ec13]">
                      <div className="flex items-center gap-1 p-2 border-b border-[#24381e] bg-[#1c2e17]">
                        <button className="p-1.5 rounded hover:bg-[#24381e] text-gray-400 hover:text-white transition-colors">
                          <Bold size={18} />
                        </button>
                        <button className="p-1.5 rounded hover:bg-[#24381e] text-gray-400 hover:text-white transition-colors">
                          <Italic size={18} />
                        </button>
                        <button className="p-1.5 rounded hover:bg-[#24381e] text-gray-400 hover:text-white transition-colors">
                          <List size={18} />
                        </button>
                        <div className="w-px h-4 bg-[#24381e] mx-1"></div>
                        <button className="p-1.5 rounded hover:bg-[#24381e] text-gray-400 hover:text-white transition-colors">
                          <Image size={18} />
                        </button>
                        <button className="p-1.5 rounded hover:bg-[#24381e] text-gray-400 hover:text-white transition-colors">
                          <Link2 size={18} />
                        </button>
                      </div>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="flex-1 w-full bg-transparent border-none p-4 text-sm leading-relaxed text-gray-400 resize-none focus:ring-0"
                        placeholder="Qeyd detallarını buraya yazın..."
                      />
                    </div>
                  </div>

                  {/* Form Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#24381e]">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
                        Növü
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full bg-[#142210] border border-[#24381e] text-white text-sm rounded-lg focus:ring-[#46ec13] focus:border-[#46ec13] p-2.5"
                      >
                        <option value="watering">Suvarma</option>
                        <option value="fertilizer">Gübrələmə</option>
                        <option value="disease">Xəstəlik</option>
                        <option value="observation">Müşahidə</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
                        Tarix və Saat
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.datetime}
                        onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
                        className="w-full bg-[#142210] border border-[#24381e] text-white text-sm rounded-lg focus:ring-[#46ec13] focus:border-[#46ec13] p-2.5"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
                        Əlaqəli Hadisə / Sahə
                      </label>
                      <select
                        value={formData.field}
                        onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                        className="w-full bg-[#142210] border border-[#24381e] text-white text-sm rounded-lg focus:ring-[#46ec13] focus:border-[#46ec13] p-2.5"
                      >
                        <option value="">Seçin...</option>
                        <option value="field3">Sahə 3 - Pomidor (Batch #B-203)</option>
                        <option value="irrigation12">Suvarma Planı #12</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
                        Teqlər
                      </label>
                      <div className="flex items-center gap-2 p-2 bg-[#142210] border border-[#24381e] rounded-lg focus-within:ring-1 focus-within:ring-[#46ec13] focus-within:border-[#46ec13]">
                        {formData.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-[#24381e] text-white text-xs px-2 py-1 rounded flex items-center gap-1"
                          >
                            {tag}
                            <button className="hover:text-red-400">
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          className="bg-transparent border-none focus:ring-0 text-sm text-white p-0 placeholder-gray-400 flex-1"
                          placeholder="+ Teq əlavə et..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-[#24381e] bg-[#1c2e17] flex items-center justify-end gap-3">
                <button className="px-5 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-[#24381e] transition-colors">
                  Ləğv et
                </button>
                <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#46ec13] hover:bg-[#36b80f] text-black text-sm font-bold shadow-lg shadow-[#46ec13]/20 transition-all">
                  <Save size={18} />
                  Yadda Saxla
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

