/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { useStore, VOCABULARY_DATA } from "../store";
import { Sparkles, Compass, MapPin, Award, Flame } from "lucide-react";
import { playClickSound } from "../utils/audio";
import gsap from "gsap";
import { ExploreCategory } from "../types";
import AchievementBadge from "./AchievementBadge";

export default function WorldMap() {
  const { setCategory, learnedWordIds, soundEnabled, setRewardsModalOpen, loginStreak } = useStore();
  const [ripples, setRipples] = useState<{ id: number; category: ExploreCategory; x: number; y: number }[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // GSAP tactile hover effects for cards
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: -14,
      scale: 1.04,
      duration: 0.35,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1.0,
      duration: 0.35,
      ease: "power2.out"
    });
  };

  // Sweet entry animations for the welcome dashboard using GSAP
  useEffect(() => {
    if (titleRef.current && cardsRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(
        titleRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
      );
      tl.fromTo(
        cardsRef.current.children,
        { scale: 0.85, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" },
        "-=0.4"
      );
    }
  }, []);

  const handleSelect = (category: ExploreCategory) => {
    playClickSound(soundEnabled);
    setCategory(category);
  };

  const handleIslandClick = (e: React.MouseEvent<HTMLButtonElement>, category: ExploreCategory) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: Date.now() + Math.random(),
      category,
      x,
      y
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 700);

    setTimeout(() => {
      handleSelect(category);
    }, 150);
  };

  const getStats = (category: ExploreCategory) => {
    const list = VOCABULARY_DATA.filter((w) => w.category === category);
    const learned = list.filter((w) => learnedWordIds.includes(w.id)).length;
    return {
      total: list.length,
      learned,
      percentage: list.length > 0 ? Math.round((learned / list.length) * 100) : 0,
      emojis: list.map((w) => w.emoji).slice(0, 5).join(" ")
    };
  };

  const gardenStats = getStats("garden");
  const petStats = getStats("pet");
  const seaStats = getStats("sea");
  const animalsStats = getStats("animals");

  return (
    <div 
      className="min-h-screen w-full p-6 flex flex-col items-center justify-center overflow-y-auto pt-24 pb-12 select-none relative"
      style={{ background: "linear-gradient(180deg, #99E5FF 0%, #E0F7FF 60%, #88E070 60%, #68C950 100%)" }}
    >
      {/* Fuzzy fluffy clouds floating decoration - Artistic Flair style */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50">
        <div className="absolute top-20 left-32 w-52 h-20 bg-white rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-40 right-24 w-72 h-24 bg-white rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-10 right-96 w-36 h-16 bg-white rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* HEADER SECTION */}
      <div ref={titleRef} className="text-center max-w-2xl mb-12 flex flex-col items-center z-10">
        <div className="bg-white/90 text-slate-800 font-black px-6 py-2.5 rounded-full shadow-[0_6px_0_#D1D5DB] border-4 border-white inline-flex items-center gap-2 mb-4 animate-bounce-slow text-sm md:text-base">
          <Sparkles className="w-5 h-5 text-[#FFB800] fill-yellow-250 animate-pulse" />
          <span>HỌC CÙNG SMARTEXPLORER 3D</span>
          <Sparkles className="w-5 h-5 text-[#FFB800] fill-yellow-250 animate-pulse" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-slate-850 tracking-tight leading-none drop-shadow-md mb-3">
          Bản Đồ Học Tiếng Anh! 🗺️
        </h1>

        {/* Daily Streak Fire Flame Badge for Children Motivation */}
        {loginStreak && loginStreak > 0 && (
          <div className="mb-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black text-xs md:text-sm px-5 py-2.5 rounded-full shadow-[0_6px_0_#9F1239] border-4 border-white flex items-center gap-2.5 animate-bounce-slow" style={{ animationDuration: '4.5s' }}>
            <Flame className="w-5 h-5 text-yellow-300 fill-yellow-400 animate-pulse stroke-[3]" />
            <span className="tracking-wide">CHUỔI BÉ CHĂM: <b className="text-yellow-200 uppercase">{loginStreak} NGÀY</b> LIÊN TIẾP! 🔥</span>
          </div>
        )}
        
        <p className="text-base md:text-lg text-slate-705 font-bold max-w-md md:max-w-lg leading-snug mb-6">
          Bé yêu hãy nhấn chọn một vùng đất thần tiên dưới đây để cùng khám phá các từ vựng 3D ngộ nghĩnh nhé!
        </p>

        {/* CUTE INTERACTIVE REWARDS LAUNCH BUTTON */}
        <button
          onClick={() => setRewardsModalOpen(true)}
          className="group flex items-center gap-3 bg-gradient-to-r from-amber-400 to-[#FF9000] hover:from-amber-300 hover:to-[#FFA000] text-slate-900 font-black px-8 py-4 rounded-[28px] shadow-[0_8px_0_#C2410C] border-2 border-white transition-all transform hover:scale-105 active:scale-95 active:translate-y-2 active:shadow-none text-md md:text-lg cursor-pointer"
        >
          <span className="text-3xl group-hover:rotate-12 transition-transform">🎁</span>
          <span className="uppercase text-white tracking-wider font-extrabold text-sm md:text-base drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
            Kho Báu & Phần Thưởng
          </span>
        </button>
      </div>

      {/* ISLAND SELECT CARDS - Resized to standard 4 columns on large screens */}
      <div 
        ref={cardsRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl px-4 z-10"
      >
        
        {/* ISLAND 1: FRUIT GARDEN */}
        <div 
          className="relative h-full"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <AchievementBadge percentage={gardenStats.percentage} />
          <button
            onClick={(e) => handleIslandClick(e, "garden")}
            className="w-full h-full text-left bg-white rounded-[40px] p-6 border-4 border-emerald-400 shadow-[0_12px_0_#D1D5DB] active:scale-95 flex flex-col relative overflow-hidden cursor-pointer"
          >
            {ripples.filter(r => r.category === "garden").map(r => (
              <span 
                key={r.id}
                className="absolute bg-emerald-450/30 rounded-full animate-ripple pointer-events-none"
                style={{
                  left: r.x,
                  top: r.y,
                  width: '120px',
                  height: '120px',
                }}
              />
            ))}
            {/* Floating fruits pattern in background */}
            <div className="absolute top-2 right-2 text-6xl opacity-15 pointer-events-none transition-transform duration-500">
              🍎
            </div>
            
            <div className="bg-emerald-400 text-white p-3.5 rounded-[22px] inline-flex self-start shadow-[0_5px_0_#059669] mb-4 border-2 border-white transition-transform">
              <span className="text-3xl">🍏</span>
            </div>

            <div className="flex-1 flex flex-col">
              <h3 className="text-xl font-black text-slate-800 mb-0.5 flex items-center gap-1.5">
                Vườn Trái Cây
                <Compass className="w-4 h-4 text-emerald-605 animate-spin" style={{ animationDuration: '30s' }} />
              </h3>
              <p className="text-emerald-805 text-[10px] font-black uppercase tracking-wider mb-3">Fruit Garden</p>
              
              <p className="text-slate-500 text-xs font-semibold mb-4 flex-1">
                Khám phá thế giới quả ngọt thơm ngon: táo đỏ, cam mọng, dâu tây ngọt mát,...
              </p>

              <span className="text-sm mb-3.5 tracking-wide">{gardenStats.emojis}</span>
            </div>

            {/* Progress widget */}
            <div className="w-full bg-emerald-50 rounded-xl p-3 border-2 border-slate-200 mt-auto">
              <div className="flex justify-between text-[10px] font-black text-emerald-950 mb-1 uppercase">
                <span>Đã thuộc</span>
                <span>{gardenStats.learned} / {gardenStats.total} từ</span>
              </div>
              <div className="h-3 bg-white rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                  style={{ width: `${gardenStats.percentage}%` }}
                ></div>
              </div>
            </div>
          </button>
        </div>

        {/* ISLAND 2: PET HOUSE */}
        <div 
          className="relative h-full"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <AchievementBadge percentage={petStats.percentage} />
          <button
            onClick={(e) => handleIslandClick(e, "pet")}
            className="w-full h-full text-left bg-white rounded-[40px] p-6 border-4 border-amber-400 shadow-[0_12px_0_#D1D5DB] active:scale-95 flex flex-col relative overflow-hidden cursor-pointer"
          >
            {ripples.filter(r => r.category === "pet").map(r => (
              <span 
                key={r.id}
                className="absolute bg-amber-450/30 rounded-full animate-ripple pointer-events-none"
                style={{
                  left: r.x,
                  top: r.y,
                  width: '120px',
                  height: '120px',
                }}
              />
            ))}
            <div className="absolute top-2 right-2 text-6xl opacity-15 pointer-events-none transition-transform duration-500">
              🐱
            </div>
            
            <div className="bg-amber-400 text-white p-3.5 rounded-[22px] inline-flex self-start shadow-[0_5px_0_#D97706] mb-4 border-2 border-white transition-transform">
              <span className="text-3xl">🐶</span>
            </div>

            <div className="flex-1 flex flex-col">
              <h3 className="text-xl font-black text-slate-800 mb-0.5 flex items-center gap-1.5">
                Nhà Thú Cưng
                <Compass className="w-4 h-4 text-amber-605 animate-spin" style={{ animationDuration: '30s' }} />
              </h3>
              <p className="text-amber-855 text-[10px] font-black uppercase tracking-wider mb-3">Pet House</p>
              
              <p className="text-slate-500 text-xs font-semibold mb-4 flex-1">
                Chơi đùa cùng các loài thú cưng siêu dễ thương: cún con năng động, chú mèo lười,...
              </p>

              <span className="text-sm mb-3.5 tracking-wide">{petStats.emojis}</span>
            </div>

            {/* Progress widget */}
            <div className="w-full bg-amber-50 rounded-xl p-3 border-2 border-slate-200 mt-auto">
              <div className="flex justify-between text-[10px] font-black text-amber-950 mb-1 uppercase">
                <span>Đã thuộc</span>
                <span>{petStats.learned} / {petStats.total} từ</span>
              </div>
              <div className="h-3 bg-white rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
                  style={{ width: `${petStats.percentage}%` }}
                ></div>
              </div>
            </div>
          </button>
        </div>

        {/* ISLAND 3: SEA WORLD */}
        <div 
          className="relative h-full"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <AchievementBadge percentage={seaStats.percentage} />
          <button
            onClick={(e) => handleIslandClick(e, "sea")}
            className="w-full h-full text-left bg-white rounded-[40px] p-6 border-4 border-sky-400 shadow-[0_12px_0_#D1D5DB] active:scale-95 flex flex-col relative overflow-hidden cursor-pointer"
          >
            {ripples.filter(r => r.category === "sea").map(r => (
              <span 
                key={r.id}
                className="absolute bg-sky-450/30 rounded-full animate-ripple pointer-events-none"
                style={{
                  left: r.x,
                  top: r.y,
                  width: '120px',
                  height: '120px',
                }}
              />
            ))}
            <div className="absolute top-2 right-2 text-6xl opacity-15 pointer-events-none transition-transform duration-500">
              🐙
            </div>
            
            <div className="bg-sky-400 text-white p-3.5 rounded-[22px] inline-flex self-start shadow-[0_5px_0_#0284C7] mb-4 border-2 border-white transition-transform">
              <span className="text-3xl">🐳</span>
            </div>

            <div className="flex-1 flex flex-col">
              <h3 className="text-xl font-black text-slate-800 mb-0.5 flex items-center gap-1.5">
                Đại Dương Xanh
                <Compass className="w-4 h-4 text-sky-600 animate-spin" style={{ animationDuration: '30s' }} />
              </h3>
              <p className="text-sky-850 text-[10px] font-black uppercase tracking-wider mb-3">Ocean World</p>
              
              <p className="text-slate-500 text-xs font-semibold mb-4 flex-1">
                Lặn sâu xuống biển để làm quen bạn cá bơi nhanh, chú cá voi xanh thân thiện,...
              </p>

              <span className="text-sm mb-3.5 tracking-wide">{seaStats.emojis}</span>
            </div>

            {/* Progress widget */}
            <div className="w-full bg-cyan-50 rounded-xl p-3 border-2 border-slate-200 mt-auto">
              <div className="flex justify-between text-[10px] font-black text-cyan-950 mb-1 uppercase">
                <span>Đã thuộc</span>
                <span>{seaStats.learned} / {seaStats.total} từ</span>
              </div>
              <div className="h-3 bg-white rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div 
                  className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
                  style={{ width: `${seaStats.percentage}%` }}
                ></div>
              </div>
            </div>
          </button>
        </div>

        {/* ISLAND 4: SAVANNA ANIMALS */}
        <div 
          className="relative h-full"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <AchievementBadge percentage={animalsStats.percentage} />
          <button
            onClick={(e) => handleIslandClick(e, "animals")}
            className="w-full h-full text-left bg-white rounded-[40px] p-6 border-4 border-orange-400 shadow-[0_12px_0_#D1D5DB] active:scale-95 flex flex-col relative overflow-hidden cursor-pointer"
          >
            {ripples.filter(r => r.category === "animals").map(r => (
              <span 
                key={r.id}
                className="absolute bg-orange-450/30 rounded-full animate-ripple pointer-events-none"
                style={{
                  left: r.x,
                  top: r.y,
                  width: '120px',
                  height: '120px',
                }}
              />
            ))}
            <div className="absolute top-2 right-2 text-6xl opacity-15 pointer-events-none transition-transform duration-500">
              🦒
            </div>
            
            <div className="bg-orange-400 text-white p-3.5 rounded-[22px] inline-flex self-start shadow-[0_5px_0_#C2410C] mb-4 border-2 border-white transition-transform">
              <span className="text-3xl">🦁</span>
            </div>

            <div className="flex-1 flex flex-col">
              <h3 className="text-xl font-black text-slate-800 mb-0.5 flex items-center gap-1.5">
                Thú Hoang Dã
                <Compass className="w-4 h-4 text-orange-600 animate-spin" style={{ animationDuration: '30s' }} />
              </h3>
              <p className="text-orange-800 text-[10px] font-black uppercase tracking-wider mb-3">Wild Animals</p>
              
              <p className="text-slate-500 text-xs font-semibold mb-4 flex-1">
                Kết bạn cùng thế giới động vật muôn màu: sư tử oai phong, bạn hươu cao kều,...
              </p>

              <span className="text-sm mb-3.5 tracking-wide">{animalsStats.emojis}</span>
            </div>

            {/* Progress widget */}
            <div className="w-full bg-orange-50 rounded-xl p-3 border-2 border-slate-200 mt-auto">
              <div className="flex justify-between text-[10px] font-black text-orange-950 mb-1 uppercase">
                <span>Đã thuộc</span>
                <span>{animalsStats.learned} / {animalsStats.total} từ</span>
              </div>
              <div className="h-3 bg-white rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-yellow-600 rounded-full"
                  style={{ width: `${animalsStats.percentage}%` }}
                ></div>
              </div>
            </div>
          </button>
        </div>

      </div>

      {/* FOOTER TIPS */}
      <div className="mt-12 text-slate-800 text-xs font-bold text-center flex items-center gap-2 bg-white/90 px-6 py-3 rounded-full shadow-[0_6px_0_#D1D5DB] border-2 border-white z-10">
        <MapPin className="w-4 h-4 text-red-500 animate-bounce" />
        <span>Gợi ý: Bé học đủ {VOCABULARY_DATA.length} từ ở cả 4 vùng đất để nhận Cúp Vô Địch Tiếng Anh nhé! 🏆</span>
      </div>

    </div>
  );
}
