import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CharterForm } from './components/CharterForm';
import { CharterPreview } from './components/CharterPreview';
import { StageGateDashboard } from './components/StageGateDashboard';
import { HistoryModal } from './components/HistoryModal';
import { TeamRosterModal, getStoredTeamRoster, applyRosterDataToCharter } from './components/TeamRosterModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { ToastContainer, ToastData } from './components/Toast';
import { ProjectCharterData } from './types/charter';
import { PRESET_CHARTERS } from './data/presets';
import { exportCharterToExcel } from './utils/excelExporter';
import { normalizeCharter } from './utils/normalizeCharter';
import { hasApiKey } from './utils/geminiClient';
import { 
  Cpu, 
  FolderPlus, 
  Layers, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  X,
  Users,
  Zap,
  Key
} from 'lucide-react';

const STORAGE_KEY = 'rnd_appliance_charters_history_v1';

export default function App() {
  const [activeCharter, setActiveCharter] = useState<ProjectCharterData>(() => normalizeCharter(PRESET_CHARTERS.fan));
  const [savedCharters, setSavedCharters] = useState<ProjectCharterData[]>([]);
  const [viewMode, setViewMode] = useState<'form' | 'preview' | 'dashboard'>('form');
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isRosterOpen, setIsRosterOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [keyConfigured, setKeyConfigured] = useState<boolean>(() => hasApiKey());
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');

  // Load saved charters from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map(c => normalizeCharter(c));
          setSavedCharters(normalized);
          return;
        }
      }
      // Initialize with preset samples if empty
      const initialPresets = [
        normalizeCharter(PRESET_CHARTERS.fan),
        normalizeCharter(PRESET_CHARTERS.cooker),
        normalizeCharter(PRESET_CHARTERS.kettle),
        normalizeCharter(PRESET_CHARTERS.aircon),
        normalizeCharter(PRESET_CHARTERS.fridge)
      ];
      setSavedCharters(initialPresets);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPresets));
    } catch (e) {
      console.error('Error loading history from localStorage', e);
    }
  }, []);

  // Save to localStorage whenever savedCharters changes
  const updateSavedChartersState = (newList: ProjectCharterData[]) => {
    setSavedCharters(newList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSelectPreset = (presetKey: string) => {
    const preset = PRESET_CHARTERS[presetKey];
    if (preset) {
      setActiveCharter(normalizeCharter({ ...preset, id: `charter_${Date.now()}` }));
      addToast(`Đã tải mẫu dự án: ${preset.name}`, 'info');
      setLastSavedTime(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));
    }
  };

  const handleSaveCharter = () => {
    if (!activeCharter.name.trim()) {
      addToast('Vui lòng nhập Tên Dự Án trước khi lưu!', 'error');
      return;
    }

    const currentTimestamp = new Date().toLocaleString('vi-VN');
    const existingIndex = savedCharters.findIndex((c) => c.id === activeCharter.id);

    let updatedList: ProjectCharterData[];
    if (existingIndex >= 0) {
      // Update existing
      updatedList = [...savedCharters];
      updatedList[existingIndex] = normalizeCharter({
        ...activeCharter,
        savedAt: currentTimestamp
      });
      addToast(`Đã cập nhật dự án "${activeCharter.name}" trong lịch sử!`, 'success');
    } else {
      // Create new entry
      const newEntry: ProjectCharterData = normalizeCharter({
        ...activeCharter,
        id: `prj_${Date.now()}`,
        savedAt: currentTimestamp
      });
      updatedList = [newEntry, ...savedCharters];
      setActiveCharter(newEntry);
      addToast(`Đã lưu "${activeCharter.name}" vào lịch sử dự án!`, 'success');
    }

    setLastSavedTime(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));
    updateSavedChartersState(updatedList);
  };

  const handleLoadCharter = (charter: ProjectCharterData) => {
    setActiveCharter(normalizeCharter(charter));
    addToast(`Đã mở dự án: ${charter.name}`, 'info');
    setLastSavedTime(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));
  };

  const handleDeleteCharter = (id: string) => {
    const updated = savedCharters.filter((c) => c.id !== id);
    updateSavedChartersState(updated);
    addToast('Đã xóa bản ghi dự án khỏi lịch sử', 'info');
  };

  const handleClearAllHistory = () => {
    updateSavedChartersState([]);
    addToast('Đã xóa toàn bộ lịch sử dự án', 'info');
  };

  const handleQuickAutoFillRoster = () => {
    const roster = getStoredTeamRoster();
    const updated = applyRosterDataToCharter(roster, activeCharter, true);
    setActiveCharter(normalizeCharter(updated));
    addToast('Đã tự động điền danh bạ nhân sự & chức danh cố định vào Form!', 'success');
  };

  const handleDuplicateCharter = (charter: ProjectCharterData) => {
    const duplicate: ProjectCharterData = normalizeCharter({
      ...charter,
      id: `prj_dup_${Date.now()}`,
      name: `${charter.name} (Bản sao)`,
      code: `${charter.code}-REV2`,
      savedAt: new Date().toLocaleString('vi-VN')
    });
    const updated = [duplicate, ...savedCharters];
    updateSavedChartersState(updated);
    addToast(`Đã nhân bản: ${duplicate.name}`, 'success');
  };

  const handleExportExcel = async (charterToExport = activeCharter) => {
    try {
      setIsExporting(true);
      addToast('Đang kết xuất file Excel định dạng cao cấp & công thức động...', 'info');
      await exportCharterToExcel(charterToExport);
      addToast('Xuất file Excel thành công! Công thức & kiểu dáng được bảo toàn.', 'success');
    } catch (error) {
      console.error('Export Excel failed', error);
      addToast('Có lỗi xảy ra trong quá trình xuất Excel.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    if (viewMode !== 'preview') {
      setViewMode('preview');
      addToast('Đã chuyển sang Bản In Điều Lệ (A4) để sẵn sàng xuất PDF...', 'info');
    }
    
    setTimeout(() => {
      try {
        window.focus();
        window.print();
      } catch (err) {
        console.error('Print failed:', err);
        addToast('Không thể kích hoạt hộp thoại in. Vui lòng thử lại hoặc mở trong tab mới.', 'error');
      }
    }, 250);
  };

  const getStatusDotColor = (index: number) => {
    if (index === 0) return 'bg-emerald-400';
    if (index === 1) return 'bg-amber-400';
    if (index === 2) return 'bg-blue-400';
    return 'bg-slate-500';
  };

  return (
    <div className="flex h-screen w-full bg-[#f1f5f9] text-[#0f172a] font-sans overflow-hidden">
      
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Geometric Balance Aside Navigation */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#1e293b] text-white flex flex-col shrink-0 transition-transform duration-200 ease-in-out border-r border-slate-700/80 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-700/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center font-bold text-xs italic text-white shadow-xs">
                R&D
              </div>
              <h1 className="text-base font-bold tracking-tight text-white">CHARTER PRO</h1>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Home Appliances Division
            </p>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Nav List */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-4">
          
          {/* Quick Presets / Recent Charters */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Recent Charters
              </p>
              <button 
                onClick={() => setIsHistoryOpen(true)}
                className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                Tất cả ({savedCharters.length})
              </button>
            </div>

            <div className="space-y-1">
              {savedCharters.slice(0, 5).map((item, idx) => {
                const isActive = item.id === activeCharter.id || item.code === activeCharter.code;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      handleLoadCharter(item);
                      setIsSidebarOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-slate-800 text-white border-l-2 border-blue-400'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusDotColor(idx)}`} />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium truncate">{item.name}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider truncate font-mono">
                        {item.code} • {item.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Team Roster shortcut */}
          <div className="pt-2 border-t border-slate-700/60">
            <button
              onClick={() => {
                setIsRosterOpen(true);
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-slate-800/80 hover:bg-slate-800 text-blue-300 hover:text-white transition text-xs font-semibold border border-slate-700 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>Danh Bạ Nhân Sự</span>
              </div>
              <span className="text-[9px] bg-blue-900/60 text-blue-200 px-1.5 py-0.5 rounded font-mono">Cố định</span>
            </button>
          </div>

          {/* Quick Preset Library */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase px-3 mb-2 tracking-wider">
              Mẫu Ngành Hàng
            </p>
            <div className="space-y-1">
              <button
                onClick={() => handleSelectPreset('fan')}
                className="w-full text-left flex items-center justify-between px-3 py-1.5 rounded hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition"
              >
                <span>🌀 Quạt Đứng DC</span>
                <span className="text-[10px] text-slate-500 font-mono">Inverter</span>
              </button>
              <button
                onClick={() => handleSelectPreset('cooker')}
                className="w-full text-left flex items-center justify-between px-3 py-1.5 rounded hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition"
              >
                <span>🍚 Nồi Cơm Cao Tần</span>
                <span className="text-[10px] text-slate-500 font-mono">IH Niêu</span>
              </button>
              <button
                onClick={() => handleSelectPreset('kettle')}
                className="w-full text-left flex items-center justify-between px-3 py-1.5 rounded hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition"
              >
                <span>🫖 Ấm Siêu Tốc</span>
                <span className="text-[10px] text-slate-500 font-mono">Inox 316</span>
              </button>
              <button
                onClick={() => handleSelectPreset('aircon')}
                className="w-full text-left flex items-center justify-between px-3 py-1.5 rounded hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition"
              >
                <span>❄️ Điều Hòa PM2.5</span>
                <span className="text-[10px] text-slate-500 font-mono">Eco DC</span>
              </button>
              <button
                onClick={() => handleSelectPreset('fridge')}
                className="w-full text-left flex items-center justify-between px-3 py-1.5 rounded hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition"
              >
                <span>🧊 Tủ Lạnh 4 Cánh</span>
                <span className="text-[10px] text-slate-500 font-mono">MultiDoor</span>
              </button>
            </div>
          </div>

          {/* AI Tools & API Key Setting in Sidebar */}
          <div className="pt-2 border-t border-slate-700/60 space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
              AI & Cấu Hình
            </p>

            <button
              onClick={() => {
                setIsAiAssistantOpen(true);
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-700/50 rounded-md text-xs font-semibold text-indigo-200 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Co-pilot Studio</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 font-mono">Gemini</span>
            </button>

            <button
              onClick={() => {
                setIsApiKeyModalOpen(true);
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/80 hover:bg-slate-800 rounded-md text-xs font-medium text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
            >
              <div className="flex items-center gap-2">
                <Key className={`w-3.5 h-3.5 ${keyConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span>Cài Đặt API Key</span>
              </div>
              <span className={`w-2 h-2 rounded-full ${keyConfigured ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
            </button>
          </div>

        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-4 bg-slate-900 border-t border-slate-700/80">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-xs">
              {activeCharter.pm ? activeCharter.pm.slice(0, 2).toUpperCase() : 'PM'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-white truncate">
                {activeCharter.pm || 'Nguyen Hoang'}
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                Lead R&D Manager • {activeCharter.sponsor || 'Executive BOD'}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Layout */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Workspace Header */}
        <Header
          currentCategory={activeCharter.category}
          onSelectPreset={handleSelectPreset}
          onSave={handleSaveCharter}
          onExportExcel={() => handleExportExcel(activeCharter)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenRoster={() => setIsRosterOpen(true)}
          historyCount={savedCharters.length}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onPrint={handlePrint}
          isExporting={isExporting}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          hasApiKey={keyConfigured}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        />

        {/* Scrollable Workspace Container */}
        <section className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {viewMode === 'form' && (
              <CharterForm
                charter={activeCharter}
                onChange={setActiveCharter}
                onSave={handleSaveCharter}
                onExportExcel={() => handleExportExcel(activeCharter)}
                onOpenRoster={() => setIsRosterOpen(true)}
                onQuickAutoFillRoster={handleQuickAutoFillRoster}
                onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
              />
            )}

            {viewMode === 'preview' && (
              <CharterPreview 
                charter={activeCharter} 
                onPrint={handlePrint}
                onExportExcel={() => handleExportExcel(activeCharter)}
                onEditForm={() => setViewMode('form')}
              />
            )}

            {viewMode === 'dashboard' && (
              <StageGateDashboard charter={activeCharter} />
            )}
          </div>
        </section>

        {/* Geometric Balance Workspace Footer */}
        <footer className="h-8 bg-slate-50 border-t border-slate-200 px-6 sm:px-8 flex items-center justify-between shrink-0 text-[10px] text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <span>Version 2.4.0 (Build 2026.RND)</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline font-mono text-slate-500 font-bold">{activeCharter.code}</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition cursor-pointer"
            >
              <Key className="w-3 h-3" />
              <span>Google Gemini API: {keyConfigured ? 'Đã cài đặt' : 'Chưa cấu hình'}</span>
            </button>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-slate-600 font-semibold uppercase tracking-wider text-[9px]">
                Hardware Engine Active
              </span>
            </div>
            <div className="hidden sm:block text-slate-400">
              Đồng bộ lúc: {lastSavedTime}
            </div>
          </div>
        </footer>

      </main>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedCharters={savedCharters}
        onLoadCharter={handleLoadCharter}
        onDeleteCharter={handleDeleteCharter}
        onClearAll={handleClearAllHistory}
        onExportDirect={(c) => handleExportExcel(c)}
        onDuplicate={handleDuplicateCharter}
      />

      {/* Team Roster Modal (Persistent names, titles, positions with STT) */}
      <TeamRosterModal
        isOpen={isRosterOpen}
        onClose={() => setIsRosterOpen(false)}
        charter={activeCharter}
        currentCharter={activeCharter}
        onApplyRosterToCharter={(updated) => {
          setActiveCharter(normalizeCharter(updated));
          addToast('Đã áp dụng danh bạ nhân sự vào dự án hiện tại!', 'success');
        }}
        onSaveToast={(msg, type) => addToast(msg, type)}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={(hasKey) => {
          setKeyConfigured(hasKey);
          addToast(hasKey ? 'Đã lưu Google Gemini API Key vào trình duyệt!' : 'Đã xóa API Key khỏi trình duyệt!', 'info');
        }}
      />

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        currentCharter={activeCharter}
        onApplyDraft={(draft) => {
          const merged = normalizeCharter({
            ...activeCharter,
            ...draft,
            risks: draft.risks && draft.risks.length > 0 ? draft.risks : activeCharter.risks
          });
          setActiveCharter(merged);
          addToast('Đã áp dụng dự thảo AI vào Điều Lệ Dự Án thành công!', 'success');
        }}
        onOpenApiKeyModal={() => {
          setIsAiAssistantOpen(false);
          setIsApiKeyModalOpen(true);
        }}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

    </div>
  );
}

