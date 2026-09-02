import { GoogleGenAI } from '@google/genai';
import { ProjectCharterData, ApplianceCategory, ProjectRisk, SuccessMetricItem } from '../types/charter';

const LOCAL_STORAGE_KEY = 'gemini_api_key';

/**
 * Lấy API Key đã lưu trong LocalStorage của trình duyệt
 */
export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(LOCAL_STORAGE_KEY) || '';
}

/**
 * Lưu API Key vào LocalStorage
 */
export function setStoredApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  const cleanKey = key.trim();
  if (cleanKey) {
    localStorage.setItem(LOCAL_STORAGE_KEY, cleanKey);
  } else {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}

/**
 * Xóa API Key khỏi LocalStorage
 */
export function removeStoredApiKey(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

/**
 * Kiểm tra xem đã có API Key hay chưa
 */
export function hasApiKey(): boolean {
  return !!getStoredApiKey();
}

/**
 * Khởi tạo client Gemini an toàn
 */
function createGeminiClient(customKey?: string): GoogleGenAI {
  const apiKey = customKey?.trim() || getStoredApiKey();
  if (!apiKey) {
    throw new Error('Chưa cấu hình Google Gemini API Key. Vui lòng nhấn nút "API Key" để cài đặt.');
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Kiểm tra kết nối và tính hợp lệ của API Key
 */
export async function testApiKeyConnection(key: string): Promise<{ success: boolean; message: string }> {
  try {
    const ai = createGeminiClient(key);
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: 'Hãy phản hồi đúng 1 câu ngắn gọn: "Kết nối Google Gemini API thành công! Sẵn sàng hỗ trợ R&D."',
    });

    const text = response.text || '';
    if (text) {
      return {
        success: true,
        message: text.trim(),
      };
    }
    return {
      success: true,
      message: 'Kết nối thành công với Google Gemini API!',
    };
  } catch (error: any) {
    console.error('Test API Key error:', error);
    let errMsg = error?.message || 'Không thể kết nối đến Gemini API. Vui lòng kiểm tra lại API Key.';
    if (errMsg.includes('API_KEY_INVALID') || errMsg.includes('403') || errMsg.includes('unregistered')) {
      errMsg = 'API Key không hợp lệ hoặc chưa được kích hoạt. Hãy tạo key mới tại Google AI Studio.';
    } else if (errMsg.includes('QUOTA_EXCEEDED') || errMsg.includes('429')) {
      errMsg = 'Hạn ngạch API Key của bạn đã hết (Quota Exceeded). Vui lòng thử lại sau hoặc dùng key khác.';
    }
    return {
      success: false,
      message: errMsg,
    };
  }
}

/**
 * AI Gợi ý nội dung soạn thảo Project Charter đầy đủ
 */
export async function aiGenerateCharterDraft(
  productName: string,
  category: ApplianceCategory,
  extraNotes?: string
): Promise<Partial<ProjectCharterData>> {
  const ai = createGeminiClient();

  const prompt = `
Bạn là chuyên gia trưởng ban R&D Thiết Bị Gia Dụng Cao Cấp (R&D Director) với 20 năm kinh nghiệm phát triển sản phẩm điện gia dụng (MDA & SDA).
Hãy tạo một bản dự thảo Điều Lệ Dự Án R&D (Project Charter) chi tiết, thực tế, đúng chuẩn công nghiệp cho sản phẩm sau:

- Tên sản phẩm: ${productName}
- Phân loại ngành hàng: ${category}
${extraNotes ? `- Yêu cầu / Ghi chú bổ sung: ${extraNotes}` : ''}

Hãy trả về kết quả ĐÚNG ĐỊNH DẠNG JSON duy nhất (không markdown code block, không giải thích ngoài JSON) theo cấu trúc sau:
{
  "name": "Tên sản phẩm đầy đủ và chuyên nghiệp",
  "code": "Mã dự án (ví dụ: RD-FAN-2026-01)",
  "problem": "Mô tả bài toán thị trường, pain points người dùng và cơ hội kinh doanh (3-5 câu súc tích)",
  "benefits": "Mục tiêu kinh doanh, doanh thu dự kiến và lợi thế cạnh tranh (3-4 gạch đầu dòng)",
  "targetAudience": "Chân dung khách hàng mục tiêu và phân khúc giá",
  "bomTarget": "Mục tiêu giá thành BOM (ví dụ: 450,000 VND/sản phẩm hoặc 32 USD)",
  "sopDate": "Thời điểm ra mắt SOP (ví dụ: Q4/2026)",
  "qualityMetric": "Tiêu chuẩn độ bền & chất lượng (ví dụ: MTBF > 10,000 giờ, tỷ lệ lỗi < 0.3%)",
  "performanceMetric": "Hiệu suất hoạt động chính (ví dụ: Công suất 45W, độ ồn < 32dB, tiết kiệm điện 40%)",
  "complianceMetric": "Tiêu chuẩn an toàn & chứng nhận (ví dụ: TCVN, CE, RoHS, CB, 5 sao năng lượng)",
  "warrantyTarget": "Chính sách bảo hành (ví dụ: 24 tháng động cơ, 12 tháng linh kiện)",
  "scopeIn": "Phạm vi thực hiện của dự án (Thiết kế ID, MD, EE, làm khuôn, chứng nhận, pilot test)",
  "scopeOut": "Những hạng mục KHÔNG thuộc phạm vi dự án này (ví dụ: xây dựng nhà xưởng mới, phiên bản 110V cho thị trường Mỹ)",
  "pmAuthority": "Thẩm quyền của Giám Đốc Dự Án (PM) về ngân sách, phân bổ nhân sự và ký cổng Stage-Gate",
  "risks": [
    {
      "title": "Tên rủi ro kỹ thuật hoặc tiến độ",
      "impact": "High",
      "mitigation": "Biện pháp phòng ngừa và kế hoạch dự phòng cụ thể"
    },
    {
      "title": "Rủi ro nhà cung cấp / linh kiện",
      "impact": "Medium",
      "mitigation": "Biện pháp phòng ngừa"
    },
    {
      "title": "Rủi ro chi phí khuôn / BOM vượt định mức",
      "impact": "High",
      "mitigation": "Biện pháp phòng ngừa"
    }
  ]
}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.7-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const rawJson = response.text?.trim() || '{}';
  try {
    const data = JSON.parse(rawJson);
    return data;
  } catch (e) {
    console.error('Failed to parse JSON from AI response:', rawJson);
    throw new Error('AI không thể xuất định dạng dữ liệu chuẩn. Vui lòng thử lại.');
  }
}

/**
 * AI Rà soát & Đánh giá rủi ro chuyên sâu cho Project Charter
 */
export async function aiReviewCharter(charter: ProjectCharterData): Promise<{
  overallScore: number; // 0 - 100
  feasibilityAssessment: string;
  keyStrengths: string[];
  criticalRisks: string[];
  recommendations: string[];
}> {
  const ai = createGeminiClient();

  const prompt = `
Bạn là Hội đồng Thẩm định Kỹ thuật R&D cấp cao (R&D Technical Review Board).
Hãy phân tích và đánh giá bản Điều Lệ Dự Án (Project Charter) sau:

- Tên dự án: ${charter.name} (${charter.code || 'Chưa có mã'})
- Ngành hàng: ${charter.category}
- Bài toán & Lợi ích: ${charter.problem} | ${charter.benefits}
- Khách hàng mục tiêu: ${charter.targetAudience}
- Chỉ số BOM: ${charter.bomTarget} | Thời điểm SOP: ${charter.sopDate}
- Tiêu chuẩn Chất lượng: ${charter.qualityMetric} | Hiệu suất: ${charter.performanceMetric} | Hợp quy: ${charter.complianceMetric}
- Phạm vi In/Out: Trong: ${charter.scopeIn} | Ngoài: ${charter.scopeOut}
- Ngân sách Tooling: ${charter.budget.tooling} | Prototype: ${charter.budget.prototype} | Dự phòng: ${charter.budget.contingencyRate * 100}%
- Số lượng rủi ro đã nhận diện: ${charter.risks?.length || 0}

Hãy trả về kết quả ĐÚNG ĐỊNH DẠNG JSON (không code markdown block):
{
  "overallScore": 85,
  "feasibilityAssessment": "Đánh giá tổng quan về tính khả thi kỹ thuật, chi phí và thời gian ra thị trường (3-4 câu sắc bén).",
  "keyStrengths": [
    "Điểm mạnh 1 của bản charter",
    "Điểm mạnh 2",
    "Điểm mạnh 3"
  ],
  "criticalRisks": [
    "Cảnh báo rủi ro tiềm ẩn 1 (ví dụ: thời gian làm khuôn, kiểm thử EMC, rủi ro chuỗi cung ứng)",
    "Cảnh báo rủi ro tiềm ẩn 2"
  ],
  "recommendations": [
    "Khuyến nghị cải thiện 1 trước khi ký duyệt Gate 0/Gate 1",
    "Khuyến nghị 2"
  ]
}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.7-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const rawJson = response.text?.trim() || '{}';
  try {
    return JSON.parse(rawJson);
  } catch (e) {
    console.error('Failed to parse review JSON:', rawJson);
    throw new Error('Không thể phân tích phản hồi từ AI.');
  }
}
