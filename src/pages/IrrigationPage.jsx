import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Plus, History, Calendar, Droplet, TrendingUp, AlertTriangle, 
  Search, Menu, Bell, Settings, Archive, MoreVertical, Check, X, User,
  Wheat, Sprout, BarChart3, Map, FileText, Upload, Sun
} from 'lucide-react';
import { mockIrrigationEvents, mockCropBatches, mockFields } from '../data/mockData';
import { getActiveCropBatches, getActiveFields, getIrrigationDelayLevel, countOverdueIrrigation } from '../utils/calculations';
import JsonImport from '../components/JsonImport';

function IrrigationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    delayed: false,
    thisWeek: false,
    grainFields: false
  });
  const [showImport, setShowImport] = useState(false);

  const activeCropBatches = getActiveCropBatches(mockCropBatches);
  const activeFields = getActiveFields(mockFields);
  const overdueCount = countOverdueIrrigation(activeCropBatches, mockIrrigationEvents);

  // Get current date for header
  const currentDate = new Date();
  const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('az-AZ', dateOptions);

  // Calculate next irrigation
  const upcomingIrrigations = mockIrrigationEvents
    .filter(e => e.type === 'planned' && !e.executedDate)
    .sort((a, b) => new Date(a.plannedDate) - new Date(b.plannedDate));
  
  const nextIrrigation = upcomingIrrigations[0];
  let nextIrrigationText = 'Yoxdur';
  let nextIrrigationTime = '';
  let hoursRemaining = null;

  if (nextIrrigation) {
    const plannedDate = new Date(nextIrrigation.plannedDate);
    const now = new Date();
    const diffMs = plannedDate - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours > 0) {
      hoursRemaining = diffHours;
      nextIrrigationText = plannedDate.toLocaleDateString('az-AZ', { day: 'numeric', month: 'short' });
      nextIrrigationTime = plannedDate.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' });
    }
  }

  // Calculate total water usage (mock - based on executed events)
  const executedEvents = mockIrrigationEvents.filter(e => e.executedDate);
  const totalWaterUsage = executedEvents.length * 1500; // Mock calculation
  const lastMonthUsage = totalWaterUsage * 0.88; // Mock - 12% increase
  const usageIncrease = Math.round(((totalWaterUsage - lastMonthUsage) / lastMonthUsage) * 100);

  // Calculate active alerts
  const criticalDelays = mockIrrigationEvents.filter(e => {
    if (e.type === 'planned' && !e.executedDate) {
      const delayLevel = getIrrigationDelayLevel(e.plannedDate);
      return delayLevel === 'critical';
    }
    return false;
  });
  const delayedCount = mockIrrigationEvents.filter(e => {
    if (e.type === 'planned' && !e.executedDate) {
      const delayLevel = getIrrigationDelayLevel(e.plannedDate);
      return delayLevel === 'overdue' || delayLevel === 'critical';
    }
    return false;
  }).length;

  // Get irrigation events with details
  const irrigationEventsWithDetails = mockIrrigationEvents
    .map(event => {
      const batch = activeCropBatches.find(b => b.id === event.cropBatchId);
      const field = batch ? activeFields.find(f => f.id === batch.fieldId) : null;
      
      if (!batch || !field) return null;

      let status = 'scheduled';
      let statusLabel = 'Planlaşdırılıb';
      
      if (event.executedDate) {
        status = 'completed';
        statusLabel = 'Tamamlandı';
      } else if (event.type === 'planned') {
        const delayLevel = getIrrigationDelayLevel(event.plannedDate);
        if (delayLevel === 'critical') {
          status = 'critical';
          statusLabel = 'Kritik Gecikmə';
        } else if (delayLevel === 'overdue') {
          status = 'delayed';
          statusLabel = 'Gecikmiş';
        }
      }

      const plannedDate = new Date(event.plannedDate);
      let timeText = '';
      const today = new Date();
      const diffDays = Math.floor((plannedDate - today) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        timeText = `Bu gün, ${plannedDate.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}`;
      } else if (diffDays === 1) {
        timeText = `Sabah, ${plannedDate.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}`;
      } else {
        timeText = plannedDate.toLocaleDateString('az-AZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      }

      if (event.executedDate) {
        const execDate = new Date(event.executedDate);
        timeText = execDate.toLocaleDateString('az-AZ', { day: 'numeric', month: 'short' }) + ', ' + execDate.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' });
      }

      // Crop icons - using React components
      const cropIcons = {
        'Wheat': Wheat,
        'Corn': Wheat, // Using Wheat as placeholder
        'Soybeans': Sprout,
        'Barley': Wheat,
        'Oats': Wheat,
      };

      return {
        id: event.id,
        field: field.name,
        crop: batch.cropType,
        status,
        statusLabel,
        time: timeText,
        volume: '1,500 L', // Mock volume
        image: cropIcons[batch.cropType] || Wheat,
        event
      };
    })
    .filter(e => e !== null)
    .sort((a, b) => {
      // Sort by status priority: critical first, then delayed, then scheduled, then completed
      const priority = { critical: 0, delayed: 1, scheduled: 2, completed: 3 };
      return priority[a.status] - priority[b.status];
    });

  // Filter events
  let filteredEvents = irrigationEventsWithDetails;
  
  if (filters.delayed) {
    filteredEvents = filteredEvents.filter(e => e.status === 'delayed' || e.status === 'critical');
  }
  
  if (filters.thisWeek) {
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    filteredEvents = filteredEvents.filter(e => {
      const eventDate = e.event.executedDate ? new Date(e.event.executedDate) : new Date(e.event.plannedDate);
      return eventDate <= weekFromNow;
    });
  }
  
  if (filters.grainFields) {
    filteredEvents = filteredEvents.filter(e => 
      e.crop === 'Wheat' || e.crop === 'Barley' || e.crop === 'Oats'
    );
  }
  
  if (searchQuery) {
    filteredEvents = filteredEvents.filter(e => 
      e.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.crop.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Calculate status distribution
  const onTimeCount = filteredEvents.filter(e => e.status === 'scheduled' || e.status === 'completed').length;
  const delayedCount2 = filteredEvents.filter(e => e.status === 'delayed').length;
  const criticalCount2 = filteredEvents.filter(e => e.status === 'critical').length;
  const totalEvents = filteredEvents.length;
  
  const onTimePercent = totalEvents > 0 ? Math.round((onTimeCount / totalEvents) * 100) : 0;
  const delayedPercent = totalEvents > 0 ? Math.round((delayedCount2 / totalEvents) * 100) : 0;
  const criticalPercent = totalEvents > 0 ? Math.round((criticalCount2 / totalEvents) * 100) : 0;

  const statusStyles = {
    critical: {
      bg: 'bg-red-500/10',
      text: 'text-red-500',
      border: 'border-red-500/20',
      textColor: 'text-red-400'
    },
    delayed: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      border: 'border-orange-500/20',
      textColor: 'text-orange-300'
    },
    scheduled: {
      bg: 'bg-[#46ec13]/10',
      text: 'text-[#46ec13]',
      border: 'border-[#46ec13]/20',
      textColor: 'text-white'
    },
    completed: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/20',
      textColor: 'text-gray-500'
    }
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#46ec13] to-green-800 flex items-center justify-center text-black">
              <Wheat size={24} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-lg font-bold leading-none tracking-tight">AqroVix</h1>
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
                placeholder="Axtarış (Sahə, Məhsul, Tarix)..."
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl lg:text-4xl font-black tracking-tight">Suvarma İdarəetməsi</h2>
                <p className="text-gray-400 text-base">
                  Suvarma hadisələrini planlaşdırın, gecikmələri izləyin və su istifadəsinə nəzarət edin
                </p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center justify-center gap-2 h-10 px-5 rounded-full bg-[#24381e] border border-white/5 text-white text-sm font-semibold hover:bg-[#1c2e17] transition-colors">
                  <History size={20} />
                  <span>Tarixçə</span>
                </button>
                <button className="flex items-center justify-center gap-2 h-10 px-5 rounded-full bg-[#46ec13] hover:bg-[#36b80f] text-black text-sm font-bold shadow-[0_0_20px_rgba(70,236,19,0.2)] transition-all hover:scale-[1.02]">
                  <Plus size={20} />
                  <span>Yeni Suvarma Planla</span>
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col p-6 bg-[#1c2e17] rounded-2xl border border-white/5 relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-[#46ec13]/5 rounded-full blur-2xl group-hover:opacity-100 transition-all"></div>
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Calendar className="text-white" size={80} />
                </div>
                <p className="text-gray-400 text-sm font-medium mb-1">Növbəti Suvarma</p>
                <div className="flex items-baseline gap-2 mt-auto relative z-10">
                  <p className="text-3xl font-bold tracking-tight">{nextIrrigationText}</p>
                  {nextIrrigationTime && <p className="text-white/70 text-lg font-medium">{nextIrrigationTime}</p>}
                </div>
                {hoursRemaining !== null && (
                  <p className="text-[#46ec13] text-sm font-medium mt-2 flex items-center gap-1 relative z-10">
                    <TrendingUp size={16} />
                    {hoursRemaining} saat qalıb
                  </p>
                )}
              </div>

              <div className="flex flex-col p-6 bg-[#1c2e17] rounded-2xl border border-white/5 relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-[#46ec13]/5 rounded-full blur-2xl group-hover:opacity-100 transition-all"></div>
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Droplet className="text-white" size={80} />
                </div>
                <p className="text-gray-400 text-sm font-medium mb-1">Ümumi Su İstifadəsi (Ay)</p>
                <div className="flex items-baseline gap-2 mt-auto relative z-10">
                  <p className="text-3xl font-bold tracking-tight">{totalWaterUsage.toLocaleString()} L</p>
                </div>
                <p className="text-[#46ec13] text-sm font-medium mt-2 flex items-center gap-1 relative z-10">
                  <TrendingUp size={16} />
                  +{usageIncrease}% keçən aya görə
                </p>
              </div>

              <div className="flex flex-col p-6 bg-[#1c2e17] rounded-2xl border border-white/5 relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-orange-500/5 rounded-full blur-2xl group-hover:opacity-100 transition-all"></div>
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <AlertTriangle className="text-orange-500" size={80} />
                </div>
                <p className="text-gray-400 text-sm font-medium mb-1">Aktiv Xəbərdarlıqlar</p>
                <div className="flex items-baseline gap-2 mt-auto relative z-10">
                  <p className="text-3xl font-bold tracking-tight">{delayedCount} Sahə</p>
                </div>
                {criticalDelays.length > 0 && (
                  <p className="text-orange-400 text-sm font-medium mt-2 flex items-center gap-1 relative z-10">
                    <AlertTriangle size={16} />
                    {criticalDelays.length} Kritik gecikmə
                  </p>
                )}
              </div>
            </div>

            {/* Charts & Search Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Status Tracker */}
              <div className="lg:col-span-2 bg-[#1c2e17] rounded-2xl border border-white/5 p-6 flex flex-col justify-between min-h-[250px]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">Suvarma Statusu</h3>
                    <p className="text-gray-400 text-sm">Planlaşdırılan vs İcra Edilən Hadisələr (Bu Ay)</p>
                  </div>
                  <div className="px-3 py-1 bg-[#24381e] rounded-full text-xs text-gray-300 font-medium border border-white/5">
                    {currentDate.toLocaleDateString('az-AZ', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div className="flex items-end gap-2 mb-6">
                  <span className="text-4xl font-bold">{totalEvents}</span>
                  <span className="text-gray-400 text-base mb-1">Ümumi Hadisə</span>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <span className="text-right text-sm font-bold text-[#46ec13]">Vaxtında</span>
                    <div className="h-3 w-full bg-[#24381e] rounded-full overflow-hidden">
                      <div className="h-full bg-[#46ec13]" style={{ width: `${onTimePercent}%` }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <span className="text-right text-sm font-bold text-orange-400">Gecikmiş</span>
                    <div className="h-3 w-full bg-[#24381e] rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: `${delayedPercent}%` }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <span className="text-right text-sm font-bold text-red-500">Kritik</span>
                    <div className="h-3 w-full bg-[#24381e] rounded-full overflow-hidden">
                      <div className="h-full bg-red-600" style={{ width: `${criticalPercent}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Search & Filters */}
              <div className="bg-[#1c2e17] rounded-2xl border border-white/5 p-6 flex flex-col gap-4">
                <h3 className="text-lg font-bold">Axtarış və Filtrlər</h3>
                <div className="relative w-full group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="text-gray-500 group-focus-within:text-[#46ec13] transition-colors" size={18} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full p-3 pl-10 text-sm text-white bg-[#24381e] border border-white/5 rounded-lg focus:ring-1 focus:ring-[#46ec13] focus:border-[#46ec13] placeholder-gray-500 transition-all"
                    placeholder="Sahə və ya məhsul axtar..."
                  />
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tez Filtrlər</p>
                  {[
                    { key: 'delayed', label: 'Yalnız Gecikənlər' },
                    { key: 'thisWeek', label: 'Bu Həftə' },
                    { key: 'grainFields', label: 'Taxıl Sahələri' }
                  ].map((filter) => (
                    <label key={filter.key} className="flex items-center gap-3 p-2 rounded hover:bg-[#24381e] cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={filters[filter.key]}
                        onChange={(e) => setFilters({ ...filters, [filter.key]: e.target.checked })}
                        className="w-4 h-4 text-[#46ec13] bg-[#24381e] border-white/20 rounded focus:ring-[#46ec13] focus:ring-offset-0"
                      />
                      <span className="text-sm text-gray-300">{filter.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Event Table */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Suvarma Cədvəli</h3>
                <button className="text-[#46ec13] text-sm font-bold hover:underline">Hamısına bax</button>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#1c2e17]">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="bg-[#24381e]/50 text-xs uppercase text-gray-300 font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Sahə Adı</th>
                      <th className="px-6 py-4">Məhsul</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Planlaşdırılan Vaxt</th>
                      <th className="px-6 py-4">Həcm (L)</th>
                      <th className="px-6 py-4 text-right">Əməliyyat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredEvents.length > 0 ? (
                      filteredEvents.map((event, idx) => (
                        <tr key={idx} className="hover:bg-[#24381e]/50 transition-colors group">
                          <td className="px-6 py-4 font-medium text-white">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-[#24381e] flex items-center justify-center text-lg border border-white/5">
                                {event.image && <event.image size={20} />}
                              </div>
                              {event.field}
                            </div>
                          </td>
                          <td className="px-6 py-4">{event.crop}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border ${statusStyles[event.status].bg} ${statusStyles[event.status].text} ${statusStyles[event.status].border}`}>
                              {event.status === 'completed' ? (
                                <Check size={14} />
                              ) : (
                                <span className={`w-1.5 h-1.5 rounded-full ${event.status === 'critical' ? 'bg-red-500 animate-pulse' : event.status === 'delayed' ? 'bg-orange-400' : 'bg-[#46ec13]'}`}></span>
                              )}
                              {event.statusLabel}
                            </span>
                          </td>
                          <td className={`px-6 py-4 font-medium ${statusStyles[event.status].textColor}`}>
                            {event.time}
                          </td>
                          <td className="px-6 py-4">{event.volume}</td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-[#24381e] rounded">
                              <MoreVertical size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          Heç bir suvarma hadisəsi tapılmadı
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* JSON Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1c2e17] rounded-2xl border border-white/5 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Məlumat İdxalı</h3>
                <button 
                  onClick={() => setShowImport(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <JsonImport onImportComplete={() => {
                console.log('Import completed - refresh data');
                setShowImport(false);
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IrrigationPage;

