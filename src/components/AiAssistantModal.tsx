import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  ShieldAlert, 
  TrendingUp, 
  Key, 
  ArrowRight,
  RefreshCw,
  FileText,
  Sliders
} from 'lucide-react';
import { ProjectCharterData, ApplianceCategory } from '../types/charter';
import { hasApiKey, aiGenerateCharterDraft, aiReviewCharter } from '../utils/geminiClient';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCharter: ProjectCharterData;
  onApplyDraft: (draft: Partial<ProjectCharterData>) => void;
  onOpenApiKeyModal: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  currentCharter,
  onApplyDraft,
  onOpenApiKeyModal,
}) => {
  const [activeTab, setActiveTab] = useState<'draft' | 'review'>('draft');

  // Draft Tab State
  const [productName, setProductName] = useState(currentCharter.name || '');
  const [category, setCategory] = useState<ApplianceCategory>(currentCharter.category || 'Quạt làm mát');
  const [extraNotes, setExtraNotes] = useState('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<Partial<ProjectCharterData> | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);

  // Review Tab State
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<{
    overallScore: number;
    feasibilityAssessment: string;
    keyStrengths: string[];
    criticalRisks: string[];
    recommendations: string[];
  } | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);

  if (!isOpen) return null;

  const keyConfigured = hasApiKey();

  const handleGenerateDraft = async () => {
    if (!keyConfigured) {
      onOpenApiKeyModal();
      return;
    }
    if (!productName.trim()) {
      setDraftError('Vui lòng nhập tên sản phẩm R&D để AI có dữ liệu tạo dự thảo.');
      return;
    }

    setIsGeneratingDraft(true);
    setDraftError(null);
    setGeneratedDraft(null);

    try {
      const draft = await aiGenerateCharterDraft(productName, category, extraNotes);
      setGeneratedDraft(draft);
    } catch (err: any) {
      setDraftError(err?.message || 'Có lỗi xảy ra khi tạo dự thảo.');
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const handleRunReview = async () => {
    if (!keyConfigured) {
      onOpenApiKeyModal();
      return;
    }

    setIsReviewing(true);
    setReviewError(null);
    setReviewResult(null);

    try {
      const result = await aiReviewCharter(currentCharter);
      setReviewResult(result);
    } catch (err: any) {
      setReviewError(err?.message || 'Có lỗi xảy ra khi thẩm định.');
    } finally {
      setIsReviewing(false);
    }
  };

  const handleApplyToCharter = () => {
    if (generatedDraft) {
      onApplyDraft(generatedDraft);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-400/30 text-amber-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight flex items-center gap-2">
                R&D AI Co-pilot Studio
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30">
                  Gemini 3.7 Flash
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Trợ lý AI hỗ trợ soạn thảo, rà soát bài toán kinh doanh & quản trị rủi ro dự án
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('draft')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'draft'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Gợi Ý Soạn Thảo Charter</span>
            </button>

            <button
              onClick={() => setActiveTab('review')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'review'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Thẩm Định & Rà Soát Rủi Ro</span>
            </button>
          </div>

          {!keyConfigured && (
            <button
              onClick={onOpenApiKeyModal}
              className="text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded border border-amber-300 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-amber-600" />
              <span>Cài đặt API Key</span>
            </button>
          )}
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Missing Key Warning */}
          {!keyConfigured && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-3">
              <Key className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Chưa cấu hình API Key cá nhân</p>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  Để sử dụng các tính năng thông minh của Gemini AI, bạn chỉ cần nhập API Key một lần. Key được lưu an toàn trên máy bạn và không bị chia sẻ khi bạn gửi link cho người khác.
                </p>
                <button
                  onClick={onOpenApiKeyModal}
                  className="mt-2.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-xs transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Nhập API Key ngay</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: DRAFT GENERATOR */}
          {activeTab === 'draft' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Tên Sản Phẩm R&D:
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="VD: Quạt Đứng Inverter DC Siêu Êm 9 Cánh"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Phân Loại Ngành Hàng:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ApplianceCategory)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="Quạt làm mát">Quạt làm mát</option>
                    <option value="Nồi cơm điện">Nồi cơm điện</option>
                    <option value="Ấm siêu tốc">Ấm siêu tốc</option>
                    <option value="Điều hòa không khí">Điều hòa không khí</option>
                    <option value="Tủ lạnh / Tủ đông">Tủ lạnh / Tủ đông</option>
                    <option value="Bếp điện / Bếp từ">Bếp điện / Bếp từ</option>
                    <option value="Máy lọc không khí">Máy lọc không khí</option>
                    <option value="Gia dụng nhà bếp khác">Gia dụng nhà bếp khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Yêu Cầu / Tính Năng Đặc Biệt Cần Nhấn Mạnh (Tùy chọn):
                </label>
                <textarea
                  rows={2}
                  value={extraNotes}
                  onChange={(e) => setExtraNotes(e.target.value)}
                  placeholder="VD: Phân khúc tầm trung, độ ồn dưới 30dB, kết nối WiFi điều khiển qua điện thoại, tối ưu thời gian làm khuôn dưới 45 ngày..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleGenerateDraft}
                  disabled={isGeneratingDraft || !keyConfigured}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition shadow-xs flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isGeneratingDraft ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  )}
                  <span>{isGeneratingDraft ? 'AI Đang Phân Tích & Soạn Thảo...' : 'AI Soạn Thảo Dự Thảo Charter'}</span>
                </button>
              </div>

              {draftError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-lg text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{draftError}</span>
                </div>
              )}

              {/* Draft Results Preview */}
              {generatedDraft && (
                <div className="mt-4 p-4 bg-slate-50 border border-slate-300 rounded-lg space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900 uppercase">
                        Dự Thảo Hoàn Tất: {generatedDraft.name || productName}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                      {generatedDraft.code}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700">
                    <div>
                      <strong className="text-slate-900 font-semibold">1. Bài Toán & Nhu Cầu:</strong>
                      <p className="mt-0.5 text-slate-600 italic">{generatedDraft.problem}</p>
                    </div>
                    <div>
                      <strong className="text-slate-900 font-semibold">2. Lợi Ích & Mục Tiêu Kinh Doanh:</strong>
                      <p className="mt-0.5 text-slate-600">{generatedDraft.benefits}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded border border-slate-200">
                      <div><strong>Chỉ số BOM:</strong> {generatedDraft.bomTarget}</div>
                      <div><strong>Kế hoạch SOP:</strong> {generatedDraft.sopDate}</div>
                      <div><strong>Chất lượng:</strong> {generatedDraft.qualityMetric}</div>
                      <div><strong>Hiệu suất:</strong> {generatedDraft.performanceMetric}</div>
                    </div>
                    {generatedDraft.risks && generatedDraft.risks.length > 0 && (
                      <div>
                        <strong className="text-slate-900 font-semibold">3. Rủi Ro Tiềm Ẩn Đã Nhận Diện ({generatedDraft.risks.length}):</strong>
                        <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px] text-slate-600">
                          {generatedDraft.risks.map((r, i) => (
                            <li key={i}>
                              <span className="font-semibold text-slate-800">{r.title}</span> ({r.impact}): {r.mitigation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-end">
                    <button
                      type="button"
                      onClick={handleApplyToCharter}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Áp Dụng Dự Thảo Vào Biểu Mẫu</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TECHNICAL REVIEW */}
          {activeTab === 'review' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-indigo-700" />
                  <span>Hội Đồng Thẩm Định Kỹ Thuật Ảo (Virtual Gate Review Board)</span>
                </p>
                <p className="text-indigo-800 text-[11px] leading-relaxed">
                  AI sẽ quét toàn bộ dữ liệu hiện tại của dự án <strong>"{currentCharter.name || 'Dự án hiện tại'}"</strong>, đối chiếu với tiêu chuẩn công nghiệp gia dụng và đưa ra điểm số khả thi, các lỗ hổng rủi ro kỹ thuật và khuyến nghị cụ thể.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleRunReview}
                  disabled={isReviewing || !keyConfigured}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold transition shadow-xs flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isReviewing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sliders className="w-4 h-4 text-amber-300" />
                  )}
                  <span>{isReviewing ? 'Hội Đồng Đang Rà Soát Chi Tiết...' : 'Bắt Đầu Thẩm Định Charter'}</span>
                </button>
              </div>

              {reviewError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-lg text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{reviewError}</span>
                </div>
              )}

              {reviewResult && (
                <div className="space-y-4 animate-in fade-in">
                  {/* Score Card */}
                  <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl shadow-md flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-indigo-300 font-bold">
                        Điểm Đánh Giá Tính Khả Thi
                      </span>
                      <h4 className="text-sm font-semibold text-white mt-1">
                        {currentCharter.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-black text-amber-400 font-mono">
                        {reviewResult.overallScore}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">/100</span>
                    </div>
                  </div>

                  {/* Feasibility Summary */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800">
                    <strong className="block text-slate-900 font-bold mb-1">
                      Nhận định của Hội Đồng Thẩm Định:
                    </strong>
                    <p className="leading-relaxed text-slate-700">{reviewResult.feasibilityAssessment}</p>
                  </div>

                  {/* Strengths & Risks Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg space-y-2">
                      <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Điểm Mạnh & Khả Thi</span>
                      </h5>
                      <ul className="text-[11px] text-emerald-800 space-y-1 list-disc pl-4">
                        {reviewResult.keyStrengths?.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg space-y-2">
                      <h5 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>Cảnh Báo Rủi Ro Cần Lưu Ý</span>
                      </h5>
                      <ul className="text-[11px] text-rose-800 space-y-1 list-disc pl-4">
                        {reviewResult.criticalRisks?.map((r, idx) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                    <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span>Khuyến Nghị Hoàn Thiện Trước Khi Ký Duyệt Cổng</span>
                    </h5>
                    <ul className="text-[11px] text-amber-800 space-y-1 list-disc pl-4">
                      {reviewResult.recommendations?.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Powered by Google Gemini 3.7 Flash API
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded text-xs transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
