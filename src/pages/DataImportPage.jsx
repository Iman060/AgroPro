import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Upload, HelpCircle, AlertTriangle, Check, X, 
  CheckCircle, AlertCircle, Database, Settings, Menu, Bell, Search, User,
  Wheat, Sprout, BarChart3, Map, Droplet, FileText, Sun
} from 'lucide-react';
import { mockCropBatches, mockIrrigationEvents } from '../data/mockData';
import { getActiveCropBatches, countOverdueIrrigation } from '../utils/calculations';

function DataImportPage() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showConflicts, setShowConflicts] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [conflictResolutions, setConflictResolutions] = useState({});

  const activeCropBatches = getActiveCropBatches(mockCropBatches);
  const overdueCount = countOverdueIrrigation(activeCropBatches, mockIrrigationEvents);

  // Get current date for header
  const currentDate = new Date();
  const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('az-AZ', dateOptions);

  const conflicts = [
    {
      id: 'conflict-1',
      field: 'Şimal Sahəsi A1',
      fieldId: '#FK-2938',
      label: 'Sahə ölçüsü',
      currentValue: '45.2 Hektar',
      newValue: '45.5 Hektar'
    },
    {
      id: 'conflict-2',
      field: 'Pambıq B2',
      fieldId: '#FK-2942',
      label: 'Bitki növü',
      currentValue: 'Pambıq (Sort: Ağ qızıl)',
      newValue: 'Pambıq (Sort: Elite)'
    },
    {
      id: 'conflict-3',
      field: 'Cənub Bloku C3',
      fieldId: '#FK-2945',
      label: 'Suvarma tarixi',
      currentValue: '15.10.2023',
      newValue: '18.10.2023'
    }
  ];

  const importHistory = [
    {
      date: '24 Okt 2023, 14:30',
      filename: 'soil_analysis_2023.json',
      user: 'Orxan M.',
      records: '150 yeni qeyd əlavə edildi',
      status: 'success',
      statusLabel: 'Uğurlu'
    },
    {
      date: '20 Okt 2023, 09:15',
      filename: 'irrigation_logs_q3.json',
      user: 'Aysel K.',
      records: 'Format xətası: sətir 42',
      status: 'error',
      statusLabel: 'Xəta'
    },
    {
      date: '15 Okt 2023, 11:00',
      filename: 'crop_batches_archived.json',
      user: 'Orxan M.',
      records: '3 konflikt həll edildi',
      status: 'warning',
      statusLabel: 'Xəbərdarlıq'
    }
  ];

  const statusStyles = {
    success: {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      border: 'border-green-500/20',
      icon: CheckCircle
    },
    error: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/20',
      icon: AlertCircle
    },
    warning: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-500',
      border: 'border-yellow-500/20',
      icon: AlertTriangle
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file && file.type === 'application/json') {
      setSelectedFile(file);
      // Simulate upload and validation
      setUploadProgress(0);
      setShowConflicts(false);
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setShowConflicts(true);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    } else {
      alert('Yalnız .json formatı dəstəklənir');
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleConflictResolution = (conflictId, action) => {
    setConflictResolutions({
      ...conflictResolutions,
      [conflictId]: action
    });
  };

  const handleApplyAll = () => {
    console.log('Applying all changes:', conflictResolutions);
    setShowConflicts(false);
    setUploadProgress(0);
    setSelectedFile(null);
    setConflictResolutions({});
  };

  const handleCancel = () => {
    setShowConflicts(false);
    setUploadProgress(0);
    setSelectedFile(null);
    setConflictResolutions({});
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
            <div className="flex items-center gap-2 p-3 bg-[#24381e] rounded-lg border border-white/5 mb-4">
              <Database className="text-gray-400" size={16} />
              <span className="text-xs text-gray-400">Server: Online (ver 2.4.1)</span>
            </div>
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-[1000px] mx-auto flex flex-col gap-8">
            {/* Page Header */}
            <header className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-black tracking-tight">Məlumat İdxalı</h1>
                  <p className="text-gray-400 text-base mt-2">
                    Xarici JSON fayllarını sistemə yükləyin və konfliktləri həll edin.
                  </p>
                </div>
                <button className="hidden md:flex items-center gap-2 bg-[#24381e] border border-white/5 text-white px-4 py-2 rounded-full hover:bg-[#1c2e17] transition-colors">
                  <HelpCircle size={16} />
                  <span className="text-sm font-medium">Kömək</span>
                </button>
              </div>
            </header>

            {/* Upload Area */}
            <section 
              className="rounded-2xl bg-[#1c2e17] border border-white/5 p-6 shadow-lg"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className={`flex flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed px-6 py-12 cursor-pointer group transition-all ${
                isDragging 
                  ? 'border-[#46ec13] bg-[#46ec13]/5' 
                  : 'border-white/10 hover:border-[#46ec13]/50 hover:bg-[#24381e]/30'
              }`}>
                <div className={`p-4 rounded-full transition-colors ${
                  isDragging ? 'bg-[#46ec13]/20' : 'bg-[#24381e] group-hover:bg-[#46ec13]/20'
                }`}>
                  <Upload className={`transition-colors ${
                    isDragging ? 'text-[#46ec13]' : 'text-gray-400 group-hover:text-[#46ec13]'
                  }`} size={40} />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-lg font-bold text-center">
                    Faylı seçin və ya bura sürüşdürün
                  </p>
                  <p className="text-gray-400 text-sm text-center">
                    Yalnız .json formatı dəstəklənir (Maks 25MB)
                  </p>
                </div>
                <label className="flex items-center justify-center rounded-full h-10 px-6 bg-[#46ec13] text-black text-sm font-bold shadow-[0_0_20px_rgba(70,236,19,0.2)] hover:bg-[#36b80f] transition-all hover:scale-105 cursor-pointer">
                  <span>Fayl Seç</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </label>
                {selectedFile && (
                  <p className="text-sm text-[#46ec13] mt-2">
                    Seçilmiş fayl: {selectedFile.name}
                  </p>
                )}
              </div>
            </section>

            {/* Upload Progress & Validation */}
            {(uploadProgress > 0 || showConflicts) && (
              <section className="flex flex-col gap-6 animate-fade-in">
                {/* Progress Bar */}
                <div className="flex flex-col gap-3">
                  <div className="flex gap-6 justify-between items-end">
                    <div>
                      <p className="text-base font-bold">Doğrulama statusu</p>
                      <p className="text-gray-400 text-xs mt-1">
                        Skan edilir... <span className="text-[#46ec13] font-bold">Tamamlandı</span>
                      </p>
                    </div>
                    <p className="text-[#46ec13] text-xl font-bold font-mono">{uploadProgress}%</p>
                  </div>
                  <div className="rounded-full bg-[#24381e] h-2 overflow-hidden">
                    <div 
                      className="h-full bg-[#46ec13] shadow-lg shadow-[#46ec13]/60 transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Conflict Resolution Card */}
                {showConflicts && conflicts.length > 0 && (
                  <div className="rounded-2xl bg-[#1c2e17] border border-white/5 overflow-hidden shadow-lg">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#24381e]/30">
                      <div className="flex items-center gap-3">
                        <div className="bg-yellow-500/20 p-2 rounded-lg">
                          <AlertTriangle className="text-yellow-500" size={24} />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold">Konfliktlərin Həlli</h2>
                          <p className="text-gray-400 text-sm">
                            {conflicts.length} dublikat qeyd aşkarlandı. Zəhmət olmasa seçim edin.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#24381e] text-xs text-gray-400 border border-white/5">
                          Fayl: {selectedFile?.name || 'fields_backup_v2.json'}
                        </span>
                      </div>
                    </div>

                    {/* Conflict Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-[#24381e]/50 border-b border-white/5 text-xs uppercase text-gray-400">
                            <th className="px-6 py-4 font-semibold">Sahə Adı / ID</th>
                            <th className="px-6 py-4 font-semibold">Mövcud Dəyər (Sistem)</th>
                            <th className="px-6 py-4 font-semibold">Yeni Dəyər (Fayl)</th>
                            <th className="px-6 py-4 font-semibold text-center">Hərəkət</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {conflicts.map((conflict) => (
                            <tr key={conflict.id} className="group hover:bg-[#24381e]/30 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="font-medium">{conflict.field}</span>
                                  <span className="text-gray-400 text-xs">{conflict.fieldId}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                  <span className="text-gray-400 text-xs">{conflict.label}:</span>
                                  <span className="bg-[#24381e] px-2 py-1 rounded w-fit border border-white/5">
                                    {conflict.currentValue}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                  <span className="text-gray-400 text-xs">{conflict.label}:</span>
                                  <span className="text-[#46ec13] bg-[#46ec13]/10 border border-[#46ec13]/20 px-2 py-1 rounded w-fit">
                                    {conflict.newValue}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex justify-center gap-2">
                                  <button 
                                    onClick={() => handleConflictResolution(conflict.id, 'keep')}
                                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                                      conflictResolutions[conflict.id] === 'keep'
                                        ? 'bg-[#24381e] text-white border border-[#46ec13]/50'
                                        : 'bg-[#24381e] text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                                    }`}
                                  >
                                    Saxla
                                  </button>
                                  <button 
                                    onClick={() => handleConflictResolution(conflict.id, 'update')}
                                    className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                                      conflictResolutions[conflict.id] === 'update' || !conflictResolutions[conflict.id]
                                        ? 'bg-[#46ec13] text-black hover:bg-[#36b80f] shadow-lg shadow-[#46ec13]/20'
                                        : 'bg-[#24381e] text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                                    }`}
                                  >
                                    Yenilə
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 bg-[#24381e]/30 border-t border-white/5 flex justify-end gap-3">
                      <button 
                        onClick={handleCancel}
                        className="px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#24381e] transition-colors"
                      >
                        Ləğv et
                      </button>
                      <button 
                        onClick={handleApplyAll}
                        className="px-4 py-2 rounded-lg bg-[#46ec13] text-black text-sm font-bold hover:bg-[#36b80f] transition-colors shadow-lg shadow-[#46ec13]/20"
                      >
                        Bütün Dəyişiklikləri Tətbiq Et
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Import History */}
            <section className="flex flex-col gap-4 pt-4">
              <h3 className="text-xl font-bold">İdxal Tarixçəsi</h3>
              <div className="rounded-2xl border border-white/5 bg-[#1c2e17] overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-400 text-xs uppercase bg-[#24381e]/50">
                      <th className="px-6 py-4 font-medium">Tarix</th>
                      <th className="px-6 py-4 font-medium">Fayl Adı</th>
                      <th className="px-6 py-4 font-medium">İstifadəçi</th>
                      <th className="px-6 py-4 font-medium">Qeydlər</th>
                      <th className="px-6 py-4 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {importHistory.map((record, idx) => {
                      const StatusIcon = statusStyles[record.status].icon;
                      return (
                        <tr key={idx} className="hover:bg-[#24381e]/30 transition-colors">
                          <td className="px-6 py-4 text-sm">{record.date}</td>
                          <td className="px-6 py-4 text-sm text-gray-400">{record.filename}</td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#24381e] border border-white/5"></div>
                              {record.user}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">{record.records}</td>
                          <td className="px-6 py-4 text-right">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${statusStyles[record.status].bg} ${statusStyles[record.status].text} ${statusStyles[record.status].border}`}>
                              <StatusIcon size={14} />
                              {record.statusLabel}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DataImportPage;

