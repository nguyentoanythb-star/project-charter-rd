import React from 'react';
import { 
  FileCheck, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw, 
  Sparkles, 
  UserCheck, 
  Shield, 
  Zap,
  Building
} from 'lucide-react';
import { ProjectCharterData, SignOffMember } from '../types/charter';
import { AutoResizeTextarea } from './AutoResizeTextarea';
import { STANDARD_SIGN_OFF_ROLES_CATALOGUE, PM_AUTHORITY_PRESETS } from '../data/standardCriteria';

interface SectionSignOffProps {
  charter: ProjectCharterData;
  onChange: (updated: ProjectCharterData) => void;
  onOpenRoster?: () => void;
}

export const SectionSignOff: React.FC<SectionSignOffProps> = ({ charter, onChange, onOpenRoster }) => {
  const currentSignOffMembers: SignOffMember[] = (charter.signOffMembers && charter.signOffMembers.length > 0)
    ? charter.signOffMembers
    : [
        {
          id: 'som_sponsor',
          roleKey: 'sponsor',
          roleTitle: '1. Project Sponsor:',
          signOffName: charter.signMatrix?.sponsor || charter.sponsor || 'Nguyễn Văn Tuấn (Giám Đốc Kỹ Thuật R&D)',
          department: 'Khối R&D',
          isRequired: true
        },
        {
          id: 'som_pm',
          roleKey: 'pm',
          roleTitle: '2. Project Manager:',
          signOffName: charter.signMatrix?.pm || charter.pm || 'Trần Minh Quang (Trưởng phòng Quản lý Dự án R&D)',
          department: 'Ban PMO',
          isRequired: true
        },
        {
          id: 'som_qa',
          roleKey: 'qa',
          roleTitle: '3. Lead QA/QC:',
          signOffName: charter.signMatrix?.qa || (charter.team as any)?.qaLead || 'Bùi Thị Mai (Trưởng phòng Đảm bảo Chất lượng R&D)',
          department: 'Khối Quản Lý Chất Lượng',
          isRequired: true
        },
        {
          id: 'som_factory',
          roleKey: 'factory',
          roleTitle: '4. Giám Đốc Nhà Máy (PE):',
          signOffName: charter.signMatrix?.factory || 'Vũ Mạnh Hùng (Giám Đốc Khối Sản Xuất & Lắp Ráp)',
          department: 'Khối Nhà Máy',
          isRequired: true
        }
      ];

  const updateSignOffMember = (index: number, updated: Partial<SignOffMember>) => {
    const newMembers = [...currentSignOffMembers];
    newMembers[index] = { ...newMembers[index], ...updated };

    // Synchronize to traditional signMatrix
    const newSignMatrix = {
      sponsor: newMembers.find(m => m.roleKey === 'sponsor')?.signOffName || charter.signMatrix?.sponsor || '',
      pm: newMembers.find(m => m.roleKey === 'pm')?.signOffName || charter.signMatrix?.pm || '',
      qa: newMembers.find(m => m.roleKey === 'qa')?.signOffName || charter.signMatrix?.qa || '',
      factory: newMembers.find(m => m.roleKey === 'factory')?.signOffName || charter.signMatrix?.factory || ''
    };

    onChange({
      ...charter,
      signOffMembers: newMembers,
      signMatrix: newSignMatrix
    });
  };

  const handlePresetChange = (index: number, selectedKey: string) => {
    const std = STANDARD_SIGN_OFF_ROLES_CATALOGUE.find(r => r.roleKey === selectedKey);
    if (std) {
      updateSignOffMember(index, {
        roleKey: std.roleKey,
        roleTitle: `${index + 1}. ${std.roleTitle.replace(/^\d+\.\s*/, '')}`,
        signOffName: currentSignOffMembers[index].signOffName || std.defaultSignOff,
        department: currentSignOffMembers[index].department || std.department
      });
    }
  };

  const addSignOffMember = (presetKey?: string) => {
    let newMember: SignOffMember;
    const std = STANDARD_SIGN_OFF_ROLES_CATALOGUE.find(r => r.roleKey === presetKey);
    if (std) {
      newMember = {
        id: `som_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        roleKey: std.roleKey,
        roleTitle: `${currentSignOffMembers.length + 1}. ${std.roleTitle.replace(/^\d+\.\s*/, '')}`,
        signOffName: std.defaultSignOff,
        department: std.department,
        isRequired: true
      };
    } else {
      newMember = {
        id: `som_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        roleKey: 'custom',
        roleTitle: `${currentSignOffMembers.length + 1}. Đại diện phê duyệt bổ sung`,
        signOffName: '',
        department: 'Khối chức năng',
        isRequired: true
      };
    }

    const newMembers = [...currentSignOffMembers, newMember];
    onChange({
      ...charter,
      signOffMembers: newMembers
    });
  };

  const removeSignOffMember = (index: number) => {
    if (currentSignOffMembers.length <= 1) return;
    const newMembers = currentSignOffMembers.filter((_, i) => i !== index);
    onChange({
      ...charter,
      signOffMembers: newMembers
    });
  };

  const moveSignOffMember = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === currentSignOffMembers.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newMembers = [...currentSignOffMembers];
    const temp = newMembers[index];
    newMembers[index] = newMembers[targetIndex];
    newMembers[targetIndex] = temp;
    onChange({
      ...charter,
      signOffMembers: newMembers
    });
  };

  const resetDefaultSignOff = () => {
    const defaultList: SignOffMember[] = STANDARD_SIGN_OFF_ROLES_CATALOGUE.slice(0, 4).map((std, idx) => ({
      id: `som_${std.roleKey}`,
      roleKey: std.roleKey,
      roleTitle: `${idx + 1}. ${std.roleTitle.replace(/^\d+\.\s*/, '')}`,
      signOffName: std.defaultSignOff,
      department: std.department,
      isRequired: true
    }));

    onChange({
      ...charter,
      signOffMembers: defaultList,
      signMatrix: {
        sponsor: defaultList[0].signOffName,
        pm: defaultList[1].signOffName,
        qa: defaultList[2].signOffName,
        factory: defaultList[3].signOffName
      }
    });
  };

  const appendAuthorityClause = (clause: string) => {
    const current = charter.pmAuthority || '';
    if (current.includes(clause)) return;
    const separator = current.trim().endsWith(';') || current.trim().endsWith('.') ? ' ' : '; ';
    onChange({
      ...charter,
      pmAuthority: current ? `${current.trim()}${separator}${clause}` : clause
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
              <Shield className="w-4 h-4 text-blue-600" />
              VIII. Thẩm Quyền PM & Hội Đồng Ký Duyệt
            </h3>
            <p className="text-[11px] text-slate-400">
              Tùy biến ranh giới thẩm quyền của PM và thiết lập hội đồng phê duyệt điều lệ theo cơ cấu tổ chức
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
                  addSignOffMember(e.target.value);
                  e.target.value = '';
                }
              }}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded cursor-pointer transition shadow-2xs"
              title="Thêm vai trò phê duyệt từ hội đồng chuẩn"
            >
              <option value="" disabled>📋 Thêm Vai Trò Ký Duyệt...</option>
              {STANDARD_SIGN_OFF_ROLES_CATALOGUE.map(item => (
                <option key={item.roleKey} value={item.roleKey}>
                  + {item.roleTitle.replace(/^\d+\.\s*/, '')}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => addSignOffMember()}
            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer shadow-2xs"
            title="Thêm người ký duyệt tùy chỉnh mới"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Thêm Người Ký</span>
          </button>

          {onOpenRoster && (
            <button
              type="button"
              onClick={onOpenRoster}
              className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
              title="Mở danh bạ cố định để tra cứu nhân sự"
            >
              <Building className="w-3.5 h-3.5" />
              <span>Danh Bạ R&D</span>
            </button>
          )}

          <button
            type="button"
            onClick={resetDefaultSignOff}
            className="px-2 py-1 text-slate-500 hover:text-slate-800 rounded bg-slate-100 hover:bg-slate-200 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
            title="Khôi phục 4 người ký mặc định"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Khôi phục</span>
          </button>

          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            Section 08 ({currentSignOffMembers.length})
          </span>
        </div>
      </div>

      <div className="space-y-5">
        {/* PM Authority Box with Template Selector */}
        <div className="p-4 rounded-lg bg-slate-50/80 border border-slate-200 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Quyền Hạn Của Project Manager (PM Authority)
            </label>

            {/* PM Authority Presets */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-500 font-medium">Mẫu thẩm quyền:</span>
              <select
                value=""
                onChange={(e) => {
                  const preset = PM_AUTHORITY_PRESETS.find(p => p.id === e.target.value);
                  if (preset) {
                    onChange({ ...charter, pmAuthority: preset.content });
                  }
                  e.target.value = '';
                }}
                className="text-[10px] font-semibold text-slate-700 bg-white border border-slate-300 rounded px-2 py-0.5 cursor-pointer"
              >
                <option value="" disabled>Chọn mẫu thẩm quyền R&D...</option>
                {PM_AUTHORITY_PRESETS.map(preset => (
                  <option key={preset.id} value={preset.id}>
                    {preset.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <AutoResizeTextarea
            minRows={3}
            value={charter.pmAuthority}
            onChange={(e) => onChange({ ...charter, pmAuthority: e.target.value })}
            placeholder="Quy định rõ phạm vi quyền hạn và giới hạn phê duyệt của Project Manager..."
            className="w-full text-xs leading-relaxed text-slate-900 font-medium rounded border border-slate-300 p-3 bg-white focus:border-blue-500 focus:outline-none transition-colors"
          />

          {/* Quick Clauses Badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Chèn nhanh:</span>
            <button
              type="button"
              onClick={() => appendAuthorityClause('Toàn quyền điều phối và phân bổ nguồn lực kỹ sư nội bộ trong suốt vòng đời dự án.')}
              className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition text-[10px] cursor-pointer"
            >
              + Phân bổ kỹ sư R&D
            </button>
            <button
              type="button"
              onClick={() => appendAuthorityClause('Quyền yêu cầu dừng chạy thử dây chuyền nếu phát hiện nguy cơ lỗi an toàn điện hoặc cháy nổ.')}
              className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition text-[10px] cursor-pointer"
            >
              + Quyền dừng dây chuyền (An toàn)
            </button>
            <button
              type="button"
              onClick={() => appendAuthorityClause('Chủ động phê duyệt điều chỉnh thông số phụ tùng thay thế miễn không vượt tổng định mức Target BOM.')}
              className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition text-[10px] cursor-pointer"
            >
              + Duyệt linh kiện trong Target BOM
            </button>
            <button
              type="button"
              onClick={() => appendAuthorityClause('Được quyền sử dụng linh hoạt quỹ dự phòng Contingency Fund trong hạn mức 10%.')}
              className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 transition text-[10px] cursor-pointer"
            >
              + Sử dụng quỹ Contingency 10%
            </button>
          </div>
        </div>

        {/* Sign-Off Matrix Cards */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Hội Đồng Ký Duyệt Bắt Buộc (Sign-off Matrix)
            </label>
            <span className="text-[11px] text-slate-400">
              Có thể thêm Giám Đốc Tài Chính (CFO), Giám Đốc Bán Hàng (CMO) hoặc Tổng Giám Đốc theo yêu cầu.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {currentSignOffMembers.map((member, index) => (
              <div 
                key={member.id || index}
                className="p-3.5 rounded-lg border border-slate-300 bg-slate-50/80 hover:bg-slate-50 transition flex flex-col justify-between space-y-2.5"
              >
                <div>
                  {/* Top: Role Title & Actions */}
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <input
                        type="text"
                        value={member.roleTitle}
                        onChange={(e) => updateSignOffMember(index, { roleTitle: e.target.value })}
                        placeholder="Tên vai trò ký..."
                        className="text-[11px] font-bold text-blue-900 bg-white border border-slate-200 rounded px-1.5 py-0.5 w-full focus:border-blue-500 focus:outline-none truncate"
                      />
                    </div>

                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveSignOffMember(index, 'up')}
                        disabled={index === 0}
                        className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                        title="Di chuyển sang trái / lên"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSignOffMember(index, 'down')}
                        disabled={index === currentSignOffMembers.length - 1}
                        className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                        title="Di chuyển sang phải / xuống"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSignOffMember(index)}
                        disabled={currentSignOffMembers.length <= 1}
                        className="p-0.5 text-slate-400 hover:text-rose-600 disabled:opacity-20 transition cursor-pointer"
                        title="Xóa người ký này"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Role Preset Quick Switcher */}
                  <div className="mb-2">
                    <select
                      value={member.roleKey || 'custom'}
                      onChange={(e) => handlePresetChange(index, e.target.value)}
                      className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium border border-slate-300 rounded px-1.5 py-0.5 cursor-pointer w-full"
                      title="Chọn vai trò từ hội đồng mẫu"
                    >
                      <option value="custom">Chọn mẫu chức danh...</option>
                      {STANDARD_SIGN_OFF_ROLES_CATALOGUE.map(std => (
                        <option key={std.roleKey} value={std.roleKey}>{std.roleTitle.replace(/^\d+\.\s*/, '')}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sign-Off Person Name & Title */}
                  <AutoResizeTextarea
                    minRows={2}
                    value={member.signOffName}
                    onChange={(e) => updateSignOffMember(index, { signOffName: e.target.value })}
                    placeholder="Họ tên & Chức vụ (VD: Nguyễn Văn A - Giám Đốc R&D)"
                    className="w-full text-xs font-semibold text-slate-900 rounded border border-slate-300 p-2 bg-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Department Info */}
                <div className="pt-1.5 border-t border-slate-200/80">
                  <input
                    type="text"
                    value={member.department || ''}
                    onChange={(e) => updateSignOffMember(index, { department: e.target.value })}
                    placeholder="Phòng ban / Khối..."
                    className="w-full text-[10px] text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:outline-none px-1 py-0.5 rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
