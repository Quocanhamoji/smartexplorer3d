import React, { useState } from "react";
import { useStore } from "../store";
import AdminWords from "./AdminWords";
import { ShieldCheck, Users2, Unlock, Trash2, ArrowRightCircle, X } from "lucide-react";

interface AdminPanelProps {
  onClose?: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const { users, currentUser, logout, showToast } = useStore();
  const [showWords, setShowWords] = useState(false);

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  const handleRemoveUser = (username: string) => {
    if (confirm(`Xóa tài khoản ${username}? Hành động này không thể hoàn tác.`)) {
      useStore.getState().deleteUser(username);
      showToast("Đã xóa tài khoản", `Tài khoản ${username} đã bị xóa khỏi hệ thống.`, "🗑️", "success");
    }
  };

  return (
    <div className="absolute inset-0 z-40 overflow-auto bg-slate-950/90 p-6 text-slate-50">
      <div className="mx-auto max-w-6xl rounded-[40px] border border-slate-700 bg-slate-900/95 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.45)]">
        <div className="mb-6 flex flex-col gap-4 rounded-[32px] border border-cyan-500/20 bg-slate-800 p-6 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500 text-slate-950 shadow-[0_12px_30px_rgba(14,165,233,0.35)]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200 font-black">Trang Quản lý Admin</p>
                <h2 className="text-3xl font-black">Xin chào {currentUser.username}</h2>
              </div>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-3xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-slate-300">Trang này chỉ dành cho tài khoản Admin. Người dùng thường không thể xem danh sách tài khoản hoặc chỉnh sửa người dùng khác.</p>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-3xl bg-slate-950/90 p-4 text-sm border border-slate-700">
              <p className="text-slate-300 uppercase tracking-[0.2em] text-[10px]">Tổng tài khoản</p>
              <p className="text-2xl font-black text-cyan-400">{users.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-950/90 p-4 text-sm border border-slate-700">
              <p className="text-slate-300 uppercase tracking-[0.2em] text-[10px]">Quyền admin</p>
              <p className="text-2xl font-black text-emerald-400">{users.filter((u) => u.role === "admin").length}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.45fr_0.85fr]">
          <div className="rounded-[32px] bg-slate-800 p-6 border border-slate-700 shadow-lg">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-100">Danh sách tài khoản</h3>
                <p className="text-slate-400 text-sm">Chỉ Admin mới xem được màn hình này.</p>
              </div>
              <div className="flex items-center gap-2 rounded-3xl bg-slate-950/90 px-4 py-3 text-sm text-slate-300 border border-slate-700">
                <Users2 className="w-4 h-4" /> Người dùng
              </div>
            </div>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.username} className="flex flex-col gap-3 rounded-3xl border border-slate-700 bg-slate-900/95 p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="rounded-full bg-slate-700 px-3 py-1 uppercase tracking-[0.2em] font-black">{user.role}</span>
                        <span className="font-semibold text-slate-100">{user.username}</span>
                      </div>
                      <p className="text-slate-400 text-sm">{user.email || "Chưa có email"}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <button
                        onClick={() => handleRemoveUser(user.username)}
                        className="inline-flex items-center gap-2 rounded-3xl bg-rose-500 px-4 py-3 text-white font-black transition hover:bg-rose-600"
                      >
                        <Trash2 className="w-4 h-4" /> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-cyan-500/20 bg-slate-900/95 p-6 shadow-lg">
            <div className="mb-5 flex items-center gap-3 text-slate-100">
              <Unlock className="w-5 h-5 text-cyan-300" />
              <h3 className="text-lg font-black">Quyền truy cập chung</h3>
            </div>
            <div className="space-y-4 text-sm text-slate-300">
              <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-4">
                <p className="font-semibold text-slate-100">Admin</p>
                <p>Được xem trang quản lý và toàn bộ danh sách người dùng.</p>
              </div>
              <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-4">
                <p className="font-semibold text-slate-100">Người dùng thường</p>
                <p>Chỉ xem được nội dung học, không truy cập được trang quản lý và danh sách tài khoản.</p>
              </div>
              <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-4">
                <p className="font-semibold text-slate-100">Ghi chú</p>
                <p>Đăng nhập trước khi sử dụng trang, nếu chưa có thì đăng ký tài khoản.</p>
              </div>
            </div>
            <button
              onClick={() => setShowWords(true)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-emerald-400 px-5 py-4 text-sm font-black text-slate-900 transition hover:bg-emerald-300"
            >
              Quản lý Từ vựng 3D
            </button>
            <button
              onClick={() => {
                logout();
                showToast("Đã đăng xuất", "Admin đã rời trang quản lý.", "👋", "success");
              }}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-cyan-400 px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-cyan-300"
            >
              <ArrowRightCircle className="w-4 h-4" /> Đăng xuất
            </button>
          </div>
        </div>
        {showWords && <AdminWords onClose={() => setShowWords(false)} />}
      </div>
    </div>
  );
}
