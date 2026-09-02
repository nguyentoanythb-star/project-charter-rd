import { ProjectCharterData } from '../types/charter';

export const PRESET_CHARTERS: Record<string, ProjectCharterData> = {
  fan: {
    id: 'preset-fan',
    savedAt: '2026-09-02 08:30:00',
    name: 'Quạt Đứng DC Inverter EcoBreeze 24 Cấp Gió',
    code: 'RD-FAN-2026-DC',
    category: 'Quạt làm mát',
    sponsor: 'Vũ Minh Tuấn - Phó TGĐ Phụ Trách R&D & Chuỗi Cung Ứng',
    pm: 'Lê Hoàng Nam - Senior PM Thiết Bị Gia Dụng Làm Mát',
    date: '2026-09-02',
    version: '1.0',
    targetAudience: 'Hộ gia đình hiện đại, gia đình có trẻ nhỏ/người cao tuổi cần gió êm dịu ban đêm và tiết kiệm điện.',
    problem: 'Thị trường quạt cây hiện tại chủ yếu dùng động cơ AC tiêu tốn điện năng (45-60W), độ ồn cao (45-55dB) gây khó ngủ. Phân khúc quạt DC thông minh của các hãng Nhật/Âu lại quá đắt (>2.5 triệu). Doanh nghiệp cần 1 model DC nội địa hóa, 24 cấp gió, cực êm <22dB với mức giá bán lẻ hấp dẫn dưới 1.2 triệu.',
    benefits: '1. Chiếm lĩnh 20% thị phần quạt gia dụng trung-cao cấp trong mùa vụ 2027.\n2. Doanh số dự kiến: 80.000 chiếc trong năm đầu; Đóng góp doanh thu ~75 tỷ VNĐ.\n3. Biên lợi nhuận gộp (Gross Margin) mục tiêu >= 33.5%.\n4. Thu hồi toàn bộ chi phí đầu tư R&D & khuôn mẫu trong vòng 7 tháng mở bán.',
    
    bomTarget: '<= 395.000 VNĐ / chiếc (Bao gồm động cơ BLDC, bo mạch biến tần & bao bì)',
    sopDate: '2026-11-25 (Kịp trữ hàng cao điểm hè & lễ tết)',
    qualityMetric: 'Tỷ lệ lỗi lắp ráp tại xưởng < 0.6%; Tuổi thọ động cơ DC BLDC >= 10.000 giờ chạy liên tục (tương đương 6 năm sử dụng)',
    performanceMetric: 'Độ ồn mức thấp nhất <= 22 dB(A) đo trong buồng câm Anechoic; Tiết kiệm 55% điện năng so với quạt AC truyền thống; Lưu lượng gió max >= 68 m³/phút',
    complianceMetric: 'Chứng nhận hợp quy QCVN 4:2009/BKHCN, Dán nhãn năng lượng Cấp 5 Sao (Bộ Công Thương), Thử nghiệm an toàn điện IEC 60335-2-80',
    warrantyTarget: 'Tỷ lệ bảo hành sau 12 tháng bán lẻ < 1.0%',

    scopeIn: `1. Thiết kế kiểu dáng công nghiệp (ID) phong cách tối giản thanh lịch, khuôn vỏ nhựa ABS nguyên sinh chống ố vàng.
2. Thiết kế kết cấu cơ khí (MD), cụm xoay tuốc-năng điện 120 độ và cơ cấu nâng hạ chiều cao ống thép sơn tĩnh điện.
3. Nghiên cứu & phát triển động cơ BLDC không chổi than, bo mạch điều khiển biến tần sóng sin FOC (EE & FW).
4. Thiết kế khí động học cánh quạt 7 lá giảm xoáy gió bằng mô phỏng CFD.
5. Chế tạo 6 bộ khuôn ép nhựa chính và 2 bộ đồ gá kiểm tra âm học dây chuyền (Acoustic Test Jig).
6. Hoàn tất hồ sơ kiểm định Quatest 1 và chuyển giao tài liệu SOP cho nhà máy.`,
    
    scopeOut: `1. Không tích hợp Pin sạc dự phòng Lithium trong phiên bản này (thuộc Phase 2 nâng cấp).
2. Không kèm module kết nối Smart App WiFi / Bluetooth (chỉ sử dụng Remote hồng ngoại 10m).
3. Không bao gồm chi phí quảng cáo truyền thông TVC và trưng bày kệ hàng tại chuỗi siêu thị.
4. Không tự sản xuất linh kiện ốc vít, vòng bi và dây cắm nguồn (chỉ định mua ngoài theo quy chuẩn R&D).`,

    milestones: [
      {
        gate: 'Gate 1',
        name: 'Concept & PRD Approval',
        deliverables: 'Bản vẽ 3D ID hoàn thiện, Đặc tả yêu cầu kỹ thuật PRD, Dự toán sơ bộ BOM & Phân tích DFM',
        targetDate: '2026-09-20',
        owner: 'Product Sponsor & Brand Marketing',
        status: 'Approved'
      },
      {
        gate: 'Gate 2',
        name: 'Design Freeze & EVT',
        deliverables: 'Đóng băng bản vẽ 3D/2D chi tiết, Mẫu in 3D & bo mạch mẫu Proto T0 thử nghiệm buồng câm đạt <22dB',
        targetDate: '2026-10-10',
        owner: 'R&D Lead (MD + EE Leads)',
        status: 'In Progress'
      },
      {
        gate: 'Gate 3',
        name: 'Tooling & DVT',
        deliverables: 'Gia công hoàn thiện 6 bộ khuôn thép, ép thử mẫu T1/T2, Thử nghiệm thả rơi thùng carton & test bền 500h',
        targetDate: '2026-10-30',
        owner: 'QA Manager & Tooling Lead',
        status: 'Not Started'
      },
      {
        gate: 'Gate 4',
        name: 'Pilot Run & PVT',
        deliverables: 'Sản xuất thử nghiệm 200 chiếc tại chuyền số 3, cân bằng thao tác công nhân, hiệu chuẩn đồ gá kiểm định',
        targetDate: '2026-11-10',
        owner: 'Giám Đốc Nhà Máy & PE Lead',
        status: 'Not Started'
      },
      {
        gate: 'Gate 5',
        name: 'Mass Production (SOP)',
        deliverables: 'Nghiệm thu xuất xưởng lô thương mại đầu tiên (10.000 cái), Đầy đủ chứng nhận QCVN và tem 5 sao',
        targetDate: '2026-11-25',
        owner: 'Ban Tổng Giám Đốc (BOD)',
        status: 'Not Started'
      }
    ],

    team: {
      mdLead: 'Nguyễn Văn Hùng - Trưởng nhóm Kết cấu Cơ khí',
      eeLead: 'Trần Trọng Tấn - Trưởng nhóm Phần cứng & Firmware BLDC',
      idLead: 'Phan Anh Khoa - Senior Industrial Designer',
      qaLead: 'Đỗ Thị Mai - Trưởng phòng Đảm bảo Chất lượng QA/QC',
      sourcingLead: 'Ngô Quốc Bảo - Trưởng nhóm Thu mua & Cung ứng Linh kiện',
      peLead: 'Đặng Tuấn Kiệt - Kỹ sư trưởng Kỹ thuật Sản xuất PE',
      mktLead: 'Bùi Bích Phương - Giám đốc Tiếp thị Ngành hàng Gia dụng'
    },

    budget: {
      tooling: 580000000,
      prototype: 65000000,
      certTesting: 40000000,
      jigPilot: 45000000,
      contingencyRate: 0.10,
      currency: 'VND'
    },

    risks: [
      {
        id: 'r1',
        title: 'Chất lượng bề mặt và biến dạng cánh quạt 7 lá khi ép nhựa',
        impact: 'High',
        mitigation: 'Sử dụng thép khuôn nhập khẩu P20 gia công CNC 5 trục độ chính xác cao; DFM khuôn có cổng bơm keo đối xứng.'
      },
      {
        id: 'r2',
        title: 'Khan hiếm chip vi điều khiển Driver Motor BLDC từ nhà cung cấp',
        impact: 'Medium',
        mitigation: 'Thiết kế sơ đồ mạch PCBA hỗ trợ Dual-Footprint tương thích 2 dòng chip thay thế (MCU STM32 & GD32).'
      },
      {
        id: 'r3',
        title: 'Độ ồn khí động học phát sinh ở các nấc gió tối đa',
        impact: 'Medium',
        mitigation: 'Kiểm tra đo âm phổ FFT liên tục trong buồng câm và tinh chỉnh góc nghiêng mép lá cánh quạt sau mỗi lần chạy mẫu.'
      }
    ],

    pmAuthority: 'Toàn quyền điều phối và phân bổ nguồn lực kỹ sư nội bộ trong suốt vòng đời dự án; Chủ động phê duyệt điều chỉnh thông số phụ tùng thay thế miễn không vượt tổng định mức Target BOM; Quyền yêu cầu dừng chạy thử dây chuyền nếu phát hiện nguy cơ lỗi an toàn điện.',
    signMatrix: {
      sponsor: 'Vũ Minh Tuấn - Phó TGĐ R&D',
      pm: 'Lê Hoàng Nam - Senior PM',
      qa: 'Đỗ Thị Mai - Lead QA/QC',
      factory: 'Nguyễn Hữu Cường - Giám Đốc Nhà Máy'
    }
  },

  cooker: {
    id: 'preset-cooker',
    savedAt: '2026-09-02 08:35:00',
    name: 'Nồi Cơm Điện Cao Tần IH SmartCook 1.8L Lòng Niêu Gang',
    code: 'RD-IH-2026-18L',
    category: 'Nồi cơm điện',
    sponsor: 'Hoàng Văn Dũng - Giám Đốc Khối Nghiên Cứu & Phát Triển R&D',
    pm: 'Phạm Hải Đăng - Senior PM Thiết Bị Gia Dụng Nhiệt',
    date: '2026-09-02',
    version: '1.0',
    targetAudience: 'Gia đình 4-6 người coi trọng chất lượng dinh dưỡng bữa cơm, cần nấu cơm dẻo ngon chuẩn vị gạo Việt.',
    problem: 'Phân khúc nồi cơm cao tần IH hiện nay phụ thuộc nhiều vào hàng nhập khẩu Nhật/Hàn giá từ 3.5 - 6 triệu, giao diện tiếng nước ngoài khó dùng. Các dòng nồi điện tử nội địa chưa nấu được cơm ngon tơi xốp hạt như IH. Doanh nghiệp cần phát triển dòng nồi IH 1.8L lòng niêu đúc dày 3.0mm, bảng điều khiển cảm ứng tiếng Việt, giá chỉ ~1.8 triệu.',
    benefits: '1. Kỳ vọng đạt sản lượng tiêu thụ 45.000 chiếc trong năm tài chính đầu tiên.\n2. Doanh thu ước tính: ~81 tỷ VNĐ; Lợi nhuận gộp đạt 36%.\n3. Đưa thương hiệu vào Top 3 thương hiệu nồi cơm điện cao tần được yêu thích nhất.\n4. Tạo nền tảng công nghệ gia nhiệt cảm ứng từ (IH Core Platform) để mở rộng sang dòng nồi áp suất điện tử.',
    
    bomTarget: '<= 850.000 VNĐ / sản phẩm hoàn chỉnh',
    sopDate: '2026-12-10 (Kịp phục vụ cao điểm mua sắm Tết Nguyên Đán)',
    qualityMetric: 'Lòng nồi tráng men Ceramic chịu được 10.000 lần cọ rửa; Tỷ lệ hỏng hóc bảo hành sau 1 năm < 1.1%; Độ kín áp suất hơi đạt 100% kiểm tra bồn nước.',
    performanceMetric: 'Công suất gia nhiệt từ trường 1300W; Thuật toán gia nhiệt 7 giai đoạn tối ưu độ nở tinh bột; Giữ ấm cơm nóng dẻo 24 giờ không đổi màu cơm.',
    complianceMetric: 'QCVN 4:2009/BKHCN an toàn điện, Tiêu chuẩn thôi nhiễm chống dính an toàn vệ sinh thực phẩm của Viện Kiểm Nghiệm Quốc Gia (NIFC).',
    warrantyTarget: 'Tỷ lệ bảo hành sau 12 tháng < 1.0%',

    scopeIn: `1. Thiết kế cơ khí lòng nồi dạng niêu cong tuần hoàn nhiệt, hợp kim nhôm đúc áp lực cao dày 3mm phủ ceramic chống dính.
2. Thiết kế mạch công suất từ trường IH (Mâm từ đa cuộn dây, IGBT công suất cao, mạch cộng hưởng LC).
3. Lập trình Firmware thuật toán vi điều khiển (MCU) kiểm soát nhiệt độ 7 giai đoạn theo từng loại gạo (gạo ST25, gạo lứt, cháo).
4. Thiết kế khuôn vỏ thân nồi nhựa PP chịu nhiệt cao và nắp gài kim loại inox SUS304 tháo rời vệ sinh được.
5. Kiểm định độ bền chịu nhiệt 250°C và an toàn thôi nhiễm thực phẩm.`,
    
    scopeOut: `1. Không bao gồm phụ kiện xửng hấp bằng tre thủ công (chỉ trang bị xửng nhựa PP nguyên sinh).
2. Không hỗ trợ tính năng kết nối điện thoại thông minh (Smart App).
3. Không tự chế tạo cuộn mâm từ bằng tay (đặt hàng OEM theo bản vẽ kỹ thuật).`,

    milestones: [
      {
        gate: 'Gate 1',
        name: 'Concept & PRD',
        deliverables: 'PRD chi tiết, Bản vẽ 3D dáng lòng niêu và cụm nắp thoát hơi, Báo cáo phân tích nhiệt độ mô phỏng Ansys',
        targetDate: '2026-09-25',
        owner: 'Sponsor & PM',
        status: 'Approved'
      },
      {
        gate: 'Gate 2',
        name: 'Design Freeze & EVT',
        deliverables: 'Đóng băng mạch công suất IH, Nấu thử nghiệm cơm mẫu Proto T0 đạt độ nở tơi xốp theo tiêu chí cảm quan',
        targetDate: '2026-10-18',
        owner: 'MD + EE Lead',
        status: 'In Progress'
      },
      {
        gate: 'Gate 3',
        name: 'Tooling & DVT',
        deliverables: 'Nghiệm thu khuôn đúc lòng nồi và khuôn ép thân, Thử nghiệm phát nhiệt IGBT liên tục 72h',
        targetDate: '2026-11-05',
        owner: 'QA Manager & Tooling Lead',
        status: 'Not Started'
      },
      {
        gate: 'Gate 4',
        name: 'PVT & Pilot Run',
        deliverables: 'Chạy thử nghiệm 150 chiếc tại nhà máy, kiểm định an toàn phóng điện cao áp 3.750V AC 100% sản phẩm',
        targetDate: '2026-11-20',
        owner: 'Giám Đốc Nhà Máy & PE Lead',
        status: 'Not Started'
      },
      {
        gate: 'Gate 5',
        name: 'SOP & Bàn Giao',
        deliverables: 'Bàn giao SOP sản xuất hàng loạt, Đạt chứng chỉ kiểm nghiệm an toàn thực phẩm LFGB & QCVN 4',
        targetDate: '2026-12-10',
        owner: 'Ban Tổng Giám Đốc',
        status: 'Not Started'
      }
    ],

    team: {
      mdLead: 'Trịnh Xuân Thắng - Trưởng nhóm Thiết kế Cơ khí & Lòng Niêu',
      eeLead: 'Vũ Công Danh - Kỹ sư trưởng Điện tử Công suất IH',
      idLead: 'Ngô Quốc Minh - Industrial Designer Thiết bị Nhà bếp',
      qaLead: 'Lê Thu Hà - QA Lead Kiểm định An toàn Nhiệt',
      sourcingLead: 'Nguyễn Thanh Hải - Lead Mua hàng Linh kiện & IGBT',
      peLead: 'Trần Văn Đăng - Kỹ sư Trưởng Dây chuyền Gia dụng Nhiệt',
      mktLead: 'Mai Thị Phương Lan - Brand Manager Ngành Hàng Nấu Nướng'
    },

    budget: {
      tooling: 920000000,
      prototype: 110000000,
      certTesting: 60000000,
      jigPilot: 75000000,
      contingencyRate: 0.10,
      currency: 'VND'
    },

    risks: [
      {
        id: 'r1',
        title: 'Lỗi nổ sò công suất IGBT do sốc điện lưới hoặc tản nhiệt kém',
        impact: 'High',
        mitigation: 'Chọn IGBT chính hãng từ Infineon / Toshiba; Thiết kế cánh nhôm tản nhiệt có quạt gió cưỡng bức riêng biệt.'
      },
      {
        id: 'r2',
        title: 'Lớp phủ men chống dính Ceramic bị bong tróc khi cọ rửa mạnh',
        impact: 'High',
        mitigation: 'Áp dụng quy trình phun phủ Ceramic 3 lớp và tôi nhiệt độ cao 420°C theo tiêu chuẩn khắt khe.'
      },
      {
        id: 'r3',
        title: 'Cơm bị khê hoặc ướt bề mặt khi điện áp dao động 180V-240V',
        impact: 'Medium',
        mitigation: 'Lập trình thuật toán bù công suất tự động theo dải điện áp đầu vào trong MCU Firmware.'
      }
    ],

    pmAuthority: 'Quyền quyết định lựa chọn đối tác tráng phủ chống dính Ceramic; Quyền chủ động chi tiêu dự phòng kỹ thuật dưới 10% để rút ngắn thời gian sửa khuôn; Quyền từ chối nghiệm thu linh kiện nếu không đạt thông số kiểm định nhiệt độ.',
    signMatrix: {
      sponsor: 'Hoàng Văn Dũng - Giám Đốc R&D',
      pm: 'Phạm Hải Đăng - Senior PM',
      qa: 'Lê Thu Hà - Lead QA/QC',
      factory: 'Nguyễn Văn Định - Giám Đốc Nhà Máy'
    }
  },

  kettle: {
    id: 'preset-kettle',
    savedAt: '2026-09-02 08:40:00',
    name: 'Ấm Siêu Tốc Cảm Ứng Đa Nhiệt Độ ThermoTouch 1.7L Inox 316',
    code: 'RD-KT-2026-17',
    category: 'Ấm siêu tốc',
    sponsor: 'Trần Văn An - Giám Đốc Khối R&D',
    pm: 'Nguyễn Văn Bình - Senior PM Gia Dụng Nhà Bếp Nhỏ',
    date: '2026-09-02',
    version: '1.0',
    targetAudience: 'Gia đình có trẻ nhỏ pha sữa, người sành trà/cà phê cần nhiệt độ nước chuẩn xác từ 40°C đến 100°C.',
    problem: 'Ấm siêu tốc cơ truyền thống chỉ có 1 chức năng đun sôi 100°C, thân ấm 1 lớp kim loại dễ gây bỏng khi vô tình chạm phải. Người dùng hiện đại cần ấm hiển thị nhiệt độ Real-time, chọn mức nhiệt (45°C pha sữa, 70°C trà xanh, 90°C cafe, 100°C sôi), ruột inox 316 y tế không gỉ và vỏ chống bỏng 2 lớp.',
    benefits: '1. Đạt doanh số 100.000 chiếc/năm đầu tiên; Biên lợi nhuận gộp >= 31%.\n2. Trở thành sản phẩm chiến lược để nâng tầm thương hiệu thiết bị gia dụng chăm sóc sức khỏe.\n3. Thời gian hoàn vốn đầu tư: 5 tháng.',
    
    bomTarget: '<= 240.000 VNĐ / chiếc (Đã bao gồm ruột Inox 316 dập sâu và đế cảm ứng)',
    sopDate: '2026-10-25',
    qualityMetric: 'Độ bền đóng ngắt Rơ-le bảo vệ đạt >= 15.000 lần đun (tương đương 10 năm sử dụng); Kiểm tra 100% rò rỉ nước bằng khí nén áp suất cao.',
    performanceMetric: 'Ruột ấm Inox 316 liền khối không vết hàn; Cảm biến nhiệt NTC độ chính xác ±1°C; Thân vỏ 2 lớp cách nhiệt (chạm vào <= 40°C khi nước đang sôi 100°C).',
    complianceMetric: 'QCVN 4 an toàn điện, Tiêu chuẩn Inox thực phẩm SUS 316 chống ăn mòn.',
    warrantyTarget: 'Tỷ lệ bảo hành sau 12 tháng < 0.8%',

    scopeIn: `1. Thiết kế cơ khí ruột ấm dập sâu Inox 316 nguyên khối không mối hàn đáy.
2. Thiết kế vỏ nhựa PP cao cấp 2 lớp cách nhiệt chống nóng bên ngoài.
3. Phát triển cụm mạch cảm ứng LED hiển thị nhiệt độ thực tế trên thân/đế ấm.
4. Tích hợp Rơ-le điều khiển nhiệt độ Strix cao cấp và cảm biến nhiệt độ NTC siêu nhạy.
5. Chế tạo khuôn ép nhựa và đồ gá kiểm tra rò điện dây chuyền.`,
    
    scopeOut: `1. Không làm thân bằng thủy tinh Borosilicate trong dự án này (chuyên biệt hóa dòng Inox 316 2 lớp).
2. Không kèm phụ kiện lưới lọc trà bằng gốm sứ.`,

    milestones: [
      {
        gate: 'Gate 1',
        name: 'Concept & PRD',
        deliverables: 'Bản vẽ 3D ID/MD, Bảng thông số linh kiện cảm biến NTC và bản vẽ dập Inox 316',
        targetDate: '2026-09-15',
        owner: 'Sponsor & PM',
        status: 'Approved'
      },
      {
        gate: 'Gate 2',
        name: 'Design Freeze & EVT',
        deliverables: 'Mẫu mock-up chạy thử nghiệm giữ ấm nước ở các mức 45°C - 70°C - 90°C chính xác',
        targetDate: '2026-09-30',
        owner: 'R&D Lead',
        status: 'In Progress'
      },
      {
        gate: 'Gate 3',
        name: 'Tooling & DVT',
        deliverables: 'Hoàn thiện khuôn dập ruột inox và khuôn ép vỏ nhựa, test thả rơi thùng đầy nước',
        targetDate: '2026-10-10',
        owner: 'QA & Tooling Lead',
        status: 'Not Started'
      },
      {
        gate: 'Gate 4',
        name: 'PVT & Pilot Run',
        deliverables: 'Sản xuất thử nghiệm 300 cái tại chuyền lắp ráp, kiểm tra rò điện cao áp 100%',
        targetDate: '2026-10-18',
        owner: 'Giám Đốc Nhà Máy & PE',
        status: 'Not Started'
      },
      {
        gate: 'Gate 5',
        name: 'SOP Đại Trà',
        deliverables: 'Nghiệm thu xuất hàng lô đầu tiên 20.000 cái ra thị trường',
        targetDate: '2026-10-25',
        owner: 'Ban Tổng Giám Đốc',
        status: 'Not Started'
      }
    ],

    team: {
      mdLead: 'Đỗ Văn Thành - Kỹ sư trưởng Kết cấu Thân ấm & Dập Inox',
      eeLead: 'Lương Đình Khang - Kỹ sư Mạch Cảm biến & NTC',
      idLead: 'Phan Anh Khoa - CMF & Industrial Designer',
      qaLead: 'Nguyễn Thị Loan - QA Lead Inox & Rò rỉ',
      sourcingLead: 'Vũ Mạnh Cường - Sourcing Lead Linh kiện Điện gia dụng',
      peLead: 'Hoàng Văn Phúc - Kỹ sư Dây chuyền Lắp ráp',
      mktLead: 'Bùi Bích Phương - Giám đốc Tiếp thị'
    },

    budget: {
      tooling: 350000000,
      prototype: 40000000,
      certTesting: 35000000,
      jigPilot: 30000000,
      contingencyRate: 0.10,
      currency: 'VND'
    },

    risks: [
      {
        id: 'r1',
        title: 'Chất lượng mác thép Inox không đúng chuẩn 316 dẫn đến rỉ sét đốm đáy',
        impact: 'High',
        mitigation: 'Kiểm định quang phổ kim loại từng cuộn phôi thép nhập kho từ nhà máy Posco/Yongjin.'
      },
      {
        id: 'r2',
        title: 'Nguy cơ cạn nước gây cháy nổ nếu người dùng quên đổ nước',
        impact: 'High',
        mitigation: 'Sử dụng rơ-le kép bảo vệ 2 lớp chống cháy khô tự ngắt dưới 0.5 giây.'
      }
    ],

    pmAuthority: 'Toàn quyền lựa chọn hãng sản xuất đế tiếp điện chuẩn an toàn; Được chủ động điều chỉnh linh kiện phụ trợ tương đương.',
    signMatrix: {
      sponsor: 'Trần Văn An - Giám Đốc R&D',
      pm: 'Nguyễn Văn Bình - Senior PM',
      qa: 'Nguyễn Thị Loan - Lead QA',
      factory: 'Trần Quốc Bảo - Giám Đốc Sản Xuất'
    }
  },

  aircon: {
    id: 'preset-aircon',
    savedAt: '2026-09-02 08:45:00',
    name: 'Điều Hòa Treo Tường Inverter 12.000 BTU Lọc Bụi Mịn PM2.5 & Diệt Khuẩn Ion',
    code: 'RD-AC-2026-12K',
    category: 'Điều hòa không khí',
    sponsor: 'Nguyễn Thanh Tùng - Phó Tổng Giám Đốc Khối Kỹ Thuật HVAC',
    pm: 'Đoàn Quốc Hưng - Senior PM Dự Án Điện Lạnh Không Khí',
    date: '2026-09-02',
    version: '1.0',
    targetAudience: 'Căn hộ chung cư, nhà phố đô thị có nhu cầu vừa làm mát tiết kiệm điện vừa thanh lọc không khí bảo vệ hô hấp.',
    problem: 'Ô nhiễm không khí bụi mịn PM2.5 tại các đô thị lớn ngày càng nghiêm trọng. Người dùng phải mua máy lạnh và máy lọc không khí riêng biệt gây tốn diện tích và chi phí. Cần một dòng điều hòa Inverter thế hệ mới tích hợp màng lọc PM2.5 tĩnh điện, phát ion Plasma diệt khuẩn, độ ồn dàn lạnh siêu êm 19dB.',
    benefits: '1. Doanh số dự kiến: 35.000 bộ trong năm tài chính 2027.\n2. Doanh thu ước tính: ~210 tỷ VNĐ; Biên lợi nhuận gộp đạt 30.5%.\n3. Khẳng định năng lực tự chủ công nghệ HVAC nhiệt lạnh cao cấp.',
    
    bomTarget: '<= 4.150.000 VNĐ / bộ (Bao gồm Dàn nóng + Dàn lạnh + Môi chất lạnh R32 nạp sẵn)',
    sopDate: '2027-01-20 (Kịp đón đầu mùa nóng miền Bắc & miền Nam)',
    qualityMetric: 'Dàn trao đổi nhiệt mạ vàng Golden Fin chống ăn mòn muối biển đạt 1.500 giờ phun sương muối; Tỷ lệ xì gas bảo hành < 0.5%.',
    performanceMetric: 'Hiệu suất năng lượng CSPF đạt 5.85 (Đạt chuẩn 5 sao vượt trội); Độ ồn dàn lạnh chỉ 19 dB(A) ở chế độ Quiet Sleep; Làm lạnh siêu tốc Turbo giảm 5°C trong 3 phút.',
    complianceMetric: 'QCVN 9:2012/BKHCN về tương thích điện từ EMC, QCVN an toàn thiết bị làm lạnh sử dụng gas R32, Dán nhãn năng lượng Cục Tiết Kiệm Năng Lượng.',
    warrantyTarget: 'Tỷ lệ bảo hành sau 24 tháng < 1.2%',

    scopeIn: `1. Thiết kế khí động học dàn lạnh với quạt lồng sóc đường kính lớn thổi gió xa 12m.
2. Tích hợp module tạo ion âm Plasma diệt khuẩn và khay màng lọc bụi mịn PM2.5 tháo lắp dễ dàng.
3. Thiết kế bo mạch biến tần Inverter DC Full-Sin điều khiển máy nén trục kép.
4. Gia công dàn tản nhiệt ống đồng cánh nhôm Golden Fin cho cả dàn nóng và dàn lạnh.
5. Kiểm định độc lập tại Phòng thử nghiệm Enthalpy tiêu chuẩn quốc gia.`,
    
    scopeOut: `1. Không bao gồm phụ kiện vật tư ống đồng và công thợ lắp đặt tại nhà khách hàng.
2. Không kèm chức năng sưởi ấm 2 chiều (chuyên biệt hóa dòng 1 chiều lạnh cho vùng nhiệt đới).`,

    milestones: [
      {
        gate: 'Gate 1',
        name: 'Concept & PRD',
        deliverables: 'PRD chi tiết, Mô phỏng động lực học chất lưu CFD luồng gió dàn lạnh, Dự toán BOM',
        targetDate: '2026-10-01',
        owner: 'Sponsor & PM HVAC',
        status: 'Approved'
      },
      {
        gate: 'Gate 2',
        name: 'Design Freeze & EVT',
        deliverables: 'Đóng băng máy nén R32 và hệ thống ống đồng, Chạy thử mẫu Proto đạt CSPF > 5.8',
        targetDate: '2026-11-15',
        owner: 'Lead HVAC & Inverter HW',
        status: 'In Progress'
      },
      {
        gate: 'Gate 3',
        name: 'Tooling & DVT',
        deliverables: 'Nghiệm thu bộ khuôn vỏ nhựa dàn lạnh và dập vỏ tôn dàn nóng, Test buồng cân bằng nhiệt Enthalpy',
        targetDate: '2026-12-15',
        owner: 'QA HVAC & Tooling Lead',
        status: 'Not Started'
      },
      {
        gate: 'Gate 4',
        name: 'PVT & Pilot Run',
        deliverables: 'Pilot run 100 bộ trên dây chuyền hút chân không tự động, kiểm tra rò rỉ gas bằng máy dò Heli',
        targetDate: '2027-01-05',
        owner: 'Giám Đốc Nhà Máy Điện Lạnh & PE',
        status: 'Not Started'
      },
      {
        gate: 'Gate 5',
        name: 'SOP Thương Mại',
        deliverables: 'Bàn giao sản xuất hàng loạt 10.000 bộ đợt 1, Hoàn tất chứng nhận QCVN 9',
        targetDate: '2027-01-20',
        owner: 'Ban Tổng Giám Đốc',
        status: 'Not Started'
      }
    ],

    team: {
      mdLead: 'Trần Đình Trọng - Kỹ sư trưởng Cơ khí & Khí động học HVAC',
      eeLead: 'Lê Minh Tuấn - Kỹ sư trưởng Bo mạch Inverter & EMC',
      idLead: 'Phạm Minh Đức - Senior Industrial Designer',
      qaLead: 'Đặng Ngọc Sơn - QA Lead Kiểm định HVAC & Enthalpy',
      sourcingLead: 'Vũ Quốc Hưng - Sourcing Lead Máy nén & Môi chất R32',
      peLead: 'Nguyễn Văn Long - PE Lead Dây chuyền Hút chân không & Nạp Gas',
      mktLead: 'Trần Thị Thu Thảo - Giám đốc Kinh doanh Ngành Hàng Điện Lạnh'
    },

    budget: {
      tooling: 1750000000,
      prototype: 240000000,
      certTesting: 120000000,
      jigPilot: 140000000,
      contingencyRate: 0.10,
      currency: 'VND'
    },

    risks: [
      {
        id: 'r1',
        title: 'Rủi ro tương thích điện từ EMC không đạt chuẩn QCVN 9 do xung nhiễu biến tần',
        impact: 'High',
        mitigation: 'Bổ sung mạch lọc nguồn EMI 2 cấp và cuộn kháng lọc nhiễu ngay từ giai đoạn layout bo mạch PCB.'
      },
      {
        id: 'r2',
        title: 'Biến động giá nguyên liệu đồng và phôi nhôm trên sàn thế giới',
        impact: 'Medium',
        mitigation: 'Ký hợp đồng chốt giá phôi đồng dài hạn 6 tháng với đối tác cung ứng.'
      }
    ],

    pmAuthority: 'Toàn quyền lựa chọn nhà cung cấp máy nén trục kép và phòng lab kiểm định độc lập; Được phê duyệt phát sinh kinh phí thử nghiệm buồng câm.',
    signMatrix: {
      sponsor: 'Nguyễn Thanh Tùng - Phó TGĐ HVAC',
      pm: 'Đoàn Quốc Hưng - Senior PM',
      qa: 'Đặng Ngọc Sơn - Lead QA',
      factory: 'Phạm Văn Nam - Giám Đốc Nhà Máy Điện Lạnh'
    }
  },

  fridge: {
    id: 'preset-fridge',
    savedAt: '2026-09-02 08:50:00',
    name: 'Tủ Lạnh 4 Cửa Multi-Door Inverter 480L Ngăn Đông Mềm -1°C Ag+ Plasma',
    code: 'RD-FR-2026-480L',
    category: 'Tủ lạnh / Tủ đông',
    sponsor: 'Nguyễn Văn Tuấn - Giám Đốc R&D Điện Lạnh Gia Dụng',
    pm: 'Trần Minh Quân - Senior PM Tủ Lạnh & Tủ Đông',
    date: '2026-09-02',
    version: '1.0',
    targetAudience: 'Gia đình hiện đại 4-7 người có nhu cầu bảo quản thực phẩm tươi sống nguyên tuần không cần rã đông.',
    problem: 'Tủ lạnh 2 cánh truyền thống dung tích nhỏ và dễ lẫn mùi thực phẩm giữa các ngăn. Người tiêu dùng ngày càng ưa chuộng dòng tủ 4 cửa Multi-door có ngăn đông mềm bảo quản thịt cá tươi 7 ngày không đông cứng, khử mùi Plasma kháng khuẩn và tiết kiệm điện.',
    benefits: '1. Dự kiến bán 25.000 chiếc trong năm đầu; Doanh thu kỳ vọng ~250 tỷ VNĐ.\n2. Gia tăng biên lợi nhuận danh mục điện lạnh lên 34%.\n3. Nâng cấp vị thế thương hiệu vào phân khúc gia dụng cao cấp.',
    
    bomTarget: '<= 6.200.000 VNĐ / sản phẩm hoàn chỉnh',
    sopDate: '2027-02-15',
    qualityMetric: 'Độ bền bản lề cửa tủ đạt 100.000 lần đóng mở; Khả năng giữ lạnh cách nhiệt xốp Polyurethane Cyclopentane khi mất điện 16 giờ.',
    performanceMetric: 'Ngăn đông mềm duy trì nhiệt độ chuẩn -1°C ± 0.5°C; 2 dàn lạnh độc lập chống lẫn mùi 100%; Điện năng tiêu thụ chỉ ~1.05 kWh/ngày.',
    complianceMetric: 'QCVN 4 an toàn điện, Tiêu chuẩn hiệu suất năng lượng 5 sao, Tiêu chuẩn an toàn thực phẩm lòng tủ HIPS kháng khuẩn.',
    warrantyTarget: 'Tỷ lệ bảo hành sau 24 tháng < 1.0%',

    scopeIn: `1. Thiết kế kiểu dáng 4 cửa mặt thép ánh kim chống bám vân tay sang trọng.
2. Thiết kế kết cấu buồng xốp cách nhiệt PU áp lực cao và ngăn đông mềm chuyên biệt.
3. Phát triển hệ thống 2 dàn lạnh độc lập (Dual Cooling System) và máy nén biến tần Inverter.
4. Tích hợp module tạo ion Ag+ Plasma diệt khuẩn khử mùi hôi tanh thực phẩm.
5. Thử nghiệm độ ồn và tiêu hao điện năng theo tiêu chuẩn TCVN.`,
    
    scopeOut: `1. Không tích hợp màn hình cảm ứng Android lớn trên cánh tủ (tối ưu giá thành cho khách hàng phổ thông).
2. Không tích hợp máy làm đá tự động lấy nước ngoài (dành cho model Flagship Phase sau).`,

    milestones: [
      {
        gate: 'Gate 1',
        name: 'Concept & PRD',
        deliverables: 'Bản vẽ 3D tổng thể 4 cửa, Bố trí phân khoang dung tích 480L, Dự toán BOM',
        targetDate: '2026-10-15',
        owner: 'Sponsor & PM',
        status: 'Approved'
      },
      {
        gate: 'Gate 2',
        name: 'Design Freeze & EVT',
        deliverables: 'Đóng băng bản vẽ tạo hình buồng xốp PU và hệ thống ống gas dàn lạnh',
        targetDate: '2026-11-30',
        owner: 'MD & Cold System Leads',
        status: 'In Progress'
      },
      {
        gate: 'Gate 3',
        name: 'Tooling & DVT',
        deliverables: 'Nghiệm thu khuôn dập cánh tủ và đồ gá ép xốp PU, Test cân bằng nhiệt độ các ngăn',
        targetDate: '2027-01-10',
        owner: 'QA & Tooling Lead',
        status: 'Not Started'
      },
      {
        gate: 'Gate 4',
        name: 'PVT & Pilot Run',
        deliverables: 'Sản xuất thử nghiệm 80 chiếc, kiểm tra độ đồng đều nhiệt độ bằng 64 cảm biến nhiệt',
        targetDate: '2027-01-25',
        owner: 'Giám Đốc Nhà Máy & PE',
        status: 'Not Started'
      },
      {
        gate: 'Gate 5',
        name: 'SOP Thương Mại',
        deliverables: 'Nghiệm thu lô hàng thương mại đầu tiên xuất kho',
        targetDate: '2027-02-15',
        owner: 'Ban Tổng Giám Đốc',
        status: 'Not Started'
      }
    ],

    team: {
      mdLead: 'Hoàng Minh Đức - Lead Kết cấu Cơ khí & Vỏ tủ Polyurethane',
      eeLead: 'Phan Văn Hải - Lead Bo mạch Inverter Tủ lạnh',
      idLead: 'Phan Anh Khoa - Senior CMF Designer',
      qaLead: 'Đỗ Thị Mai - QA Lead Điện Lạnh',
      sourcingLead: 'Nguyễn Văn Thắng - Sourcing Máy nén & Xốp PU',
      peLead: 'Vũ Đức Nam - PE Lead Dây chuyền Bơm xốp Áp lực cao',
      mktLead: 'Bùi Bích Phương - Giám đốc Tiếp thị'
    },

    budget: {
      tooling: 2400000000,
      prototype: 320000000,
      certTesting: 150000000,
      jigPilot: 180000000,
      contingencyRate: 0.10,
      currency: 'VND'
    },

    risks: [
      {
        id: 'r1',
        title: 'Hiện tượng đọng sương rỉ nước ở mép cửa tủ trong mùa nồm ẩm',
        impact: 'High',
        mitigation: 'Bố trí ống sấy nhiệt xung quanh mép gioăng cửa tận dụng nhiệt thải của dàn ngưng.'
      },
      {
        id: 'r2',
        title: 'Mùi thức ăn ám lẫn giữa ngăn đông và ngăn rau củ',
        impact: 'Medium',
        mitigation: 'Sử dụng hệ thống 2 quạt gió và 2 dàn lạnh riêng biệt kèm màng lọc carbon Ag+.'
      }
    ],

    pmAuthority: 'Toàn quyền lựa chọn nhà cung cấp máy nén Inverter và hóa chất xốp cách nhiệt PU Cyclopentane; Quyền điều phối chuyên gia nước ngoài.',
    signMatrix: {
      sponsor: 'Nguyễn Văn Tuấn - Giám Đốc R&D',
      pm: 'Trần Minh Quân - Senior PM',
      qa: 'Đỗ Thị Mai - Lead QA',
      factory: 'Lê Văn Cường - Giám Đốc Nhà Máy Điện Lạnh'
    }
  }
};
