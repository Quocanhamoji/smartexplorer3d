/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from "react";
import { useStore, VOCABULARY_DATA } from "../store";
import { Volume2, VolumeX, Star, Award, RotateCcw, Map } from "lucide-react";
import gsap from "gsap";
import VocabularySearch from "./VocabularySearch";

export default function Header() {
  const { stars, soundEnabled, toggleSound, learnedWordIds, activeCategory, setCategory, resetProgress, challengeEnabled, toggleChallenge, funModeEnabled, toggleFunMode, narrativeModeEnabled, toggleNarrativeMode, environmentTheme, setEnvironmentTheme, skyboxBackground, setSkyboxBackground, isAuthenticated, openAuthModal } = useStore();
  const speakerRef = useRef<HTMLDivElement>(null);

  const cycleEnvironmentTheme = () => {
    if (environmentTheme === "day") {
      setEnvironmentTheme("twilight");
    } else if (environmentTheme === "twilight") {
      setEnvironmentTheme("night");
    } else {
      setEnvironmentTheme("day");
    }
  };

  const cycleSkyboxBackground = () => {
    if (skyboxBackground === "plain") {
      setSkyboxBackground("mountain");
    } else if (skyboxBackground === "mountain") {
      setSkyboxBackground("underwater");
    } else if (skyboxBackground === "underwater") {
      setSkyboxBackground("space");
    } else {
      setSkyboxBackground("plain");
    }
  };

  useEffect(() => {
    if (speakerRef.current) {
      gsap.fromTo(
        speakerRef.current,
        { scale: 0.65, rotation: -25 },
        { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2.5)" }
      );
    }
  }, [soundEnabled]);
  
  const totalWords = VOCABULARY_DATA.length;
  const learnedCount = learnedWordIds.length;
  const progressPercent = totalWords > 0 ? (learnedCount / totalWords) * 100 : 0;

  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6 pointer-events-none select-none">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* LEFT COMPONENT: PROGRESS & STAR COUNTER (Pointer events enabled inside container only) */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/95 backdrop-blur-md px-6 py-3 rounded-3xl shadow-[0_8px_0_#D1D5DB] border-4 border-white pointer-events-auto">
          {/* Star Counter */}
          <div className="flex items-center gap-2">
            <span className="text-3xl animate-bounce-slow">⭐</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.2em] leading-none mb-0.5">Điểm Thưởng</span>
              <span className="text-3xl font-black text-[#FFB800] leading-none drop-shadow-sm">{stars}0</span>
            </div>
          </div>

          <div className="hidden sm:block w-px h-8 bg-slate-200"></div>

          {/* Progress bar */}
          <div className="flex items-center gap-3 w-48 sm:w-60">
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-black uppercase tracking-wider mb-1">
                <span>Khám phá: {learnedCount}/{totalWords} từ</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-6 w-full bg-white/50 backdrop-blur-sm rounded-full p-1 border-2 border-slate-200">
                <div 
                  className="h-full bg-gradient-to-r from-[#FFDD00] to-[#FFAA00] rounded-full shadow-inner transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
            {progressPercent === 100 && (
              <div className="p-1.5 bg-[#FFB800] rounded-full animate-bounce shadow-[0_4px_0_#D1A300]">
                <Award className="w-5 h-5 text-white fill-yellow-200" />
              </div>
            )}
          </div>
        </div>

        {/* CENTER COMPONENT: VOCABULARY SEARCH BAR & OPTIONAL TITLE */}
        <div className="flex items-center gap-3">
          <VocabularySearch />
          {activeCategory && (
            <div className="hidden xl:flex items-center gap-3 bg-white/95 backdrop-blur-md px-5 py-2 rounded-2xl border-4 border-emerald-400 shadow-[0_6px_0_#D1D5DB] select-none animate-float">
              <span className="text-2xl">
                {activeCategory === "garden" ? "🍎" : activeCategory === "pet" ? "🐶" : activeCategory === "sea" ? "🐠" : "🦁"}
              </span>
              <h2 className="text-sm font-black text-slate-850 tracking-wide uppercase">
                {activeCategory === "garden" ? "Khu Vườn" : activeCategory === "pet" ? "Thú Cưng" : activeCategory === "sea" ? "Đại Dương" : "Thang Dã"}
              </h2>
            </div>
          )}
        </div>

        {/* RIGHT COMPONENT: AUDIO TOGGLE & REPLAY PROGRESS (Pointer events enabled inside) */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Back to Map button inside upper right for quick desktop interaction if needed */}
          {activeCategory && (
            <button
              onClick={() => setCategory(null)}
              className="flex items-center gap-2 bg-white rounded-2xl shadow-[0_6px_0_#D1D5DB] border-2 border-slate-100 font-black text-blue-600 px-5 py-3 transition-all hover:scale-105 active:scale-95 active:translate-y-1 active:shadow-none cursor-pointer"
            >
              <Map className="w-5 h-5 text-blue-500" />
              <span className="hidden sm:inline text-sm uppercase font-black">Bản đồ</span>
            </button>
          )}

          {/* Sẵn sàng Thử Thách Toggle */}
          <button
            onClick={toggleChallenge}
            aria-label="Chế độ Thử Thách"
            title={challengeEnabled ? "Tắt thử thách (Hiện tiếng Anh)" : "Bật thử thách (Ẩn tiếng Anh)"}
            className={`h-14 px-4 rounded-2xl border-2 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 active:translate-y-1 active:shadow-none text-xs font-black ${
              challengeEnabled
                ? "bg-gradient-to-r from-orange-400 to-amber-500 border-white text-white shadow-[0_6px_0_#B45309]"
                : "bg-white border-white shadow-[0_6px_0_#D1D5DB] text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className="text-xl">{challengeEnabled ? "🧠" : "👶"}</span>
            <span className="hidden xl:inline-block leading-none uppercase">Thách Thức</span>
          </button>

          {/* Sẵn sàng Đoán Âm Thanh Toggle (Fun Mode) */}
          <button
            onClick={toggleFunMode}
            aria-label="Đoán Âm Thanh"
            title={funModeEnabled ? "Tắt chế độ đoán âm thanh" : "Bật chế độ đoán âm thanh"}
            className={`h-14 px-4 rounded-2xl border-2 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 active:translate-y-1 active:shadow-none text-xs font-black ${
              funModeEnabled
                ? "bg-gradient-to-r from-emerald-400 to-teal-500 border-white text-white shadow-[0_6px_0_#047857]"
                : "bg-white border-white shadow-[0_6px_0_#D1D5DB] text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className="text-xl">{funModeEnabled ? "🎶" : "🔇"}</span>
            <span className="hidden xl:inline-block leading-none uppercase">Đoán Âm</span>
          </button>

          {/* Sẵn sàng Dẫn Chuyện Toggle (Narrative Mode) */}
          <button
            onClick={toggleNarrativeMode}
            aria-label="Chế độ dẫn truyện"
            title={narrativeModeEnabled ? "Tắt chế độ dẫn kể chuyện ríu rít" : "Bật chế độ dẫn kể chuyện ríu rít" }
            className={`h-14 px-4 rounded-2xl border-2 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 active:translate-y-1 active:shadow-none text-xs font-black ${
              narrativeModeEnabled
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 border-white text-white shadow-[0_6px_0_#4C1D95]"
                : "bg-white border-white shadow-[0_6px_0_#D1D5DB] text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className="text-xl">{narrativeModeEnabled ? "📖" : "🔇"}</span>
            <span className="hidden xl:inline-block leading-none uppercase">Dẫn Chuyện</span>
          </button>

          {/* Environment Theme Switcher (Day/Night cycle) */}
          {activeCategory && (
            <button
              onClick={cycleEnvironmentTheme}
              aria-label="Chuyển đổi bầu trời"
              title="Đổi cảnh bầu trời (Sáng / Chiều / Tối)"
              className={`h-14 px-4 rounded-2xl border-2 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 active:translate-y-1 active:shadow-none text-xs font-black ${
                environmentTheme === "day"
                  ? "bg-gradient-to-r from-amber-400 to-yellow-300 border-white text-slate-800 shadow-[0_6px_0_#D97706]"
                  : environmentTheme === "twilight"
                  ? "bg-gradient-to-r from-pink-500 to-indigo-500 border-white text-white shadow-[0_6px_0_#4C1D95]"
                  : "bg-gradient-to-r from-slate-900 to-slate-850 border-white text-sky-200 shadow-[0_6px_0_#0F172A]"
              }`}
            >
              <span className="text-xl">
                {environmentTheme === "day" ? "☀️" : environmentTheme === "twilight" ? "🌇" : "🌙"}
              </span>
              <span className="hidden xl:inline-block leading-none uppercase">
                {environmentTheme === "day" ? "Sáng Ấm" : environmentTheme === "twilight" ? "Chiều Tà" : "Đêm Sao"}
              </span>
            </button>
          )}

          {/* Environment Skybox/Background Theme Switcher */}
          {activeCategory && (
            <button
              onClick={cycleSkyboxBackground}
              aria-label="Đổi hình nền 3D"
              title="Đổi phong cảnh nền (Trơn / Núi / Biển / Vũ Trụ)"
              className={`h-14 px-4 rounded-2xl border-2 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 active:translate-y-1 active:shadow-none text-xs font-black ${
                skyboxBackground === "plain"
                  ? "bg-gradient-to-r from-teal-400 to-emerald-400 border-white text-slate-800 shadow-[0_6px_0_#0D9488]"
                  : skyboxBackground === "mountain"
                  ? "bg-gradient-to-r from-amber-500 to-orange-400 border-white text-white shadow-[0_6px_0_#9A3412]"
                  : skyboxBackground === "underwater"
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 border-white text-white shadow-[0_6px_0_#1E40AF]"
                  : "bg-gradient-to-r from-fuchsia-600 to-purple-600 border-white text-white shadow-[0_6px_0_#581C87]"
              }`}
            >
              <span className="text-xl">
                {skyboxBackground === "plain" ? "🎨" : skyboxBackground === "mountain" ? "⛰️" : skyboxBackground === "underwater" ? "🐠" : "🚀"}
              </span>
              <span className="hidden xl:inline-block leading-none uppercase">
                {skyboxBackground === "plain" ? "Nền Trơn" : skyboxBackground === "mountain" ? "Núi Non" : skyboxBackground === "underwater" ? "Đại Dương" : "Vũ Trụ"}
              </span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Bật/Tắt âm thanh"
            className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-90 active:translate-y-1 active:shadow-none ${
              soundEnabled
                ? "bg-white border-white shadow-[0_6px_0_#D1D5DB] text-[#FFAA00]"
                : "bg-gray-100 border-gray-200 shadow-[0_6px_0_#E5E7EB] text-gray-400"
            }`}
          >
            <div ref={speakerRef}>
              {soundEnabled ? <Volume2 className="w-6 h-6 stroke-[3]" /> : <VolumeX className="w-6 h-6 stroke-[3]" />}
            </div>
          </button>

          {/* Reset Progress Button */}
          {!isAuthenticated && (
            <button
              onClick={() => openAuthModal()}
              title="Đăng nhập"
              className="h-14 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 text-white font-black flex items-center gap-2 cursor-pointer transition hover:scale-105"
            >
              Đăng nhập
            </button>
          )}
          <button
            onClick={() => {
              if (confirm("Con muốn chơi lại từ đầu và đặt lại điểm số không?")) {
                resetProgress();
              }
            }}
            title="Đặt lại tiến trình"
            className="w-14 h-14 rounded-2xl bg-white hover:bg-rose-50 border-2 border-white shadow-[0_6px_0_#D1D5DB] text-rose-500 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-90 active:translate-y-1 active:shadow-none"
          >
            <RotateCcw className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

      </div>
    </header>
  );
}
