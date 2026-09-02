import React, { useState } from 'react';
import { 
  Briefcase, 
  Target, 
  Crosshair, 
  Calendar, 
  Users, 
  Calculator, 
  AlertTriangle, 
  FileCheck, 
  Plus, 
  Trash2, 
  HelpCircle, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  Zap, 
  UserCheck, 
  Maximize2, 
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Edit3,
  Tag,
  Building,
  Shield,
  ChevronDown
} from 'lucide-react';
import { ProjectCharterData, StageGateMilestone, ProjectRisk, ProjectTeamMember } from '../types/charter';
import { AutoResizeTextarea } from './AutoResizeTextarea';
import { STANDARD_RD_ROLES, StandardRoleOption } from '../data/standardRoles';
import { DEFAULT_BASE_ROLES } from '../utils/normalizeCharter';
import { SectionSuccessMetrics } from './SectionSuccessMetrics';
import { SectionBudget } from './SectionBudget';
import { SectionSignOff } from './SectionSignOff';

interface CharterFormProps {
  charter: ProjectCharterData;
  onChange: (updated: ProjectCharterData) => void;
  onSave: () => void;
  onExportExcel: () => void;
  onOpenRoster?: () => void;
  onQuickAutoFillRoster?: () => void;
  onOpenAiAssistant?: () => void;
}

