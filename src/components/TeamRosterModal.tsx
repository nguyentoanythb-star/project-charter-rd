import React, { useState, useEffect } from 'react';
import { 
  Users, 
  X, 
  Save, 
  Zap, 
  Plus, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  UserCheck, 
  ShieldCheck, 
  Briefcase, 
  Building2,
  HelpCircle,
  ArrowDown,
  ArrowUp,
  Tag,
  Edit3
} from 'lucide-react';
import { TeamRosterMember, ProjectCharterData, ProjectTeamMember } from '../types/charter';
import { DEFAULT_TEAM_ROSTER } from '../data/defaultRoster';
import { STANDARD_RD_ROLES } from '../data/standardRoles';

interface TeamRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  charter?: ProjectCharterData;
  currentCharter?: ProjectCharterData;
  onApplyRosterToCharter: (updatedCharter: ProjectCharterData) => void;
  onSaveToast?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ROSTER_STORAGE_KEY = 'rnd_appliance_team_roster_preset_v1';

export const getStoredTeamRoster = (): TeamRosterMember[] => {
  try {
    const stored = localStorage.getItem(ROSTER_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading team roster from localStorage', e);
  }
  return DEFAULT_TEAM_ROSTER;
};

export const applyRosterDataToCharter = (
  roster: TeamRosterMember[],
  currentCharter: ProjectCharterData,
  includeTitle: boolean = true
): ProjectCharterData => {
  if (!currentCharter) return currentCharter;
  const findMember = (roleKey: string) => {
    return (roster || []).find(m => m.roleKey === roleKey);
  };

  const formatName = (member?: TeamRosterMember) => {
    if (!member || !member.fullName.trim()) return '';
    if (includeTitle && member.jobTitle.trim()) {
      return `${member.fullName.trim()} - ${member.jobTitle.trim()}`;
    }
    return member.fullName.trim();
  };

  const formatSignOff = (member?: TeamRosterMember, defaultRoleTitle: string = '') => {
    if (!member || !member.fullName.trim()) return defaultRoleTitle;
    if (member.jobTitle.trim()) {
      return `${member.fullName.trim()} (${member.jobTitle.trim()})`;
    }
    return member.fullName.trim();
  };

  const sponsorMember = findMember('sponsor');
  const pmMember = findMember('pm');
  const mdMember = findMember('mdLead');
  const eeMember = findMember('eeLead');
  const idMember = findMember('idLead');
  const qaMember = findMember('qaLead');
  const sourcingMember = findMember('sourcingLead');
  const peMember = findMember('peLead');
  const mktMember = findMember('mktLead');
  const factoryMember = findMember('factory');

  const existingTeam = currentCharter.team || {
    mdLead: '',
    eeLead: '',
    idLead: '',
    qaLead: '',
    sourcingLead: '',
    peLead: '',
    mktLead: ''
  };

  const existingSign = currentCharter.signMatrix || {
    sponsor: '',
    pm: '',
    qa: '',
    factory: ''
  };

  // Map non-sponsor, non-factory to teamMembers
  const engineeringRoster = roster.filter(m => m.roleKey !== 'sponsor' && m.roleKey !== 'factory');
  const mappedTeamMembers: ProjectTeamMember[] = engineeringRoster.map((m, idx) => ({
    id: `tm_roster_${m.id || idx}`,
    roleKey: m.roleKey,
    roleTitle: m.roleName || 'Vị trí kỹ thuật',
    memberName: formatName(m),
    department: m.department || '',
    responsibilities: ''
  }));

  return {
    ...currentCharter,
    sponsor: sponsorMember ? formatName(sponsorMember) : (currentCharter.sponsor || ''),
    pm: pmMember ? formatName(pmMember) : (currentCharter.pm || ''),
    team: {
      mdLead: mdMember ? formatName(mdMember) : existingTeam.mdLead,
      eeLead: eeMember ? formatName(eeMember) : existingTeam.eeLead,
      idLead: idMember ? formatName(idMember) : existingTeam.idLead,
      qaLead: qaMember ? formatName(qaMember) : existingTeam.qaLead,
      sourcingLead: sourcingMember ? formatName(sourcingMember) : existingTeam.sourcingLead,
      peLead: peMember ? formatName(peMember) : existingTeam.peLead,
      mktLead: mktMember ? formatName(mktMember) : existingTeam.mktLead,
    },
    teamMembers: mappedTeamMembers.length > 0 ? mappedTeamMembers : currentCharter.teamMembers,
    signMatrix: {
      sponsor: sponsorMember ? formatSignOff(sponsorMember, 'Project Sponsor') : existingSign.sponsor,
      pm: pmMember ? formatSignOff(pmMember, 'Project Manager') : existingSign.pm,
      qa: qaMember ? formatSignOff(qaMember, 'Lead QA/QC') : existingSign.qa,
      factory: factoryMember ? formatSignOff(factoryMember, 'Giám Đốc Nhà Máy') : existingSign.factory,
    }
  };
};

export const TeamRosterModal: React.FC<TeamRosterModalProps> = ({
  isOpen,
  onClose,
  charter,
  currentCharter,
  onApplyRosterToCharter,
  onSaveToast
}) => {
  const activeCharterData = charter || currentCharter;
  const [rosterList, setRosterList] = useState<TeamRosterMember[]>([]);
  const [includeTitleInForm, setIncludeTitleInForm] = useState<boolean>(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const safeToast = (msg: string, type?: 'success' | 'info' | 'error') => {
    if (typeof onSaveToast === 'function') {
      onSaveToast(msg, type);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setRosterList(getStoredTeamRoster());
      setHasUnsavedChanges(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const updateMember = (index: number, field: keyof TeamRosterMember, value: any) => {
    const updated = [...rosterList];
    updated[index] = { ...updated[index], [field]: value };
    setRosterList(updated);
    setHasUnsavedChanges(true);
  };

  const handleRoleKeyChange = (index: number, selectedKey: string) => {
    const stdRole = STANDARD_RD_ROLES.find(r => r.key === selectedKey);
    const updated = [...rosterList];
    if (stdRole) {
      updated[index] = {
        ...updated[index],
        roleKey: selectedKey,
        roleName: stdRole.title,
        department: updated[index].department || stdRole.defaultDepartment
      };
    } else {
      updated[index] = {
        ...updated[index],
        roleKey: selectedKey
      };
    }
    setRosterList(updated);
    setHasUnsavedChanges(true);
  };

  const addMember = () => {
    const nextStt = rosterList.length + 1;
    const newMember: TeamRosterMember = {
      id: `roster_${Date.now()}`,
      stt: nextStt,
      roleKey: 'custom',
      roleName: 'Vị trí bổ sung / Kỹ sư chính',
      fullName: '',
      jobTitle: 'Kỹ sư R&D',
      department: 'Khối Kỹ Thuật'
    };
    setRosterList([...rosterList, newMember]);
    setHasUnsavedChanges(true);
  };

  const removeMember = (index: number) => {
    const updated = rosterList
      .filter((_, i) => i !== index)
      .map((item, idx) => ({ ...item, stt: idx + 1 }));
    setRosterList(updated);
    setHasUnsavedChanges(true);
  };

  const moveRow = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === rosterList.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...rosterList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Recalculate STT
    const reindexed = updated.map((item, idx) => ({ ...item, stt: idx + 1 }));
    setRosterList(reindexed);
    setHasUnsavedChanges(true);
  };

  const handleSaveFixedRoster = () => {
    try {
      localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(rosterList));
      setHasUnsavedChanges(false);
      safeToast('Đã lưu cố định danh bạ nhân sự & chức danh vào hệ thống!', 'success');
    } catch (e) {
      console.error(e);
      safeToast('Không thể lưu vào bộ nhớ trình duyệt', 'error');
    }
  };

  const handleApplyToCurrentCharter = () => {
    // Save to local storage first
    try {
      localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(rosterList));
    } catch (e) {
      console.error(e);
    }
    
    // Apply mapping to the active charter
    if (activeCharterData) {
      const updatedCharter = applyRosterDataToCharter(rosterList, activeCharterData, includeTitleInForm);
      onApplyRosterToCharter(updatedCharter);
      safeToast('Đã tự động điền toàn bộ nhân sự & vai trò vào Dự án hiện tại!', 'success');
      onClose();
    } else {
      safeToast('Không tìm thấy dự án hiện tại để áp dụng', 'error');
    }
  };

  const handleResetDefaults = () => {
    setRosterList(DEFAULT_TEAM_ROSTER);
    setHasUnsavedChanges(true);
    safeToast('Đã khôi phục mẫu nhân sự mặc định', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                  Quản Lý Danh Bạ & Thay Đổi Vai Trò Cố Định (R&D Team Roster)
                </h3>
                {hasUnsavedChanges && (
                  <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded font-medium">
                    Chưa lưu
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Tùy chỉnh, đổi tên vai trò, thêm vị trí mới và lưu cố định để tự động điền vào biểu mẫu điều lệ dự án
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Options */}
        <div className="px-6 py-3 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={addMember}
              className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Thêm Vai Trò / Nhân Sự</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="px-3 py-1.5 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 font-medium flex items-center gap-1.5 transition cursor-pointer"
              title="Khôi phục danh sách vai trò mặc định"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Mẫu Tiêu Chuẩn (10 Vai Trò)</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none text-[11px]">
              <input
                type="checkbox"
                checked={includeTitleInForm}
                onChange={(e) => setIncludeTitleInForm(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
              <span>Kèm Chức danh khi điền (VD: &quot;Nguyễn Văn Tuấn - Giám Đốc R&D&quot;)</span>
            </label>
          </div>
        </div>

        {/* Table Content */}
        <div className="p-6 overflow-y-auto flex-1 divide-y divide-slate-100">
          <div className="border border-slate-200 rounded overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="p-2.5 w-12 text-center">STT</th>
                  <th className="p-2.5 w-1/3">Vị Trí / Vai Trò Dự Án</th>
                  <th className="p-2.5 w-1/4">Họ Và Tên</th>
                  <th className="p-2.5 w-1/4">Chức Danh Công Tác</th>
                  <th className="p-2.5 w-1/5">Phòng Ban / Khối</th>
                  <th className="p-2.5 w-16 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {rosterList.map((member, index) => (
                  <tr key={member.id || index} className="hover:bg-slate-50/70 transition group">
                    {/* STT Column */}
                    <td className="p-2.5 text-center font-mono font-bold text-slate-500 bg-slate-50/50">
                      {member.stt || index + 1}
                    </td>

                    {/* Role in Project */}
                    <td className="p-2.5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <select
                            value={member.roleKey}
                            onChange={(e) => handleRoleKeyChange(index, e.target.value)}
                            className="w-full text-[11px] font-semibold text-slate-800 border border-slate-200 rounded px-2 py-1 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none"
                          >
                            <optgroup label="Vai trò nòng cốt (Core R&D)">
                              <option value="sponsor">1. Project Sponsor (Người bảo trợ)</option>
                              <option value="pm">2. Project Manager (PM - Chủ nhiệm)</option>
                              <option value="mdLead">3. Lead Cơ Khí & Khuôn Mẫu (MD)</option>
                              <option value="eeLead">4. Lead Điện Tử & FW (EE)</option>
                              <option value="idLead">5. Kiểu Dáng Công Nghiệp (ID)</option>
                              <option value="qaLead">6. Đảm Bảo Chất Lượng (QA/QC)</option>
                              <option value="sourcingLead">7. Thu Mua & Cung Ứng (Sourcing)</option>
                              <option value="peLead">8. Kỹ Thuật Sản Xuất (PE)</option>
                              <option value="mktLead">9. Đại Diện Tiếp Thị (Brand/MKT)</option>
                            </optgroup>
                            <optgroup label="Chuyên ngành kỹ thuật mở rộng">
                              <option value="reliabilityLead">10. Kỹ Sư Độ Tin Cậy (Reliability)</option>
                              <option value="complianceLead">11. An Toàn & Chứng Nhận (Compliance)</option>
                              <option value="iotLead">12. Phần Mềm & IoT (Smart App)</option>
                              <option value="thermalLead">13. Nhiệt Động Lực Học (Thermal)</option>
                              <option value="acousticLead">14. Âm Học & Khí Động (Acoustics/CFD)</option>
                              <option value="packagingLead">15. Thiết Kế Bao Bì (Packaging)</option>
                              <option value="pmoLead">16. Điều Phối Tiến Độ (PMO)</option>
                              <option value="factory">17. Giám Đốc Nhà Máy (Ký duyệt)</option>
                              <option value="custom">18. ✍️ Tự Đặt Tên Vai Trò Khác...</option>
                            </optgroup>
                          </select>
                        </div>
                        <input
                          type="text"
                          value={member.roleName}
                          onChange={(e) => updateMember(index, 'roleName', e.target.value)}
                          placeholder="Chỉnh sửa tên vai trò hiển thị"
                          className="w-full text-[11px] text-slate-700 font-medium border border-slate-200 rounded px-2 py-1 bg-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </td>

                    {/* Full Name */}
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={member.fullName}
                        onChange={(e) => updateMember(index, 'fullName', e.target.value)}
                        placeholder="VD: Nguyễn Văn Tuấn"
                        className="w-full font-bold text-slate-900 border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>

                    {/* Job Title */}
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={member.jobTitle}
                        onChange={(e) => updateMember(index, 'jobTitle', e.target.value)}
                        placeholder="VD: Giám Đốc Kỹ Thuật R&D"
                        className="w-full text-slate-700 border border-slate-200 rounded px-2.5 py-1.5 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none"
                      />
                    </td>

                    {/* Department */}
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={member.department}
                        onChange={(e) => updateMember(index, 'department', e.target.value)}
                        placeholder="VD: Khối R&D"
                        className="w-full text-slate-600 border border-slate-200 rounded px-2.5 py-1.5 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none text-[11px]"
                      />
                    </td>

                    {/* Actions */}
                    <td className="p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => moveRow(index, 'up')}
                          disabled={index === 0}
                          title="Di chuyển lên"
                          className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => moveRow(index, 'down')}
                          disabled={index === rosterList.length - 1}
                          title="Di chuyển xuống"
                          className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeMember(index)}
                          title="Xóa nhân sự"
                          className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-blue-50/50 border border-blue-100 rounded text-xs text-slate-600 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-[11px] leading-relaxed">
              <strong className="text-slate-800">Tính năng thay đổi và thêm/chỉnh sửa vai trò:</strong>
              <p>
                - Bạn có thể <strong>chọn nhanh vai trò</strong> từ danh mục chuẩn hoặc <strong>tự do sửa đổi tên vai trò</strong> trực tiếp trong ô nhập.
              </p>
              <p>
                - Khi nhấn <strong>&quot;Lưu Cố Định&quot;</strong>: Mọi vai trò và nhân sự đã chỉnh sửa sẽ được ghi nhớ vĩnh viễn trên trình duyệt của bạn.
              </p>
              <p>
                - Khi nhấn <strong>&quot;⚡ Tự Động Điền Vào Form&quot;</strong>: Toàn bộ danh sách vai trò sẽ được đồng bộ ngay vào biểu mẫu và xuất ra báo cáo A4.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Tổng cộng: <strong className="text-slate-900 font-mono">{rosterList.length}</strong> vai trò & nhân sự</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleSaveFixedRoster}
              className="px-4 py-2 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-slate-600" />
              <span>Lưu Cố Định (Roster)</span>
            </button>

            <button
              onClick={handleApplyToCurrentCharter}
              className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>⚡ Tự Động Điền Vào Form</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

