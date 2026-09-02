import { ProjectCharterData, ProjectTeamMember, SuccessMetricItem, BudgetItemDetail, SignOffMember } from '../types/charter';
import { PRESET_CHARTERS } from '../data/presets';
import { STANDARD_SUCCESS_METRICS_CATALOGUE, STANDARD_BUDGET_CATALOGUE, STANDARD_SIGN_OFF_ROLES_CATALOGUE, PM_AUTHORITY_PRESETS } from '../data/standardCriteria';

export const DEFAULT_BUDGET = {
  tooling: 580000000,
  prototype: 65000000,
  certTesting: 40000000,
  jigPilot: 45000000,
  contingencyRate: 0.10,
  currency: 'VND' as const
};

export const DEFAULT_BASE_ROLES: Array<{ roleKey: string; roleTitle: string; defaultDepartment: string }> = [
  { roleKey: 'mdLead', roleTitle: 'Lead Cơ Khí & Khuôn Mẫu (MD Lead)', defaultDepartment: 'Phòng Cơ Khí - Khối R&D' },
  { roleKey: 'eeLead', roleTitle: 'Lead Điện Tử & Firmware (EE/FW Lead)', defaultDepartment: 'Phòng Điện Tử - Khối R&D' },
  { roleKey: 'idLead', roleTitle: 'Kiểu Dáng Công Nghiệp (ID Designer)', defaultDepartment: 'Phòng Thiết Kế Kiểu Dáng' },
  { roleKey: 'qaLead', roleTitle: 'Đảm Bảo Chất Lượng (QA/QC Lead)', defaultDepartment: 'Khối Quản Lý Chất Lượng' },
  { roleKey: 'sourcingLead', roleTitle: 'Thu Mua & Cung Ứng (Sourcing Lead)', defaultDepartment: 'Khối Chuỗi Cung Ứng' },
  { roleKey: 'peLead', roleTitle: 'Kỹ Thuật Sản Xuất (PE / Process Lead)', defaultDepartment: 'Khối Kỹ Thuật Nhà Máy' },
  { roleKey: 'mktLead', roleTitle: 'Đại Diện Tiếp Thị & Bán Hàng (Brand & MKT)', defaultDepartment: 'Khối Tiếp Thị & Kinh Doanh' }
];

