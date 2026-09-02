export interface StandardRoleOption {
  key: string;
  title: string;
  defaultDepartment: string;
  description: string;
  category: 'core' | 'engineering' | 'quality' | 'operations' | 'management';
}

export const STANDARD_RD_ROLES: StandardRoleOption[] = [
  {
    key: 'mdLead',
    title: 'Lead Cơ Khí & Khuôn Mẫu (MD Lead)',
    defaultDepartment: 'Phòng Cơ Khí - Khối R&D',
    description: 'Chịu trách nhiệm thiết kế 3D/2D kết cấu, dòng chảy nhựa DFM, giám sát chế tạo & nghiệm thu khuôn mẫu.',
    category: 'core'
  },
  {
    key: 'eeLead',
    title: 'Lead Điện Tử & Firmware (EE/FW Lead)',
    defaultDepartment: 'Phòng Điện Tử - Khối R&D',
    description: 'Thiết kế sơ đồ nguyên lý mạch Schematic, Layout PCB, lập trình vi điều khiển MCU/DSP và thuật toán điều khiển.',
    category: 'core'
  },
  {
    key: 'idLead',
    title: 'Kiểu Dáng Công Nghiệp (ID Designer)',
    defaultDepartment: 'Phòng Thiết Kế Kiểu Dáng',
    description: 'Nghiên cứu xu hướng CMF (Color, Material, Finish), công thái học Ergonomics và phác thảo phối cảnh 3D Concept.',
    category: 'core'
  },
  {
    key: 'qaLead',
    title: 'Đảm Bảo Chất Lượng (QA/QC Lead)',
    defaultDepartment: 'Khối Quản Lý Chất Lượng',
    description: 'Xây dựng kế hoạch kiểm tra chất lượng QCP, tiêu chí nghiệm thu Gate, thử nghiệm độ bền & tỷ lệ lỗi mục tiêu.',
    category: 'quality'
  },
  {
    key: 'sourcingLead',
    title: 'Thu Mua & Cung Ứng (Sourcing Lead)',
    defaultDepartment: 'Khối Chuỗi Cung Ứng',
    description: 'Tìm kiếm nhà cung ứng cấp 1/cấp 2, đàm phán giá Target BOM linh kiện và đảm bảo tiến độ cấp mẫu thử nghiệm.',
    category: 'operations'
  },
  {
    key: 'peLead',
    title: 'Kỹ Thuật Sản Xuất (PE / Process Lead)',
    defaultDepartment: 'Khối Kỹ Thuật Nhà Máy',
    description: 'Thiết kế dây chuyền lắp ráp, chế tạo đồ gá kiểm tra Jig, cân bằng chuyền và ban hành hướng dẫn thao tác SOP.',
    category: 'operations'
  },
  {
    key: 'mktLead',
    title: 'Đại Diện Tiếp Thị & Bán Hàng (Brand/MKT)',
    defaultDepartment: 'Khối Tiếp Thị & Kinh Doanh',
    description: 'Cung cấp yêu cầu thị trường PRD, định giá bán lẻ, kế hoạch ra mắt sản phẩm và chiến lược truyền thông Go-To-Market.',
    category: 'core'
  },
  {
    key: 'reliabilityLead',
    title: 'Kỹ Sư Thử Nghiệm & Độ Tin Cậy (Reliability Lead)',
    defaultDepartment: 'Trung Tâm Thử Nghiệm Lab',
    description: 'Thực hiện test gia tốc vòng đời ALT/HALT, kiểm tra thả rơi Drop Test, rung xóc và sốc nhiệt độ/độ ẩm.',
    category: 'quality'
  },
  {
    key: 'complianceLead',
    title: 'Kỹ Sư An Toàn & Chứng Nhận (Compliance / Safety)',
    defaultDepartment: 'Ban Pháp Chế & Tiêu Chuẩn Kỹ Thuật',
    description: 'Phụ trách hồ sơ kiểm định hợp quy QCVN, tiêu chuẩn an toàn điện IEC, dán nhãn năng lượng và CE/RoHS.',
    category: 'quality'
  },
  {
    key: 'iotLead',
    title: 'Kỹ Sư Phần Mềm & IoT (Embedded SW / Smart App)',
    defaultDepartment: 'Trung Tâm IoT & Smart Home',
    description: 'Phát triển kết nối WiFi/BLE, tích hợp ứng dụng điều khiển trên điện thoại và nền tảng điện toán đám mây Cloud.',
    category: 'engineering'
  },
  {
    key: 'thermalLead',
    title: 'Kỹ Sư Nhiệt Động Lực Học (Thermal & Heating)',
    defaultDepartment: 'Phòng Cơ Khí - Khối R&D',
    description: 'Mô phỏng tản nhiệt, tính toán mâm nhiệt, bộ gia nhiệt điện trở và tối ưu luồng đối lưu khí.',
    category: 'engineering'
  },
  {
    key: 'acousticLead',
    title: 'Kỹ Sư Âm Học & Khí Động Học (Acoustics & CFD)',
    defaultDepartment: 'Phòng Nghiên Cứu Kỹ Thuật Cao',
    description: 'Mô phỏng khí động học cánh quạt/cửa gió CFD, triệt tiêu cộng hưởng âm thanh và đo kiểm buồng câm Anechoic.',
    category: 'engineering'
  },
  {
    key: 'packagingLead',
    title: 'Kỹ Sư Thiết Kế Bao Bì (Packaging Engineer)',
    defaultDepartment: 'Phòng Thiết Kế Sản Phẩm',
    description: 'Thiết kế thùng carton, mút xốp định hình EPS/EPE bảo vệ sản phẩm chống va đập khi vận chuyển logistics.',
    category: 'operations'
  },
  {
    key: 'pmoLead',
    title: 'Điều Phối Dự Án PMO (Project Coordinator)',
    defaultDepartment: 'Văn Phòng Quản Trị Dự Án PMO',
    description: 'Theo dõi tiến độ hàng tuần, quản lý nhật ký rủi ro, nhắc nhở hạn chót hoàn thành các Deliverables cửa duyệt.',
    category: 'management'
  },
  {
    key: 'sponsor',
    title: 'Project Sponsor (Người Bảo Trợ Cấp Cao)',
    defaultDepartment: 'Ban Tổng Giám Đốc',
    description: 'Cấp thẩm quyền cao nhất phê duyệt nguồn lực ngân sách, định hướng chiến lược và ký duyệt nghiệm thu thương mại.',
    category: 'management'
  },
  {
    key: 'pm',
    title: 'Project Manager (Chủ Nhiệm Dự Án)',
    defaultDepartment: 'Khối R&D / PMO',
    description: 'Toàn quyền điều hành chéo các bộ phận, chịu trách nhiệm trước BOD về Chất lượng, Chi phí Target BOM và Tiến độ SOP.',
    category: 'management'
  },
  {
    key: 'factory',
    title: 'Giám Đốc Nhà Máy (Factory Director)',
    defaultDepartment: 'Khối Sản Xuất & Vận Hành',
    description: 'Tiếp nhận chuyển giao công nghệ, phê duyệt sản xuất thử nghiệm Pilot và tổ chức sản xuất hàng loạt Mass Production.',
    category: 'management'
  }
];
