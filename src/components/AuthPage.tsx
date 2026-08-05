import React, { useState } from "react";
import { useStore } from "../store";
import { ShieldCheck, UserPlus, Key, Mail, LogIn, ArrowLeftRight } from "lucide-react";

export default function AuthPage() {
  const { login, register, currentUser, showToast } = useStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    if (mode === "login") {
      const result = login(username.trim(), password);
      if (result !== true) {
        setErrorMessage(result as string);
      }
    } else {
      if (password !== confirmPassword) {
        setErrorMessage("Mật khẩu và xác nhận mật khẩu phải giống nhau.");
        return;
      }
      const result = register(username.trim(), email.trim(), password);
      if (result === true) {
        showToast("Đăng ký thành công!", "Chào mừng bé đã gia nhập SmartExplorer 3D.", "🎉", "success");
      } else {
        setErrorMessage(result as string);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-500 via-cyan-400 to-emerald-400 text-slate-900 flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-3xl rounded-[36px] bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.22)] border-2 border-white backdrop-blur-xl overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.2),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.25),_transparent_28%)] pointer-events-none" />
        <div className="relative p-6 md:p-10">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-800 to-slate-600 text-white shadow-lg">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-black">SmartExplorer 3D</p>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900">Đăng nhập &amp; Đăng ký</h1>
                </div>
              </div>
              <p className="max-w-xl text-slate-600 leading-7">Đăng nhập để bắt đầu hành trình — hoặc đăng ký nếu bé chưa có tài khoản.</p>
            </div>

            {/* Removed pre-filled account hint so users must remember or register themselves */}
          </div>

          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[32px] bg-slate-950/95 p-8 text-slate-50 shadow-[0_18px_60px_rgba(15,23,42,0.25)] border border-slate-800 flex flex-col items-center">
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-black mb-2">{mode === "login" ? "Chào trở lại!" : "Chào bạn mới!"}</h2>
                <p className="text-sm text-slate-400">Nhập tên và mật khẩu để tiếp tục</p>
              </div>

              <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                <div className="flex items-center gap-3 rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3">
                  <UserPlus className="w-5 h-5 text-slate-400" />
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-transparent text-slate-100 outline-none text-lg"
                    placeholder="Tên tài khoản"
                    required
                  />
                </div>

                {mode === "register" && (
                  <div className="flex items-center gap-3 rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-slate-100 outline-none text-lg"
                      placeholder="Email (nếu có)"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3 rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3">
                  <Key className="w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-slate-100 outline-none text-lg"
                    placeholder="Mật khẩu"
                    required
                  />
                </div>

                {mode === "register" && (
                  <div className="flex items-center gap-3 rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3">
                    <Key className="w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-transparent text-slate-100 outline-none text-lg"
                      placeholder="Nhập lại mật khẩu"
                      required
                    />
                  </div>
                )}

                {errorMessage && (
                  <div className="rounded-3xl bg-rose-500/10 border border-rose-300/60 px-4 py-3 text-sm text-rose-700 text-center">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-3xl bg-gradient-to-r from-cyan-400 to-sky-500 px-6 py-4 text-lg font-black uppercase tracking-[0.12em] text-slate-950 shadow-[0_12px_25px_rgba(14,165,233,0.25)] transition hover:scale-[1.01]"
                >
                  {mode === "login" ? (
                    <span className="inline-flex items-center gap-2"><LogIn className="w-5 h-5" />Đăng nhập</span>
                  ) : (
                    <span className="inline-flex items-center gap-2"><UserPlus className="w-5 h-5" />Đăng ký</span>
                  )}
                </button>

                <div className="flex items-center justify-between mt-2">
                  <button
                    type="button"
                    onClick={() => setMode(mode === "login" ? "register" : "login")}
                    className="text-sm text-slate-300 underline"
                  >
                    {mode === "login" ? "Tạo tài khoản mới" : "Đã có tài khoản? Đăng nhập"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowMore(!showMore); }}
                    className="text-sm text-slate-400"
                  >
                    {showMore ? "Ẩn" : "Xem thêm"}
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-5 rounded-[32px] bg-slate-50 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.15)] border border-slate-200 flex flex-col justify-center">
              <div className="text-center text-slate-900">
                <h3 className="text-xl font-black">Vì sao cần tài khoản?</h3>
                <p className="text-sm text-slate-500">Giữ tiến trình và phần thưởng của bé.</p>
              </div>
              {showMore && (
                <div className="rounded-2xl border border-slate-200 bg-slate-950/95 p-4 text-slate-100 text-sm">
                  <ul className="space-y-2">
                    <li>• Lưu tiến trình học và điểm thưởng.</li>
                    <li>• Trang quản lý chỉ cho Admin (người lớn).</li>
                    <li>• Tùy chỉnh trải nghiệm cho bé.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
