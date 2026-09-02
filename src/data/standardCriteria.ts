import { SuccessMetricItem, BudgetItemDetail, SignOffMember } from '../types/charter';

export const STANDARD_SUCCESS_METRICS_CATALOGUE = [
  {
    key: 'bom',
    title: 'Giá Thành Định Mức (Target BOM)',
    category: 'Tài chính',
    categoryColor: 'amber' as const,
    defaultValue: '<= 395.000 VNĐ / chiếc (Bao gồm động cơ BLDC, bo mạch Inverter & bao bì)',
    description: 'Gồm linh kiện mạch, động cơ, vỏ nhựa & bao bì xuất xưởng.'
  },
  {
    key: 'sop',
    title: 'Hạn Bắt Đầu Sản Xuất Hàng Loạt (SOP)',
    category: 'Tiến độ',
    categoryColor: 'blue' as const,
    defaultValue: '2026-11-25 (Kịp trữ hàng cao điểm hè & lễ tết)',
    description: 'Thời điểm xuất xưởng mẻ thành phẩm thương mại đầu tiên.'
  },
  {
    key: 'quality',
    title: 'Chất Lượng & Tuổi Thọ (Reliability)',
    category: 'Chất lượng',
    categoryColor: 'emerald' as const,
    defaultValue: 'Tỷ lệ lỗi lắp ráp tại xưởng < 0.6%; Tuổi thọ động cơ DC BLDC >= 10.000 giờ chạy liên tục (tương đương 6 năm sử dụng)',
    description: 'Tiêu chuẩn kiểm thử MTBF, thả rơi thùng và sốc nhiệt.'
  },
  {
    key: 'performance',
    title: 'Hiệu Năng & Độ Ồn (Acoustics & Power)',
    category: 'Trải nghiệm',
    categoryColor: 'indigo' as const,
    defaultValue: 'Độ ồn mức thấp nhất <= 22 dB(A) đo trong buồng câm Anechoic; Tiết kiệm 55% điện năng so với quạt AC truyền thống; Lưu lượng gió max >= 68 m³/phút',
    description: 'Đo đạc kiểm nghiệm độc lập tại buồng câm Anechoic.'
  },
  {
    key: 'compliance',
    title: 'Chứng Nhận & Tiêu Chuẩn Pháp Lý Bắt Buộc (Compliance)',
    category: 'Pháp lý',
    categoryColor: 'purple' as const,
    defaultValue: 'Chứng nhận hợp quy QCVN 4:2009/BKHCN, Dán nhãn năng lượng Cấp 5 Sao (Bộ Công Thương), Thử nghiệm an toàn điện IEC 60335-2-80',
    description: 'Các giấy phép kiểm định Quatest để được phép lưu hành thương mại tại Việt Nam.'
  },
  {
    key: 'localContent',
    title: 'Tỷ Lệ Nội Địa Hóa Linh Kiện (Local Content Ratio)',
    category: 'Tài chính',
    categoryColor: 'amber' as const,
    defaultValue: 'Tỷ lệ nội địa hóa tính theo giá trị BOM >= 65% (Khuôn ép, phụ kiện cơ khí & bao bì sản xuất trong nước)',
    description: 'Tối ưu chuỗi cung ứng nội địa và giảm thiểu rủi ro biến động tỷ giá.'
  },
  {
    key: 'warranty',
    title: 'Chính Sách & Chi Phí Bảo Hành (Warranty & RMA)',
    category: 'Chất lượng',
    categoryColor: 'emerald' as const,
    defaultValue: 'Tỷ lệ trả hàng bảo hành (RMA) trong 12 tháng đầu < 0.8%; Bảo hành động cơ 24 tháng',
    description: 'Cam kết chất lượng sau bán hàng với đối tác phân phối.'
  },
  {
    key: 'uxReview',
    title: 'Đánh Giá Trải Nghiệm Khách Hàng (UX & NPS Score)',
    category: 'Trải nghiệm',
    categoryColor: 'indigo' as const,
    defaultValue: 'Điểm đánh giá trải nghiệm người dùng thử nghiệm thực tế >= 4.6/5 sao; Tỷ lệ khuyến nghị bạn bè >= 85%',
    description: 'Khảo sát nhóm khách hàng mù (Blind test) giai đoạn PVT.'
  },
  {
    key: 'ecoDesign',
    title: 'Thiết Kế Sinh Thái & Tiết Kiệm Năng Lượng (Eco & RoHS)',
    category: 'Pháp lý',
    categoryColor: 'purple' as const,
    defaultValue: 'Toàn bộ vật liệu nhựa đạt tiêu chuẩn RoHS 2.0; Bao bì 100% carton tái chế không dùng xốp EPS',
    description: 'Tiêu chuẩn bảo vệ môi trường và định hướng xuất khẩu thị trường EU/Mỹ.'
  },
  {
    key: 'smartApp',
    title: 'Kết Nối Thông Minh & Ứng Dụng (Smart Connectivity)',
    category: 'Kỹ thuật',
    categoryColor: 'teal' as const,
    defaultValue: 'Kết nối Wi-Fi 2.4GHz + Bluetooth BLE 5.0; Thời gian kết nối lần đầu (Pairing) < 15 giây; Tương thích Tuya / Matter',
    description: 'Chỉ số đo lường hiệu năng ứng dụng điều khiển thông minh.'
  }
];