export const normalizeCharter = (raw?: any): ProjectCharterData => {
  if (!raw || typeof raw !== 'object') {
    return { ...PRESET_CHARTERS.fan, id: `charter_${Date.now()}` };
  }

  const rawBudget = raw.budget || {};
  const rawTeam = raw.team || {};
  const rawSign = raw.signMatrix || {};

  // Normalize Team Members
  let normalizedTeamMembers: ProjectTeamMember[] = [];
  if (Array.isArray(raw.teamMembers) && raw.teamMembers.length > 0) {
    normalizedTeamMembers = raw.teamMembers.map((m: any, idx: number) => ({
      id: m.id || `tm_${Date.now()}_${idx}`,
      roleKey: m.roleKey || 'custom',
      roleTitle: m.roleTitle || m.role || 'Vị trí kỹ thuật',
      memberName: m.memberName || m.name || '',
      department: m.department || '',
      responsibilities: m.responsibilities || ''
    }));
  } else {
    normalizedTeamMembers = DEFAULT_BASE_ROLES.map((base, idx) => ({
      id: `tm_base_${base.roleKey}_${idx}`,
      roleKey: base.roleKey,
      roleTitle: base.roleTitle,
      memberName: rawTeam[base.roleKey] || '',
      department: base.defaultDepartment,
      responsibilities: ''
    }));
  }

  // Normalize Success Metrics
  let normalizedSuccessMetrics: SuccessMetricItem[] = [];
  if (Array.isArray(raw.successMetrics) && raw.successMetrics.length > 0) {
    normalizedSuccessMetrics = raw.successMetrics.map((m: any, idx: number) => ({
      id: m.id || `sm_${Date.now()}_${idx}`,
      key: m.key || 'custom',
      title: m.title || `Tiêu chí #${idx + 1}`,
      category: m.category || 'Chất lượng',
      categoryColor: m.categoryColor || 'blue',
      value: m.value || '',
      description: m.description || ''
    }));
  } else {
    normalizedSuccessMetrics = [
      {
        id: 'sm_bom',
        key: 'bom',
        title: 'Giá Thành Định Mức (Target BOM)',
        category: 'Tài chính',
        categoryColor: 'amber',
        value: raw.bomTarget || STANDARD_SUCCESS_METRICS_CATALOGUE[0].defaultValue,
        description: 'Gồm linh kiện mạch, động cơ, vỏ nhựa & bao bì xuất xưởng.'
      },
      {
        id: 'sm_sop',
        key: 'sop',
        title: 'Hạn Bắt Đầu Sản Xuất Hàng Loạt (SOP)',
        category: 'Tiến độ',
        categoryColor: 'blue',
        value: raw.sopDate || STANDARD_SUCCESS_METRICS_CATALOGUE[1].defaultValue,
        description: 'Thời điểm xuất xưởng mẻ thành phẩm thương mại đầu tiên.'
      },
      {
        id: 'sm_quality',
        key: 'quality',
        title: 'Chất Lượng & Tuổi Thọ (Reliability)',
        category: 'Chất lượng',
        categoryColor: 'emerald',
        value: raw.qualityMetric || STANDARD_SUCCESS_METRICS_CATALOGUE[2].defaultValue,
        description: 'Tiêu chuẩn kiểm thử MTBF, thả rơi thùng và sốc nhiệt.'
      },
      {
        id: 'sm_performance',
        key: 'performance',
        title: 'Hiệu Năng & Độ Ồn (Acoustics & Power)',
        category: 'Trải nghiệm',
        categoryColor: 'indigo',
        value: raw.performanceMetric || STANDARD_SUCCESS_METRICS_CATALOGUE[3].defaultValue,
        description: 'Đo đạc kiểm nghiệm độc lập tại buồng câm Anechoic.'
      },
      {
        id: 'sm_compliance',
        key: 'compliance',
        title: 'Chứng Nhận & Tiêu Chuẩn Pháp Lý Bắt Buộc (Compliance)',
        category: 'Pháp lý',
        categoryColor: 'purple',
        value: raw.complianceMetric || STANDARD_SUCCESS_METRICS_CATALOGUE[4].defaultValue,
        description: 'Các giấy phép kiểm định Quatest để được phép lưu hành thương mại tại Việt Nam.'
      }
    ];
  }

  // Normalize Budget Items
  let normalizedBudgetItems: BudgetItemDetail[] = [];
  if (Array.isArray(raw.budgetItems) && raw.budgetItems.length > 0) {
    normalizedBudgetItems = raw.budgetItems.map((b: any, idx: number) => ({
      id: b.id || `bi_${Date.now()}_${idx}`,
      key: b.key || 'custom',
      name: b.name || `Hạng mục #${idx + 1}`,
      description: b.description || '',
      amount: typeof b.amount === 'number' ? b.amount : 0
    }));
  } else {
    normalizedBudgetItems = [
      {
        id: 'bi_tooling',
        key: 'tooling',
        name: '1. Chế tạo khuôn mẫu (Tooling & Molds)',
        description: 'Khuôn ép nhựa, khuôn dập nhôm/inox, khuôn đúc...',
        amount: typeof rawBudget.tooling === 'number' ? rawBudget.tooling : DEFAULT_BUDGET.tooling
      },
      {
        id: 'bi_prototype',
        key: 'prototype',
        name: '2. Mẫu thử nghiệm (Mock-up & Prototypes)',
        description: 'In 3D SLA, gia công CNC, bo mạch mẫu EVT...',
        amount: typeof rawBudget.prototype === 'number' ? rawBudget.prototype : DEFAULT_BUDGET.prototype
      },
      {
        id: 'bi_certTesting',
        key: 'certTesting',
        name: '3. Đo kiểm phòng Lab & Cấp chứng nhận',
        description: 'Phí Quatest, nhãn năng lượng, kiểm tra an toàn điện...',
        amount: typeof rawBudget.certTesting === 'number' ? rawBudget.certTesting : DEFAULT_BUDGET.certTesting
      },
      {
        id: 'bi_jigPilot',
        key: 'jigPilot',
        name: '4. Đồ gá lắp ráp & Chạy thử Pilot (Jig & Trial)',
        description: 'Đồ gá cân bằng chuyền, vật tư tiêu hao đợt PVT...',
        amount: typeof rawBudget.jigPilot === 'number' ? rawBudget.jigPilot : DEFAULT_BUDGET.jigPilot
      }
    ];
  }

  // Normalize Sign-Off Members
  let normalizedSignOffMembers: SignOffMember[] = [];
  if (Array.isArray(raw.signOffMembers) && raw.signOffMembers.length > 0) {
    normalizedSignOffMembers = raw.signOffMembers.map((s: any, idx: number) => ({
      id: s.id || `som_${Date.now()}_${idx}`,
      roleKey: s.roleKey || 'custom',
      roleTitle: s.roleTitle || `Người ký duyệt #${idx + 1}`,
      signOffName: s.signOffName || s.name || '',
      department: s.department || '',
      isRequired: s.isRequired !== false
    }));
  } else {
    normalizedSignOffMembers = [
      {
        id: 'som_sponsor',
        roleKey: 'sponsor',
        roleTitle: '1. Project Sponsor',
        signOffName: rawSign.sponsor || raw.sponsor || 'Nguyễn Văn Tuấn (Giám Đốc Kỹ Thuật R&D)',
        department: 'Khối R&D',
        isRequired: true
      },
      {
        id: 'som_pm',
        roleKey: 'pm',
        roleTitle: '2. Project Manager',
        signOffName: rawSign.pm || raw.pm || 'Trần Minh Quang (Trưởng phòng Quản lý Dự án R&D)',
        department: 'Ban PMO',
        isRequired: true
      },
      {
        id: 'som_qa',
        roleKey: 'qa',
        roleTitle: '3. Lead QA/QC',
        signOffName: rawSign.qa || rawTeam.qaLead || 'Bùi Thị Mai (Trưởng phòng Đảm bảo Chất lượng R&D)',
        department: 'Khối Quản Lý Chất Lượng',
        isRequired: true
      },
      {
        id: 'som_factory',
        roleKey: 'factory',
        roleTitle: '4. Giám Đốc Nhà Máy (PE)',
        signOffName: rawSign.factory || 'Vũ Mạnh Hùng (Giám Đốc Khối Sản Xuất & Lắp Ráp)',
        department: 'Khối Nhà Máy',
        isRequired: true
      }
    ];
  }

  const bomTargetVal = normalizedSuccessMetrics.find(m => m.key === 'bom')?.value || raw.bomTarget || '';
  const sopDateVal = normalizedSuccessMetrics.find(m => m.key === 'sop')?.value || raw.sopDate || '';
  const qualityVal = normalizedSuccessMetrics.find(m => m.key === 'quality')?.value || raw.qualityMetric || '';
  const perfVal = normalizedSuccessMetrics.find(m => m.key === 'performance')?.value || raw.performanceMetric || '';
  const compVal = normalizedSuccessMetrics.find(m => m.key === 'compliance')?.value || raw.complianceMetric || '';

  const toolingVal = normalizedBudgetItems.find(b => b.key === 'tooling')?.amount ?? (typeof rawBudget.tooling === 'number' ? rawBudget.tooling : DEFAULT_BUDGET.tooling);
  const protoVal = normalizedBudgetItems.find(b => b.key === 'prototype')?.amount ?? (typeof rawBudget.prototype === 'number' ? rawBudget.prototype : DEFAULT_BUDGET.prototype);
  const certVal = normalizedBudgetItems.find(b => b.key === 'certTesting')?.amount ?? (typeof rawBudget.certTesting === 'number' ? rawBudget.certTesting : DEFAULT_BUDGET.certTesting);
  const jigVal = normalizedBudgetItems.find(b => b.key === 'jigPilot')?.amount ?? (typeof rawBudget.jigPilot === 'number' ? rawBudget.jigPilot : DEFAULT_BUDGET.jigPilot);

  return {
    id: raw.id || `charter_${Date.now()}`,
    savedAt: raw.savedAt || new Date().toLocaleString('vi-VN'),
    name: raw.name || '',
    code: raw.code || '',
    category: raw.category || 'Quạt làm mát',
    sponsor: raw.sponsor || '',
    pm: raw.pm || '',
    date: raw.date || new Date().toISOString().split('T')[0],
    version: raw.version || '1.0',
    problem: raw.problem || '',
    benefits: raw.benefits || '',
    targetAudience: raw.targetAudience || '',

    bomTarget: bomTargetVal,
    sopDate: sopDateVal,
    qualityMetric: qualityVal,
    performanceMetric: perfVal,
    complianceMetric: compVal,
    warrantyTarget: raw.warrantyTarget || '',
    successMetrics: normalizedSuccessMetrics,

    scopeIn: raw.scopeIn || '',
    scopeOut: raw.scopeOut || '',

    milestones: Array.isArray(raw.milestones) && raw.milestones.length > 0
      ? raw.milestones
      : (PRESET_CHARTERS.fan?.milestones || []),

    team: {
      mdLead: rawTeam.mdLead || '',
      eeLead: rawTeam.eeLead || '',
      idLead: rawTeam.idLead || '',
      qaLead: rawTeam.qaLead || '',
      sourcingLead: rawTeam.sourcingLead || '',
      peLead: rawTeam.peLead || '',
      mktLead: rawTeam.mktLead || '',
      ...rawTeam
    },
    teamMembers: normalizedTeamMembers,

    budget: {
      tooling: toolingVal,
      prototype: protoVal,
      certTesting: certVal,
      jigPilot: jigVal,
      contingencyRate: typeof rawBudget.contingencyRate === 'number' ? rawBudget.contingencyRate : DEFAULT_BUDGET.contingencyRate,
      currency: rawBudget.currency || 'VND'
    },
    budgetItems: normalizedBudgetItems,

    risks: Array.isArray(raw.risks) && raw.risks.length > 0
      ? raw.risks
      : (PRESET_CHARTERS.fan?.risks || []),

    pmAuthority: raw.pmAuthority || PM_AUTHORITY_PRESETS[0].content,
    signMatrix: {
      sponsor: rawSign.sponsor || normalizedSignOffMembers.find(s => s.roleKey === 'sponsor')?.signOffName || raw.sponsor || '',
      pm: rawSign.pm || normalizedSignOffMembers.find(s => s.roleKey === 'pm')?.signOffName || raw.pm || '',
      qa: rawSign.qa || normalizedSignOffMembers.find(s => s.roleKey === 'qa')?.signOffName || rawTeam.qaLead || '',
      factory: rawSign.factory || normalizedSignOffMembers.find(s => s.roleKey === 'factory')?.signOffName || ''
    },
    signOffMembers: normalizedSignOffMembers
  };
};
