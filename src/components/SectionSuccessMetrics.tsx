import React from 'react';
import { 
  Target, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw, 
  Sparkles, 
  Tag,
  ChevronDown
} from 'lucide-react';
import { ProjectCharterData, SuccessMetricItem } from '../types/charter';
import { AutoResizeTextarea } from './AutoResizeTextarea';
import { STANDARD_SUCCESS_METRICS_CATALOGUE } from '../data/standardCriteria';

interface SectionSuccessMetricsProps {
  charter: ProjectCharterData;
  onChange: (updated: ProjectCharterData) => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  'Tài chính': { bg: 'bg-amber-100', text: 'text-amber-900', dot: 'bg-amber-500', border: 'border-amber-300' },
  'Tiến độ': { bg: 'bg-blue-100', text: 'text-blue-900', dot: 'bg-blue-500', border: 'border-blue-300' },
  'Chất lượng': { bg: 'bg-emerald-100', text: 'text-emerald-900', dot: 'bg-emerald-500', border: 'border-emerald-300' },
  'Trải nghiệm': { bg: 'bg-indigo-100', text: 'text-indigo-900', dot: 'bg-indigo-500', border: 'border-indigo-300' },
  'Pháp lý': { bg: 'bg-purple-100', text: 'text-purple-900', dot: 'bg-purple-500', border: 'border-purple-300' },
  'Kỹ thuật': { bg: 'bg-cyan-100', text: 'text-cyan-900', dot: 'bg-cyan-500', border: 'border-cyan-300' },
  'Môi trường': { bg: 'bg-lime-100', text: 'text-lime-900', dot: 'bg-lime-500', border: 'border-lime-300' },
  'Thị trường': { bg: 'bg-rose-100', text: 'text-rose-900', dot: 'bg-rose-500', border: 'border-rose-300' }
};

const DEFAULT_COLOR = { bg: 'bg-slate-100', text: 'text-slate-800', dot: 'bg-slate-500', border: 'border-slate-300' };

