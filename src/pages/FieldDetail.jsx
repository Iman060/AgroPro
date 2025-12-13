import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Menu, Search, Bell, Settings, Edit, Plus, MoreVertical, ChevronRight, TrendingUp, Archive, Clock, X, User } from 'lucide-react';
import { mockFields, mockCropBatches, mockStatusHistory, mockIrrigationEvents, mockNotes } from '../data/mockData';
import { getActiveCropBatchesForField, getCurrentStatus, getIrrigationState, getActiveFields, getActiveCropBatches, countOverdueIrrigation } from '../utils/calculations';
import JsonImport from '../components/JsonImport';
import AddIrrigationModal from '../components/AddIrrigationModal';
import AddStatusChangeModal from '../components/AddStatusChangeModal';
import AddNoteModal from '../components/AddNoteModal';

function FieldDetail() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [modalParams, setModalParams] = useState({});
  const [showImport, setShowImport] = useState(false);

  const activeFields = getActiveFields(mockFields);
  const activeCropBatches = getActiveCropBatches(mockCropBatches);
  const overdueCount = countOverdueIrrigation(activeCropBatches, mockIrrigationEvents);
  const fieldId = searchParams.get('fieldId') || activeFields[0]?.id;
  const field = activeFields.find(f => f.id === fieldId);
  const cropBatches = fieldId ? getActiveCropBatchesForField(fieldId, mockCropBatches) : [];
  const archivedBatches = fieldId ? mockCropBatches.filter(b => b.fieldId === fieldId && b.archived) : [];

  // Set default fieldId if not in URL
  useEffect(() => {
    if (!searchParams.get('fieldId') && activeFields.length > 0) {
      setSearchParams({ fieldId: activeFields[0].id });
    }
  }, [searchParams, activeFields, setSearchParams]);

  const handleFieldSelect = (selectedFieldId) => {
    setSearchParams({ fieldId: selectedFieldId });
  };

  if (!field || activeFields.length === 0) {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-[#142210] text-white items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Sahə tapılmadı</p>
          <Link to="/dashboard" className="text-[#46ec13] hover:underline">
            İdarə Panelinə qayıt
          </Link>
        </div>
      </div>
    );
  }

  // Calculate field stats
  const totalArea = cropBatches.length * 10; // Mock calculation - in real app would come from field data
  const lastIrrigation = mockIrrigationEvents
    .filter(e => cropBatches.some(b => b.id === e.cropBatchId) && e.executedDate)
    .sort((a, b) => new Date(b.executedDate) - new Date(a.executedDate))[0];

  const nextIrrigation = mockIrrigationEvents
    .filter(e => cropBatches.some(b => b.id === e.cropBatchId) && e.type === 'planned' && !e.executedDate)
    .sort((a, b) => new Date(a.plannedDate) - new Date(b.plannedDate))[0];

  const getDaysAgo = (date) => {
    if (!date) return null;
    const diff = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Bu gün';
    if (diff === 1) return '1 gün əvvəl';
    return `${diff} gün əvvəl`;
  };

  const statsCards = [
    {
      label: 'Ümumi Sahə',
      value: `${totalArea} ha`,
      subtext: 'Dəyişiklik yoxdur',
      icon: '🏞️',
      iconColor: 'text-[#46ec13]'
    },
    {
      label: 'Torpaq Vəziyyəti',
      value: 'Yaxşı',
      valueExtra: '(pH 6.5)',
      subtext: 'Verimlilik +2%',
      subtextIcon: <TrendingUp size={16} />,
      subtextColor: 'text-[#46ec13]',
      icon: '🌾',
      iconColor: 'text-[#bcaaa4]'
    },
    {
      label: 'Hava Proqnozu',
      value: '24°C',
      subtext: 'Aydın günəşli, külək 5 km/s',
      icon: '☀️',
      iconColor: 'text-yellow-400'
    },
    {
      label: 'Son Suvarma',
      value: lastIrrigation ? getDaysAgo(lastIrrigation.executedDate) : 'Yoxdur',
      subtext: nextIrrigation 
        ? `Növbəti: ${new Date(nextIrrigation.plannedDate).toLocaleDateString('az-AZ', { day: 'numeric', month: 'long' })}`
        : 'Planlaşdırılmamış',
      icon: '💧',
      iconColor: 'text-blue-400'
    }
  ];

  // Get active crops with details
  const activeCrops = cropBatches.map(batch => {
    const currentStatus = getCurrentStatus(batch.id, mockStatusHistory);
    const status = currentStatus?.status || 'healthy';
    
    // Calculate progress (mock - in real app would be based on growth stage)
    const plantedDate = new Date(batch.plantedDate);
    const daysSincePlanting = Math.floor((new Date() - plantedDate) / (1000 * 60 * 60 * 24));
    const estimatedDays = 120; // Mock total days
    const progress = Math.min(Math.max(Math.floor((daysSincePlanting / estimatedDays) * 100), 0), 100);

    const statusLabels = {
      healthy: { label: 'Vegetasiya', color: 'bg-blue-500/20 text-blue-400 border-blue-500/20' },
      risk: { label: 'Risk', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20' },
      sick: { label: 'Xəstə', color: 'bg-orange-500/20 text-orange-400 border-orange-500/20' },
      critical: { label: 'Kritik', color: 'bg-red-500/20 text-red-400 border-red-500/20' },
    };

    const statusInfo = statusLabels[status] || statusLabels.healthy;

    // Mock harvest date (90 days after planting)
    const harvestDate = new Date(plantedDate);
    harvestDate.setDate(harvestDate.getDate() + 90);

    return {
      id: batch.id,
      name: batch.cropType,
      status: statusInfo.label,
      statusColor: statusInfo.color,
      variety: batch.cropType, // Mock - would come from batch data
      area: '10 ha', // Mock
      plantDate: plantedDate.toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' }),
      harvestDate: harvestDate.toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' }),
      progress,
      progressColor: progress > 50 ? 'bg-[#46ec13]' : 'bg-yellow-400',
      progressTextColor: progress > 50 ? 'text-[#46ec13]' : 'text-yellow-400',
      image: `https://images.unsplash.com/photo-${batch.id === 'batch-1' ? '1574943320219-553eb213f72d' : '1615485500704-8e990f9900f7'}?w=400&h=400&fit=crop`
    };
  });

  // Get archived crops
  const archivedCrops = archivedBatches.map(batch => {
    const harvestDate = new Date(batch.plantedDate);
    harvestDate.setDate(harvestDate.getDate() + 90);
    return {
      id: batch.id,
      name: `${batch.cropType} (${new Date(batch.plantedDate).getFullYear()} Mövsümü)`,
      date: `Yığım tarixi: ${harvestDate.toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      icon: '🌾'
    };
  });

  // Get recent activities (combine status changes, irrigation, notes)
  const allActivities = [
    ...mockStatusHistory
      .filter(s => cropBatches.some(b => b.id === s.cropBatchId))
      .map(s => ({
        type: 'status',
        title: `Status: ${s.status === 'healthy' ? 'Sağlam' : s.status === 'risk' ? 'Risk' : s.status === 'sick' ? 'Xəstə' : 'Kritik'}`,
        description: s.reason,
        date: new Date(s.date),
        user: s.changedBy === 'farmer' ? 'Fermer' : s.changedBy === 'system' ? 'Sistem' : 'İdxal',
        userAvatar: s.changedBy === 'system' ? 'S' : '👨‍🌾',
        isSystem: s.changedBy === 'system'
      })),
    ...mockIrrigationEvents
      .filter(e => cropBatches.some(b => b.id === e.cropBatchId) && e.executedDate)
      .map(e => ({
        type: 'irrigation',
        title: 'Suvarma Tamamlandı',
        description: `Sahə ${field.name} - Suvarma uğurla həyata keçirildi`,
        date: new Date(e.executedDate),
        user: 'Fermer',
        userAvatar: '💧',
        isSystem: false
      })),
    ...mockNotes
      .filter(n => cropBatches.some(b => b.id === n.cropBatchId) && !n.archived)
      .map(n => ({
        type: 'note',
        title: n.type === 'disease' ? 'Xəstəlik Qeydi' : n.type === 'fertilizer' ? 'Gübrələmə' : n.type === 'watering' ? 'Suvarma Qeydi' : 'Müşahidə',
        description: n.text,
        date: new Date(n.date),
        user: 'Fermer',
        userAvatar: '📝',
        isSystem: false
      }))
  ]
    .sort((a, b) => b.date - a.date)
    .slice(0, 4)
    .map(activity => {
      const now = new Date();
      const diffDays = Math.floor((now - activity.date) / (1000 * 60 * 60 * 24));
      
      let timeLabel = '';
      if (diffDays === 0) {
        timeLabel = `Bu gün, ${activity.date.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}`;
      } else if (diffDays === 1) {
        timeLabel = `Dünən, ${activity.date.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}`;
      } else {
        timeLabel = activity.date.toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' });
      }

      return {
        ...activity,
        time: timeLabel,
        timeColor: diffDays === 0 ? 'text-[#46ec13]' : 'text-[#a3b99d]',
        isActive: diffDays === 0
      };
    });

  const handleAddActivity = () => {
    setModalParams({ fieldId });
    setActiveModal('note');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setModalParams({});
  };

  const handleSave = async (data) => {
    // In a real app, this would save to backend
    console.log('Saving:', data);
    handleCloseModal();
  };

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
          <button
            className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all ${
              location.pathname.startsWith('/fields')
                ? 'bg-[#46ec13] text-black shadow-[0_0_15px_rgba(70,236,19,0.3)] font-bold'
                : 'text-gray-400 hover:text-white hover:bg-[#24381e]'
            }`}
          >
            <span className="text-xl">🗺️</span>
            <span className="text-sm font-medium">Sahələr</span>
          </button>
          
          {/* Field Selector */}
          {activeFields.length > 1 && (
            <div className="ml-3 mt-2 space-y-1">
              {activeFields.map(f => (
                <button
                  key={f.id}
                  onClick={() => handleFieldSelect(f.id)}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                    f.id === fieldId
                      ? 'bg-[#46ec13]/30 text-[#46ec13] font-bold'
                      : 'text-gray-400 hover:text-white hover:bg-[#24381e]'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          )}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap items-center gap-2">
              <Link to="/dashboard" className="text-[#a3b99d] hover:text-[#46ec13] transition-colors text-sm font-medium">
                İdarə Paneli
              </Link>
              <ChevronRight size={16} className="text-[#a3b99d]" />
              <span className="text-white text-sm font-medium">Sahələr</span>
              <ChevronRight size={16} className="text-[#a3b99d]" />
              <span className="text-white text-sm font-medium">{field.name}</span>
            </div>

            {/* Page Heading */}
            <div className="flex flex-wrap justify-between items-end gap-4 border-b border-[#2c3928] pb-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-white text-3xl font-bold leading-tight tracking-tight">
                  Sahə Təfərrüatları: {field.name}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#46ec13]/20 text-[#46ec13] border border-[#46ec13]/20">
                    AKTİV
                  </span>
                  <p className="text-[#a3b99d] text-base font-normal">
                    Azərbaycan • Bakı
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#1c2e18] hover:bg-[#3a4b35] text-white text-sm font-bold transition-colors">
                  <Edit size={20} />
                  <span>Düzəliş et</span>
                </button>
                <button 
                  onClick={handleAddActivity}
                  className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#46ec13] hover:bg-[#3bd10f] text-black text-sm font-bold transition-colors shadow-[0_0_15px_rgba(70,236,19,0.3)]"
                >
                  <Plus size={20} />
                  <span>Yeni Fəaliyyət</span>
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat, idx) => (
                <div key={idx} className="flex flex-col gap-1 rounded-2xl p-6 bg-[#1c2e17] border border-white/5">
                  <div className="flex items-center justify-between">
                    <p className="text-[#a3b99d] text-sm font-medium">{stat.label}</p>
                    <span className={`text-2xl ${stat.iconColor}`}>{stat.icon}</span>
                  </div>
                  <p className="text-white text-2xl font-bold mt-1">
                    {stat.value}
                    {stat.valueExtra && <span className="text-lg font-normal text-[#a3b99d]"> {stat.valueExtra}</span>}
                  </p>
                  <p className={`text-xs mt-1 flex items-center gap-1 ${stat.subtextColor || 'text-[#a3b99d]'}`}>
                    {stat.subtextIcon}
                    {stat.subtext}
                  </p>
                </div>
              ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column - Crops */}
              <div className="xl:col-span-2 flex flex-col gap-8">
                {/* Active Crops */}
                <section className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white text-xl font-bold flex items-center gap-2">
                      <span className="text-[#46ec13] text-2xl">🌿</span>
                      Cari Məhsullar
                    </h3>
                    <Link to="/fields" className="text-sm text-[#46ec13] font-bold hover:underline">
                      Hamısına bax
                    </Link>
                  </div>

                  {/* Crop Cards */}
                  {activeCrops.length > 0 ? (
                    activeCrops.map((crop, idx) => (
                      <div key={crop.id} className="bg-[#1c2e17] border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 relative overflow-hidden group hover:border-[#46ec13]/40 transition-colors">
                        <button className="absolute top-3 right-3 p-1 hover:bg-white/10 rounded text-[#a3b99d] hover:text-white transition-colors">
                          <MoreVertical size={20} />
                        </button>
                        
                        <div 
                          className="w-full sm:w-32 h-32 rounded-lg bg-cover bg-center shrink-0"
                          style={{ backgroundImage: `url(${crop.image})` }}
                        />
                        
                        <div className="flex flex-col flex-1 justify-center gap-3">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-white text-lg font-bold">{crop.name}</h4>
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${crop.statusColor}`}>
                                {crop.status}
                              </span>
                            </div>
                            <p className="text-[#a3b99d] text-sm">
                              Sort: {crop.variety} | Ərazi: {crop.area}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-[#a3b99d] text-xs uppercase font-bold tracking-wider mb-1">
                                Əkilmə Tarixi
                              </p>
                              <p className="text-white text-sm font-medium">{crop.plantDate}</p>
                            </div>
                            <div>
                              <p className="text-[#a3b99d] text-xs uppercase font-bold tracking-wider mb-1">
                                Planlanan Yığım
                              </p>
                              <p className="text-white text-sm font-medium">{crop.harvestDate}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-1.5 mt-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-[#a3b99d]">İnkişaf göstəricisi</span>
                              <span className={crop.progressTextColor}>{crop.progress}%</span>
                            </div>
                            <div className="w-full bg-black/40 rounded-full h-2">
                              <div 
                                className={`${crop.progressColor} h-2 rounded-full transition-all`}
                                style={{ width: `${crop.progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => navigate(`/crop-batches/${crop.id}`)}
                              className="px-4 py-2 bg-[#1c2e18] hover:bg-[#3a4b35] border border-[#3a4b35] text-white text-sm font-medium rounded-lg transition-colors"
                            >
                              Detallar
                            </button>
                            <button
                              onClick={() => {
                                setModalParams({ cropBatchId: crop.id });
                                setActiveModal('irrigation');
                              }}
                              className="px-4 py-2 bg-[#46ec13] hover:bg-[#3bd10f] text-black text-sm font-bold rounded-lg transition-colors"
                            >
                              Suvarma
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-[#1c2e17] border border-white/5 rounded-2xl p-8 text-center text-gray-400">
                      Bu sahədə aktiv məhsul yoxdur
                    </div>
                  )}
                </section>

                {/* Archived Crops */}
                {archivedCrops.length > 0 && (
                  <section className="flex flex-col gap-4 pt-6 border-t border-[#2c3928]">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[#a3b99d] text-xl font-bold flex items-center gap-2">
                        <Archive size={24} />
                        Arxiv
                      </h3>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {archivedCrops.map((crop) => (
                        <div 
                          key={crop.id} 
                          className="flex items-center justify-between p-4 rounded-lg bg-[#1a241b] border border-[#2c3928]/50 hover:bg-[#233025] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded bg-[#2c3928] flex items-center justify-center text-2xl">
                              {crop.icon}
                            </div>
                            <div>
                              <p className="text-gray-300 font-medium">{crop.name}</p>
                              <p className="text-gray-500 text-xs">{crop.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-gray-800 text-gray-400">
                              Yekunlaşıb
                            </span>
                            <ChevronRight size={20} className="text-gray-600" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Right Column - Timeline */}
              <div className="xl:col-span-1">
                <div className="bg-[#1c2e17] border border-white/5 rounded-2xl p-6 h-full">
                  <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-2">
                    <Clock size={24} className="text-[#46ec13]" />
                    Son Fəaliyyətlər
                  </h3>
                  
                  <div className="relative pl-2">
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-[#3a4b35]"></div>
                    
                    {allActivities.length > 0 ? (
                      allActivities.map((event, idx) => (
                        <div key={idx} className={`relative pl-8 ${idx !== allActivities.length - 1 ? 'pb-8' : 'pb-2'} group`}>
                          <div className={`
                            absolute left-0 top-1.5 h-4 w-4 rounded-full border-4 border-[#1c2e18]
                            ${event.isActive 
                              ? 'bg-[#46ec13] shadow-[0_0_0_1px_#46ec13]' 
                              : 'bg-[#3a4b35]'}
                          `}></div>
                          
                          <div className="flex flex-col gap-1">
                            <span className={`text-xs font-bold uppercase tracking-wider ${event.timeColor}`}>
                              {event.time}
                            </span>
                            <p className="text-white font-medium text-base">{event.title}</p>
                            <p className="text-[#a3b99d] text-sm mb-2">{event.description}</p>
                            
                            <div className="flex items-center gap-2">
                              {event.isSystem ? (
                                <div className="h-6 w-6 rounded-full bg-blue-900 flex items-center justify-center text-[10px] text-white font-bold">
                                  {event.userAvatar}
                                </div>
                              ) : (
                                <div className="h-6 w-6 rounded-full bg-[#2c3928] flex items-center justify-center text-sm">
                                  {event.userAvatar}
                                </div>
                              )}
                              <span className="text-xs text-[#a3b99d]">{event.user}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-[#a3b99d] py-8 text-sm">
                        Fəaliyyət yoxdur
                      </div>
                    )}
                  </div>
                  
                  <button className="w-full mt-6 py-2 border border-[#3a4b35] rounded-lg text-sm text-[#a3b99d] hover:bg-[#3a4b35] hover:text-white transition-colors">
                    Bütün tarixçəni gör
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {activeModal === 'irrigation' && (
        <AddIrrigationModal
          cropBatchId={modalParams.cropBatchId}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}

      {activeModal === 'status' && (
        <AddStatusChangeModal
          cropBatchId={modalParams.cropBatchId}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}

      {activeModal === 'note' && (
        <AddNoteModal
          cropBatchId={modalParams.cropBatchId || modalParams.fieldId}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}

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

export default FieldDetail;
