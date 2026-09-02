import React from 'react';
import { 
  FileSpreadsheet, 
  Save, 
  Clock, 
  Eye, 
  PenTool, 
  Sparkles,
  Layers,
  Menu,
  Users,
  Key
} from 'lucide-react';
import { ApplianceCategory } from '../types/charter';

interface HeaderProps {
  currentCategory: ApplianceCategory;
  onSelectPreset: (key: string) => void;
  onSave: () => void;
  onExportExcel: () => void;
  onOpenHistory: () => void;
  onOpenRoster: () => void;
  historyCount: number;
  viewMode: 'form' | 'preview' | 'dashboard';
  setViewMode: (mode: 'form' | 'preview' | 'dashboard') => void;
  onPrint?: () => void;
  isExporting: boolean;
  onToggleSidebar?: () => void;
  hasApiKey?: boolean;
  onOpenApiKeyModal: () => void;
  onOpenAiAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectPreset,
  onSave,
  onExportExcel,
  onOpenHistory,
  onOpenRoster,
  historyCount,
  viewMode,
  setViewMode,
  isExporting,
  onToggleSidebar,
  hasApiKey = false,
  onOpenApiKeyModal,
  onOpenAiAssistant
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-300 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 no-print z-20 shadow-xs">
      {/* Left section: Breadcrumb / Workspace title */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider whitespace-nowrap">
            Project Charter Studio
          </h2>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-2xs uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            {viewMode === 'form' ? 'Biểu Mẫu Nhập' : viewMode === 'preview' ? 'Bản In A4' : 'Stage-Gate'}
          </span>
          <span className="hidden md:inline-block text-[11px] text-slate-600 font-semibold">
            • {currentCategory}
          </span>
        </div>
      </div>

      {/* Center/Tabs for Switch Mode (High Contrast Modern Segmented Control) */}
      <div className="hidden md:flex items-center bg-slate-200/80 p-1 rounded-lg border border-slate-300 gap-1">
        <button
          onClick={() => setViewMode('form')}
          className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            viewMode === 'form'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Biểu Mẫu</span>
        </button>

        <button
          onClick={() => setViewMode('preview')}
          className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            viewMode === 'preview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Bản In Charter (A4)</span>
        </button>

        <button
          onClick={() => setViewMode('dashboard')}
          className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            viewMode === 'dashboard'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Stage-Gate Matrix</span>
        </button>
      </div>

      {/* Right section: Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        
        {/* Template Selector dropdown */}
        <div className="relative hidden xl:inline-block">
          <select
            aria-label="Chọn mẫu dự án gia dụng"
            onChange={(e) => {
              if (e.target.value) {
                onSelectPreset(e.target.value);
                e.target.value = '';
              }
            }}
            className="bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded px-2.5 py-1.5 border border-slate-300 focus:outline-none focus:border-blue-600 cursor-pointer transition appearance-none pr-7 shadow-2xs"
            defaultValue=""
          >
            <option value="" disabled>📂 Mẫu R&D Thiết Bị...</option>
            <option value="fan">🌀 Quạt Đứng Inverter DC</option>
            <option value="cooker">🍚 Nồi Cơm Cao Tần IH</option>
            <option value="kettle">🫖 Ấm Siêu Tốc Inox 316</option>
            <option value="aircon">❄️ Điều Hòa Không Khí PM2.5</option>
            <option value="fridge">🧊 Tủ Lạnh 4 Cánh Multi-Door</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
        </div>

        {/* API Key Management Button */}
        <button
          onClick={onOpenApiKeyModal}
          title={hasApiKey ? "Quản lý Google Gemini API Key (Đã kích hoạt)" : "Nhập Google Gemini API Key để dùng AI Co-pilot"}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-bold transition-colors shadow-2xs cursor-pointer border ${
            hasApiKey 
              ? 'bg-slate-50 border-emerald-300 text-slate-800 hover:bg-emerald-50' 
              : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
          }`}
        >
          <Key className={`w-3.5 h-3.5 ${hasApiKey ? 'text-emerald-600' : 'text-amber-600'}`} />
          <span className="hidden sm:inline">API Key</span>
          <span className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
        </button>

        {/* AI Co-pilot Assistant button */}
        <button
          onClick={onOpenAiAssistant}
          title="Trợ lý AI Gemini: Gợi ý soạn thảo & Thẩm định rủi ro"
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded text-xs font-bold shadow-xs transition-all active:scale-98 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden md:inline">AI Co-pilot</span>
        </button>

        {/* History button */}
        <button
          onClick={onOpenHistory}
          title="Lịch sử dự án đã lưu"
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
        >
          <Clock className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden sm:inline">Lịch sử</span>
          <span className="px-1.5 py-0.2 bg-slate-200 text-slate-800 rounded text-[10px] font-mono font-bold">
            {historyCount}
          </span>
        </button>

        {/* Team Roster button */}
        <button
          onClick={onOpenRoster}
          title="Quản lý danh bạ nhân sự & tự động điền"
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 border border-blue-300 rounded text-xs font-bold text-blue-800 hover:bg-blue-100 transition-colors shadow-2xs cursor-pointer"
        >
          <Users className="w-3.5 h-3.5 text-blue-700" />
          <span className="hidden sm:inline">Danh Bạ</span>
        </button>

        {/* Export Excel Button */}
        <button
          onClick={onExportExcel}
          disabled={isExporting}
          title="Xuất file Excel chuẩn công thức động (.xlsx)"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 shadow-xs transition-colors active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isExporting ? 'Đang xuất...' : 'Excel'}</span>
        </button>

        {/* Save button */}
        <button
          onClick={onSave}
          title="Lưu lại dự án vào hệ thống"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 shadow-xs transition-colors active:scale-98 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden lg:inline">Lưu Dự Án</span>
        </button>

      </div>
    </header>
  );
};
