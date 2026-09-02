import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Clock, 
  Coins, 
  Gauge, 
  Cpu, 
  Award,
  Users,
  AlertTriangle,
  Printer,
  FileSpreadsheet,
  Edit3,
  CheckCircle,
  Briefcase,
  Target,
  DollarSign
} from 'lucide-react';
import { ProjectCharterData } from '../types/charter';

interface CharterPreviewProps {
  charter: ProjectCharterData;
  onPrint?: () => void;
  onExportExcel?: () => void;
  onEditForm?: () => void;
}

export const CharterPreview: React.FC<CharterPreviewProps> = ({ 
  charter, 
  onPrint, 
  onExportExcel,
  onEditForm 
}) => {
  const budget = charter?.budget || {
    tooling: 0,
    prototype: 0,
    certTesting: 0,
    jigPilot: 0,
    contingencyRate: 0.10,
    currency: 'VND'
  };

  const budgetItems = charter?.budgetItems && charter.budgetItems.length > 0 
    ? charter.budgetItems 
    : [
        { id: 'tooling', name: 'Chế tạo khuôn mẫu (Tooling & Molds)', amount: budget.tooling || 0, category: 'Tooling' },
        { id: 'prototype', name: 'Mẫu thử nghiệm (Mock-up & Prototypes)', amount: budget.prototype || 0, category: 'Prototype' },
        { id: 'certTesting', name: 'Đo kiểm phòng Lab & Cấp chứng nhận', amount: budget.certTesting || 0, category: 'Testing' },
        { id: 'jigPilot', name: 'Đồ gá lắp ráp & Chạy thử Pilot (Jig & Trial)', amount: budget.jigPilot || 0, category: 'Pilot' },
      ];

  const directCost = budgetItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  const contingencyRate = charter?.budget?.contingencyRate !== undefined ? charter.budget.contingencyRate : 0.10;
  const contingencyAmount = Math.round(directCost * contingencyRate);
  const grandTotal = directCost + contingencyAmount;

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const getGateBadgeStyle = (gate: string) => {
    switch (gate?.toUpperCase()) {
      case 'G0':
      case 'G1':
        return 'bg-blue-600 text-white';
      case 'G2':
        return 'bg-indigo-600 text-white';
      case 'G3':
        return 'bg-purple-600 text-white';
      case 'G4':
        return 'bg-amber-600 text-white';
      case 'G5':
        return 'bg-emerald-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Quick Actions Bar (hidden in print) */}
      <div className="no-print max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900 text-white rounded-lg shadow-md border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Chế Độ Xem Bản In Điều Lệ Chuẩn (A4 Executive View)
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {onEditForm && (
            <button
              onClick={onEditForm}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded text-xs font-semibold transition border border-slate-700 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-400" />
              <span>Chỉnh Sửa Form</span>
            </button>
          )}

          {onExportExcel && (
            <button
              onClick={onExportExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Xuất Excel (.xlsx)</span>
            </button>
          )}

          {onPrint && (
            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition shadow-sm cursor-pointer active:scale-98"
            >
              <Printer className="w-3.5 h-3.5 text-white" />
              <span>In PDF (A4)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Document Body */}
      <div className="max-w-5xl mx-auto bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden p-6 sm:p-10 text-slate-800 print:p-0 print:border-none print:shadow-none">
        
        {/* Document Header Banner */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-lg mb-8 shadow-sm print:bg-slate-900 print:text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-blue-400 mb-1.5 flex items-center gap-1.5 font-mono">
                <Cpu className="w-4 h-4 text-blue-400" />
                R&D DIVISION • HỆ THỐNG ĐIỀU HÀNH DỰ ÁN GIA DỤNG
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                BẢN ĐIỀU LỆ DỰ ÁN R&D
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-300 mt-1">
                Tên Dự Án: <span className="text-white font-bold">{charter.name || 'Dự Án Nghiên Cứu Phát Triển'}</span>
              </p>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded text-xs text-slate-300 space-y-1 sm:text-right shrink-0">
              <div>Mã Dự Án: <strong className="font-mono text-blue-400 font-bold">{charter.code || 'N/A'}</strong></div>
              <div>Ngành Hàng: <strong className="text-white">{charter.category || 'Gia Dụng'}</strong></div>
              <div>Phiên Bản: <strong className="text-emerald-400 font-mono">Ver {charter.version || '1.0'}</strong> | Ngày: <strong className="text-slate-200 font-mono">{charter.date}</strong></div>
            </div>
          </div>
        </div>

        {/* Section 1: Business Case & Stakeholders */}
        <div className="mb-8 avoid-break">
          <div className="bg-slate-800 text-white px-4 py-2 rounded-t flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-400" />
              I. Bối Cảnh Thị Trường & Mục Tiêu Kinh Doanh (Business Case)
            </h3>
            <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded font-mono text-slate-300">Section I</span>
          </div>

          <div className="border border-slate-300 border-t-0 rounded-b p-5 bg-slate-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-4 rounded border border-slate-300 bg-white shadow-2xs">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  Vấn Đề & Cơ Hội Thị Trường (Market Problem)
                </h4>
                <p className="text-slate-800 leading-relaxed whitespace-pre-line text-xs">
                  {charter.problem || 'Chưa cập nhật nội dung bối cảnh thị trường.'}
                </p>
                {charter.targetAudience && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 text-slate-700 text-[11px]">
                    <strong className="text-slate-900">Khách hàng mục tiêu:</strong> {charter.targetAudience}
                  </div>
                )}
              </div>

              <div className="p-4 rounded border border-slate-300 bg-white shadow-2xs">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  Mục Tiêu Kinh Doanh & Hiệu Quả Đầu Tư (Benefits)
                </h4>
                <p className="text-slate-800 leading-relaxed whitespace-pre-line text-xs">
                  {charter.benefits || 'Chưa cập nhật mục tiêu kinh doanh.'}
                </p>
                <div className="mt-3 pt-2.5 border-t border-slate-200 grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <div>Sponsor: <strong className="text-slate-900 font-bold">{charter.sponsor || 'Chưa xác định'}</strong></div>
                  <div>PM: <strong className="text-slate-900 font-bold">{charter.pm || 'Chưa xác định'}</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Core Success Metrics */}
        <div className="mb-8 avoid-break">
          <div className="bg-slate-800 text-white px-4 py-2 rounded-t flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              II. Chỉ Số Đo Lường Thành Công Cốt Lõi (Key Success Metrics)
            </h3>
            <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded font-mono text-slate-300">Section II</span>
          </div>

          <div className="border border-slate-300 border-t-0 rounded-b p-5 bg-slate-50/50">
            {charter.successMetrics && charter.successMetrics.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                {charter.successMetrics.map((metric, idx) => (
                  <div key={metric.id || idx} className="p-3.5 rounded border border-slate-300 bg-white shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider">
                          {metric.title}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {metric.category}
                        </span>
                      </div>
                      <div className="font-extrabold text-slate-900 text-sm whitespace-pre-line leading-snug">
                        {metric.value || 'Chưa định mức'}
                      </div>
                    </div>
                    {metric.description && (
                      <div className="text-[10px] text-slate-500 mt-2 pt-1.5 border-t border-slate-100 italic">
                        {metric.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
                  <div className="p-3.5 rounded border border-blue-200 bg-blue-50/70">
                    <div className="text-[10px] uppercase font-bold text-blue-800 flex items-center gap-1 mb-1">
                      <Coins className="w-3.5 h-3.5 text-blue-600" />
                      Target BOM:
                    </div>
                    <div className="font-extrabold text-blue-950 text-sm">
                      {charter.bomTarget || 'Chưa định mức'}
                    </div>
                    <div className="text-[10px] text-blue-700 mt-0.5 font-medium">Chi phí sản xuất định mức</div>
                  </div>

                  <div className="p-3.5 rounded border border-purple-200 bg-purple-50/70">
                    <div className="text-[10px] uppercase font-bold text-purple-800 flex items-center gap-1 mb-1">
                      <Clock className="w-3.5 h-3.5 text-purple-600" />
                      Hạn SOP Đại Trà:
                    </div>
                    <div className="font-extrabold text-purple-950 text-sm font-mono">
                      {charter.sopDate || 'Chưa xác định'}
                    </div>
                    <div className="text-[10px] text-purple-700 mt-0.5 font-medium">Bắt đầu sản xuất hàng loạt</div>
                  </div>

                  <div className="p-3.5 rounded border border-emerald-200 bg-emerald-50/70">
                    <div className="text-[10px] uppercase font-bold text-emerald-800 flex items-center gap-1 mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Độ Bền & Chất Lượng:
                    </div>
                    <div className="font-bold text-emerald-950 text-xs">
                      {charter.qualityMetric || 'Chưa định mức'}
                    </div>
                    <div className="text-[10px] text-emerald-700 mt-0.5 font-medium">Chỉ số MTBF / Tỷ lệ lỗi</div>
                  </div>

                  <div className="p-3.5 rounded border border-indigo-200 bg-indigo-50/70">
                    <div className="text-[10px] uppercase font-bold text-indigo-800 flex items-center gap-1 mb-1">
                      <Gauge className="w-3.5 h-3.5 text-indigo-600" />
                      Hiệu Năng & Độ Ồn:
                    </div>
                    <div className="font-bold text-indigo-950 text-xs">
                      {charter.performanceMetric || 'Chưa định mức'}
                    </div>
                    <div className="text-[10px] text-indigo-700 mt-0.5 font-medium">Đo kiểm phòng Lab</div>
                  </div>
                </div>

                <div className="p-3 mt-3.5 rounded border border-slate-300 bg-white text-xs flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-purple-700 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900">Tiêu Chuẩn Pháp Lý / Hợp Quy Bắt Buộc:</strong>
                    <span className="text-slate-800 ml-1.5 font-medium">{charter.complianceMetric || 'QCVN 4:2009/BKHCN & TCVN An Toàn Điện Gia Dụng'}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 3: Scope In & Out */}
        <div className="mb-8 avoid-break">
          <div className="bg-slate-800 text-white px-4 py-2 rounded-t flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-amber-400" />
              III. Định Nghĩa Phạm Vi Dự Án (In-Scope vs Out-of-Scope)
            </h3>
            <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded font-mono text-slate-300">Section III</span>
          </div>

          <div className="border border-slate-300 border-t-0 rounded-b p-5 bg-slate-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              
              {/* In-Scope Card */}
              <div className="rounded border-2 border-emerald-500 overflow-hidden bg-white shadow-2xs">
                <div className="bg-emerald-600 text-white px-3.5 py-2 font-bold uppercase tracking-wider text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    TRONG PHẠM VI (IN-SCOPE)
                  </span>
                  <span className="text-[10px] bg-emerald-700 px-1.5 py-0.2 rounded">Bắt buộc</span>
                </div>
                <div className="p-4 text-slate-800 whitespace-pre-line leading-relaxed font-mono text-[11px] bg-emerald-50/20">
                  {charter.scopeIn || 'Chưa thiết lập phạm vi trong dự án.'}
                </div>
              </div>

              {/* Out-of-Scope Card */}
              <div className="rounded border-2 border-rose-500 overflow-hidden bg-white shadow-2xs">
                <div className="bg-rose-600 text-white px-3.5 py-2 font-bold uppercase tracking-wider text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" />
                    NGOÀI PHẠM VI (OUT-OF-SCOPE)
                  </span>
                  <span className="text-[10px] bg-rose-700 px-1.5 py-0.2 rounded">Không thực hiện</span>
                </div>
                <div className="p-4 text-slate-800 whitespace-pre-line leading-relaxed font-mono text-[11px] bg-rose-50/20">
                  {charter.scopeOut || 'Chưa thiết lập ranh giới ngoài phạm vi.'}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Section 4: Stage-Gate & Budget Breakdown */}
        <div className="mb-8 avoid-break">
          <div className="bg-slate-800 text-white px-4 py-2 rounded-t flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              IV. Lộ Trình Cửa Duyệt Kỹ Thuật (Stage-Gate) & Dự Toán Đầu Tư
            </h3>
            <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded font-mono text-slate-300">Section IV</span>
          </div>

          <div className="border border-slate-300 border-t-0 rounded-b p-5 bg-slate-50/50">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
              
              {/* Stage Gate Table */}
              <div className="lg:col-span-7 border border-slate-300 rounded overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="p-2.5">Giai Đoạn (Gate)</th>
                      <th className="p-2.5 text-center">Hạn Định</th>
                      <th className="p-2.5">Người Phê Duyệt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(charter.milestones || []).map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80">
                        <td className="p-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${getGateBadgeStyle(m.gate)}`}>
                              {m.gate}
                            </span>
                            <strong className="text-slate-900">{m.name}</strong>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{m.deliverables}</p>
                        </td>
                        <td className="p-2.5 text-slate-800 font-mono text-center font-semibold">{m.targetDate || '--'}</td>
                        <td className="p-2.5 text-slate-800 font-medium">{m.owner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Budget Breakdown Card */}
              <div className="lg:col-span-5 border border-slate-800 rounded p-4 bg-slate-900 text-white flex flex-col justify-between shadow-md">
                <div className="space-y-2">
                  <div className="flex justify-between pb-2 border-b border-slate-700 text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                    <span>Hạng Mục Chi Phí R&D</span>
                    <span>Số Tiền (VNĐ)</span>
                  </div>
                  {budgetItems.map((item, idx) => (
                    <div key={item.id || idx} className="flex justify-between text-slate-300 text-xs gap-2">
                      <span className="truncate" title={item.name}>{item.name}:</span>
                      <strong className="text-white shrink-0 font-mono">{formatVND(item.amount || 0)}</strong>
                    </div>
                  ))}
                  <div className="flex justify-between text-amber-300 font-semibold pt-1.5 border-t border-slate-800 text-xs">
                    <span>Dự phòng rủi ro ({((contingencyRate || 0.1) * 100).toFixed(0)}%):</span>
                    <strong className="text-amber-400 font-mono">{formatVND(contingencyAmount)}</strong>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t-2 border-blue-500/80 flex justify-between items-baseline bg-slate-800/80 -mx-4 -mb-4 p-4 rounded-b">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">TỔNG NGÂN SÁCH ĐƯỢC DUYỆT:</span>
                  <span className="text-base font-extrabold text-emerald-400 font-mono">{formatVND(grandTotal)}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Section 5: Project Team Matrix */}
        <div className="mb-8 avoid-break">
          <div className="bg-slate-800 text-white px-4 py-2 rounded-t flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              V. Đội Ngũ Dự Án & Phân Công Vai Trò (Core Project Team)
            </h3>
            <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded font-mono text-slate-300">
              Section V ({charter.teamMembers && charter.teamMembers.length > 0 ? charter.teamMembers.length : 7} Vị Trí)
            </span>
          </div>

          <div className="border border-slate-300 border-t-0 rounded-b p-5 bg-slate-50/50">
            {charter.teamMembers && charter.teamMembers.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                {charter.teamMembers.map((member, idx) => (
                  <div key={member.id || idx} className="p-3 rounded border border-slate-300 bg-white shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block truncate" title={member.roleTitle}>
                          {member.roleTitle || 'Vị trí kỹ thuật'}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 font-bold">#{idx + 1}</span>
                      </div>
                      <strong className="text-slate-900 font-bold text-xs block leading-snug">
                        {member.memberName || 'Chưa phân bổ'}
                      </strong>
                    </div>
                    {(member.department || member.responsibilities) && (
                      <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-500 space-y-0.5">
                        {member.department && (
                          <div className="truncate text-slate-600 font-medium" title={member.department}>
                            🏢 {member.department}
                          </div>
                        )}
                        {member.responsibilities && (
                          <div className="truncate text-slate-400 italic" title={member.responsibilities}>
                            📋 {member.responsibilities}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded border border-slate-300 bg-white shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Lead Cơ Khí (MD)</span>
                  <strong className="text-slate-900 font-bold text-xs">{charter.team?.mdLead || 'Chưa phân bổ'}</strong>
                </div>
                <div className="p-3 rounded border border-slate-300 bg-white shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Lead Mạch & FW (EE)</span>
                  <strong className="text-slate-900 font-bold text-xs">{charter.team?.eeLead || 'Chưa phân bổ'}</strong>
                </div>
                <div className="p-3 rounded border border-slate-300 bg-white shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Lead Kiểu Dáng (ID)</span>
                  <strong className="text-slate-900 font-bold text-xs">{charter.team?.idLead || 'Chưa phân bổ'}</strong>
                </div>
                <div className="p-3 rounded border border-slate-300 bg-white shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Lead Đảm Bảo CL (QA)</span>
                  <strong className="text-slate-900 font-bold text-xs">{charter.team?.qaLead || 'Chưa phân bổ'}</strong>
                </div>
                <div className="p-3 rounded border border-slate-300 bg-white shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Lead Mua Hàng & Supply</span>
                  <strong className="text-slate-900 font-bold text-xs">{charter.team?.sourcingLead || 'Chưa phân bổ'}</strong>
                </div>
                <div className="p-3 rounded border border-slate-300 bg-white shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Lead Kỹ Thuật SX (PE)</span>
                  <strong className="text-slate-900 font-bold text-xs">{charter.team?.peLead || 'Chưa phân bổ'}</strong>
                </div>
                <div className="p-3 rounded border border-slate-300 bg-white shadow-2xs sm:col-span-2">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Đại Diện Tiếp Thị (MKT/Sales)</span>
                  <strong className="text-slate-900 font-bold text-xs">{charter.team?.mktLead || 'Chưa phân bổ'}</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 6: Risks & Sign-off Block */}
        <div className="avoid-break">
          <div className="bg-slate-800 text-white px-4 py-2 rounded-t flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              VI. Rủi Ro Trọng Yếu & Bảng Ký Duyệt (Sign-off Matrix)
            </h3>
            <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded font-mono text-slate-300">Section VI</span>
          </div>

          <div className="border border-slate-300 border-t-0 rounded-b p-5 bg-slate-50/50 space-y-6">
            
            {/* PM Authority Box */}
            <div className="p-3.5 rounded bg-blue-50/80 border border-blue-200 text-xs">
              <strong className="text-blue-900 block mb-1 font-bold">Thẩm quyền của Project Manager (PM Authority):</strong>
              <span className="text-blue-950 leading-relaxed font-medium">
                {charter.pmAuthority || 'Toàn quyền điều phối nhân sự kỹ sư trong dự án; Được chủ động phê duyệt phát sinh ngân sách dưới 5% mỗi hạng mục.'}
              </span>
            </div>

            {/* Signature Matrix */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 text-center mb-6">
                Xác Nhận & Cam Kết Của Các Bên Liên Quan (Sign-off Matrix)
              </h4>

              {charter.signOffMembers && charter.signOffMembers.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-center text-xs">
                  {charter.signOffMembers.map((member, idx) => (
                    <div key={member.id || idx} className="p-3 rounded border border-slate-300 bg-white flex flex-col justify-between min-h-[148px]">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-blue-700 block tracking-wider truncate" title={member.roleTitle}>
                          {member.roleTitle || 'Đại diện'}
                        </span>
                        <p className="font-bold text-slate-900 mt-1">{member.signOffName || '(Chưa phân bổ)'}</p>
                        <p className="text-slate-500 text-[10px] line-clamp-2 mt-0.5">{member.department || 'Cam kết phê duyệt'}</p>
                      </div>
                      <div className="border-t border-dashed border-slate-300 pt-2 text-[10px] text-slate-400 font-mono mt-2">
                        (Ký & ghi rõ họ tên)
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
                  <div className="p-3 rounded border border-slate-300 bg-white flex flex-col justify-between h-36">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Project Sponsor</span>
                      <p className="font-bold text-slate-900 mt-1">{charter.signMatrix?.sponsor || charter.sponsor || 'Đại diện BOD'}</p>
                      <p className="text-slate-500 text-[10px]">Phê duyệt ngân sách R&D</p>
                    </div>
                    <div className="border-t border-dashed border-slate-300 pt-2 text-[10px] text-slate-400 font-mono">
                      (Ký & ghi rõ họ tên)
                    </div>
                  </div>

                  <div className="p-3 rounded border border-slate-300 bg-white flex flex-col justify-between h-36">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Project Manager</span>
                      <p className="font-bold text-slate-900 mt-1">{charter.signMatrix?.pm || charter.pm || 'Chủ nhiệm Dự án'}</p>
                      <p className="text-slate-500 text-[10px]">Cam kết tiến độ & BOM</p>
                    </div>
                    <div className="border-t border-dashed border-slate-300 pt-2 text-[10px] text-slate-400 font-mono">
                      (Ký & ghi rõ họ tên)
                    </div>
                  </div>

                  <div className="p-3 rounded border border-slate-300 bg-white flex flex-col justify-between h-36">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Trưởng Phòng QA/QC</span>
                      <p className="font-bold text-slate-900 mt-1">{charter.signMatrix?.qa || charter.team?.qaLead || 'Lead QA/QC'}</p>
                      <p className="text-slate-500 text-[10px]">Tiêu chuẩn kỹ thuật</p>
                    </div>
                    <div className="border-t border-dashed border-slate-300 pt-2 text-[10px] text-slate-400 font-mono">
                      (Ký & ghi rõ họ tên)
                    </div>
                  </div>

                  <div className="p-3 rounded border border-slate-300 bg-white flex flex-col justify-between h-36">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Giám Đốc Nhà Máy</span>
                      <p className="font-bold text-slate-900 mt-1">{charter.signMatrix?.factory || 'Khối Sản Xuất'}</p>
                      <p className="text-slate-500 text-[10px]">Khả thi dây chuyền PE</p>
                    </div>
                    <div className="border-t border-dashed border-slate-300 pt-2 text-[10px] text-slate-400 font-mono">
                      (Ký & ghi rõ họ tên)
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
