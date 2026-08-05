/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useStore } from "./store";
import Header from "./components/Header";
import WorldMap from "./components/WorldMap";
import ThreeCanvas from "./components/ThreeCanvas";
import VocabularyCard from "./components/VocabularyCard";
import RewardsModal from "./components/RewardsModal";
import RewardUnlockNotification from "./components/RewardUnlockNotification";
import ToastContainer from "./components/ToastContainer";
import AuthPage from "./components/AuthPage";
import AdminPanel from "./components/AdminPanel";
import { Map, Sparkles, Compass, Lightbulb, Minimize2, Eye } from "lucide-react";
import DrawingBoard from "./components/DrawingBoard";

export default function App() {
  const { 
    activeCategory, 
    setCategory, 
    currentWord, 
    checkLoginStreak, 
    immersive3D, 
    toggleImmersive3D,
    drawingModeEnabled,
    toggleDrawingMode,
    isAuthenticated,
    currentUser
  } = useStore();
  const [showAdminPanel, setShowAdminPanel] = React.useState(false);
  const { authModalOpen } = useStore();

  React.useEffect(() => {
    checkLoginStreak();

    // Parse shared drawing link from URL search parameters on load
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const sharedCode = searchParams.get("drawing");
      if (sharedCode) {
        try {
          // Robust Unicode Base64 decoding
          const jsonStr = decodeURIComponent(
            atob(sharedCode)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          const sharedObj = JSON.parse(jsonStr);
          if (sharedObj && sharedObj.category && Array.isArray(sharedObj.elements)) {
            // Wait briefly for ThreeJS system rendering loop to load and wake up
            setTimeout(() => {
              useStore.getState().loadSharedDrawing(sharedObj.category, sharedObj.elements);
            }, 600);
            
            // Clean up address bar query params immediately to avoid retriggering on manual refreshes
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }
        } catch (e) {
          console.error("Error decoding shared drawing from URL:", e);
        }
      }
    }
  }, [checkLoginStreak]);

  // Allow homepage/world map to be public. Show auth modal only when required.

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-slate-50 font-sans">
      
      {/* GLOBAL TOAST NOTIFICATION CONTAINER */}
      <ToastContainer />
      {currentUser?.role === "admin" && (
        <div className="absolute top-5 right-5 z-40 pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowAdminPanel(true)}
            className="rounded-3xl bg-slate-950/95 px-4 py-3 text-sm font-black text-white shadow-lg border-2 border-cyan-500 transition hover:bg-cyan-500/95"
          >
            Quản lý tài khoản
          </button>
        </div>
      )}
      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
      {authModalOpen && <AuthPage />}
      
      {/* 2D MAIN HEADER OVERLAY (Progress tracker & global settings) */}
      {!immersive3D && <Header />}

      {/* REWARDS MODAL AND UNLOCK NOTIFICATION OVERLAYS */}
      <RewardsModal />
      <RewardUnlockNotification />

      {/* RENDER CATEGORY LEVEL VIEW OR DASHBOARD MAP */}
      {activeCategory === null ? (
        /* World Map Selection Board */
        <WorldMap />
      ) : (
        /* 3D Scene Exploration View */
        <div className="relative w-full h-full">
          
          {/* 3D Canvas Ground Scenery */}
          <ThreeCanvas />

          {immersive3D ? (
            /* --- IMMERSIVE MODE CONTROLS OVERLAY --- */
            <div className="absolute top-6 right-6 z-30 pointer-events-auto">
              <button
                onClick={toggleImmersive3D}
                className="group flex items-center gap-3 bg-slate-900/95 text-white font-black px-6 py-4 rounded-[28px] shadow-[0_8px_0_#1E293B] border-2 border-slate-700 transition-all transform hover:scale-110 active:scale-95 text-sm md:text-base hover:rotate-1 cursor-pointer"
                title="Quay lại Chế độ Thường"
              >
                <Minimize2 className="w-5 h-5 text-emerald-400 stroke-[3]" />
                <span className="uppercase tracking-wider">Thoát 3D Toàn Màn Hình</span>
              </button>
            </div>
          ) : (
            /* --- STANDARD 2D INTERACTIVE CONTROLS --- */
            <>
              {/* LEFT-BOTTOM NAVIGATION: Back to Map, Immersive & Drawing Board */}
              <div className="absolute bottom-6 left-6 z-20 pointer-events-auto flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setCategory(null)}
                  className="group flex items-center gap-3 bg-white text-slate-800 font-black px-6 py-4 rounded-[28px] shadow-[0_8px_0_#D1D5DB] border-2 border-slate-100 transition-all transform hover:scale-110 active:scale-95 active:translate-y-2 active:shadow-none text-base md:text-lg hover:-rotate-1 animate-bounce-slow"
                  style={{ animationDuration: '4s' }}
                  title="Quay lại Bản đồ"
                >
                  <span className="text-2xl group-hover:scale-125 transition-transform">🗺️</span>
                  <span className="uppercase tracking-wider">Bản Đồ</span>
                </button>

                <button
                  onClick={toggleImmersive3D}
                  className="group flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black px-6 py-4 rounded-[28px] shadow-[0_8px_0_#065F46] border-2 border-emerald-400 transition-all transform hover:scale-110 active:scale-95 active:translate-y-2 active:shadow-none text-base md:text-lg hover:rotate-1 cursor-pointer animate-float"
                  title="Chế độ xem 3D toàn màn hình"
                >
                  <Eye className="w-5 h-5 text-emerald-200 fill-emerald-300 stroke-[3]" />
                  <span className="uppercase tracking-wider">Xem 3D Toàn Màn Hình</span>
                </button>

                <button
                  onClick={toggleDrawingMode}
                  className={`group flex items-center gap-3 font-black px-6 py-4 rounded-[28px] transition-all transform hover:scale-110 active:scale-95 active:translate-y-2 active:shadow-none text-base md:text-lg hover:-rotate-1 cursor-pointer ${
                    drawingModeEnabled 
                      ? "bg-amber-500 text-white shadow-[0_8px_0_#78350F] border-2 border-amber-400" 
                      : "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-[0_8px_0_#D97706] border-2 border-amber-300"
                  }`}
                  title="Mở bảng vẽ tranh 3D"
                >
                  <span className="text-2xl group-hover:scale-125 transition-transform">🎨</span>
                  <span className="uppercase tracking-wider">{drawingModeEnabled ? "Đóng Bảng Vẽ" : "Bảng Vẽ 3D"}</span>
                </button>
              </div>

              {/* BOTTOM FLOATING TIPS BAR (Fades out when a word card occupies the bottom center space) */}
              {!currentWord && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 w-fit max-w-sm md:max-w-md px-6 py-4 bg-white border-2 border-slate-200 rounded-[32px] shadow-[0_8px_0_#D1D5DB] pointer-events-none flex items-center gap-3 animate-float">
                  <div className="bg-[#FFDD00]/20 p-2.5 rounded-2xl text-[#FFAA00]">
                    <Lightbulb className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="text-xs md:text-sm text-slate-705 font-bold leading-snug text-left">
                    <p className="text-emerald-800 font-black text-sm mb-0.5 uppercase tracking-wide">🧠 Bí kíp cho bé! 👆</p>
                    <p className="font-semibold text-slate-500">
                      Hãy nhấn giữ chuột để xoay xoay đổi góc nhìn, rồi nhấp vào các bạn thú/trái cây nhé!
                    </p>
                  </div>
                </div>
              )}

              {/* 3D DRAWING CONTROLS BOARD OVERLAY */}
              <DrawingBoard />

              {/* VOCABULARY DETAILED CARD INTERACTIVE OVERLAY */}
              <VocabularyCard />

              {/* MINI SCENE BACKGROUND SOUND EFFECTS */}
              <div className="absolute bottom-6 right-6 z-20 pointer-events-none text-right hidden md:block select-none bg-white border border-slate-100 shadow-[0_4px_0_#E5E7EB] py-2 px-4 rounded-2xl">
                <p className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Đang xem</p>
                <p className="text-xs font-black text-indigo-650 flex items-center gap-1.5 justify-end">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  {activeCategory === "garden" ? "🍎 Vườn Trái Cây" : activeCategory === "pet" ? "🐶 Nhà Thú Cưng" : activeCategory === "sea" ? "🐠 Đại Dương" : "🦁 Thú Hoang Dã"}
                </p>
              </div>
            </>
          )}

        </div>
      )}

    </div>
  );
}