export const STANDARD_BUDGET_CATALOGUE = [
  {
    key: 'tooling',
    name: '1. Chế tạo khuôn mẫu (Tooling & Molds)',
    description: 'Khuôn ép nhựa, khuôn dập nhôm/inox, khuôn đúc...',
    defaultAmount: 580000000
  },
  {
    key: 'prototype',
    name: '2. Mẫu thử nghiệm (Mock-up & Prototypes)',
    description: 'In 3D SLA, gia công CNC, bo mạch mẫu EVT...',
    defaultAmount: 65000000
  },
  {
    key: 'certTesting',
    name: '3. Đo kiểm phòng Lab & Cấp chứng nhận',
    description: 'Phí Quatest, nhãn năng lượng, kiểm tra an toàn điện...',
    defaultAmount: 40000000
  },
  {
    key: 'jigPilot',
    name: '4. Đồ gá lắp ráp & Chạy thử Pilot (Jig & Trial)',
    description: 'Đồ gá cân bằng chuyền, vật tư tiêu hao đợt PVT...',
    defaultAmount: 45000000
  },
  {
    key: 'softwareIp',
    name: '5. Bản quyền phần mềm & Sở hữu trí tuệ (IP & Licenses)',
    description: 'Phí đăng ký kiểu dáng công nghiệp, bằng sáng chế, bản quyền Firmware/App...',
    defaultAmount: 30000000
  },
  {
    key: 'externalConsulting',
    name: '6. Thuê chuyên gia tư vấn thiết kế ngoài (Consulting)',
    description: 'Thuê đối tác thiết kế ID nước ngoài hoặc chuyên gia khí động học CFD...',
    defaultAmount: 50000000
  },
  {
    key: 'labEquipment',
    name: '7. Mua sắm thiết bị đo kiểm chuyên dụng (Lab Tools)',
    description: 'Máy phân tích công suất, máy đo độ ồn buồng câm, cảm biến nhiệt độ...',
    defaultAmount: 35000000
  },
  {
    key: 'trainingTransfer',
    name: '8. Đào tạo & Chuyển giao công nghệ sản xuất (Training)',
    description: 'Tài liệu hướng dẫn thao tác chuẩn (SOP), đào tạo kỹ thuật viên xưởng...',
    defaultAmount: 20000000
  }
];

