import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  ShieldCheck, 
  Trash2, 
  Loader2, 
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  getStoredApiKey, 
  setStoredApiKey, 
  removeStoredApiKey, 
  testApiKeyConnection 
} from '../utils/geminiClient';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: (hasKey: boolean) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeySaved,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredApiKey();
      setApiKey(stored);
      setTestResult(null);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = apiKey.trim();
    setStoredApiKey(trimmed);
    setSavedSuccess(true);
    if (onKeySaved) {
      onKeySaved(!!trimmed);
    }
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  const handleTest = async () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setTestResult({
        success: false,
        message: 'Vui lòng nhập API Key trước khi kiểm tra.',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testApiKeyConnection(trimmed);
      setTestResult(res);
      if (res.success) {
        // Auto save on successful test
        setStoredApiKey(trimmed);
        if (onKeySaved) onKeySaved(true);
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Kiểm tra thất bại.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleDelete = () => {
    removeStoredApiKey();
    setApiKey('');
    setTestResult(null);
    setSavedSuccess(false);
    if (onKeySaved) {
      onKeySaved(false);
    }
  };

  const isCurrentKeySaved = !!getStoredApiKey();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/30 rounded-lg border border-blue-400/30">
              <Key className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight flex items-center gap-2">
                Google Gemini API Key
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/20">
                  gemini-3.7-flash
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Cài đặt & quản lý key cá nhân an toàn cho các tính năng R&D AI Co-pilot
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition hover:bg-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Key Status Banner */}
          <div className={`p-3.5 rounded-lg border flex items-center justify-between text-xs ${
            isCurrentKeySaved
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-2.5">
              {isCurrentKeySaved ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span className="font-medium">
                {isCurrentKeySaved 
                  ? 'Trạng thái: Đã có API Key lưu trên trình duyệt này'
                  : 'Trạng thái: Chưa có API Key. Nhập key bên dưới để mở khóa AI.'}
              </span>
            </div>
            {isCurrentKeySaved && (
              <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold">
                HOẠT ĐỘNG
              </span>
            )}
          </div>

          {/* Privacy & Sharing Assurance Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>An toàn & Bảo mật khi chia sẻ ứng dụng</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              API Key được <strong>lưu 100% trong bộ nhớ trình duyệt cá nhân (Local Storage)</strong> của máy bạn.
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1 list-disc pl-4">
              <li>Khi bạn chia sẻ link web, mã nguồn GitHub hoặc Vercel, người khác sẽ <strong>không thể thấy hay dùng key của bạn</strong>.</li>
              <li>Mỗi người dùng sẽ tự nhập API Key của riêng họ mà không ảnh hưởng đến tài khoản của bạn.</li>
            </ul>
          </div>

          {/* Input field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="gemini-key-input" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>Nhập API Key:</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Lấy key miễn phí tại Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                id="gemini-key-input"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-3 pr-20 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-inner"
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer"
                  title={showKey ? 'Ẩn key' : 'Hiện key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Test & Status Feedback */}
          {testResult && (
            <div className={`p-3 rounded-lg text-xs flex items-start gap-2.5 ${
              testResult.success 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' 
                : 'bg-rose-50 border border-rose-200 text-rose-900'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-semibold">{testResult.success ? 'Kết nối thành công!' : 'Kiểm tra không thành công'}</p>
                <p className="text-[11px] mt-0.5 opacity-90">{testResult.message}</p>
              </div>
            </div>
          )}

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Đã lưu API Key thành công vào bộ nhớ trình duyệt!</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <div>
            {isCurrentKeySaved && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-transparent hover:border-rose-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Key Khỏi Trình Duyệt</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting || !apiKey.trim()}
              className="px-3.5 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isTesting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span>{isTesting ? 'Đang kiểm tra...' : 'Kiểm Tra Kết Nối'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleSave();
                onClose();
              }}
              disabled={!apiKey.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Lưu & Đóng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