export const CharterForm: React.FC<CharterFormProps> = ({
  charter,
  onChange,
  onSave,
  onExportExcel,
  onOpenRoster,
  onQuickAutoFillRoster,
  onOpenAiAssistant
}) => {
  // Helpers to update fields
  const updateField = <K extends keyof ProjectCharterData>(field: K, value: ProjectCharterData[K]) => {
    onChange({ ...charter, [field]: value });
  };

  const currentTeam = charter.team || {
    mdLead: '',
    eeLead: '',
    idLead: '',
    qaLead: '',
    sourcingLead: '',
    peLead: '',
    mktLead: ''
  };

  // Dynamic Team Members list
  const currentTeamMembers: ProjectTeamMember[] = (charter.teamMembers && charter.teamMembers.length > 0)
    ? charter.teamMembers
    : DEFAULT_BASE_ROLES.map((base, idx) => ({
        id: `tm_base_${base.roleKey}_${idx}`,
        roleKey: base.roleKey,
        roleTitle: base.roleTitle,
        memberName: (charter.team as any)?.[base.roleKey] || '',
        department: base.defaultDepartment,
        responsibilities: ''
      }));

  const updateTeamMember = (index: number, updated: Partial<ProjectTeamMember>) => {
    const newMembers = [...currentTeamMembers];
    newMembers[index] = { ...newMembers[index], ...updated };
    
    // Synchronize to traditional team object if matching roleKey
    const updatedTeam = { ...currentTeam };
    const member = newMembers[index];
    if (member.roleKey && member.roleKey in updatedTeam && updated.memberName !== undefined) {
      (updatedTeam as any)[member.roleKey] = member.memberName;
    }

    onChange({
      ...charter,
      teamMembers: newMembers,
      team: updatedTeam
    });
  };

  const handleRolePresetChange = (index: number, selectedKey: string) => {
    const stdRole = STANDARD_RD_ROLES.find(r => r.key === selectedKey);
    if (stdRole) {
      updateTeamMember(index, {
        roleKey: selectedKey,
        roleTitle: stdRole.title,
        department: currentTeamMembers[index].department || stdRole.defaultDepartment,
        responsibilities: currentTeamMembers[index].responsibilities || stdRole.description
      });
    } else {
      updateTeamMember(index, {
        roleKey: selectedKey
      });
    }
  };

  const addTeamMember = (roleKeyOrPreset?: string) => {
    let newMember: ProjectTeamMember;
    const stdRole = STANDARD_RD_ROLES.find(r => r.key === roleKeyOrPreset);
    if (stdRole) {
      newMember = {
        id: `tm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        roleKey: stdRole.key,
        roleTitle: stdRole.title,
        memberName: '',
        department: stdRole.defaultDepartment,
        responsibilities: stdRole.description
      };
    } else {
      newMember = {
        id: `tm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        roleKey: 'custom',
        roleTitle: 'Vị trí kỹ thuật mới / Phân công bổ sung',
        memberName: '',
        department: 'Khối Kỹ Thuật & R&D',
        responsibilities: ''
      };
    }
    const newMembers = [...currentTeamMembers, newMember];
    onChange({
      ...charter,
      teamMembers: newMembers
    });
  };

  const removeTeamMember = (index: number) => {
    if (currentTeamMembers.length <= 1) return;
    const newMembers = currentTeamMembers.filter((_, i) => i !== index);
    onChange({
      ...charter,
      teamMembers: newMembers
    });
  };

  const moveTeamMember = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === currentTeamMembers.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newMembers = [...currentTeamMembers];
    const temp = newMembers[index];
    newMembers[index] = newMembers[targetIndex];
    newMembers[targetIndex] = temp;
    onChange({
      ...charter,
      teamMembers: newMembers
    });
  };

  const resetDefaultRoles = () => {
    const defaultList: ProjectTeamMember[] = DEFAULT_BASE_ROLES.map((base, idx) => ({
      id: `tm_base_${base.roleKey}_${idx}`,
      roleKey: base.roleKey,
      roleTitle: base.roleTitle,
      memberName: (charter.team as any)?.[base.roleKey] || '',
      department: base.defaultDepartment,
      responsibilities: ''
    }));
    onChange({
      ...charter,
      teamMembers: defaultList
    });
  };

  const currentBudget = charter.budget || {
    tooling: 0,
    prototype: 0,
    certTesting: 0,
    jigPilot: 0,
    contingencyRate: 0.10,
    currency: 'VND'
  };

  const updateTeamField = (role: keyof ProjectCharterData['team'], value: string) => {
    onChange({
      ...charter,
      team: { ...currentTeam, [role]: value }
    });
  };

  const updateBudgetField = (field: keyof ProjectCharterData['budget'], value: number) => {
    onChange({
      ...charter,
      budget: { ...currentBudget, [field]: value }
    });
  };

  const updateMilestone = (index: number, updated: Partial<StageGateMilestone>) => {
    const newMilestones = [...(charter.milestones || [])];
    newMilestones[index] = { ...newMilestones[index], ...updated };
    onChange({ ...charter, milestones: newMilestones });
  };

  const addMilestone = () => {
    const nextNum = (charter.milestones || []).length + 1;
    const newMilestone: StageGateMilestone = {
      gate: `Gate ${nextNum}`,
      name: 'Giai đoạn bổ sung',
      deliverables: 'Mô tả kết quả bàn giao tại cửa duyệt',
      targetDate: new Date().toISOString().slice(0, 10),
      owner: 'Project Manager',
      status: 'Not Started'
    };
    onChange({ ...charter, milestones: [...(charter.milestones || []), newMilestone] });
  };

  const removeMilestone = (index: number) => {
    if ((charter.milestones || []).length <= 1) return;
    const newMilestones = (charter.milestones || []).filter((_, i) => i !== index);
    onChange({ ...charter, milestones: newMilestones });
  };

  const updateRisk = (index: number, updated: Partial<ProjectRisk>) => {
    const newRisks = [...(charter.risks || [])];
    newRisks[index] = { ...newRisks[index], ...updated };
    onChange({ ...charter, risks: newRisks });
  };

  const addRisk = () => {
    const newRisk: ProjectRisk = {
      id: `r_${Date.now()}`,
      title: 'Rủi ro kỹ thuật / chuỗi cung ứng mới',
      impact: 'Medium',
      mitigation: 'Kế hoạch hành động ứng phó'
    };
    onChange({ ...charter, risks: [...(charter.risks || []), newRisk] });
  };

  const removeRisk = (index: number) => {
    const newRisks = (charter.risks || []).filter((_, i) => i !== index);
    onChange({ ...charter, risks: newRisks });
  };

  // Calculations
  const directCost = 
    (currentBudget.tooling || 0) + 
    (currentBudget.prototype || 0) + 
    (currentBudget.certTesting || 0) + 
    (currentBudget.jigPilot || 0);

  const contingencyAmount = Math.round(directCost * (currentBudget.contingencyRate || 0.10));
  const grandTotal = directCost + contingencyAmount;

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <div className="space-y-8 pb-16">

      {/* Top Helper Banner for Full Visibility Guarantee */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 text-white flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <p className="text-xs font-bold text-slate-200">
            Chế độ tự động mở rộng & hiển thị trọn vẹn 100% nội dung (Auto-fit Multiline View)
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-300">
          {onOpenAiAssistant && (
            <button
              type="button"
              onClick={onOpenAiAssistant}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-3 py-1 rounded font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Co-pilot Soạn Thảo / Thẩm Định</span>
            </button>
          )}
          <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700 font-mono text-blue-400 font-bold">
            Mã: {charter.code || 'CHƯA ĐẶT'}
          </span>
          <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700 font-mono text-emerald-400 font-bold">
            Ngân sách: {formatVND(grandTotal)}
          </span>
        </div>
      </div>

      {/* ==================== PHẦN 1: THÔNG TIN TỔNG QUAN & BUSINESS CASE ==================== */}
      <section className="bg-white p-6 rounded-lg shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 flex items-center gap-2">
                I. Thông Tin Dự Án & Bối Cảnh Kinh Doanh (Identity & Purpose)
              </h3>
              <p className="text-[11px] text-slate-400">Thiết lập mục tiêu đầu tư, định vị phân khúc gia dụng và người bảo trợ</p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            Section 01
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">
              Tên Dự Án Sản Phẩm <span className="text-rose-500">*</span>
            </label>
            <AutoResizeTextarea
              minRows={1}
              value={charter.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="VD: Quạt Đứng DC Inverter Siêu Êm 24 Cấp Gió"
              className="w-full text-sm font-bold text-slate-900 rounded border border-slate-300 px-3 py-2 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">
              Mã Dự Án (Project Code) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={charter.code}
              onChange={(e) => updateField('code', e.target.value.toUpperCase())}
              placeholder="VD: RD-FAN-2026-DC"
              className="w-full text-xs font-mono font-bold text-slate-900 rounded border border-slate-300 px-3 py-2 bg-slate-50 uppercase tracking-wide focus:bg-white focus:border-blue-500 focus:outline-none transition-colors h-[38px]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">
              Dòng Sản Phẩm (Category)
            </label>
            <select
              aria-label="Dòng sản phẩm gia dụng"
              value={charter.category}
              onChange={(e) => updateField('category', e.target.value as any)}
              className="w-full text-xs font-medium rounded border border-slate-300 px-3 py-2 bg-slate-50 text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none cursor-pointer transition-colors h-[38px]"
            >
              <option value="Quạt làm mát">Quạt điện / Làm mát</option>
              <option value="Nồi cơm điện">Nồi cơm điện (Cơ / IH / Điện tử)</option>
              <option value="Ấm siêu tốc">Ấm siêu tốc / Bình thủy</option>
              <option value="Điều hòa không khí">Điều hòa không khí (HVAC)</option>
              <option value="Tủ lạnh / Tủ đông">Tủ lạnh / Tủ đông</option>
              <option value="Bếp điện / Bếp từ">Bếp từ / Bếp hồng ngoại</option>
              <option value="Máy lọc không khí">Máy lọc không khí</option>
              <option value="Gia dụng nhà bếp khác">Thiết bị nhà bếp khác</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">
              Project Sponsor (Người bảo trợ)
            </label>
            <AutoResizeTextarea
              minRows={1}
              value={charter.sponsor}
              onChange={(e) => updateField('sponsor', e.target.value)}
              placeholder="VD: Trần Văn A - Giám Đốc Khối R&D"
              className="w-full text-xs font-semibold text-slate-900 rounded border border-slate-300 px-3 py-2 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">
              Project Manager (Chủ nhiệm dự án)
            </label>
            <AutoResizeTextarea
              minRows={1}
              value={charter.pm}
              onChange={(e) => updateField('pm', e.target.value)}
              placeholder="VD: Nguyễn Văn B - Senior PM"
              className="w-full text-xs font-semibold text-slate-900 rounded border border-slate-300 px-3 py-2 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">
              Ngày Lập / Phê Duyệt
            </label>
            <input
              type="date"
              value={charter.date}
              onChange={(e) => updateField('date', e.target.value)}
              className="w-full text-xs rounded border border-slate-300 px-3 py-2 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors font-mono h-[38px]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">
              Phiên Bản (Version)
            </label>
            <input
              type="text"
              value={charter.version}
              onChange={(e) => updateField('version', e.target.value)}
              placeholder="VD: 1.0"
              className="w-full text-xs rounded border border-slate-300 px-3 py-2 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors font-mono h-[38px]"
            />
          </div>

          <div className="lg:col-span-4">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">
              Khách Hàng Mục Tiêu & Định Vị Phân Khúc (Target Audience)
            </label>
            <AutoResizeTextarea
              minRows={2}
              value={charter.targetAudience}
              onChange={(e) => updateField('targetAudience', e.target.value)}
              placeholder="VD: Hộ gia đình trẻ thành thị, ưa chuộng thiết kế hiện đại, cần tiết kiệm điện và vận hành siêu êm."
              className="w-full text-xs leading-relaxed text-slate-900 rounded border border-slate-300 p-3 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors font-medium"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider flex items-center justify-between">
              <span>Vấn Đề & Cơ Hội Thị Trường (Problem Statement)</span>
              <span className="text-[10px] text-slate-400 font-normal lowercase">tại sao cần làm dự án này?</span>
            </label>
            <AutoResizeTextarea
              minRows={4}
              value={charter.problem}
              onChange={(e) => updateField('problem', e.target.value)}
              placeholder="Mô tả bối cảnh thị trường, khoảng trống sản phẩm của đối thủ, điểm nghẽn của khách hàng..."
              className="w-full text-xs leading-relaxed text-slate-900 rounded border border-slate-300 p-3 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors font-medium"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider flex items-center justify-between">
              <span>Mục Tiêu Kinh Doanh & Lợi Ích Kỳ Vọng (Business Benefits)</span>
              <span className="text-[10px] text-slate-400 font-normal lowercase">sản lượng, doanh số, biên lợi nhuận</span>
            </label>
            <AutoResizeTextarea
              minRows={4}
              value={charter.benefits}
              onChange={(e) => updateField('benefits', e.target.value)}
              placeholder="VD: Sản lượng 80.000 chiếc/năm đầu; Doanh thu 75 tỷ VNĐ; Biên lợi nhuận gộp >= 33%; Hoàn vốn trong 7 tháng..."
              className="w-full text-xs leading-relaxed text-slate-900 rounded border border-slate-300 p-3 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors font-medium"
            />
          </div>
        </div>
      </section>

      {/* ==================== PHẦN 2: MỤC TIÊU SMART & SUCCESS METRICS ==================== */}
      <SectionSuccessMetrics charter={charter} onChange={onChange} />

      {/* ==================== PHẦN 3: PHẠM VI DỰ ÁN (SCOPE) ==================== */}
      <section className="bg-white p-6 rounded-lg shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 flex items-center gap-2">
                III. Phạm Vi Dự Án (Project Scope: In-Scope vs Out-of-Scope)
              </h3>
              <p className="text-[11px] text-slate-400">Thiết lập ranh giới rõ ràng tránh rủi ro phình to phạm vi (Scope Creep)</p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200">
            Section 03
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-emerald-300 rounded-lg p-4 bg-emerald-50/30">
            <div className="flex items-center gap-2 mb-2 text-emerald-900 font-bold text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              TRONG PHẠM VI (IN-SCOPE)
            </div>
            <AutoResizeTextarea
              minRows={6}
              value={charter.scopeIn}
              onChange={(e) => updateField('scopeIn', e.target.value)}
              placeholder="1. Thiết kế dáng công nghiệp (ID) & kết cấu cơ khí (MD)...&#10;2. Thiết kế bo mạch EE và code firmware...&#10;3. Chế tạo bộ khuôn ép nhựa chính và đồ gá kiểm tra...&#10;4. Hồ sơ kiểm định chứng nhận hợp quy..."
              className="w-full text-xs leading-relaxed rounded border border-emerald-200 p-3 bg-white focus:outline-none focus:border-blue-500 font-mono text-slate-900"
            />
            <p className="text-[11px] text-emerald-800 font-semibold mt-2">Hạng mục R&D cam kết bàn giao đầy đủ.</p>
          </div>

          <div className="border border-rose-300 rounded-lg p-4 bg-rose-50/30">
            <div className="flex items-center gap-2 mb-2 text-rose-900 font-bold text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
              NGOÀI PHẠM VI (OUT-OF-SCOPE)
            </div>
            <AutoResizeTextarea
              minRows={6}
              value={charter.scopeOut}
              onChange={(e) => updateField('scopeOut', e.target.value)}
              placeholder="1. Không bao gồm module pin sạc dự phòng (thuộc Phase sau)...&#10;2. Không kèm chi phí quay TVC quảng cáo và bao bì quà tặng...&#10;3. Không tự chế tạo ốc vít, vòng bi (chỉ định mua ngoài)..."
              className="w-full text-xs leading-relaxed rounded border border-rose-200 p-3 bg-white focus:outline-none focus:border-blue-500 font-mono text-slate-900"
            />
            <p className="text-[11px] text-rose-800 font-semibold mt-2">Các hạng mục không thuộc trách nhiệm của đội R&D.</p>
          </div>
        </div>
      </section>

      {/* ==================== PHẦN 4: LỘ TRÌNH STAGE-GATE MILESTONES ==================== */}
      <section className="bg-white p-6 rounded-lg shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 flex items-center gap-2">
                IV. Lộ Trình Cột Mốc Stage-Gate (Hardware Development Cycle)
              </h3>
              <p className="text-[11px] text-slate-400">Concept ➔ EVT (Engineering) ➔ DVT (Design) ➔ PVT (Production) ➔ Mass Production (SOP)</p>
            </div>
          </div>
          <button
            onClick={addMilestone}
            className="px-3 py-1.5 rounded bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Cửa Duyệt</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-slate-200 rounded overflow-hidden">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3 w-1/5">Cửa Duyệt (Gate)</th>
                <th className="p-3 w-2/5">Kết Quả Bàn Giao Cốt Lõi (Key Deliverables)</th>
                <th className="p-3 w-1/6 text-center">Hạn Hoàn Thành</th>
                <th className="p-3 w-1/5">Người Phê Duyệt</th>
                <th className="p-3 w-12 text-center">Xóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {charter.milestones.map((m, index) => (
                <tr key={index} className="hover:bg-slate-50/80 transition">
                  <td className="p-3">
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={m.gate}
                        onChange={(e) => updateMilestone(index, { gate: e.target.value })}
                        className="w-full font-bold text-blue-800 bg-blue-50/70 border border-blue-200 rounded px-2 py-1 text-xs font-mono"
                      />
                      <AutoResizeTextarea
                        minRows={1}
                        value={m.name}
                        onChange={(e) => updateMilestone(index, { name: e.target.value })}
                        className="w-full font-semibold text-slate-900 border border-slate-200 rounded px-2 py-1 text-xs bg-white"
                      />
                    </div>
                  </td>

                  <td className="p-3">
                    <AutoResizeTextarea
                      minRows={2}
                      value={m.deliverables}
                      onChange={(e) => updateMilestone(index, { deliverables: e.target.value })}
                      className="w-full text-xs text-slate-900 border border-slate-300 rounded p-2 focus:border-blue-500 focus:outline-none bg-white leading-normal"
                    />
                  </td>

                  <td className="p-3 text-center">
                    <input
                      type="date"
                      value={m.targetDate}
                      onChange={(e) => updateMilestone(index, { targetDate: e.target.value })}
                      className="text-xs border border-slate-200 rounded p-1.5 text-center font-mono focus:border-blue-500 focus:outline-none bg-white"
                    />
                  </td>

                  <td className="p-3">
                    <AutoResizeTextarea
                      minRows={1}
                      value={m.owner}
                      onChange={(e) => updateMilestone(index, { owner: e.target.value })}
                      className="w-full text-xs border border-slate-200 rounded p-1.5 focus:border-blue-500 focus:outline-none font-medium text-slate-900 bg-white"
                    />
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => removeMilestone(index)}
                      disabled={charter.milestones.length <= 1}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded transition disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ==================== PHẦN 5: ĐỘI NGŨ DỰ ÁN CỐT LÕI (LINH HOẠT VAI TRÒ) ==================== */}
      <section className="bg-white p-6 rounded-lg shadow-xs border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-5 border-b border-slate-100 pb-3 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 flex items-center gap-2">
                V. Đội Ngũ Dự Án & Phân Công Vai Trò (Core Project Team & Roles)
              </h3>
              <p className="text-[11px] text-slate-400">
                Linh hoạt đổi tên vai trò, thêm/xóa vị trí kỹ thuật và phân công nhân sự đảm trách
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Add Custom Role */}
            <button
              type="button"
              onClick={() => addTeamMember()}
              className="px-2.5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              title="Thêm một vai trò mới vào dự án"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Thêm Vai Trò Mới</span>
            </button>

            {/* Quick Add From Catalogue */}
            <div className="relative group">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addTeamMember(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
                className="px-2.5 py-1.5 rounded bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer shadow-xs appearance-none pr-7"
                title="Chọn thêm nhanh vai trò từ danh mục R&D tiêu chuẩn"
              >
                <option value="" disabled>📋 Thêm từ Danh Mục R&D...</option>
                <optgroup label="Vai trò nòng cốt">
                  <option value="mdLead">+ Lead Cơ Khí & Khuôn Mẫu (MD)</option>
                  <option value="eeLead">+ Lead Điện Tử & FW (EE)</option>
                  <option value="idLead">+ Kiểu Dáng Công Nghiệp (ID)</option>
                  <option value="qaLead">+ Đảm Bảo Chất Lượng (QA/QC)</option>
                  <option value="sourcingLead">+ Thu Mua & Cung Ứng (Sourcing)</option>
                  <option value="peLead">+ Kỹ Thuật Sản Xuất (PE)</option>
                  <option value="mktLead">+ Đại Diện Tiếp Thị (Brand/MKT)</option>
                </optgroup>
                <optgroup label="Chuyên ngành kỹ thuật mở rộng">
                  <option value="reliabilityLead">+ Kỹ Sư Độ Tin Cậy (Reliability)</option>
                  <option value="complianceLead">+ An Toàn & Chứng Nhận (Compliance)</option>
                  <option value="iotLead">+ Phần Mềm & IoT (Smart App)</option>
                  <option value="thermalLead">+ Nhiệt Động Lực Học (Thermal)</option>
                  <option value="acousticLead">+ Âm Học & Khí Động (Acoustics/CFD)</option>
                  <option value="packagingLead">+ Thiết Kế Bao Bì (Packaging)</option>
                  <option value="pmoLead">+ Điều Phối Tiến Độ (PMO)</option>
                </optgroup>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>

            {onQuickAutoFillRoster && (
              <button
                type="button"
                onClick={onQuickAutoFillRoster}
                className="px-2.5 py-1.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                title="Tự động điền nhanh họ tên và chức danh từ danh bạ cố định"
              >
                <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                <span>⚡ Tự Điền Roster</span>
              </button>
            )}

            {onOpenRoster && (
              <button
                type="button"
                onClick={onOpenRoster}
                className="px-2.5 py-1.5 rounded bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                title="Quản lý danh bạ nhân sự cố định (có cột STT)"
              >
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>Cấu Hình STT</span>
              </button>
            )}

            <button
              type="button"
              onClick={resetDefaultRoles}
              className="p-1.5 rounded bg-white text-slate-400 hover:text-slate-600 border border-slate-200 hover:bg-slate-50 text-xs transition cursor-pointer"
              title="Khôi phục danh sách 7 vai trò tiêu chuẩn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200">
              Section 05 ({currentTeamMembers.length} vai trò)
            </span>
          </div>
        </div>

        {/* Dynamic List of Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {currentTeamMembers.map((member, index) => (
            <div 
              key={member.id || index}
              className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all space-y-2.5 flex flex-col justify-between"
            >
              {/* Card Header: STT, Role Selector / Input & Actions */}
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                      #{index + 1}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Vai Trò / Vị Trí
                    </span>
                  </div>

                  {/* Reorder and Delete */}
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveTeamMember(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200 disabled:opacity-20 cursor-pointer"
                      title="Di chuyển lên"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveTeamMember(index, 'down')}
                      disabled={index === currentTeamMembers.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200 disabled:opacity-20 cursor-pointer"
                      title="Di chuyển xuống"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      disabled={currentTeamMembers.length <= 1}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 disabled:opacity-20 transition cursor-pointer"
                      title="Xóa vai trò này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Role Title Editable Input with Quick Preset Picker */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={member.roleTitle}
                      onChange={(e) => updateTeamMember(index, { roleTitle: e.target.value })}
                      placeholder="VD: Lead Cơ Khí & Khuôn Mẫu (MD Lead)"
                      className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    
                    {/* Role Preset Quick Switcher */}
                    <select
                      value={member.roleKey || 'custom'}
                      onChange={(e) => handleRolePresetChange(index, e.target.value)}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold border border-slate-300 rounded px-1.5 py-1.5 cursor-pointer max-w-[95px] shrink-0"
                      title="Chọn nhanh vai trò từ danh mục mẫu"
                    >
                      <option value="custom">Đổi mẫu...</option>
                      <optgroup label="Vai trò chính">
                        <option value="mdLead">Lead MD</option>
                        <option value="eeLead">Lead EE/FW</option>
                        <option value="idLead">ID Designer</option>
                        <option value="qaLead">Lead QA/QC</option>
                        <option value="sourcingLead">Sourcing</option>
                        <option value="peLead">PE Lead</option>
                        <option value="mktLead">Brand/MKT</option>
                      </optgroup>
                      <optgroup label="Mở rộng">
                        <option value="reliabilityLead">Reliability</option>
                        <option value="complianceLead">Compliance</option>
                        <option value="iotLead">IoT/App</option>
                        <option value="thermalLead">Thermal</option>
                        <option value="acousticLead">Acoustics</option>
                        <option value="packagingLead">Packaging</option>
                        <option value="pmoLead">PMO</option>
                      </optgroup>
                    </select>
                  </div>
                </div>
              </div>

              {/* Member Name & Job Title */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">
                  Họ Tên & Chức Danh Nhân Sự
                </label>
                <AutoResizeTextarea
                  minRows={1}
                  value={member.memberName}
                  onChange={(e) => updateTeamMember(index, { memberName: e.target.value })}
                  placeholder="VD: Nguyễn Văn Hùng - Trưởng nhóm MD"
                  className="w-full text-xs font-semibold text-slate-900 rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Department & Responsibilities row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200/70 text-[11px]">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Phòng Ban / Khối
                  </label>
                  <input
                    type="text"
                    value={member.department || ''}
                    onChange={(e) => updateTeamMember(index, { department: e.target.value })}
                    placeholder="VD: Phòng Cơ Khí"
                    className="w-full text-[11px] text-slate-700 bg-white border border-slate-200 rounded px-2 py-1 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Trách Nhiệm Chính
                  </label>
                  <input
                    type="text"
                    value={member.responsibilities || ''}
                    onChange={(e) => updateTeamMember(index, { responsibilities: e.target.value })}
                    placeholder="VD: Thiết kế 3D/2D & khuôn"
                    className="w-full text-[11px] text-slate-700 bg-white border border-slate-200 rounded px-2 py-1 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Quick Add Card */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => addTeamMember()}
              className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 transition cursor-pointer border border-slate-200"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>+ Thêm Vị Trí Khác</span>
            </button>
            <span className="text-[11px] text-slate-400">
              Mẹo: Bạn có thể tự do chỉnh sửa tên bất kỳ vai trò nào phù hợp với quy trình nội bộ.
            </span>
          </div>

          <div className="text-[11px] font-medium text-slate-600">
            Tổng cộng: <strong className="text-slate-900 font-mono">{currentTeamMembers.length}</strong> thành viên
          </div>
        </div>
      </section>

      {/* ==================== PHẦN 6: DỰ TOÁN NGÂN SÁCH (CÔNG THỨC ĐỘNG) ==================== */}
      <SectionBudget charter={charter} onChange={onChange} />

      {/* ==================== PHẦN 7: RỦI RO TRỌNG YẾU (RISK MATRIX) ==================== */}
      <section className="bg-[#1e293b] p-6 rounded-lg shadow-xs text-white border border-slate-700">
        <div className="flex items-center justify-between mb-5 border-b border-slate-700 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                VII. Rủi Ro Trọng Yếu & Ứng Phó (Risk Matrix)
              </h3>
              <p className="text-[11px] text-slate-400">Đánh giá tác động và biện pháp kiểm soát kỹ thuật</p>
            </div>
          </div>
          <button
            onClick={addRisk}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Thêm Rủi Ro</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {charter.risks.map((r, idx) => (
            <div key={r.id || idx} className="p-3.5 rounded border border-slate-700 bg-slate-800/80 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-200">Rủi ro #{idx + 1}</span>
                <div className="flex items-center gap-2">
                  <select
                    aria-label="Mức độ ảnh hưởng của rủi ro"
                    value={r.impact}
                    onChange={(e) => updateRisk(idx, { impact: e.target.value as any })}
                    className="text-[10px] font-bold border border-slate-600 rounded px-1.5 py-0.5 bg-slate-900 text-white cursor-pointer"
                  >
                    <option value="High">Cao (High Impact)</option>
                    <option value="Medium">Vừa (Medium)</option>
                    <option value="Low">Thấp (Low)</option>
                  </select>
                  <button
                    onClick={() => removeRisk(idx)}
                    className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <AutoResizeTextarea
                minRows={1}
                value={r.title}
                onChange={(e) => updateRisk(idx, { title: e.target.value })}
                placeholder="Tiêu đề rủi ro (VD: Sai lệch thông số khuôn ép)"
                className="w-full text-xs font-semibold rounded border border-slate-600 p-2 bg-slate-900 text-white focus:border-blue-400 focus:outline-none"
              />
              <AutoResizeTextarea
                minRows={2}
                value={r.mitigation}
                onChange={(e) => updateRisk(idx, { mitigation: e.target.value })}
                placeholder="Biện pháp ứng phó..."
                className="w-full text-xs rounded border border-slate-600 p-2 bg-slate-900 text-slate-200 focus:border-blue-400 focus:outline-none leading-relaxed"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ==================== PHẦN 8: THẨM QUYỀN PM & HỘI ĐỒNG KÝ DUYỆT ==================== */}
      <SectionSignOff charter={charter} onChange={onChange} onOpenRoster={onOpenRoster} />

      {/* Floating Bottom Action Bar (Geometric Balance Style) */}
      <div className="p-4 bg-slate-900 text-white rounded-lg shadow-xs border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <div>
            <p className="text-xs font-bold text-slate-200">Trạng thái: Sẵn sàng kết xuất dữ liệu & lưu trữ</p>
            <p className="text-[10px] text-slate-400">Bảo toàn công thức toán học và bảng màu chuẩn khi xuất Excel</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onSave}
            className="flex-1 sm:flex-initial px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Lưu Lịch Sử</span>
          </button>

          <button
            onClick={onExportExcel}
            className="flex-1 sm:flex-initial px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            <span>Xuất File Excel (.xlsx)</span>
          </button>
        </div>
      </div>

    </div>
  );
};

