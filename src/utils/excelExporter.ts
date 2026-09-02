import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ProjectCharterData } from '../types/charter';
import { normalizeCharter } from './normalizeCharter';

export async function exportCharterToExcel(rawCharter: ProjectCharterData): Promise<void> {
  const charter = normalizeCharter(rawCharter);
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'R&D Appliance Project Charter Studio';
  workbook.lastModifiedBy = charter.pm || 'R&D Project Manager';
  workbook.created = new Date();
  workbook.modified = new Date();

  const sheet = workbook.addWorksheet('Project Charter', {
    views: [{ showGridLines: true }],
    pageSetup: {
      orientation: 'portrait',
      paperSize: 9, // A4
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: {
        left: 0.5,
        right: 0.5,
        top: 0.6,
        bottom: 0.6,
        header: 0.3,
        footer: 0.3
      }
    }
  });

  // Setup Column Widths
  sheet.columns = [
    { width: 3 },   // A - spacing
    { width: 28 },  // B - Section / Category / Label
    { width: 38 },  // C - Values / Deliverables / Direct Cost
    { width: 22 },  // D - Dates / Targets / Percentage
    { width: 30 },  // E - Owner / Approver / Notes
    { width: 3 }    // F - spacing
  ];

  // ==================== MODERN HIGH-CONTRAST EXECUTIVE COLOR PALETTE ====================
  // Bold, sharp, modern tones that clearly distinguish sections and read crisply in Excel & Print
  const TITLE_BG = 'FF0F172A';         // #0f172a (Deep Slate 900)
  const TITLE_TEXT = 'FFFFFFFF';       // Pure White
  const SUBTITLE_BG = 'FF1E293B';      // #1e293b (Slate 800)
  const SUBTITLE_TEXT = 'FF93C5FD';    // #93c5fd (Ice Blue Accent)
  
  const SECTION_BG = 'FF1E3A8A';       // #1e3a8a (Deep Royal Navy Blue)
  const SECTION_TEXT = 'FFFFFFFF';     // Pure White bold text
  const SECTION_ACCENT = 'FF3B82F6';   // #3b82f6 (Vibrant Electric Blue left accent bar)
  
  const TH_FILL = 'FF334155';          // #334155 (Slate 700 Table Header)
  const TH_TEXT = 'FFFFFFFF';          // Pure White
  
  const LABEL_FILL = 'FFE2E8F0';       // #e2e8f0 (High-contrast Slate 200)
  const LABEL_TEXT = 'FF0F172A';       // #0f172a (Deep Slate 900 bold)
  
  const BORDER_COLOR = 'FF94A3B8';     // #94a3b8 (Crisp Slate 400 border)
  const BORDER_DARK = 'FF475569';      // #475569 (Strong Slate 600 header border)
  
  const IN_SCOPE_HEADER_BG = 'FF059669';  // #059669 (Rich Emerald Green 600)
  const IN_SCOPE_HEADER_TEXT = 'FFFFFFFF';
  const IN_SCOPE_CELL_BG = 'FFF0FDF4';    // #f0fdf4 (Soft Mint)
  const IN_SCOPE_CELL_TEXT = 'FF064E3B';  // #064e3b (Deep Forest Green)
  
  const OUT_SCOPE_HEADER_BG = 'FFE11D48'; // #e11d48 (Rose Crimson 600)
  const OUT_SCOPE_HEADER_TEXT = 'FFFFFFFF';
  const OUT_SCOPE_CELL_BG = 'FFFFF1F2';   // #fff1f2 (Soft Rose)
  const OUT_SCOPE_CELL_TEXT = 'FF881337'; // #881337 (Deep Crimson Red)
  
  const AMBER_BG = 'FFFEF3C7';         // #fef3c7 (Amber 100)
  const AMBER_TEXT = 'FF92400E';       // #92400e (Deep Amber 800)
  const ACCENT_BLUE = 'FF1D4ED8';      // #1d4ed8 (Royal Blue)
  
  const GRAND_TOTAL_BG = 'FF0F172A';   // #0f172a (Deep Slate Navy)
  const GRAND_TOTAL_TEXT = 'FFFFFFFF'; // Pure White
  const GRAND_TOTAL_AMOUNT = 'FF34D399'; // #34d399 (Mint Green 400 bold)

  const borderAllThin: Partial<ExcelJS.Borders> = {
    top: { style: 'thin', color: { argb: BORDER_COLOR } },
    left: { style: 'thin', color: { argb: BORDER_COLOR } },
    bottom: { style: 'thin', color: { argb: BORDER_COLOR } },
    right: { style: 'thin', color: { argb: BORDER_COLOR } }
  };

  const borderTotalAccounting: Partial<ExcelJS.Borders> = {
    top: { style: 'medium', color: { argb: 'FF60A5FA' } },
    left: { style: 'thin', color: { argb: BORDER_DARK } },
    bottom: { style: 'double', color: { argb: 'FFFFFFFF' } },
    right: { style: 'thin', color: { argb: BORDER_DARK } }
  };

  // 1. TOP EXECUTIVE TITLE BANNER
  sheet.mergeCells('B2:E2');
  const titleCell = sheet.getCell('B2');
  titleCell.value = 'BẢN ĐIỀU LỆ DỰ ÁN R&D (PROJECT CHARTER)';
  titleCell.font = { name: 'Arial', size: 13, bold: true, color: { argb: TITLE_TEXT } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TITLE_BG } };
  titleCell.border = {
    top: { style: 'medium', color: { argb: BORDER_DARK } },
    left: { style: 'thin', color: { argb: BORDER_DARK } },
    right: { style: 'thin', color: { argb: BORDER_DARK } },
    bottom: { style: 'thin', color: { argb: BORDER_DARK } }
  };
  sheet.getRow(2).height = 30;

  sheet.mergeCells('B3:E3');
  const subTitleCell = sheet.getCell('B3');
  subTitleCell.value = `DỰ ÁN: ${(charter.name || '').toUpperCase()}  |  MÃ SỐ: ${charter.code}  |  NGÀNH HÀNG: ${(charter.category || '').toUpperCase()}`;
  subTitleCell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: SUBTITLE_TEXT } };
  subTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  subTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SUBTITLE_BG } };
  subTitleCell.border = {
    left: { style: 'thin', color: { argb: BORDER_DARK } },
    right: { style: 'thin', color: { argb: BORDER_DARK } },
    bottom: { style: 'medium', color: { argb: BORDER_DARK } }
  };
  sheet.getRow(3).height = 22;

  let currentRow = 5;

  function addSectionHeader(title: string, sectionRoman: string) {
    sheet.mergeCells(`B${currentRow}:E${currentRow}`);
    const cell = sheet.getCell(`B${currentRow}`);
    cell.value = `${sectionRoman}. ${title.toUpperCase()}`;
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: SECTION_TEXT } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SECTION_BG } };
    cell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
    cell.border = {
      top: { style: 'medium', color: { argb: SECTION_BG } },
      left: { style: 'thick', color: { argb: SECTION_ACCENT } },
      bottom: { style: 'medium', color: { argb: SECTION_BG } },
      right: { style: 'thin', color: { argb: BORDER_DARK } }
    };
    sheet.getRow(currentRow).height = 24;
    currentRow++;
  }

  // ==================== I. THÔNG TIN DỰ ÁN ====================
  addSectionHeader('Thông Tin Dự Án & Bối Cảnh Kinh Doanh (Business Case)', 'I');

  // Sponsor & PM
  sheet.getCell(`B${currentRow}`).value = 'Project Sponsor (Người bảo trợ)';
  sheet.getCell(`B${currentRow}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: LABEL_TEXT } };
  sheet.getCell(`B${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LABEL_FILL } };
  sheet.getCell(`B${currentRow}`).border = borderAllThin;

  sheet.getCell(`C${currentRow}`).value = charter.sponsor || 'Chưa cập nhật';
  sheet.getCell(`C${currentRow}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF0F172A' } };
  sheet.getCell(`C${currentRow}`).border = borderAllThin;

  sheet.getCell(`D${currentRow}`).value = 'Project Manager (Chủ nhiệm)';
  sheet.getCell(`D${currentRow}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: LABEL_TEXT } };
  sheet.getCell(`D${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LABEL_FILL } };
  sheet.getCell(`D${currentRow}`).border = borderAllThin;

  sheet.getCell(`E${currentRow}`).value = charter.pm || 'Chưa cập nhật';
  sheet.getCell(`E${currentRow}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF0F172A' } };
  sheet.getCell(`E${currentRow}`).border = borderAllThin;
  currentRow++;

  // Date & Version
  sheet.getCell(`B${currentRow}`).value = 'Ngày Phê Duyệt';
  sheet.getCell(`B${currentRow}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: LABEL_TEXT } };
  sheet.getCell(`B${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LABEL_FILL } };
  sheet.getCell(`B${currentRow}`).border = borderAllThin;

  sheet.getCell(`C${currentRow}`).value = charter.date || new Date().toISOString().slice(0, 10);
  sheet.getCell(`C${currentRow}`).font = { name: 'Arial', size: 9, color: { argb: 'FF0F172A' } };
  sheet.getCell(`C${currentRow}`).border = borderAllThin;

  sheet.getCell(`D${currentRow}`).value = 'Phiên Bản (Version)';
  sheet.getCell(`D${currentRow}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: LABEL_TEXT } };
  sheet.getCell(`D${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LABEL_FILL } };
  sheet.getCell(`D${currentRow}`).border = borderAllThin;

  sheet.getCell(`E${currentRow}`).value = `Ver ${charter.version || '1.0'}`;
  sheet.getCell(`E${currentRow}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF0F172A' } };
  sheet.getCell(`E${currentRow}`).border = borderAllThin;
  currentRow++;

  // Target Customer
  if (charter.targetAudience) {
    sheet.getCell(`B${currentRow}`).value = 'Khách Hàng Mục Tiêu';
    sheet.getCell(`B${currentRow}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: LABEL_TEXT } };
    sheet.getCell(`B${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LABEL_FILL } };
    sheet.getCell(`B${currentRow}`).border = borderAllThin;

    sheet.mergeCells(`C${currentRow}:E${currentRow}`);
    const audCell = sheet.getCell(`C${currentRow}`);
    audCell.value = charter.targetAudience;
    audCell.font = { name: 'Arial', size: 9, color: { argb: 'FF0F172A' } };
    audCell.alignment = { wrapText: true, vertical: 'top' };
    audCell.border = borderAllThin;
    sheet.getRow(currentRow).height = 26;
    currentRow++;
  }

  // Market Problem
  sheet.getCell(`B${currentRow}`).value = 'Vấn Đề & Cơ Hội Thị Trường';
  sheet.getCell(`B${currentRow}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: LABEL_TEXT } };
  sheet.getCell(`B${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LABEL_FILL } };
  sheet.getCell(`B${currentRow}`).border = borderAllThin;

  sheet.mergeCells(`C${currentRow}:E${currentRow}`);
  const probCell = sheet.getCell(`C${currentRow}`);
  probCell.value = charter.problem || 'Chưa nhập thông tin.';
  probCell.font = { name: 'Arial', size: 9, color: { argb: 'FF0F172A' } };
  probCell.alignment = { wrapText: true, vertical: 'top' };
  probCell.border = borderAllThin;
  sheet.getRow(currentRow).height = 42;
  currentRow++;

  // Business Benefits
  sheet.getCell(`B${currentRow}`).value = 'Mục Tiêu Kinh Doanh & Lợi Nhuận';
  sheet.getCell(`B${currentRow}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: LABEL_TEXT } };
  sheet.getCell(`B${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LABEL_FILL } };
  sheet.getCell(`B${currentRow}`).border = borderAllThin;

  sheet.mergeCells(`C${currentRow}:E${currentRow}`);
  const benCell = sheet.getCell(`C${currentRow}`);
  benCell.value = charter.benefits || 'Chưa nhập thông tin.';
  benCell.font = { name: 'Arial', size: 9, color: { argb: 'FF0F172A' } };
  benCell.alignment = { wrapText: true, vertical: 'top' };
  benCell.border = borderAllThin;
  sheet.getRow(currentRow).height = 42;
  currentRow += 2;

  // ==================== II. MỤC TIÊU SMART & SUCCESS METRICS ====================
  addSectionHeader('Mục Tiêu SMART & Tiêu Chí Đánh Giá Thành Công', 'II');

  const metricsRow1 = currentRow;
  sheet.getCell(`B${metricsRow1}`).value = 'Target BOM (Giá thành định mức)';
  sheet.getCell(`B${metricsRow1}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: LABEL_TEXT } };
  sheet.getCell(`B${metricsRow1}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LABEL_FILL } };
  sheet.getCell(`B${metricsRow1}`).border = borderAllThin;

  sheet.getCell(`C${metricsRow1}`).value = charter.bomTarget || 'Chưa xác định';
  sheet.getCell(`C${metricsRow1}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: ACCENT_BLUE } };
  sheet.getCell(`C${metricsRow1}`).border = borderAllThin;

  sheet.getCell(`D${metricsRow1}`).value = 'Thời Hạn Bắt Đầu Sản Xuất (SOP)';
  sheet.getCell(`D${metricsRow1}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: LABEL_TEXT } };
  sheet.getCell(`D${metricsRow1}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LABEL_FILL } };
  sheet.getCell(`D${metricsRow1}`).border = borderAllThin;

  sheet.getCell(`E${metricsRow1}`).value = charter.sopDate || 'Chưa xác định';
  sheet.getCell(`E${metricsRow1}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF7C3AED' } };
  sheet.getCell(`E${metricsRow1}`).border = borderAllThin;
  currentRow++;

  const metricsRow2 = currentRow;
  sheet.getCell(`B${metricsRow2}`).value = 'Chất Lượng & Độ Tin Cậy';
  sheet.getCell(`B${metricsRow2}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: LABEL_TEXT } };
  sheet.getCell(`B${metricsRow2}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LABEL_FILL } };
  sheet.getCell(`B${metricsRow2}`).border = borderAllThin;

  sheet.getCell(`C${metricsRow2}`).value = charter.qualityMetric || 'Chưa xác định';
  sheet.getCell(`C${metricsRow2}`).font = { name: 'Arial', size: 9, color: { argb: 'FF0F172A' } };
  sheet.getCell(`C${metricsRow2}`).border = borderAllThin;

  sheet.getCell(`D${metricsRow2}`).value = 'Hiệu Năng & Độ Ồn (Acoustics)';
  sheet.getCell(`D${metricsRow2}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: LABEL_TEXT } };
  sheet.getCell(`D${metricsRow2}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LABEL_FILL } };
  sheet.getCell(`D${metricsRow2}`).border = borderAllThin;

  sheet.getCell(`E${metricsRow2}`).value = charter.performanceMetric || 'Chưa xác định';
  sheet.getCell(`E${metricsRow2}`).font = { name: 'Arial', size: 9, color: { argb: 'FF0F172A' } };
  sheet.getCell(`E${metricsRow2}`).border = borderAllThin;
  currentRow++;

  // Compliance
  sheet.getCell(`B${currentRow}`).value = 'Tiêu Chuẩn Pháp Lý / Hợp Quy';
  sheet.getCell(`B${currentRow}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: LABEL_TEXT } };
  sheet.getCell(`B${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LABEL_FILL } };
  sheet.getCell(`B${currentRow}`).border = borderAllThin;

  sheet.mergeCells(`C${currentRow}:E${currentRow}`);
  const compCell = sheet.getCell(`C${currentRow}`);
  compCell.value = charter.complianceMetric || 'QCVN 4:2009/BKHCN';
  compCell.font = { name: 'Arial', size: 9, color: { argb: 'FF0F172A' } };
  compCell.alignment = { wrapText: true, vertical: 'top' };
  compCell.border = borderAllThin;
  sheet.getRow(currentRow).height = 24;
  currentRow += 2;

  // ==================== III. PHẠM VI (SCOPE) ====================
  addSectionHeader('Định Nghĩa Phạm Vi Dự Án (In-Scope vs Out-of-Scope)', 'III');

  sheet.getCell(`B${currentRow}`).value = 'TRONG PHẠM VI (IN-SCOPE)';
  sheet.getCell(`B${currentRow}`).font = { name: 'Arial', size: 9.5, bold: true, color: { argb: IN_SCOPE_HEADER_TEXT } };
  sheet.getCell(`B${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: IN_SCOPE_HEADER_BG } };
  sheet.getCell(`B${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getCell(`B${currentRow}`).border = {
    top: { style: 'thin', color: { argb: IN_SCOPE_HEADER_BG } },
    left: { style: 'thin', color: { argb: IN_SCOPE_HEADER_BG } },
    bottom: { style: 'thin', color: { argb: IN_SCOPE_HEADER_BG } },
    right: { style: 'thin', color: { argb: IN_SCOPE_HEADER_BG } }
  };

  sheet.mergeCells(`C${currentRow}:E${currentRow}`);
  sheet.getCell(`C${currentRow}`).value = 'NGOÀI PHẠM VI (OUT-OF-SCOPE)';
  sheet.getCell(`C${currentRow}`).font = { name: 'Arial', size: 9.5, bold: true, color: { argb: OUT_SCOPE_HEADER_TEXT } };
  sheet.getCell(`C${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: OUT_SCOPE_HEADER_BG } };
  sheet.getCell(`C${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getCell(`C${currentRow}`).border = {
    top: { style: 'thin', color: { argb: OUT_SCOPE_HEADER_BG } },
    left: { style: 'thin', color: { argb: OUT_SCOPE_HEADER_BG } },
    bottom: { style: 'thin', color: { argb: OUT_SCOPE_HEADER_BG } },
    right: { style: 'thin', color: { argb: OUT_SCOPE_HEADER_BG } }
  };
  sheet.getRow(currentRow).height = 22;
  currentRow++;

  const scopeContentRow = currentRow;
  sheet.getCell(`B${scopeContentRow}`).value = charter.scopeIn;
  sheet.getCell(`B${scopeContentRow}`).font = { name: 'Arial', size: 9, color: { argb: IN_SCOPE_CELL_TEXT } };
  sheet.getCell(`B${scopeContentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: IN_SCOPE_CELL_BG } };
  sheet.getCell(`B${scopeContentRow}`).alignment = { wrapText: true, vertical: 'top' };
  sheet.getCell(`B${scopeContentRow}`).border = borderAllThin;

  sheet.mergeCells(`C${scopeContentRow}:E${scopeContentRow}`);
  sheet.getCell(`C${scopeContentRow}`).value = charter.scopeOut;
  sheet.getCell(`C${scopeContentRow}`).font = { name: 'Arial', size: 9, color: { argb: OUT_SCOPE_CELL_TEXT } };
  sheet.getCell(`C${scopeContentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: OUT_SCOPE_CELL_BG } };
  sheet.getCell(`C${scopeContentRow}`).alignment = { wrapText: true, vertical: 'top' };
  sheet.getCell(`C${scopeContentRow}`).border = borderAllThin;
  sheet.getRow(scopeContentRow).height = 64;
  currentRow += 2;

  // ==================== IV. LỘ TRÌNH STAGE-GATE ====================
  addSectionHeader('Lộ Trình Cột Mốc Stage-Gate (Hardware Development Cycle)', 'IV');

  // Table header
  sheet.getCell(`B${currentRow}`).value = 'Giai Đoạn / Cửa Duyệt (Gate)';
  sheet.getCell(`C${currentRow}`).value = 'Kết Quả Bàn Giao Cốt Lõi (Key Deliverables)';
  sheet.getCell(`D${currentRow}`).value = 'Hạn Hoàn Thành';
  sheet.getCell(`E${currentRow}`).value = 'Người Phê Duyệt';

  [`B${currentRow}`, `C${currentRow}`, `D${currentRow}`, `E${currentRow}`].forEach(pos => {
    sheet.getCell(pos).font = { name: 'Arial', size: 9.5, bold: true, color: { argb: TH_TEXT } };
    sheet.getCell(pos).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TH_FILL } };
    sheet.getCell(pos).border = borderAllThin;
    sheet.getCell(pos).alignment = { vertical: 'middle', horizontal: pos === `B${currentRow}` ? 'left' : 'left' };
  });
  sheet.getRow(currentRow).height = 24;
  currentRow++;

  (charter.milestones || []).forEach(m => {
    sheet.getCell(`B${currentRow}`).value = `${m.gate}: ${m.name}`;
    sheet.getCell(`B${currentRow}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF0F172A' } };
    sheet.getCell(`B${currentRow}`).border = borderAllThin;

    sheet.getCell(`C${currentRow}`).value = m.deliverables;
    sheet.getCell(`C${currentRow}`).font = { name: 'Arial', size: 9, color: { argb: 'FF334155' } };
    sheet.getCell(`C${currentRow}`).alignment = { wrapText: true, vertical: 'top' };
    sheet.getCell(`C${currentRow}`).border = borderAllThin;

    sheet.getCell(`D${currentRow}`).value = m.targetDate;
    sheet.getCell(`D${currentRow}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF0F172A' } };
    sheet.getCell(`D${currentRow}`).alignment = { horizontal: 'center', vertical: 'top' };
    sheet.getCell(`D${currentRow}`).border = borderAllThin;

    sheet.getCell(`E${currentRow}`).value = m.owner;
    sheet.getCell(`E${currentRow}`).font = { name: 'Arial', size: 9, color: { argb: 'FF334155' } };
    sheet.getCell(`E${currentRow}`).alignment = { vertical: 'top' };
    sheet.getCell(`E${currentRow}`).border = borderAllThin;

    sheet.getRow(currentRow).height = 26;
    currentRow++;
  });
  currentRow++;

  // ==================== V. ĐỘI NGŨ DỰ ÁN ====================
  addSectionHeader('Đội Ngũ Dự Án & Phân Công Vai Trò', 'V');

  const membersList: { role: string; val: string }[] = (charter.teamMembers && charter.teamMembers.length > 0)
    ? charter.teamMembers.map(m => ({
        role: m.roleTitle || 'Vị trí kỹ thuật',
        val: m.memberName ? (m.department ? `${m.memberName} (${m.department})` : m.memberName) : 'Chưa phân bổ'
      }))
    : [
        { role: 'Trưởng nhóm Cơ khí & Khuôn (MD Lead)', val: charter.team?.mdLead || 'Chưa phân bổ' },
        { role: 'Trưởng nhóm Điện tử & Code (EE/FW)', val: charter.team?.eeLead || 'Chưa phân bổ' },
        { role: 'Thiết kế Kiểu dáng (ID Designer)', val: charter.team?.idLead || 'Chưa phân bổ' },
        { role: 'Đảm bảo Chất lượng (Lead QA/QC)', val: charter.team?.qaLead || 'Chưa phân bổ' },
        { role: 'Thu mua & Cung ứng (Sourcing Lead)', val: charter.team?.sourcingLead || 'Chưa phân bổ' },
        { role: 'Kỹ thuật Sản xuất (PE / Process)', val: charter.team?.peLead || 'Chưa phân bổ' },
        { role: 'Đại diện Tiếp thị & Bán hàng (MKT/Sales)', val: charter.team?.mktLead || 'Chưa phân bổ' }
      ];

  for (let i = 0; i < membersList.length; i += 2) {
    const tm1 = membersList[i];
    const tm2 = membersList[i + 1];

    sheet.getCell(`B${currentRow}`).value = tm1.role;
    sheet.getCell(`B${currentRow}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: LABEL_TEXT } };
    sheet.getCell(`B${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LABEL_FILL } };
    sheet.getCell(`B${currentRow}`).border = borderAllThin;

    sheet.getCell(`C${currentRow}`).value = tm1.val;
    sheet.getCell(`C${currentRow}`).font = { name: 'Arial', size: 9, color: { argb: 'FF0F172A' } };
    sheet.getCell(`C${currentRow}`).border = borderAllThin;

    if (tm2) {
      sheet.getCell(`D${currentRow}`).value = tm2.role;
      sheet.getCell(`D${currentRow}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: LABEL_TEXT } };
      sheet.getCell(`D${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LABEL_FILL } };
      sheet.getCell(`D${currentRow}`).border = borderAllThin;

      sheet.getCell(`E${currentRow}`).value = tm2.val;
      sheet.getCell(`E${currentRow}`).font = { name: 'Arial', size: 9, color: { argb: 'FF0F172A' } };
      sheet.getCell(`E${currentRow}`).border = borderAllThin;
    } else {
      sheet.getCell(`D${currentRow}`).value = '';
      sheet.getCell(`D${currentRow}`).border = borderAllThin;
      sheet.getCell(`E${currentRow}`).value = '';
      sheet.getCell(`E${currentRow}`).border = borderAllThin;
    }
    currentRow++;
  }
  currentRow++;

  // ==================== VI. DỰ TOÁN NGÂN SÁCH (CÓ HÀM EXCEL ĐỘNG) ====================
  addSectionHeader('Dự Toán Ngân Sách Đầu Tư R&D (Bao Gồm Công Thức Excel Tự Động)', 'VI');

  sheet.getCell(`B${currentRow}`).value = 'Hạng Mục Đầu Tư R&D';
  sheet.getCell(`C${currentRow}`).value = 'Dự Toán (VNĐ)';
  sheet.getCell(`D${currentRow}`).value = 'Tỷ Trọng (%)';
  sheet.getCell(`E${currentRow}`).value = 'Ghi Chú Kỹ Thuật';

  [`B${currentRow}`, `C${currentRow}`, `D${currentRow}`, `E${currentRow}`].forEach(pos => {
    sheet.getCell(pos).font = { name: 'Arial', size: 9.5, bold: true, color: { argb: TH_TEXT } };
    sheet.getCell(pos).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TH_FILL } };
    sheet.getCell(pos).border = borderAllThin;
    sheet.getCell(pos).alignment = { vertical: 'middle' };
  });
  sheet.getRow(currentRow).height = 24;
  currentRow++;

  const budgetStartRow = currentRow;
  const grandTotalRowNumber = budgetStartRow + 6;

  const budgetData = charter.budget || {
    tooling: 0,
    prototype: 0,
    certTesting: 0,
    jigPilot: 0,
    contingencyRate: 0.10,
    currency: 'VND'
  };

  const budgetLines = [
    { name: '1. Chi phí chế tạo khuôn (Tooling & Molds)', amount: budgetData.tooling, note: 'Khuôn ép nhựa, khuôn dập nhôm/inox' },
    { name: '2. Mẫu thử nghiệm (Mock-up & Prototypes)', amount: budgetData.prototype, note: 'In 3D SLA, gia công CNC, bo mạch mẫu EVT' },
    { name: '3. Đo kiểm phòng Lab & Cấp chứng nhận', amount: budgetData.certTesting, note: 'Đo kiểm Quatest, nhãn năng lượng, thử nghiệm an toàn' },
    { name: '4. Đồ gá lắp ráp & Pilot Run (Jig & Trial)', amount: budgetData.jigPilot, note: 'Đồ gá cân bằng chuyền, vật tư tiêu hao PVT' }
  ];

  budgetLines.forEach(item => {
    sheet.getCell(`B${currentRow}`).value = item.name;
    sheet.getCell(`B${currentRow}`).font = { name: 'Arial', size: 9, color: { argb: 'FF0F172A' } };
    sheet.getCell(`B${currentRow}`).border = borderAllThin;

    const cCell = sheet.getCell(`C${currentRow}`);
    cCell.value = item.amount;
    cCell.numFmt = '#,##0 "VNĐ"';
    cCell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF0F172A' } };
    cCell.border = borderAllThin;

    // Excel Formula: =C{current} / $C${grandTotalRow}
    const dCell = sheet.getCell(`D${currentRow}`);
    dCell.value = { formula: `C${currentRow}/$C$${grandTotalRowNumber}` };
    dCell.numFmt = '0.0%';
    dCell.alignment = { horizontal: 'center' };
    dCell.border = borderAllThin;

    sheet.getCell(`E${currentRow}`).value = item.note;
    sheet.getCell(`E${currentRow}`).font = { name: 'Arial', size: 8.5, color: { argb: 'FF475569' } };
    sheet.getCell(`E${currentRow}`).border = borderAllThin;
    currentRow++;
  });

  // Direct Subtotal Row with Excel formula: =SUM(C{start}:C{end})
  const subtotalRow = currentRow;
  sheet.getCell(`B${subtotalRow}`).value = 'TỔNG CHI PHÍ TRỰC TIẾP (DIRECT R&D):';
  sheet.getCell(`B${subtotalRow}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF0F172A' } };
  sheet.getCell(`B${subtotalRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LABEL_FILL } };
  sheet.getCell(`B${subtotalRow}`).border = borderAllThin;

  sheet.getCell(`C${subtotalRow}`).value = { formula: `SUM(C${budgetStartRow}:C${subtotalRow - 1})` };
  sheet.getCell(`C${subtotalRow}`).numFmt = '#,##0 "VNĐ"';
  sheet.getCell(`C${subtotalRow}`).font = { name: 'Arial', size: 9.5, bold: true, color: { argb: ACCENT_BLUE } };
  sheet.getCell(`C${subtotalRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LABEL_FILL } };
  sheet.getCell(`C${subtotalRow}`).border = borderAllThin;

  sheet.getCell(`D${subtotalRow}`).value = { formula: `C${subtotalRow}/$C$${grandTotalRowNumber}` };
  sheet.getCell(`D${subtotalRow}`).numFmt = '0.0%';
  sheet.getCell(`D${subtotalRow}`).alignment = { horizontal: 'center' };
  sheet.getCell(`D${subtotalRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LABEL_FILL } };
  sheet.getCell(`D${subtotalRow}`).border = borderAllThin;

  sheet.getCell(`E${subtotalRow}`).value = 'Chưa bao gồm quỹ dự phòng rủi ro';
  sheet.getCell(`E${subtotalRow}`).font = { name: 'Arial', size: 8.5, italic: true, color: { argb: 'FF475569' } };
  sheet.getCell(`E${subtotalRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LABEL_FILL } };
  sheet.getCell(`E${subtotalRow}`).border = borderAllThin;
  currentRow++;

  // Contingency Fund Row with Excel formula: =ROUND(C{subtotal} * {rate}, 0)
  const rate = budgetData.contingencyRate || 0.10;
  const contRow = currentRow;
  sheet.getCell(`B${contRow}`).value = `5. Dự phòng rủi ro kỹ thuật (${(rate * 100).toFixed(0)}%):`;
  sheet.getCell(`B${contRow}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: AMBER_TEXT } };
  sheet.getCell(`B${contRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: AMBER_BG } };
  sheet.getCell(`B${contRow}`).border = borderAllThin;

  sheet.getCell(`C${contRow}`).value = { formula: `ROUND(C${subtotalRow} * ${rate}, 0)` };
  sheet.getCell(`C${contRow}`).numFmt = '#,##0 "VNĐ"';
  sheet.getCell(`C${contRow}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: AMBER_TEXT } };
  sheet.getCell(`C${contRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: AMBER_BG } };
  sheet.getCell(`C${contRow}`).border = borderAllThin;

  sheet.getCell(`D${contRow}`).value = { formula: `C${contRow}/$C$${grandTotalRowNumber}` };
  sheet.getCell(`D${contRow}`).numFmt = '0.0%';
  sheet.getCell(`D${contRow}`).alignment = { horizontal: 'center' };
  sheet.getCell(`D${contRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: AMBER_BG } };
  sheet.getCell(`D${contRow}`).border = borderAllThin;

  sheet.getCell(`E${contRow}`).value = 'Dự phòng sửa khuôn và biến động giá linh kiện';
  sheet.getCell(`E${contRow}`).font = { name: 'Arial', size: 8.5, italic: true, color: { argb: AMBER_TEXT } };
  sheet.getCell(`E${contRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: AMBER_BG } };
  sheet.getCell(`E${contRow}`).border = borderAllThin;
  currentRow++;

  // GRAND TOTAL Row with accounting style (Deep Slate Navy, Mint Green font)
  const grandTotalRow = currentRow;
  sheet.getCell(`B${grandTotalRow}`).value = 'TỔNG NGÂN SÁCH ĐƯỢC PHÊ DUYỆT (GRAND TOTAL):';
  sheet.getCell(`B${grandTotalRow}`).font = { name: 'Arial', size: 9.5, bold: true, color: { argb: GRAND_TOTAL_TEXT } };
  sheet.getCell(`B${grandTotalRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GRAND_TOTAL_BG } };
  sheet.getCell(`B${grandTotalRow}`).border = borderTotalAccounting;

  sheet.getCell(`C${grandTotalRow}`).value = { formula: `C${subtotalRow}+C${contRow}` };
  sheet.getCell(`C${grandTotalRow}`).numFmt = '#,##0 "VNĐ"';
  sheet.getCell(`C${grandTotalRow}`).font = { name: 'Arial', size: 10.5, bold: true, color: { argb: GRAND_TOTAL_AMOUNT } };
  sheet.getCell(`C${grandTotalRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GRAND_TOTAL_BG } };
  sheet.getCell(`C${grandTotalRow}`).border = borderTotalAccounting;

  sheet.getCell(`D${grandTotalRow}`).value = 1;
  sheet.getCell(`D${grandTotalRow}`).numFmt = '100.0%';
  sheet.getCell(`D${grandTotalRow}`).alignment = { horizontal: 'center' };
  sheet.getCell(`D${grandTotalRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GRAND_TOTAL_BG } };
  sheet.getCell(`D${grandTotalRow}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: GRAND_TOTAL_TEXT } };
  sheet.getCell(`D${grandTotalRow}`).border = borderTotalAccounting;

  sheet.getCell(`E${grandTotalRow}`).value = 'Đã gồm thuế & chi phí dự phòng rủi ro';
  sheet.getCell(`E${grandTotalRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GRAND_TOTAL_BG } };
  sheet.getCell(`E${grandTotalRow}`).font = { color: { argb: 'FF93C5FD' }, italic: true, size: 8.5 };
  sheet.getCell(`E${grandTotalRow}`).border = borderTotalAccounting;
  sheet.getRow(grandTotalRow).height = 26;
  currentRow += 2;

  // ==================== VII. RỦI RO & THẨM QUYỀN PM ====================
  addSectionHeader('Rủi Ro Trọng Yếu & Thẩm Quyền Điều Hành Của PM', 'VII');

  if (charter.risks && charter.risks.length > 0) {
    charter.risks.forEach((r, idx) => {
      sheet.getCell(`B${currentRow}`).value = `Rủi ro ${idx + 1}: ${r.title}`;
      sheet.getCell(`B${currentRow}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: LABEL_TEXT } };
      sheet.getCell(`B${currentRow}`).border = borderAllThin;
      sheet.getCell(`B${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LABEL_FILL } };

      sheet.mergeCells(`C${currentRow}:E${currentRow}`);
      const rCell = sheet.getCell(`C${currentRow}`);
      rCell.value = `Ứng phó: ${r.mitigation}`;
      rCell.font = { name: 'Arial', size: 9, color: { argb: 'FF0F172A' } };
      rCell.alignment = { wrapText: true, vertical: 'top' };
      rCell.border = borderAllThin;
      sheet.getRow(currentRow).height = 26;
      currentRow++;
    });
  }

  // PM Authority
  sheet.getCell(`B${currentRow}`).value = 'Quyền Hạn Của PM:';
  sheet.getCell(`B${currentRow}`).font = { name: 'Arial', size: 9, bold: true, color: { argb: LABEL_TEXT } };
  sheet.getCell(`B${currentRow}`).border = borderAllThin;
  sheet.getCell(`B${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LABEL_FILL } };

  sheet.mergeCells(`C${currentRow}:E${currentRow}`);
  const authCell = sheet.getCell(`C${currentRow}`);
  authCell.value = charter.pmAuthority || 'Toàn quyền điều phối nhân sự kỹ sư trong dự án; Được chủ động phê duyệt phát sinh ngân sách dưới 5% mỗi hạng mục.';
  authCell.font = { name: 'Arial', size: 9, color: { argb: 'FF0F172A' } };
  authCell.alignment = { wrapText: true, vertical: 'top' };
  authCell.border = borderAllThin;
  sheet.getRow(currentRow).height = 32;
  currentRow += 2;

  // ==================== VIII. BẢNG KÝ DUYỆT (SIGN-OFF MATRIX) ====================
  addSectionHeader('Phê Duyệt Điều Lệ & Ký Tên Các Bên Liên Quan (Sign-off Matrix)', 'VIII');

  const sign = charter.signMatrix || {
    sponsor: '',
    pm: '',
    qa: '',
    factory: ''
  };

  const signRow = currentRow;
  sheet.getCell(`B${signRow}`).value = `Project Sponsor\n\n\n\n\n__________________________\n${sign.sponsor || charter.sponsor || 'Đại diện Ban Giám Đốc'}\n(Phê duyệt ngân sách)`;
  sheet.getCell(`C${signRow}`).value = `Project Manager\n\n\n\n\n__________________________\n${sign.pm || charter.pm || 'Chủ nhiệm Dự án'}\n(Cam kết tiến độ & BOM)`;
  sheet.getCell(`D${signRow}`).value = `Trưởng Phòng QA/QC\n\n\n\n\n__________________________\n${sign.qa || (charter.team && charter.team.qaLead) || 'Đại diện QA/QC'}\n(Tiêu chuẩn kỹ thuật)`;
  sheet.getCell(`E${signRow}`).value = `Giám Đốc Nhà Máy\n\n\n\n\n__________________________\n${sign.factory || 'Đại diện Khối Sản Xuất'}\n(Khả thi dây chuyền PE)`;

  [`B${signRow}`, `C${signRow}`, `D${signRow}`, `E${signRow}`].forEach(pos => {
    sheet.getCell(pos).font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF0F172A' } };
    sheet.getCell(pos).alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
    sheet.getCell(pos).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    sheet.getCell(pos).border = borderAllThin;
  });
  sheet.getRow(signRow).height = 95;

  // Export buffer & save file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const cleanCode = (charter.code || 'PRJ_RND').replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `Project_Charter_${cleanCode}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  saveAs(blob, fileName);
}
