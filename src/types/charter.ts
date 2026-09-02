export type ApplianceCategory = 
  | 'Quạt làm mát'
  | 'Nồi cơm điện'
  | 'Ấm siêu tốc'
  | 'Điều hòa không khí'
  | 'Tủ lạnh / Tủ đông'
  | 'Bếp điện / Bếp từ'
  | 'Máy lọc không khí'
  | 'Gia dụng nhà bếp khác';

export interface StageGateMilestone {
  gate: string;
  name: string;
  deliverables: string;
  targetDate: string;
  owner: string;
  status?: 'Not Started' | 'In Progress' | 'Approved' | 'Review';
}

export interface SuccessMetricItem {
  id: string;
  key?: string;
  title: string;
  category: string;
  categoryColor?: 'amber' | 'blue' | 'emerald' | 'indigo' | 'purple' | 'rose' | 'teal' | 'slate';
  value: string;
  description?: string;
}

export interface BudgetItemDetail {
  id: string;
  key?: string;
  name: string;
  description: string;
  amount: number;
}

export interface SignOffMember {
  id: string;
  roleKey?: string;
  roleTitle: string;
  signOffName: string;
  department?: string;
  isRequired?: boolean;
}

export interface BudgetItem {
  id: string;
  name: string;
  description: string;
  amount: number;
}

export interface CoreTeamMember {
  role: string;
  name: string;
  department: string;
}

export interface ProjectTeamMember {
  id: string;
  roleKey?: string;
  roleTitle: string;
  memberName: string;
  department?: string;
  responsibilities?: string;
}

export interface TeamRosterMember {
  id: string;
  stt: number;
  roleKey: string;
  roleName: string;      // e.g. "Project Sponsor", "Project Manager", "Lead Cơ khí (MD)"
  fullName: string;      // e.g. "Nguyễn Văn Tuấn"
  jobTitle: string;      // e.g. "Giám Đốc Kỹ Thuật R&D", "Trưởng phòng Kiểu dáng"
  department: string;    // e.g. "Khối R&D", "Khối Kỹ Thuật Nhà Máy"
  email?: string;
  phone?: string;
}

export interface ProjectRisk {
  id: string;
  title: string;
  impact: 'High' | 'Medium' | 'Low';
  mitigation: string;
}

export interface ProjectCharterData {
  id: string;
  savedAt: string;
  // Section 1: Thông tin dự án & Business Case
  name: string;
  code: string;
  category: ApplianceCategory;
  sponsor: string;
  pm: string;
  date: string;
  version: string;
  problem: string;
  benefits: string;
  targetAudience: string;

  // Section 2: Tiêu chí thành công & Success Metrics
  bomTarget: string;
  sopDate: string;
  qualityMetric: string;
  performanceMetric: string;
  complianceMetric: string;
  warrantyTarget: string;
  successMetrics?: SuccessMetricItem[];

  // Section 3: Phạm vi dự án
  scopeIn: string;
  scopeOut: string;

  // Section 4: Cột mốc Stage-Gate
  milestones: StageGateMilestone[];

  // Section 5: Đội ngũ dự án
  team: {
    mdLead: string;
    eeLead: string;
    idLead: string;
    qaLead: string;
    sourcingLead: string;
    peLead: string;
    mktLead: string;
    [key: string]: string;
  };
  teamMembers?: ProjectTeamMember[];

  // Section 6: Ngân sách
  budget: {
    tooling: number;
    prototype: number;
    certTesting: number;
    jigPilot: number;
    contingencyRate: number; // 0.05, 0.1, 0.15, 0.2
    currency: 'VND' | 'USD';
  };
  budgetItems?: BudgetItemDetail[];

  // Section 7: Rủi ro
  risks: ProjectRisk[];

  // Section 8: Thẩm quyền PM & Ký duyệt
  pmAuthority: string;
  signMatrix: {
    sponsor: string;
    pm: string;
    qa: string;
    factory: string;
  };
  signOffMembers?: SignOffMember[];
}