export const STANDARD_SIGN_OFF_ROLES_CATALOGUE = [
  {
    roleKey: 'sponsor',
    roleTitle: '1. Project Sponsor (Người Bảo Trợ Dự Án)',
    defaultSignOff: 'Nguyễn Văn Tuấn (Giám Đốc Kỹ Thuật R&D)',
    department: 'Khối R&D'
  },
  {
    roleKey: 'pm',
    roleTitle: '2. Project Manager (Chủ Nhiệm Dự Án)',
    defaultSignOff: 'Trần Minh Quang (Trưởng phòng Quản lý Dự án R&D)',
    department: 'Ban PMO'
  },
  {
    roleKey: 'qa',
    roleTitle: '3. Lead QA/QC (Đảm Bảo Chất Lượng)',
    defaultSignOff: 'Bùi Thị Mai (Trưởng phòng Đảm bảo Chất lượng R&D)',
    department: 'Khối Quản Lý Chất Lượng'
  },
  {
    roleKey: 'factory',
    roleTitle: '4. Giám Đốc Nhà Máy (PE / Sản Xuất)',
    defaultSignOff: 'Vũ Mạnh Hùng (Giám Đốc Khối Sản Xuất & Lắp Ráp)',
    department: 'Khối Nhà Máy'
  },
  {
    roleKey: 'cfo',
    roleTitle: '5. Giám Đốc Tài Chính (CFO / Kế Toán Trưởng)',
    defaultSignOff: 'Lê Hoàng Nam (Giám Đốc Khối Tài Chính - Kế Toán)',
    department: 'Khối Tài Chính'
  },
  {
    roleKey: 'mkt',
    roleTitle: '6. Giám Đốc Tiếp Thị & Thương Mại (CMO / Sales)',
    defaultSignOff: 'Bùi Bích Phương (Giám Đốc Ngành Hàng Điện Gia Dụng)',
    department: 'Khối Kinh Doanh'
  },
  {
    roleKey: 'sourcing',
    roleTitle: '7. Trưởng Khối Mua Hàng & Cung Ứng (Sourcing Head)',
    defaultSignOff: 'Ngô Quốc Bảo (Trưởng Khối Chuỗi Cung Ứng)',
    department: 'Khối Chuỗi Cung Ứng'
  },
  {
    roleKey: 'ceo',
    roleTitle: '8. Tổng Giám Đốc / Ban Điều Hành (CEO / BOD)',
    defaultSignOff: 'Ban Tổng Giám Đốc Tập Đoàn (Phê duyệt chủ trương)',
    department: 'Ban Điều Hành'
  }
];

export const PM_AUTHORITY_PRESETS = [
  {
    id: 'standard_rd',
    title: 'Tiêu Chuẩn PMI & R&D Gia Dụng',
    content: 'Toàn quyền điều phối và phân bổ nguồn lực kỹ sư nội bộ trong suốt vòng đời dự án; Chủ động phê duyệt điều chỉnh thông số phụ tùng thay thế miễn không vượt tổng định mức Target BOM; Quyền yêu cầu dừng chạy thử dây chuyền nếu phát hiện nguy cơ lỗi an toàn điện.'
  },
  {
    id: 'lean_agile',
    title: 'Mô Hình Lean & Tự Quyết Linh Hoạt',
    content: 'Có thẩm quyền quyết định phân bổ ngân sách trong hạn mức 10% quỹ Contingency mà không cần xin ý kiến Sponsor; Quyền trực tiếp đàm phán tiến độ chạy mẫu thử nghiệm với các nhà cung ứng bên ngoài; Toàn quyền triệu tập cuộc họp Gate Review bất thường khi có rủi ro phát sinh.'
  },
  {
    id: 'strict_governance',
    title: 'Quản Trị Rủi Ro Chặt Chẽ & Tiêu Chuẩn Cao',
    content: 'Quản lý và nghiệm thu toàn bộ kết quả đầu ra (Deliverables) của từng giai đoạn Stage-Gate; Quyền từ chối nghiệm thu mẫu EVT/DVT nếu không đạt tiêu chuẩn kỹ thuật; Bắt buộc phải có sự đồng thuận của Lead QA và Giám Đốc Nhà Máy trước khi ký Gate 4 (Mass Production).'
  }
];
