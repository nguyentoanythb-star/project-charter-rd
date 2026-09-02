import React from 'react';
import { 
  CheckCircle2, 
  Coins, 
  Cpu, 
  Calendar,
  ArrowRight,
  ShieldAlert,
  Target,
  Award,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { ProjectCharterData } from '../types/charter';

interface StageGateDashboardProps {
  charter: ProjectCharterData;
  onSelectGate?: (gateIndex: number) => void;
}

export const StageGateDashboard: React.FC<StageGateDashboardProps> = ({ charter }) => {
  const budget = charter?.budget || {
    tooling: 0,
    prototype: 0,
    certTesting: 0,
    jigPilot: 0,
    contingencyRate: 0.10,
    currency: 'VND'
  };

  const directCost = 
    (budget.tooling || 0) + 
    (budget.prototype || 0) + 
    (budget.certTesting || 0) + 
    (budget.jigPilot || 0);

  const contingencyAmount = Math.round(directCost * (budget.contingencyRate || 0.10));
  const grandTotal = directCost + contingencyAmount;

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const getGateColor = (index: number) => {
    switch (index) {
      case 0: return { bg: 'bg-blue-600', badge: 'bg-blue-600 text-white shadow-2xs', border: 'border-blue-500' };
      case 1: return { bg: 'bg-indigo-600', badge: 'bg-indigo-600 text-white shadow-2xs', border: 'border-indigo-500' };
      case 2: return { bg: 'bg-purple-600', badge: 'bg-purple-600 text-white shadow-2xs', border: 'border-purple-500' };
      case 3: return { bg: 'bg-amber-600', badge: 'bg-amber-600 text-white shadow-2xs', border: 'border-amber-500' };
      case 4: default: return { bg: 'bg-emerald-600', badge: 'bg-emerald-600 text-white shadow-2xs', border: 'border-emerald-500' };
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner Card (Modern Executive Aesthetic) */}
      <div className="bg-slate-900 text-white rounded-lg p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-blue-400 font-mono font-bold uppercase tracking-widest mb-1.5">
              <Cpu className="w-4 h-4 text-blue-400" />
              LỘ TRÌNH CỬA DUYỆT KỸ THUẬT (HARDWARE STAGE-GATE FRAMEWORK)
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
              {charter?.name || 'Dự Án Nghiên Cứu & Phát Triển Thiết Bị'}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Mã Dự Án: <span className="font-mono text-blue-400 font-bold">{charter?.code || 'N/A'}</span> • Ngành Hàng: <strong className="text-white">{charter?.category || 'Gia dụng'}</strong> • Phiên Bản: <strong className="text-emerald-400 font-mono">v{charter?.version || '1.0'}</strong>
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-lg shadow-inner">
            <span className="text-[10px] text-slate-300 uppercase font-bold tracking-wider block">Tổng Ngân Sách Được Duyệt:</span>
            <span className="text-xl font-extrabold text-emerald-400">{formatVND(grandTotal)}</span>
          </div>
        </div>

        {/* Visual Roadmap Stepper */}
        <div className="mt-8 pt-6 border-t border-slate-800 overflow-x-auto">
          <div className="flex items-stretch justify-between min-w-[760px] gap-3">
            {(charter?.milestones || []).map((m, index) => {
              const color = getGateColor(index);
              return (
                <React.Fragment key={index}>
                  <div className="flex-1 bg-slate-800/90 rounded-lg p-4 border border-slate-700 flex flex-col justify-between hover:border-blue-400 transition shadow-xs">
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded ${color.badge}`}>
                          {m.gate}
                        </span>
                        <span className="text-[10px] text-slate-300 font-mono font-semibold flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-blue-400" />
                          {m.targetDate || '--'}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white mb-1.5 line-clamp-1">
                        {m.name}
                      </h4>

                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                        {m.deliverables}
                      </p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-slate-700 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>Phê duyệt:</span>
                      <strong className="text-slate-100 truncate ml-1">{m.owner}</strong>
                    </div>
                  </div>

                  {index < (charter?.milestones || []).length - 1 && (
                    <div className="flex items-center">
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stage Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Budget Distribution */}
        <div className="bg-white rounded-lg border border-slate-300 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-500" />
              Cơ Cấu Ngân Sách Đầu Tư R&D
            </h3>
            <span className="text-[10px] uppercase font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Budget</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-700 mb-1 text-[11px]">
                <span className="font-medium">Khuôn mẫu (Tooling):</span>
                <strong className="text-slate-900 font-bold">{formatVND(budget.tooling)}</strong>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full" 
                  style={{ width: `${grandTotal > 0 ? (budget.tooling / grandTotal) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1 text-[11px]">
                <span className="font-medium">Mẫu thử Proto (EVT):</span>
                <strong className="text-slate-900 font-bold">{formatVND(budget.prototype)}</strong>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full" 
                  style={{ width: `${grandTotal > 0 ? (budget.prototype / grandTotal) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1 text-[11px]">
                <span className="font-medium">Chứng nhận & Đo kiểm Lab:</span>
                <strong className="text-slate-900 font-bold">{formatVND(budget.certTesting)}</strong>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-600 rounded-full" 
                  style={{ width: `${grandTotal > 0 ? (budget.certTesting / grandTotal) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1 text-[11px]">
                <span className="font-medium">Đồ gá Jig & Pilot Run (PVT):</span>
                <strong className="text-slate-900 font-bold">{formatVND(budget.jigPilot)}</strong>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-600 rounded-full" 
                  style={{ width: `${grandTotal > 0 ? (budget.jigPilot / grandTotal) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <div className="flex justify-between text-amber-900 font-bold mb-1 text-[11px]">
                <span>Dự phòng rủi ro ({((budget.contingencyRate || 0.1) * 100).toFixed(0)}%):</span>
                <span className="text-amber-700 font-extrabold">{formatVND(contingencyAmount)}</span>
              </div>
              <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full" 
                  style={{ width: `${grandTotal > 0 ? (contingencyAmount / grandTotal) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Quality & Target Gate Metrics */}
        <div className="bg-white rounded-lg border border-slate-300 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Tiêu Chuẩn Cửa Duyệt Xuất Xưởng
            </h3>
            <span className="text-[10px] uppercase font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Quality</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded border border-slate-200 bg-slate-50">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Target BOM:</span>
              <strong className="text-slate-900 text-xs font-bold">{charter.bomTarget || 'Chưa định mức'}</strong>
            </div>

            <div className="p-3 rounded border border-slate-200 bg-slate-50">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Chất Lượng & MTBF:</span>
              <strong className="text-slate-900 text-xs font-bold">{charter.qualityMetric || 'Chưa định mức'}</strong>
            </div>

            <div className="p-3 rounded border border-slate-200 bg-slate-50">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Độ Ồn & Hiệu Năng:</span>
              <strong className="text-slate-900 text-xs font-bold">{charter.performanceMetric || 'Chưa định mức'}</strong>
            </div>

            <div className="p-3 rounded border border-purple-200 bg-purple-50">
              <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wider block">Chứng Nhận Bắt Buộc:</span>
              <strong className="text-purple-900 text-xs font-bold">{charter.complianceMetric || 'QCVN 4:2009/BKHCN'}</strong>
            </div>
          </div>
        </div>

        {/* Card 3: Key Risks & PM Sign-off */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 shadow-md text-white">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Rủi Ro Trọng Yếu & Nhân Sự Phụ Trách
            </h3>
            <span className="text-[10px] uppercase font-mono font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">Risks</span>
          </div>

          <div className="space-y-3 text-xs">
            {(charter.risks || []).map((r, idx) => (
              <div key={idx} className="p-3 rounded border border-slate-700 bg-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-white text-xs font-bold">{r.title}</strong>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                    r.impact === 'High' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-slate-900'
                  }`}>
                    {r.impact}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] line-clamp-2 mt-1">Ứng phó: {r.mitigation}</p>
              </div>
            ))}

            <div className="pt-3 border-t border-slate-800 text-slate-300 text-[11px] space-y-1.5">
              <div>Project Sponsor: <strong className="text-white font-bold">{charter.sponsor}</strong></div>
              <div>Project Manager: <strong className="text-blue-400 font-bold">{charter.pm}</strong></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
