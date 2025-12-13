import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus, Search, Filter, List, TrendingUp, MapPin, ShoppingBag, 
  AlertTriangle, ChevronRight, Calendar, CheckCircle, Clock,
  Droplet, FileText, Archive, History, Settings, Menu, X, Bell, User
} from 'lucide-react';
import { mockCropBatches, mockFields, mockStatusHistory, mockIrrigationEvents, mockNotes } from '../data/mockData';
import { getActiveCropBatches, getCurrentStatus, getActiveFields, countOverdueIrrigation } from '../utils/calculations';
import JsonImport from '../components/JsonImport';
import AddStatusChangeModal from '../components/AddStatusChangeModal';
import AddIrrigationModal from '../components/AddIrrigationModal';
import AddNoteModal from '../components/AddNoteModal';

function CropBatchesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [filterCrop, setFilterCrop] = useState('all');
  const [showImport, setShowImport] = useState(false);

  const activeCropBatches = getActiveCropBatches(mockCropBatches);
  const activeFields = getActiveFields(mockFields);
  const overdueCount = countOverdueIrrigation(activeCropBatches, mockIrrigationEvents);

  // Calculate KPIs
  const activeBatchesCount = activeCropBatches.length;
  const totalArea = activeCropBatches.length * 10; // Mock calculation
  const expectedYield = activeCropBatches.length * 18.75; // Mock calculation
  const criticalCount = activeCropBatches.filter(batch => {
    const status = getCurrentStatus(batch.id, mockStatusHistory);
    return status && status.status === 'critical';
  }).length;

  // Get crop batches with details
  const batchesWithDetails = activeCropBatches.map(batch => {
    const field = activeFields.find(f => f.id === batch.fieldId);
    const currentStatus = getCurrentStatus(batch.id, mockStatusHistory);
    const status = currentStatus?.status || 'healthy';
    
    // Get last activity
    const lastIrrigation = mockIrrigationEvents
      .filter(e => e.cropBatchId === batch.id && e.executedDate)
      .sort((a, b) => new Date(b.executedDate) - new Date(a.executedDate))[0];
    
    const lastNote = mockNotes
      .filter(n => n.cropBatchId === batch.id && !n.archived)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    let lastActivity = 'Yoxdur';
    let lastActivityTime = '';
    
    if (lastIrrigation && lastNote) {
      const irrigationDate = new Date(lastIrrigation.executedDate);
      const noteDate = new Date(lastNote.date);
      if (irrigationDate > noteDate) {
        lastActivity = 'Suvarma';
        const daysAgo = Math.floor((new Date() - irrigationDate) / (1000 * 60 * 60 * 24));
        if (daysAgo === 0) lastActivityTime = 'Bu gün';
        else if (daysAgo === 1) lastActivityTime = 'Dünən';
        else lastActivityTime = `${daysAgo} gün əvvəl`;
      } else {
        lastActivity = lastNote.type === 'fertilizer' ? 'Gübrələmə' : lastNote.type === 'disease' ? 'Dərmanlama' : 'Monitorinq';
        const daysAgo = Math.floor((new Date() - noteDate) / (1000 * 60 * 60 * 24));
        if (daysAgo === 0) lastActivityTime = 'Bu gün';
        else if (daysAgo === 1) lastActivityTime = 'Dünən';
        else if (daysAgo < 7) lastActivityTime = `${daysAgo} gün əvvəl`;
        else lastActivityTime = `${Math.floor(daysAgo / 7)} həftə əvvəl`;
      }
    } else if (lastIrrigation) {
      lastActivity = 'Suvarma';
      const daysAgo = Math.floor((new Date() - new Date(lastIrrigation.executedDate)) / (1000 * 60 * 60 * 24));
      if (daysAgo === 0) lastActivityTime = 'Bu gün';
      else if (daysAgo === 1) lastActivityTime = 'Dünən';
      else lastActivityTime = `${daysAgo} gün əvvəl`;
    } else if (lastNote) {
      lastActivity = lastNote.type === 'fertilizer' ? 'Gübrələmə' : lastNote.type === 'disease' ? 'Dərmanlama' : 'Monitorinq';
      const daysAgo = Math.floor((new Date() - new Date(lastNote.date)) / (1000 * 60 * 60 * 24));
      if (daysAgo === 0) lastActivityTime = 'Bu gün';
      else if (daysAgo === 1) lastActivityTime = 'Dünən';
      else if (daysAgo < 7) lastActivityTime = `${daysAgo} gün əvvəl`;
      else lastActivityTime = `${Math.floor(daysAgo / 7)} həftə əvvəl`;
    }

    // Calculate progress (mock - based on days since planting)
    const plantedDate = new Date(batch.plantedDate);
    const daysSincePlanting = Math.floor((new Date() - plantedDate) / (1000 * 60 * 60 * 24));
    const estimatedDays = 120;
    const progress = Math.min(Math.max(Math.floor((daysSincePlanting / estimatedDays) * 100), 0), 100);

    // Mock harvest date
    const harvestDate = new Date(plantedDate);
    harvestDate.setDate(harvestDate.getDate() + 90);

    // Status mapping
    const statusLabels = {
      healthy: { label: 'Yaxşı', color: 'green' },
      risk: { label: 'Diqqət', color: 'amber' },
      sick: { label: 'Xəstə', color: 'amber' },
      critical: { label: 'Kritik', color: 'red' },
    };

    const statusInfo = statusLabels[status] || statusLabels.healthy;

    // Crop icons
    const cropIcons = {
      'Wheat': '🌾',
      'Corn': '🌽',
      'Soybeans': '🌱',
      'Barley': '🌾',
      'Oats': '🌾',
    };

    return {
      id: batch.id,
      crop: batch.cropType,
      field: field?.name || 'Naməlum',
      icon: cropIcons[batch.cropType] || '🌾',
      color: 'yellow',
      plantDate: plantedDate.toLocaleDateString('az-AZ', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      status: statusInfo.label,
      statusColor: statusInfo.color,
      lastActivity,
      lastActivityTime,
      progress,
      harvestDate: harvestDate.toLocaleDateString('az-AZ', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      active: selectedBatch?.id === batch.id,
    };
  });

  // Filter batches
  const filteredBatches = batchesWithDetails.filter(batch => {
    const matchesSearch = searchQuery === '' || 
      batch.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.field.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterCrop === 'all' || batch.crop === filterCrop;
    
    return matchesSearch && matchesFilter;
  });

  // Set first batch as selected by default
  useEffect(() => {
    if (!selectedBatch && filteredBatches.length > 0) {
      setSelectedBatch(filteredBatches[0]);
    }
  }, [filteredBatches, selectedBatch]);

  const statusColors = {
    green: 'bg-green-500/20 text-green-400 border-green-500/20',
    amber: 'bg-amber-500/20 text-amber-500 border-amber-500/20',
    red: 'bg-red-500/20 text-red-500 border-red-500/20',
  };

  // Get activity history for selected batch
  const getActivityHistory = (batchId) => {
    const activities = [];
    
    // Get irrigation events
    const irrigations = mockIrrigationEvents
      .filter(e => e.cropBatchId === batchId && e.executedDate)
      .map(e => ({
        type: 'irrigation',
        date: new Date(e.executedDate),
        title: 'Suvarma həyata keçirildi',
        details: 'Sistem: Damlama, Müddət: 4 saat',
        color: 'blue',
      }));

    // Get notes
    const notes = mockNotes
      .filter(n => n.cropBatchId === batchId && !n.archived)
      .map(n => ({
        type: n.type,
        date: new Date(n.date),
        title: n.type === 'fertilizer' ? `Gübrələmə (${n.text})` : n.type === 'disease' ? 'Dərmanlama' : 'Monitorinq',
        details: n.text,
        color: n.type === 'fertilizer' ? 'purple' : 'green',
      }));

    // Get status changes
    const statusChanges = mockStatusHistory
      .filter(s => s.cropBatchId === batchId)
      .map(s => ({
        type: 'status',
        date: new Date(s.date),
        title: 'Status dəyişikliyi',
        details: s.reason,
        color: 'green',
      }));

    // Combine and sort
    const allActivities = [...irrigations, ...notes, ...statusChanges]
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);

    return allActivities.map(activity => {
      const daysAgo = Math.floor((new Date() - activity.date) / (1000 * 60 * 60 * 24));
      let timeLabel = '';
      if (daysAgo === 0) {
        timeLabel = `Bu gün - ${activity.date.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}`;
      } else if (daysAgo === 1) {
        timeLabel = `Dünən - ${activity.date.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}`;
      } else if (daysAgo < 7) {
        timeLabel = `${daysAgo} gün əvvəl - ${activity.date.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}`;
      } else {
        timeLabel = activity.date.toLocaleDateString('az-AZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
      }

      return {
        ...activity,
        timeLabel,
      };
    });
  };

  const handleBatchClick = (batch) => {
    setSelectedBatch(batch);
  };

  const handleAction = (action, batchId) => {
    setSelectedBatch(batchesWithDetails.find(b => b.id === batchId));
    if (action === 'status') {
      setActiveModal('status');
    } else if (action === 'irrigation') {
      setActiveModal('irrigation');
    } else if (action === 'note') {
      setActiveModal('note');
    }
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleSave = async (data) => {
    console.log('Saving:', data);
    handleCloseModal();
  };

  // Get current date for header
  const currentDate = new Date();
  const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('az-AZ', dateOptions);

  // Get unique crop types for filter
  const uniqueCrops = ['all', ...new Set(activeCropBatches.map(b => b.cropType))];

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
                <div className="w-full h-full bg-gradient-to-br from-[#46ec13]/20 to-green-800/20 flex items-center justify-center text-xl">
                  👤
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Header */}
        <div className="border-b border-[#24381e] bg-[#142210]/95 backdrop-blur z-10 p-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black tracking-tight">Məhsul Partiyaları</h2>
            <p className="text-gray-400 text-sm">Sahələrdəki aktiv məhsul partiyalarının idarə edilməsi və monitorinqi.</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#46ec13] hover:bg-[#36b80f] text-black font-bold transition-all shadow-[0_0_20px_rgba(70,236,19,0.2)]">
            <Plus size={20} />
            Yeni Partiya Əlavə Et
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* KPI Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1c2e17] border border-white/5 rounded-2xl p-6 hover:border-[#46ec13]/30 transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start">
                <p className="text-gray-400 font-medium text-sm">Aktiv Partiyalar</p>
                <span className="text-green-500 text-2xl">🌱</span>
              </div>
              <div className="flex items-end gap-2 mt-2">
                <p className="text-3xl font-bold">{activeBatchesCount}</p>
                <span className="text-[#46ec13] text-xs font-bold mb-1.5 flex items-center gap-0.5">
                  <TrendingUp size={14} /> +2%
                </span>
              </div>
            </div>

            <div className="bg-[#1c2e17] border border-white/5 rounded-2xl p-6 hover:border-[#46ec13]/30 transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start">
                <p className="text-gray-400 font-medium text-sm">Ümumi Sahə</p>
                <MapPin className="text-gray-400" size={20} />
              </div>
              <div className="flex items-end gap-2 mt-2">
                <p className="text-3xl font-bold">{totalArea.toLocaleString()} <span className="text-lg font-medium text-gray-400">ha</span></p>
                <span className="text-gray-400 text-xs font-bold mb-1.5">0%</span>
              </div>
            </div>

            <div className="bg-[#1c2e17] border border-white/5 rounded-2xl p-6 hover:border-[#46ec13]/30 transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start">
                <p className="text-gray-400 font-medium text-sm">Gözlənilən Məhsul</p>
                <ShoppingBag className="text-[#46ec13]" size={20} />
              </div>
              <div className="flex items-end gap-2 mt-2">
                <p className="text-3xl font-bold">{Math.round(expectedYield)} <span className="text-lg font-medium text-gray-400">ton</span></p>
                <span className="text-[#46ec13] text-xs font-bold mb-1.5 flex items-center gap-0.5">
                  <TrendingUp size={14} /> +5%
                </span>
              </div>
            </div>

            <div className="bg-[#1c2e17] border border-white/5 rounded-2xl p-6 hover:border-red-500/30 transition-all group relative overflow-hidden">
              <div className="absolute right-0 top-0 p-10 bg-red-500/5 rounded-full blur-2xl -mr-6 -mt-6"></div>
              <div className="flex justify-between items-start relative z-10">
                <p className="text-gray-400 font-medium text-sm">Riskli Vəziyyət</p>
                <AlertTriangle className="text-red-500" size={20} />
              </div>
              <div className="flex items-end gap-2 mt-2 relative z-10">
                <p className="text-3xl font-bold">{criticalCount}</p>
                <span className="text-red-500 text-xs font-bold mb-1.5 flex items-center gap-0.5">
                  <TrendingUp size={14} /> +1
                </span>
              </div>
            </div>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* Left: List */}
            <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
              {/* Filter Bar */}
              <div className="flex flex-wrap gap-4 items-center justify-between bg-[#1c2e17] border border-white/5 rounded-2xl p-4">
                <div className="flex flex-1 gap-3 min-w-[280px]">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#24381e] border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#46ec13]/50 focus:ring-1 focus:ring-[#46ec13]/50 transition-all"
                      placeholder="Partiya adı və ya ID ilə axtar..."
                    />
                  </div>
                  <div className="relative w-48 hidden sm:block">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select 
                      value={filterCrop}
                      onChange={(e) => setFilterCrop(e.target.value)}
                      className="w-full bg-[#24381e] border border-white/5 rounded-lg pl-10 pr-8 py-2.5 text-white appearance-none focus:outline-none focus:border-[#46ec13]/50"
                    >
                      <option value="all">Bütün Bitkilər</option>
                      {uniqueCrops.filter(c => c !== 'all').map(crop => (
                        <option key={crop} value={crop}>{crop}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 rounded-lg border border-white/5 text-gray-400 hover:text-white hover:bg-[#24381e] transition-colors">
                    <Filter size={18} />
                  </button>
                  <button className="p-2.5 rounded-lg border border-white/5 text-gray-400 hover:text-white hover:bg-[#24381e] transition-colors">
                    <List size={18} />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="bg-[#1c2e17] border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#24381e]/50 border-b border-white/5">
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Partiya ID</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Bitki & Sahə</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Əkin Tarixi</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Son Fəaliyyət</th>
                        <th className="px-6 py-4 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredBatches.map((batch) => (
                        <tr
                          key={batch.id}
                          onClick={() => handleBatchClick(batch)}
                          className={`group hover:bg-[#24381e]/50 transition-colors cursor-pointer border-l-4 ${
                            selectedBatch?.id === batch.id ? 'bg-[#46ec13]/10 border-l-[#46ec13]' : 'border-l-transparent'
                          }`}
                        >
                          <td className="px-6 py-4">
                            <span className="text-white font-medium font-mono text-sm">{batch.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-yellow-500/20 text-yellow-500 flex items-center justify-center border border-yellow-500/20 text-lg">
                                {batch.icon}
                              </div>
                              <div>
                                <p className="text-white text-sm font-semibold">{batch.crop}</p>
                                <p className="text-gray-400 text-xs">{batch.field}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-400 text-sm">{batch.plantDate}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[batch.statusColor]}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                batch.statusColor === 'green' ? 'bg-green-400' :
                                batch.statusColor === 'amber' ? 'bg-amber-400 animate-pulse' :
                                'bg-red-400 animate-pulse'
                              }`}></span>
                              {batch.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-400 text-sm">
                              {batch.lastActivity} <span className="text-xs opacity-60">({batch.lastActivityTime})</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <ChevronRight className={selectedBatch?.id === batch.id ? 'text-[#46ec13]' : 'text-gray-400 group-hover:text-white'} size={20} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right: Detail Panel */}
            {selectedBatch && (
              <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
                <div className="bg-[#1c2e17] border border-[#46ec13]/40 rounded-2xl p-6 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 z-0 opacity-10 bg-gradient-to-br from-green-500/20 to-transparent"></div>

                  {/* Header */}
                  <div className="relative z-10 flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#24381e] text-gray-400">
                          ID: {selectedBatch.id}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                          {selectedBatch.crop}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold">{selectedBatch.field}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-[#46ec13]/20 flex items-center justify-center relative">
                      <span className="absolute inset-0 rounded-full border-4 border-[#46ec13] border-t-transparent border-r-transparent" style={{ transform: `rotate(${(selectedBatch.progress / 100) * 360 - 90}deg)` }}></span>
                      <span className="text-xs font-bold text-[#46ec13]">{selectedBatch.progress}%</span>
                    </div>
                  </div>

                  {/* Alert */}
                  {selectedBatch.statusColor === 'amber' || selectedBatch.statusColor === 'red' ? (
                    <div className="relative z-10 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-6 flex items-start gap-3">
                      <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                      <div>
                        <p className="text-amber-500 text-sm font-bold">Diqqət: Rütubət Aşağıdır</p>
                        <p className="text-amber-200/70 text-xs mt-0.5">
                          Son ölçmələr torpaq rütubətinin normadan 5% aşağı olduğunu göstərir.
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {/* Metrics */}
                  <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-[#24381e] border border-white/5">
                      <p className="text-xs text-gray-400 mb-1">Əkin Tarixi</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="text-white" size={18} />
                        <span className="text-sm font-semibold">{selectedBatch.plantDate}</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#24381e] border border-white/5">
                      <p className="text-xs text-gray-400 mb-1">Gözlənilən Yığım</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="text-white" size={18} />
                        <span className="text-sm font-semibold">{selectedBatch.harvestDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="relative z-10 grid grid-cols-2 gap-3 mb-6">
                    <button 
                      onClick={() => handleAction('status', selectedBatch.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-[#46ec13]/10 hover:bg-[#46ec13] text-[#46ec13] hover:text-black border border-[#46ec13]/50 rounded-lg text-xs font-bold transition-all"
                    >
                      <Clock size={16} />
                      Statusu Yenilə
                    </button>
                    <button 
                      onClick={() => handleAction('irrigation', selectedBatch.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/50 rounded-lg text-xs font-bold transition-all"
                    >
                      <Droplet size={16} />
                      Suvarma
                    </button>
                    <button 
                      onClick={() => handleAction('note', selectedBatch.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-[#24381e] hover:bg-white/10 text-white border border-white/5 rounded-lg text-xs font-bold transition-all"
                    >
                      <FileText size={16} />
                      Qeyd
                    </button>
                    <button 
                      onClick={() => navigate(`/crop-batches/${selectedBatch.id}`)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-[#24381e] hover:bg-white/10 text-white border border-white/5 rounded-lg text-xs font-bold transition-all"
                    >
                      <Archive size={16} />
                      Detallar
                    </button>
                  </div>

                  {/* Timeline */}
                  <div className="relative z-10">
                    <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                      <History className="text-gray-400" size={18} />
                      Fəaliyyət Tarixçəsi
                    </h4>
                    <div className="relative pl-4 space-y-6 before:absolute before:left-[5px] before:top-2 before:bottom-0 before:w-0.5 before:bg-[#24381e]">
                      {getActivityHistory(selectedBatch.id).map((activity, idx) => (
                        <div key={idx} className="relative pl-4">
                          <div className={`absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full ${
                            activity.color === 'blue' ? 'bg-blue-500' :
                            activity.color === 'purple' ? 'bg-purple-500' :
                            'bg-green-500'
                          } border-2 border-[#142210] shadow-[0_0_0_2px_rgba(59,130,246,0.3)]`}></div>
                          <p className="text-xs text-gray-400 mb-0.5">{activity.timeLabel}</p>
                          <p className="text-sm font-medium">{activity.title}</p>
                          {activity.details && (
                            <p className="text-xs text-gray-400 mt-1">{activity.details}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {activeModal === 'status' && selectedBatch && (
        <AddStatusChangeModal
          cropBatchId={selectedBatch.id}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}

      {activeModal === 'irrigation' && selectedBatch && (
        <AddIrrigationModal
          cropBatchId={selectedBatch.id}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}

      {activeModal === 'note' && selectedBatch && (
        <AddNoteModal
          cropBatchId={selectedBatch.id}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default CropBatchesPage;

