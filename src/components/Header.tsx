import React from 'react';
import { 
  FileSpreadsheet, 
  Save, 
  Eye, 
  PenTool, 
  Layers,
  Menu
} from 'lucide-react';
import { ApplianceCategory } from '../types/charter';

interface HeaderProps {
  currentCategory: ApplianceCategory;
  onSelectPreset?: (key: string) => void;
  onSave: () => void;
  onExportExcel: () => void;
  onOpenHistory?: () => void;
  onOpenRoster?: () => void;
  historyCount?: number;
  viewMode: 'form' | 'preview' | 'dashboard';
  setViewMode: (mode: 'form' | 'preview' | 'dashboard') => void;
  onPrint?: () => void;
  isExporting: boolean;
  onToggleSidebar?: () => void;
  hasApiKey?: boolean;
  onOpenApiKeyModal?: () => void;
  onOpenAiAssistant?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSave,
  onExportExcel,
  viewMode,
  setViewMode,
  isExporting,
  onToggleSidebar
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-300 flex items-center justify-between px-4 sm:px-6 shrink-0 no-print z-20 shadow-xs">
      {/* Left section: Sidebar toggle & Workspace title */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition cursor-pointer"
            title="Mở menu & danh mục"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider whitespace-nowrap">
            Project Charter Studio
          </h2>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            {currentCategory}
          </span>
        </div>
      </div>

      {/* Center/Tabs for Switch Mode (High Contrast Modern Segmented Control) */}
      <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-300 gap-1">
        <button
          onClick={() => setViewMode('form')}
          className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            viewMode === 'form'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/80'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Biểu Mẫu Nhập</span>
          <span className="sm:hidden">Biểu Mẫu</span>
        </button>

        <button
          onClick={() => setViewMode('preview')}
          className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            viewMode === 'preview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/80'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Bản In A4</span>
          <span className="sm:hidden">Bản A4</span>
        </button>

        <button
          onClick={() => setViewMode('dashboard')}
          className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            viewMode === 'dashboard'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/80'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Stage-Gate Matrix</span>
          <span className="sm:hidden">Stage-Gate</span>
        </button>
      </div>

      {/* Right section: Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Export Excel Button */}
        <button
          onClick={onExportExcel}
          disabled={isExporting}
          title="Xuất file Excel chuẩn công thức động (.xlsx)"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 shadow-xs transition-colors active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>{isExporting ? 'Đang xuất...' : 'Xuất Excel'}</span>
        </button>

        {/* Save button */}
        <button
          onClick={onSave}
          title="Lưu lại dự án vào lịch sử"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 shadow-xs transition-colors active:scale-98 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Lưu Dự Án</span>
        </button>
      </div>
    </header>
  );
};

