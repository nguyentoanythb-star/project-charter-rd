import React from 'react';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw, 
  Sparkles,
  Coins
} from 'lucide-react';
import { ProjectCharterData, BudgetItemDetail } from '../types/charter';
import { STANDARD_BUDGET_CATALOGUE } from '../data/standardCriteria';
import { DEFAULT_BUDGET } from '../utils/normalizeCharter';

interface SectionBudgetProps {
  charter: ProjectCharterData;
  onChange: (updated: ProjectCharterData) => void;
}

const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);
};

export const SectionBudget: React.FC<SectionBudgetProps> = ({ charter, onChange }) => {
  const currentBudget = charter.budget || DEFAULT_BUDGET;

  const currentBudgetItems: BudgetItemDetail[] = (charter.budgetItems && charter.budgetItems.length > 0)
    ? charter.budgetItems
    : [
        {
          id: 'bi_tooling',
          key: 'tooling',
          name: '1. Chế tạo khuôn mẫu (Tooling & Molds)',
          description: 'Khuôn ép nhựa, khuôn dập nhôm/inox, khuôn đúc...',
          amount: typeof currentBudget.tooling === 'number' ? currentBudget.tooling : DEFAULT_BUDGET.tooling
        },
        {
          id: 'bi_prototype',
          key: 'prototype',
          name: '2. Mẫu thử nghiệm (Mock-up & Prototypes)',
          description: 'In 3D SLA, gia công CNC, bo mạch mẫu EVT...',
          amount: typeof currentBudget.prototype === 'number' ? currentBudget.prototype : DEFAULT_BUDGET.prototype
        },
        {
          id: 'bi_certTesting',
          key: 'certTesting',
          name: '3. Đo kiểm phòng Lab & Cấp chứng nhận',
          description: 'Phí Quatest, nhãn năng lượng, kiểm tra an toàn điện...',
          amount: typeof currentBudget.certTesting === 'number' ? currentBudget.certTesting : DEFAULT_BUDGET.certTesting
        },
        {
          id: 'bi_jigPilot',
          key: 'jigPilot',
          name: '4. Đồ gá lắp ráp & Chạy thử Pilot (Jig & Trial)',
          description: 'Đồ gá cân bằng chuyền, vật tư tiêu hao đợt PVT...',
          amount: typeof currentBudget.jigPilot === 'number' ? currentBudget.jigPilot : DEFAULT_BUDGET.jigPilot
        }
      ];

  const directCost = currentBudgetItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  const contingencyRate = currentBudget.contingencyRate !== undefined ? currentBudget.contingencyRate : 0.10;
  const contingencyAmount = Math.round(directCost * contingencyRate);
  const grandTotal = directCost + contingencyAmount;

  const updateBudgetItem = (index: number, updated: Partial<BudgetItemDetail>) => {
    const newItems = [...currentBudgetItems];
    newItems[index] = { ...newItems[index], ...updated };

    const toolingVal = newItems.find(b => b.key === 'tooling')?.amount ?? currentBudget.tooling;
    const protoVal = newItems.find(b => b.key === 'prototype')?.amount ?? currentBudget.prototype;
    const certVal = newItems.find(b => b.key === 'certTesting')?.amount ?? currentBudget.certTesting;
    const jigVal = newItems.find(b => b.key === 'jigPilot')?.amount ?? currentBudget.jigPilot;

    onChange({
      ...charter,
      budgetItems: newItems,
      budget: {
        ...currentBudget,
        tooling: toolingVal,
        prototype: protoVal,
        certTesting: certVal,
        jigPilot: jigVal
      }
    });
  };

  const handlePresetChange = (index: number, selectedKey: string) => {
    const std = STANDARD_BUDGET_CATALOGUE.find(b => b.key === selectedKey);
    if (std) {
      updateBudgetItem(index, {
        key: std.key,
        name: std.name,
        description: std.description,
        amount: currentBudgetItems[index].amount || std.defaultAmount
      });
    }
  };

  const addBudgetItem = (presetKey?: string) => {
    let newItem: BudgetItemDetail;
    const std = STANDARD_BUDGET_CATALOGUE.find(b => b.key === presetKey);
    if (std) {
      newItem = {
        id: `bi_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        key: std.key,
        name: `${currentBudgetItems.length + 1}. ${std.name.replace(/^\d+\.\s*/, '')}`,
        description: std.description,
        amount: std.defaultAmount
      };
    } else {
      newItem = {
        id: `bi_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        key: 'custom',
        name: `${currentBudgetItems.length + 1}. Chi phí R&D bổ sung`,
        description: 'Mô tả chi tiết mục đích sử dụng ngân sách...',
        amount: 30000000
      };
    }

    const newItems = [...currentBudgetItems, newItem];
    onChange({
      ...charter,
      budgetItems: newItems
    });
  };

  const removeBudgetItem = (index: number) => {
    if (currentBudgetItems.length <= 1) return;
    const newItems = currentBudgetItems.filter((_, i) => i !== index);
    onChange({
      ...charter,
      budgetItems: newItems
    });
  };

  const moveBudgetItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === currentBudgetItems.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newItems = [...currentBudgetItems];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    onChange({
      ...charter,
      budgetItems: newItems
    });
  };

  const resetDefaultBudget = () => {
    const defaultList: BudgetItemDetail[] = STANDARD_BUDGET_CATALOGUE.slice(0, 4).map(std => ({
      id: `bi_${std.key}`,
      key: std.key,
      name: std.name,
      description: std.description,
      amount: std.defaultAmount
    }));

    onChange({
      ...charter,
      budgetItems: defaultList,
      budget: {
        ...currentBudget,
        tooling: defaultList[0].amount,
        prototype: defaultList[1].amount,
        certTesting: defaultList[2].amount,
        jigPilot: defaultList[3].amount,
        contingencyRate: 0.10
      }
    });
  };

  const updateContingencyRate = (rate: number) => {
    onChange({
      ...charter,
      budget: {
        ...currentBudget,
        contingencyRate: rate
      }
    });
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-xs border border-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-rose-600" />
              VI. Dự Toán Ngân Sách Đầu Tư R&D (Pre-Approved Budget & Formula)
            </h3>
            <p className="text-[11px] text-slate-400">
              Tùy biến hạng mục đầu tư & tự động tính tổng ngân sách trực tiếp và quỹ dự phòng rủi ro kỹ thuật
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Quick Add Dropdown */}
          <div className="relative inline-block">
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  addBudgetItem(e.target.value);
                  e.target.value = '';
                }
              }}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded cursor-pointer transition shadow-2xs"
              title="Thêm hạng mục chi phí chuẩn ngành R&D"
            >
              <option value="" disabled>📋 Thêm từ Danh Mục Chi Phí...</option>
              {STANDARD_BUDGET_CATALOGUE.map(item => (
                <option key={item.key} value={item.key}>
                  + {item.name.replace(/^\d+\.\s*/, '')}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => addBudgetItem()}
            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer shadow-2xs"
            title="Thêm hạng mục ngân sách tùy chỉnh mới"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Thêm Hạng Mục</span>
          </button>

          <button
            type="button"
            onClick={resetDefaultBudget}
            className="px-2 py-1 text-slate-500 hover:text-slate-800 rounded bg-slate-100 hover:bg-slate-200 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
            title="Khôi phục 4 hạng mục ngân sách mặc định"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Khôi phục</span>
          </button>

          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
            Section 06 ({currentBudgetItems.length})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Table */}
        <div className="lg:col-span-2 space-y-3">
          <div className="grid grid-cols-12 gap-3 items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
            <span className="col-span-6">HẠNG MỤC ĐẦU TƯ R&D</span>
            <span className="col-span-4 text-right">DỰ TOÁN (VNĐ)</span>
            <span className="col-span-2 text-center">TỶ TRỌNG</span>
          </div>

          {currentBudgetItems.map((item, index) => {
            const itemRatio = grandTotal > 0 ? ((item.amount / grandTotal) * 100).toFixed(1) + '%' : '0%';
            return (
              <div 
                key={item.id || index}
                className="grid grid-cols-12 gap-3 items-center p-3 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-50 transition"
              >
                {/* Item Details */}
                <div className="col-span-6 space-y-1">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateBudgetItem(index, { name: e.target.value })}
                      placeholder="Tên hạng mục..."
                      className="text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded px-2 py-1 w-full focus:border-blue-500 focus:outline-none"
                    />
                    
                    {/* Quick Preset Picker */}
                    <select
                      value={item.key || 'custom'}
                      onChange={(e) => handlePresetChange(index, e.target.value)}
                      className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium border border-slate-300 rounded px-1.5 py-1 cursor-pointer max-w-[90px] shrink-0 truncate"
                      title="Đổi tên hạng mục theo danh mục mẫu"
                    >
                      <option value="custom">Đổi mẫu...</option>
                      {STANDARD_BUDGET_CATALOGUE.map(std => (
                        <option key={std.key} value={std.key}>{std.name.split('(')[0]}</option>
                      ))}
                    </select>
                  </div>

                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateBudgetItem(index, { description: e.target.value })}
                    placeholder="Mô tả phụ tùng, phạm vi kiểm thử..."
                    className="text-[11px] text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:outline-none px-1 py-0.5 rounded w-full"
                  />
                </div>

                {/* Amount Input */}
                <div className="col-span-4">
                  <input
                    type="number"
                    step="1000000"
                    value={item.amount}
                    onChange={(e) => updateBudgetItem(index, { amount: parseFloat(e.target.value) || 0 })}
                    className="w-full text-right font-bold text-xs rounded border border-slate-300 p-2 bg-white focus:border-blue-500 focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-400 text-right mt-0.5 font-mono">
                    {formatVND(item.amount)}
                  </div>
                </div>

                {/* Ratio & Controls */}
                <div className="col-span-2 flex flex-col items-center justify-center gap-1">
                  <span className="font-bold text-xs text-slate-700 font-mono">{itemRatio}</span>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveBudgetItem(index, 'up')}
                      disabled={index === 0}
                      className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                      title="Di chuyển lên"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBudgetItem(index, 'down')}
                      disabled={index === currentBudgetItems.length - 1}
                      className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                      title="Di chuyển xuống"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBudgetItem(index)}
                      disabled={currentBudgetItems.length <= 1}
                      className="p-0.5 text-slate-400 hover:text-rose-600 disabled:opacity-20 transition cursor-pointer"
                      title="Xóa hạng mục này"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Contingency Row */}
          <div className="grid grid-cols-12 gap-3 items-center p-3 rounded-lg border border-amber-300 bg-amber-50/70">
            <div className="col-span-6">
              <p className="text-xs font-bold text-amber-950">
                {currentBudgetItems.length + 1}. Dự phòng rủi ro kỹ thuật (Contingency Fund)
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-amber-800">Tỷ lệ trích lập:</span>
                <select
                  aria-label="Tỷ lệ trích lập quỹ dự phòng rủi ro kỹ thuật"
                  value={contingencyRate}
                  onChange={(e) => updateContingencyRate(parseFloat(e.target.value))}
                  className="text-xs font-bold rounded border border-amber-400 bg-white px-2 py-1 text-amber-900 cursor-pointer focus:outline-none"
                >
                  <option value={0.05}>5% (Dự án cải tiến nhỏ)</option>
                  <option value={0.10}>10% (Khuyến nghị R&D)</option>
                  <option value={0.15}>15% (Dòng sản phẩm mới hoàn toàn)</option>
                  <option value={0.20}>20% (Công nghệ đột phá)</option>
                </select>
              </div>
            </div>
            <div className="col-span-4 text-right font-bold text-xs text-amber-950">
              {formatVND(contingencyAmount)}
            </div>
            <div className="col-span-2 text-center font-bold text-xs text-amber-900 font-mono">
              {grandTotal > 0 ? ((contingencyAmount / grandTotal) * 100).toFixed(1) + '%' : '0%'}
            </div>
          </div>
        </div>

        {/* Total Summary Card */}
        <div className="p-6 rounded-lg bg-slate-900 text-white flex flex-col justify-between shadow-xs border border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              TỔNG NGÂN SÁCH ĐẦU TƯ R&D
            </span>
            <div className="text-2xl font-bold text-emerald-400 mt-2 tracking-tight">
              {formatVND(grandTotal)}
            </div>
            
            {/* Geometric Progress Bar */}
            <div className="w-full bg-slate-800 h-1.5 mt-3 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[85%] rounded-full"></div>
            </div>
            
            <p className="text-[11px] text-slate-400 mt-2">
              Bao gồm thuế phí và {(contingencyRate * 100).toFixed(0)}% quỹ phòng ngừa rủi ro khuôn mẫu.
            </p>

            <div className="mt-5 pt-4 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Chi phí R&D trực tiếp ({currentBudgetItems.length} mục):</span>
                <strong className="font-semibold text-white">{formatVND(directCost)}</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Quỹ dự phòng phát sinh:</span>
                <strong className="font-semibold text-amber-400">{formatVND(contingencyAmount)}</strong>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded border border-slate-700/80 mt-5 text-[11px] text-slate-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <span>
              File Excel xuất ra lưu nguyên vẹn <strong>Hàm SUM</strong> và <strong>Công thức Contingency</strong>.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