export const SectionSuccessMetrics: React.FC<SectionSuccessMetricsProps> = ({ charter, onChange }) => {
  const currentMetrics: SuccessMetricItem[] = (charter.successMetrics && charter.successMetrics.length > 0)
    ? charter.successMetrics
    : [
        {
          id: 'sm_bom',
          key: 'bom',
          title: 'Giá Thành Định Mức (Target BOM)',
          category: 'Tài chính',
          value: charter.bomTarget || STANDARD_SUCCESS_METRICS_CATALOGUE[0].defaultValue,
          description: 'Gồm linh kiện mạch, động cơ, vỏ nhựa & bao bì xuất xưởng.'
        },
        {
          id: 'sm_sop',
          key: 'sop',
          title: 'Hạn Bắt Đầu Sản Xuất Hàng Loạt (SOP)',
          category: 'Tiến độ',
          value: charter.sopDate || STANDARD_SUCCESS_METRICS_CATALOGUE[1].defaultValue,
          description: 'Thời điểm xuất xưởng mẻ thành phẩm thương mại đầu tiên.'
        },
        {
          id: 'sm_quality',
          key: 'quality',
          title: 'Chất Lượng & Tuổi Thọ (Reliability)',
          category: 'Chất lượng',
          value: charter.qualityMetric || STANDARD_SUCCESS_METRICS_CATALOGUE[2].defaultValue,
          description: 'Tiêu chuẩn kiểm thử MTBF, thả rơi thùng và sốc nhiệt.'
        },
        {
          id: 'sm_performance',
          key: 'performance',
          title: 'Hiệu Năng & Độ Ồn (Acoustics & Power)',
          category: 'Trải nghiệm',
          value: charter.performanceMetric || STANDARD_SUCCESS_METRICS_CATALOGUE[3].defaultValue,
          description: 'Đo đạc kiểm nghiệm độc lập tại buồng câm Anechoic.'
        },
        {
          id: 'sm_compliance',
          key: 'compliance',
          title: 'Chứng Nhận & Tiêu Chuẩn Pháp Lý Bắt Buộc (Compliance)',
          category: 'Pháp lý',
          value: charter.complianceMetric || STANDARD_SUCCESS_METRICS_CATALOGUE[4].defaultValue,
          description: 'Các giấy phép kiểm định Quatest để được phép lưu hành thương mại tại Việt Nam.'
        }
      ];

  const updateMetric = (index: number, updated: Partial<SuccessMetricItem>) => {
    const newMetrics = [...currentMetrics];
    newMetrics[index] = { ...newMetrics[index], ...updated };

    const bomVal = newMetrics.find(m => m.key === 'bom')?.value ?? charter.bomTarget;
    const sopVal = newMetrics.find(m => m.key === 'sop')?.value ?? charter.sopDate;
    const qualityVal = newMetrics.find(m => m.key === 'quality')?.value ?? charter.qualityMetric;
    const perfVal = newMetrics.find(m => m.key === 'performance')?.value ?? charter.performanceMetric;
    const compVal = newMetrics.find(m => m.key === 'compliance')?.value ?? charter.complianceMetric;

    onChange({
      ...charter,
      successMetrics: newMetrics,
      bomTarget: bomVal,
      sopDate: sopVal,
      qualityMetric: qualityVal,
      performanceMetric: perfVal,
      complianceMetric: compVal
    });
  };

  const handlePresetChange = (index: number, selectedKey: string) => {
    const std = STANDARD_SUCCESS_METRICS_CATALOGUE.find(m => m.key === selectedKey);
    if (std) {
      updateMetric(index, {
        key: std.key,
        title: std.title,
        category: std.category,
        value: currentMetrics[index].value || std.defaultValue,
        description: currentMetrics[index].description || std.description
      });
    }
  };

  const addMetric = (presetKey?: string) => {
    let newMetric: SuccessMetricItem;
    const std = STANDARD_SUCCESS_METRICS_CATALOGUE.find(m => m.key === presetKey);
    if (std) {
      newMetric = {
        id: `sm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        key: std.key,
        title: std.title,
        category: std.category,
        value: std.defaultValue,
        description: std.description
      };
    } else {
      newMetric = {
        id: `sm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        key: 'custom',
        title: `Tiêu Chí Định Lượng Mới #${currentMetrics.length + 1}`,
        category: 'Kỹ thuật',
        value: '',
        description: 'Phương pháp đo đạc & tiêu chuẩn nghiệm thu.'
      };
    }

    const newMetrics = [...currentMetrics, newMetric];
    onChange({
      ...charter,
      successMetrics: newMetrics
    });
  };

  const removeMetric = (index: number) => {
    if (currentMetrics.length <= 1) return;
    const newMetrics = currentMetrics.filter((_, i) => i !== index);
    onChange({
      ...charter,
      successMetrics: newMetrics
    });
  };

  const moveMetric = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === currentMetrics.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newMetrics = [...currentMetrics];
    const temp = newMetrics[index];
    newMetrics[index] = newMetrics[targetIndex];
    newMetrics[targetIndex] = temp;
    onChange({
      ...charter,
      successMetrics: newMetrics
    });
  };

  const resetDefaultMetrics = () => {
    const defaultList: SuccessMetricItem[] = STANDARD_SUCCESS_METRICS_CATALOGUE.slice(0, 5).map(std => ({
      id: `sm_${std.key}`,
      key: std.key,
      title: std.title,
      category: std.category,
      value: std.defaultValue,
      description: std.description
    }));

    onChange({
      ...charter,
      successMetrics: defaultList,
      bomTarget: defaultList[0].value,
      sopDate: defaultList[1].value,
      qualityMetric: defaultList[2].value,
      performanceMetric: defaultList[3].value,
      complianceMetric: defaultList[4].value
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
              <Target className="w-4 h-4 text-emerald-600" />
              II. Mục Tiêu SMART & Tiêu Chí Đánh Giá Thành Công (Success Metrics)
            </h3>
            <p className="text-[11px] text-slate-400">
              Tùy biến & đổi tên mọi tiêu chí đo lường định lượng ngành phần cứng (Tự động hiển thị toàn bộ nội dung)
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
                  addMetric(e.target.value);
                  e.target.value = '';
                }
              }}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded cursor-pointer transition shadow-2xs"
              title="Thêm tiêu chí chuẩn từ thư viện R&D"
            >
              <option value="" disabled>📋 Thêm từ Thư Viện Tiêu Chí...</option>
              {STANDARD_SUCCESS_METRICS_CATALOGUE.map(item => (
                <option key={item.key} value={item.key}>
                  + [{item.category}] {item.title}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => addMetric()}
            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer shadow-2xs"
            title="Thêm tiêu chí tùy chỉnh mới"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Thêm Tiêu Chí</span>
          </button>

          <button
            type="button"
            onClick={resetDefaultMetrics}
            className="px-2 py-1 text-slate-500 hover:text-slate-800 rounded bg-slate-100 hover:bg-slate-200 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
            title="Khôi phục 5 tiêu chí mặc định ban đầu"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Khôi phục</span>
          </button>

          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            Section 02 ({currentMetrics.length})
          </span>
        </div>
      </div>

      {/* Grid of Success Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentMetrics.map((metric, index) => {
          const color = CATEGORY_COLORS[metric.category] || DEFAULT_COLOR;
          return (
            <div 
              key={metric.id || index}
              className="p-4 rounded-lg border border-slate-300 bg-slate-50/80 hover:bg-slate-50 transition-colors flex flex-col justify-between space-y-3"
            >
              <div>
                {/* Top Row: Title + Category Tag + Controls */}
                <div className="flex items-start justify-between gap-1 mb-2">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full ${color.dot} shrink-0`}></span>
                    <input
                      type="text"
                      value={metric.title}
                      onChange={(e) => updateMetric(index, { title: e.target.value })}
                      placeholder="Tên tiêu chí (VD: Target BOM)"
                      className="text-xs font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:outline-none px-1 py-0.5 rounded w-full"
                    />
                  </div>

                  {/* Reorder and Delete Actions */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveMetric(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200 disabled:opacity-20 cursor-pointer"
                      title="Di chuyển lên"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveMetric(index, 'down')}
                      disabled={index === currentMetrics.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200 disabled:opacity-20 cursor-pointer"
                      title="Di chuyển xuống"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeMetric(index)}
                      disabled={currentMetrics.length <= 1}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 disabled:opacity-20 transition cursor-pointer"
                      title="Xóa tiêu chí này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sub-bar: Category Selector & Quick Switcher */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Nhóm:</span>
                    <select
                      value={metric.category}
                      onChange={(e) => updateMetric(index, { category: e.target.value })}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer border ${color.bg} ${color.text} ${color.border}`}
                    >
                      <option value="Tài chính">Tài chính</option>
                      <option value="Tiến độ">Tiến độ</option>
                      <option value="Chất lượng">Chất lượng</option>
                      <option value="Trải nghiệm">Trải nghiệm</option>
                      <option value="Pháp lý">Pháp lý</option>
                      <option value="Kỹ thuật">Kỹ thuật</option>
                      <option value="Môi trường">Môi trường</option>
                      <option value="Thị trường">Thị trường</option>
                    </select>
                  </div>

                  <select
                    value={metric.key || 'custom'}
                    onChange={(e) => handlePresetChange(index, e.target.value)}
                    className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium border border-slate-300 rounded px-1.5 py-0.5 cursor-pointer max-w-[105px] truncate"
                    title="Đổi nhanh nội dung theo mẫu chuẩn"
                  >
                    <option value="custom">Đổi mẫu...</option>
                    {STANDARD_SUCCESS_METRICS_CATALOGUE.map(std => (
                      <option key={std.key} value={std.key}>{std.title.split('(')[0]}</option>
                    ))}
                  </select>
                </div>

                {/* Metric Target Value Input */}
                <AutoResizeTextarea
                  minRows={2}
                  value={metric.value}
                  onChange={(e) => updateMetric(index, { value: e.target.value })}
                  placeholder="Nhập giá trị mục tiêu định lượng..."
                  className="w-full text-xs font-bold text-slate-900 rounded border border-slate-300 p-2.5 bg-white focus:outline-none focus:border-blue-500 leading-normal shadow-2xs"
                />
              </div>

              {/* Description / Testing Method Input */}
              <div className="pt-2 border-t border-slate-200/80">
                <input
                  type="text"
                  value={metric.description || ''}
                  onChange={(e) => updateMetric(index, { description: e.target.value })}
                  placeholder="Ghi chú, điều kiện đo đạc hoặc tiêu chuẩn nghiệm thu..."
                  className="w-full text-[11px] text-slate-600 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:outline-none px-1 py-0.5 rounded"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Tip */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Mẹo: Bạn có thể thêm không giới hạn tiêu chí và xuất đầy đủ vào bảng tính Excel & bản in A4.</span>
        </div>
        <div className="text-[11px] font-medium text-slate-600">
          Đang cấu hình: <strong className="text-slate-900 font-mono">{currentMetrics.length}</strong> chỉ số SMART
        </div>
      </div>
    </section>
  );
};
