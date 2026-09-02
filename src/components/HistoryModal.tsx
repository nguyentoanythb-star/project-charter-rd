import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Search, 
  FolderOpen, 
  Trash2, 
  FileSpreadsheet, 
  Copy,
  Calendar,
  User,
  Tag,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ProjectCharterData } from '../types/charter';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedCharters: ProjectCharterData[];
  onLoadCharter: (charter: ProjectCharterData) => void;
  onDeleteCharter: (id: string) => void;
  onClearAll: () => void;
  onExportDirect: (charter: ProjectCharterData) => void;
  onDuplicate: (charter: ProjectCharterData) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  savedCharters,
  onLoadCharter,
  onDeleteCharter,
  onClearAll,
  onExportDirect,
  onDuplicate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isConfirmingClearAll, setIsConfirmingClearAll] = useState<boolean>(false);

  if (!isOpen) return null;

  const filteredCharters = savedCharters.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.pm && c.pm.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl border border-slate-200 flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">Lịch Sử Điều Lệ Dự Án Đã Lưu</h3>
              <p className="text-[11px] text-slate-500">Quản lý các phiên bản điều lệ và xuất file dữ liệu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên dự án, mã số (code) hoặc PM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div>
            <select
              aria-label="Lọc theo ngành hàng"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white text-slate-700 font-medium"
            >
              <option value="all">Tất cả ngành hàng</option>
              <option value="Quạt làm mát">Quạt làm mát</option>
              <option value="Nồi cơm điện">Nồi cơm điện</option>
              <option value="Ấm siêu tốc">Ấm siêu tốc</option>
              <option value="Điều hòa không khí">Điều hòa không khí</option>
              <option value="Tủ lạnh / Tủ đông">Tủ lạnh / Tủ đông</option>
              <option value="Bếp điện / Bếp từ">Bếp điện / Bếp từ</option>
              <option value="Máy lọc không khí">Máy lọc không khí</option>
            </select>
          </div>
        </div>

        {/* List Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-3">
          {filteredCharters.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <FolderOpen className="w-12 h-12 mx-auto text-slate-300 mb-3 stroke-[1.5]" />
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Không tìm thấy bản ghi điều lệ nào</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Hãy tạo và nhấn nút &quot;Lưu Dự Án&quot; trên thanh công cụ để lưu trữ lâu dài trong hệ thống.
              </p>
            </div>
          ) : (
            filteredCharters.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded border border-slate-200 bg-white hover:border-slate-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group shadow-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 font-mono">
                      <Tag className="w-2.5 h-2.5" />
                      {item.category}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {item.code}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      v{item.version || '1.0'}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs tracking-tight truncate group-hover:text-blue-600 transition">
                    {item.name}
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      PM: <strong className="text-slate-700 font-medium">{item.pm || 'N/A'}</strong>
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {item.savedAt}
                    </span>
                    <span className="text-slate-600 font-semibold font-mono">
                      BOM: {item.bomTarget || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    onClick={() => {
                      onLoadCharter(item);
                      onClose();
                    }}
                    title="Mở vào trình soạn thảo"
                    className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Mở</span>
                  </button>

                  <button
                    onClick={() => onExportDirect(item)}
                    title="Xuất file Excel trực tiếp"
                    className="px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 transition shadow-xs"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Excel</span>
                  </button>

                  <button
                    onClick={() => onDuplicate(item)}
                    title="Nhân bản làm phiên bản mới"
                    className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteCharter(item.id)}
                    title="Xóa bản ghi"
                    className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {isConfirmingClearAll ? (
            <div className="flex items-center gap-2 animate-in fade-in duration-150">
              <span className="text-xs text-rose-700 font-bold">
                Xác nhận xóa sạch {savedCharters.length} dự án?
              </span>
              <button
                onClick={() => {
                  onClearAll();
                  setIsConfirmingClearAll(false);
                }}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded shadow-xs transition"
              >
                Đồng ý xóa hết
              </button>
              <button
                onClick={() => setIsConfirmingClearAll(false)}
                className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded transition"
              >
                Hủy
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsConfirmingClearAll(true)}
              disabled={savedCharters.length === 0}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 disabled:opacity-40 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa toàn bộ lịch sử</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
