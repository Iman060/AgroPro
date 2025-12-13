import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, Bell, Settings, FileUp, Plus, MoreHorizontal, X, User } from 'lucide-react';
import { mockFields, mockCropBatches, mockStatusHistory, mockIrrigationEvents } from '../data/mockData';
import {
  countActiveCropBatches,
  countOverdueIrrigation,
  countCriticalStatus,
  countCropsByField,
  getActiveFields,
  getActiveCropBatches,
} from '../utils/calculations';
import JsonImport from '../components/JsonImport';
import Chart from 'react-apexcharts';
import { TrendingUp, Droplet, AlertTriangle, BarChart3, FileText } from 'lucide-react';

function Dashboard() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  
  // Filter to active entities only (derived data)
  const activeFields = getActiveFields(mockFields);
  const activeCropBatches = getActiveCropBatches(mockCropBatches);
  
  // All calculations are derived from active data
  const activeBatches = countActiveCropBatches(activeCropBatches);
  const overdueCount = countOverdueIrrigation(activeCropBatches, mockIrrigationEvents);
  const criticalCount = countCriticalStatus(activeCropBatches, mockStatusHistory);
  const cropsByField = countCropsByField(activeFields, activeCropBatches);

  // Calculate total fields used
  const totalFields = activeFields.length;
  const maxFields = 10; // Example max fields

  // Get current date
  const currentDate = new Date();
  const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('az-AZ', dateOptions);

  // KPI Cards Data
  const kpiCards = [
    {
      title: 'Aktiv Məhsul Partiyaları',
      value: activeBatches.toString(),
      icon: '🌱',
      badge: '+2%',
      badgeColor: 'bg-green-500/10 text-green-500',
      glowColor: 'from-green-500/5',
      borderColor: 'hover:border-green-500/30'
    },
    {
      title: 'İstifadə Olunan Sahələr',
      value: totalFields.toString(),
      suffix: `/ ${maxFields}`,
      icon: '📊',
      badge: 'Stabil',
      badgeColor: 'bg-white/5 text-gray-400',
      glowColor: 'from-white/0',
      borderColor: 'hover:border-white/20'
    },
    {
      title: 'Gecikmiş Suvarma',
      value: overdueCount.toString(),
      icon: '💧',
      badge: 'Diqqət',
      badgeColor: 'bg-red-500/10 text-red-500',
      glowColor: 'from-red-500/5',
      borderColor: 'hover:border-red-500/30'
    },
    {
      title: 'Kritik Status Sayı',
      value: criticalCount.toString(),
      icon: '⚠️',
      badge: '+1 Bu gün',
      badgeColor: 'bg-yellow-500/10 text-yellow-500',
      glowColor: 'from-yellow-500/5',
      borderColor: 'hover:border-yellow-500/30'
    }
  ];

  // Field data for bar chart
  const fieldData = cropsByField.map((field, idx) => ({
    name: field.fieldName.substring(0, 4) || `S-${String(idx + 1).padStart(2, '0')}`,
    value: field.count,
    height: Math.min((field.count / Math.max(...cropsByField.map(f => f.count), 1)) * 100, 100)
  }));

  // Calculate product distribution
  const cropTypes = activeCropBatches.reduce((acc, batch) => {
    acc[batch.cropType] = (acc[batch.cropType] || 0) + 1;
    return acc;
  }, {});

  const totalCrops = Object.values(cropTypes).reduce((sum, count) => sum + count, 0);
  const cropDistribution = Object.entries(cropTypes).map(([type, count]) => ({
    name: type,
    count,
    percentage: Math.round((count / totalCrops) * 100)
  }));

  // Status history timeline
  const recentStatusHistory = mockStatusHistory
    .filter(s => !mockCropBatches.find(b => b.id === s.cropBatchId)?.archived)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
    .map(status => {
      const batch = mockCropBatches.find(b => b.id === status.cropBatchId);
      const field = mockFields.find(f => f.id === batch?.fieldId);
      const date = new Date(status.date);
      const today = new Date();
      const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
      
      let dateLabel = '';
      if (diffDays === 0) dateLabel = 'Bugün';
      else if (diffDays === 1) dateLabel = 'Dünən';
      else dateLabel = `${date.getDate()} ${date.toLocaleDateString('az-AZ', { month: 'short' })}`;

      return {
        title: `Status: ${status.status === 'healthy' ? 'Sağlam' : status.status === 'risk' ? 'Risk' : status.status === 'sick' ? 'Xəstə' : 'Kritik'}`,
        subtitle: `${field?.name || 'Naməlum'} - ${batch?.cropType || 'Naməlum'}`,
        icon: status.status === 'healthy' ? '✓' : status.status === 'critical' ? '!' : '⚠',
        iconColor: status.status === 'healthy' 
          ? 'bg-green-500/20 text-green-500 border-green-500/50 shadow-[0_0_10px_rgba(70,236,19,0.2)]'
          : status.status === 'critical'
          ? 'bg-red-500/20 text-red-500 border-red-500/50'
          : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
        date: dateLabel,
        time: date.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })
      };
    });

  // Donut chart data
  const donutChartData = cropDistribution.map(crop => crop.percentage);
  const donutChartLabels = cropDistribution.map(crop => `${crop.name} (${crop.percentage}%)`);

  // Bar chart options
  const barChartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: 'inherit',
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: false,
        columnWidth: '60%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: fieldData.map(item => item.name),
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '12px',
        },
      },
    },
    fill: {
      colors: ['#46ec13'],
      opacity: 0.8,
    },
    tooltip: {
      theme: 'dark',
    },
    grid: {
      borderColor: '#24381e',
      strokeDashArray: 4,
    },
  };

  const barChartSeries = [{
    name: 'Partiyalar',
    data: fieldData.map(item => item.value),
  }];

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

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">İdarə Paneli</h2>
                <p className="text-gray-400 mt-1">Fermer təsərrüfatınızın ümumi vəziyyəti</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#24381e] hover:bg-[#1c2e17] rounded-full text-sm font-semibold transition-colors border border-white/5">
                  <FileUp size={18} />
                  İxrac Et
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#46ec13] hover:bg-[#36b80f] text-black rounded-full text-sm font-bold transition-colors shadow-[0_0_20px_rgba(70,236,19,0.2)]">
                  <Plus size={18} />
                  Yeni Partiya
                </button>
              </div>
            </div>

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

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {kpiCards.map((card, idx) => {
                const isCriticalStatus = card.title === 'Kritik Status Sayı';
                const CardWrapper = isCriticalStatus ? Link : 'div';
                const wrapperProps = isCriticalStatus ? { to: '/risk-analysis', className: 'block' } : {};
                
                return (
                  <CardWrapper key={idx} {...wrapperProps}>
                    <div className={`bg-[#1c2e17] p-6 rounded-2xl border border-white/5 ${card.borderColor} transition-all group relative overflow-hidden ${isCriticalStatus ? 'cursor-pointer hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10' : ''}`}>
                      <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${card.glowColor} rounded-full blur-2xl group-hover:opacity-100 transition-all`}></div>
                      <div className="flex items-start justify-between relative z-10">
                        <div className="p-3 bg-[#24381e] rounded-xl text-3xl">
                          {card.icon}
                        </div>
                        <span className={`flex items-center ${card.badgeColor} text-xs font-bold px-2 py-1 rounded-full`}>
                          {card.badge}
                        </span>
                      </div>
                      <div className="mt-4 relative z-10">
                        <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                        <div className="flex items-baseline gap-1">
                          <h3 className="text-3xl font-bold mt-1">{card.value}</h3>
                          {card.suffix && <span className="text-xl text-gray-500 font-semibold">{card.suffix}</span>}
                        </div>
                      </div>
                    </div>
                  </CardWrapper>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Donut Chart */}
              <div className="bg-[#1c2e17] p-6 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Məhsul Bölgüsü</h3>
                  <button className="text-gray-400 hover:text-white">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
                {cropDistribution.length > 0 ? (
                  <>
                    <div className="flex flex-col items-center justify-center min-h-[250px]">
                      <Chart
                        options={{
                          chart: {
                            type: 'donut',
                            toolbar: { show: false },
                            background: 'transparent',
                          },
                          labels: cropDistribution.map(c => c.name),
                          colors: ['#46ec13', '#eab308', '#3b82f6', '#8b5cf6', '#ef4444'],
                          legend: { show: false },
                          tooltip: { theme: 'dark' },
                          plotOptions: {
                            pie: {
                              donut: {
                                size: '70%',
                                labels: {
                                  show: true,
                                  total: {
                                    show: true,
                                    label: 'Cəmi',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#94a3b8',
                                    formatter: () => `${totalCrops} partiya`
                                  }
                                }
                              }
                            }
                          }
                        }}
                        series={donutChartData}
                        type="donut"
                        height={250}
                      />
                    </div>
                    <div className="mt-6 flex justify-center gap-4 flex-wrap">
                      {cropDistribution.map((crop, idx) => {
                        const colors = ['#46ec13', '#eab308', '#3b82f6', '#8b5cf6', '#ef4444'];
                        return (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }}></div>
                            <span className="text-sm text-gray-300">{crop.name} ({crop.percentage}%)</span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center min-h-[250px] text-gray-500">
                    Məlumat yoxdur
                  </div>
                )}
              </div>

              {/* Bar Chart */}
              <div className="bg-[#1c2e17] p-6 rounded-2xl border border-white/5 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Sahə üzrə Partiyalar</h3>
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="bg-[#24381e] text-xs text-white px-3 py-1.5 rounded-lg border-none focus:ring-1 focus:ring-[#46ec13] outline-none"
                  >
                    <option value="7days">Son 7 gün</option>
                    <option value="30days">Son 30 gün</option>
                  </select>
                </div>
                {fieldData.length > 0 ? (
                  <Chart
                    options={barChartOptions}
                    series={barChartSeries}
                    type="bar"
                    height={250}
                  />
                ) : (
                  <div className="flex items-center justify-center min-h-[250px] text-gray-500">
                    Məlumat yoxdur
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-[#1c2e17] p-6 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Status Tarixçəsi</h3>
                <button className="text-sm text-[#46ec13] font-semibold hover:underline">
                  Hamısına bax
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-[#24381e]"></div>
                <div className="space-y-6">
                  {recentStatusHistory.length > 0 ? (
                    recentStatusHistory.map((event, idx) => (
                      <div key={idx} className="relative flex items-start gap-4">
                        <div className="relative z-10 bg-[#1c2e17] p-1">
                          <div className={`w-8 h-8 rounded-full ${event.iconColor} flex items-center justify-center border`}>
                            <span className="text-sm font-bold">{event.icon}</span>
                          </div>
                        </div>
                        <div className="flex-1 bg-[#24381e]/50 p-4 rounded-xl border border-white/5 hover:bg-[#24381e] transition-colors">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold text-sm">{event.title}</h4>
                              <p className="text-gray-400 text-xs mt-0.5">{event.subtitle}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-gray-500 text-xs font-medium block">{event.date}</span>
                              <span className="text-gray-600 text-[10px] block">{event.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      Status tarixçəsi yoxdur
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
