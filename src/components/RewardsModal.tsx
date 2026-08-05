import React, { useState, useRef } from "react";
import { useStore, VOCABULARY_DATA } from "../store";
import { X, Lock, Trophy, Sparkles, Star, Award, Share2 } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { playClickSound } from "../utils/audio";
import { Float } from "@react-three/drei";
import { motion, AnimatePresence } from "motion/react";
import * as THREE from "three";
import Leaderboard from "./Leaderboard";

// Mini 3D Treasure Chest Model for Canvas
function Chest3DModel() {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.9;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Wooden Chest bottom */}
      <mesh position={[0, -0.25, 0]} castShadow>
        <boxGeometry args={[1.2, 0.5, 0.8]} />
        <meshStandardMaterial color="#78350F" roughness={0.7} />
      </mesh>

      {/* Golden brackets on bottom */}
      <mesh position={[-0.59, -0.25, 0.39]}>
        <boxGeometry args={[0.04, 0.52, 0.04]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.59, -0.25, 0.39]}>
        <boxGeometry args={[0.04, 0.52, 0.04]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.59, -0.25, -0.39]}>
        <boxGeometry args={[0.04, 0.52, 0.04]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.59, -0.25, -0.39]}>
        <boxGeometry args={[0.04, 0.52, 0.04]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Chest Lid (Curved dome) */}
      <mesh position={[0, 0.15, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 1.2, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#B45309" roughness={0.6} />
      </mesh>

      {/* Gold band around lid */}
      <mesh position={[0, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.41, 0.41, 0.1, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Golden key latch lock in front */}
      <mesh position={[0, -0.05, 0.41]} castShadow>
        <boxGeometry args={[0.18, 0.22, 0.05]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Keyhole */}
      <mesh position={[0, -0.05, 0.44]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#1E293B" />
      </mesh>

      {/* Magic Sparking Gems Inside/Around */}
      <group position={[0, 0.1, 0.1]}>
        <mesh position={[-0.3, 0, 0]} rotation={[0.5, 0.4, 0.2]}>
          <octahedronGeometry args={[0.08, 0]} />
          <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.2, 0.05, -0.1]} rotation={[0.2, 0.8, 0.5]}>
          <octahedronGeometry args={[0.06, 0]} />
          <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0, -0.05, 0.2]} rotation={[0.1, 0.1, 0.9]}>
          <octahedronGeometry args={[0.07, 0]} />
          <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.7} />
        </mesh>
      </group>
    </group>
  );
}

// Mini 3D Champion Trophy Model for Canvas
function Trophy3DModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.9;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Heavy obsidian round base */}
      <mesh position={[0, -0.45, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.5, 0.16, 12]} />
        <meshStandardMaterial color="#1E293B" roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Thin Gold stem */}
      <mesh position={[0, -0.22, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.12, 0.32, 10]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Trophy bowl */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.44, 0.2, 0.45, 16]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Sphere base of bowl */}
      <mesh position={[0, -0.05, 0]}>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Left Handle */}
      <group position={[-0.38, 0.18, 0]} rotation={[0, 0, 0.35]}>
        <mesh>
          <torusGeometry args={[0.16, 0.04, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Right Handle */}
      <group position={[0.38, 0.18, 0]} rotation={[0, 0, -0.35]}>
        <mesh>
          <torusGeometry args={[0.16, 0.04, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

// Particle Confetti Shower component for child celebrations
function ConfettiShower() {
  const colors = [
    "bg-rose-400", "bg-pink-400", "bg-amber-400", "bg-yellow-300", 
    "bg-emerald-400", "bg-teal-400", "bg-sky-400", "bg-indigo-400",
    "bg-purple-400", "bg-orange-400"
  ];
  
  // High-density celebratory particles array (60 items is optimal)
  const particles = Array.from({ length: 60 }).map((_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 4.5;
    const size = 6 + Math.random() * 10;
    const duration = 2.0 + Math.random() * 3.0;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = Math.random() > 0.5 ? "rounded-none" : "rounded-full";
    const rotate = Math.random() * 360;
    
    return { id: i, left, delay, size, duration, color, shape, rotate };
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map(p => (
        <div
          key={p.id}
          className={`absolute ${p.color} ${p.shape} animate-confetti-fall`}
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            top: `-20px`,
            transform: `rotate(${p.rotate}deg)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function RewardsModal() {
  const { 
    rewardsModalOpen, 
    setRewardsModalOpen, 
    stars, 
    learnedWordIds,
    showToast,
    soundEnabled
  } = useStore();

  const [activeTab, setActiveTab] = useState<"chest" | "trophy" | "leaderboard">("chest");

  if (!rewardsModalOpen) return null;

  const currentScore = stars * 10;
  const wordCount = learnedWordIds.length;
  
  // Magic Chest Condition: score reaches 500
  const isChestUnlocked = currentScore >= 500;
  
  // Trophy Condition: ALL words learned
  const isTrophyUnlocked = learnedWordIds.length === VOCABULARY_DATA.length && VOCABULARY_DATA.length > 0;

  // Percentage calculations
  const chestPercent = Math.min(100, Math.round((currentScore / 500) * 100));
  const trophyPercent = Math.min(100, Math.round((learnedWordIds.length / VOCABULARY_DATA.length) * 100));

  const handleShare = async () => {
    playClickSound(soundEnabled);

    const shareTitle = "Bảng Vàng học tiếng Anh của tớ! 🏆";
    const shareText = `Tớ đã học xong các từ vựng 3D trên SmartExplorer! Tớ đã đạt được ${stars} ⭐ (${currentScore} điểm xu) và thuộc lòng ${wordCount}/${VOCABULARY_DATA.length} từ vựng! ${
      isTrophyUnlocked 
        ? "Tập bản đồ 3D đã được tớ hoàn thành 100% kèm theo Cúp Vàng Học Giả! 🏆" 
        : isChestUnlocked 
        ? "Hộp Quà Thần Kỳ 3D cũng đang được tớ mở khóa thành công rồi đó! 🎁" 
        : "Đang nỗ lực rinh Hộp Quà Thần Kỳ! 🚀"
    }`;
    const shareUrl = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        showToast(
          "Chia Sẻ Thành Công! 🎉",
          "Thành tích rực rỡ của bé đã được gửi tới bố mẹ và bạn bè rồi nhé!",
          "🚀",
          "success"
        );
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      // Fallback copy-to-clipboard
      try {
        await navigator.clipboard.writeText(`${shareTitle}\n${shareText}\n${shareUrl}`);
        showToast(
          "Đã Sao Chép Bảng Vàng! 📋",
          "Đã lưu thành tích vào bộ nhớ tẹt ga. Bé hãy gửi tin nhắn cho bố mẹ cùng vui nhé!",
          "✨",
          "success"
        );
      } catch (err) {
        showToast(
          "Chưa hỗ trợ sao chép! 😢",
          "Bé hãy rủ bố mẹ nhìn trực tiếp vào bảng vàng thành tích này nha!",
          "⚠️",
          "success"
        );
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-hidden">
        <ConfettiShower />
        
        {/* Modal container animated using motion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg bg-white rounded-[40px] border-4 border-indigo-400 p-6 md:p-8 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.4)] flex flex-col pointer-events-auto"
        >
          
          {/* Close Action icon */}
          <button
            onClick={() => setRewardsModalOpen(false)}
            className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-250 p-2.5 rounded-full border border-slate-200 text-slate-550 transition-transform active:scale-95 hover:rotate-90 cursor-pointer"
          >
            <X className="w-5 h-5 font-bold" />
          </button>

          {/* Icon Badge & Title */}
          <div className="text-center flex flex-col items-center mb-6">
            <span className="text-5xl mb-2 animate-bounce-slow">🏆</span>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none">
              Kho Báu Của Bé 🎁
            </h2>
            <p className="text-slate-400 text-xs font-black uppercase tracking-wider mt-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-100" />
              SMARTEXPLORER 3D TROPHIES
              <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-100" />
            </p>
          </div>

          {/* THREE SIDE-BY-SIDE TAB CARDS */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6">
            
            {/* Chest tab button */}
            <button
              onClick={() => setActiveTab("chest")}
              className={`text-left p-2.5 md:p-3 rounded-2xl border-3 flex flex-col relative transition-all duration-300 ${
                activeTab === "chest" 
                  ? "bg-amber-50/75 border-amber-400 shadow-md scale-[1.03]" 
                  : "bg-slate-50 border-slate-100 opacity-80 hover:opacity-100"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xl">🎁</span>
                {isChestUnlocked ? (
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Mở</span>
                ) : (
                  <Lock className="w-3 h-3 text-slate-400" />
                )}
              </div>
              <h4 className="text-xs font-black text-slate-800 truncate leading-tight">Hộp Quà</h4>
              <p className="text-[9px] font-bold text-slate-400">Yêu cầu 500đ</p>
            </button>

            {/* Trophy tab button */}
            <button
              onClick={() => setActiveTab("trophy")}
              className={`text-left p-2.5 md:p-3 rounded-2xl border-3 flex flex-col relative transition-all duration-300 ${
                activeTab === "trophy" 
                  ? "bg-indigo-50/75 border-indigo-400 shadow-md scale-[1.03]" 
                  : "bg-slate-50 border-slate-100 opacity-80 hover:opacity-100"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xl">🏆</span>
                {isTrophyUnlocked ? (
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Có</span>
                ) : (
                  <Lock className="w-3 h-3 text-slate-400" />
                )}
              </div>
              <h4 className="text-xs font-black text-slate-800 truncate leading-tight">Cúp Vàng</h4>
              <p className="text-[9px] font-bold text-slate-400">Học đủ từ</p>
            </button>

            {/* Leaderboard tab button */}
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`text-left p-2.5 md:p-3 rounded-2xl border-3 flex flex-col relative transition-all duration-300 ${
                activeTab === "leaderboard" 
                  ? "bg-rose-50/75 border-rose-400 shadow-md scale-[1.03]" 
                  : "bg-slate-50 border-slate-100 opacity-80 hover:opacity-100"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xl">🏅</span>
                <span className="text-[8px] font-black text-rose-500 bg-rose-50 px-1 py-0.5 rounded-full uppercase tracking-tight">Mới</span>
              </div>
              <h4 className="text-xs font-black text-slate-800 truncate leading-tight">Bảng Vàng</h4>
              <p className="text-[9px] font-bold text-slate-400 font-mono">Điểm của bé</p>
            </button>

          </div>

          {/* CORE VIEWPORT CAROUSEL ELEMENT */}
          <div className="bg-slate-50 border-3 border-slate-200 rounded-[32px] p-6 flex flex-col items-center shadow-inner relative overflow-hidden">
            
            {activeTab === "chest" ? (
              <>
                {/* 3D RENDER VIEWER FOR CHEST */}
                <div className="w-48 h-44 relative mb-4">
                  {isChestUnlocked ? (
                    <div className="w-full h-full relative cursor-grab active:cursor-grabbing bg-white/70 rounded-2xl border-2 border-slate-100 shadow-md overflow-hidden">
                      <Canvas camera={{ position: [0, 1.2, 2.2], fov: 45 }}>
                        <ambientLight intensity={1.1} />
                        <directionalLight position={[4, 5, 3]} intensity={1.4} />
                        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
                          <Chest3DModel />
                        </Float>
                      </Canvas>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200/50 rounded-2xl border-4 border-dashed border-slate-300 gap-2.5">
                      <div className="bg-slate-300/40 p-4 rounded-full text-slate-550 border border-slate-300">
                        <Lock className="w-8 h-8 opacity-75 animate-pulse" />
                      </div>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Vùng đất bị khoá</span>
                    </div>
                  )}
                </div>

                {/* Info and Progress */}
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-1.5">
                  🎁 Hộp Báu Vật Thần Kỳ
                </h3>
                <p className="text-slate-400 text-xs font-semibold text-center mt-1 px-4 leading-relaxed">
                  {isChestUnlocked 
                    ? "Woa! Bé đã giỏi quá, hãy nhấp chuột và giữ để quay chiếc Hộp Thần Kỳ này 360 độ nè!" 
                    : "Chăm chỉ tích lỹ điểm bằng cách khám phá từ vựng 3D mới nhé. Bé sắp đạt rồi!"}
                </p>

                {/* Progress bar towards 500 points */}
                <div className="w-full mt-4 bg-slate-200 rounded-full h-6 p-1 flex items-center shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-[#FF9000] h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${chestPercent}%` }}
                  >
                    {chestPercent > 15 && (
                      <span className="text-[9px] font-black text-white drop-shadow-sm leading-none">{chestPercent}%</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between w-full mt-1.5 text-xs font-black text-slate-500 uppercase px-1">
                  <span>Điểm: {currentScore}</span>
                  <span>Mục tiêu: 500đ</span>
                </div>
              </>
            ) : activeTab === "trophy" ? (
              <>
                {/* 3D RENDER VIEWER FOR TROPHY */}
                <div className="w-48 h-44 relative mb-4">
                  {isTrophyUnlocked ? (
                    <div className="w-full h-full relative cursor-grab active:cursor-grabbing bg-white/70 rounded-2xl border-2 border-slate-100 shadow-md overflow-hidden">
                      <Canvas camera={{ position: [0, 1.2, 2.2], fov: 45 }}>
                        <ambientLight intensity={1.1} />
                        <directionalLight position={[4, 5, 3]} intensity={1.4} />
                        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
                          <Trophy3DModel />
                        </Float>
                      </Canvas>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200/50 rounded-2xl border-4 border-dashed border-slate-300 gap-2.5">
                      <div className="bg-slate-300/40 p-4 rounded-full text-slate-550 border border-slate-300">
                        <Lock className="w-8 h-8 opacity-75 animate-pulse" />
                      </div>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Vùng đất bị khoá</span>
                    </div>
                  )}
                </div>

                {/* Info and Progress */}
                <h3 className="text-lg font-black text-slate-805 flex items-center gap-1.5">
                  🏆 Cúp Học Giả Thượng Hạng
                </h3>
                <p className="text-slate-400 text-xs font-semibold text-center mt-1 px-4 leading-relaxed">
                  {isTrophyUnlocked 
                    ? "Chúc mừng Bé trở thành Học Giả Toàn Năng! Chiếc Cúp Vàng lấp lánh đang thuộc về Bé!" 
                    : "Học thuộc hết từ vựng ở cả 4 vùng bản đồ để rước chiếc Cúp vinh dự này về tủ nhé!"}
                </p>

                {/* Progress bar towards 20 words learned */}
                <div className="w-full mt-4 bg-slate-200 rounded-full h-6 p-1 flex items-center shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-indigo-505 to-purple-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${trophyPercent}%` }}
                  >
                    {trophyPercent > 15 && (
                      <span className="text-[9px] font-black text-white drop-shadow-sm leading-none">{trophyPercent}%</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between w-full mt-1.5 text-xs font-black text-slate-500 uppercase px-1">
                  <span>Từ vựng: {learnedWordIds.length} / {VOCABULARY_DATA.length}</span>
                  <span className="text-[#FFB800] font-black">Nhận cúp</span>
                </div>
              </>
            ) : (
              <Leaderboard />
            )}

          </div>

          {/* SHARE ACHIEVEMENT BUTTON */}
          <button
            onClick={handleShare}
            className="mt-4 w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-550 text-white font-black py-3.5 px-6 rounded-3xl shadow-[0_6px_0_#047857] hover:shadow-[0_4px_0_#047857] hover:translate-y-0.5 active:translate-y-1.5 active:shadow-none transition-all cursor-pointer text-sm tracking-wide group"
          >
            <Share2 className="w-5 h-5 text-emerald-200 fill-none stroke-[3] group-hover:scale-110 transition-transform" />
            <span className="uppercase font-black text-white">Chia Sẻ Thành Tích Của Bé</span>
          </button>

          {/* Modal Footer Tip */}
          <div className="mt-4 text-center bg-amber-50 rounded-2xl py-2 px-3 border border-amber-100 flex items-center gap-2 justify-center text-amber-950 font-bold text-[11px]">
            <Star className="w-3.5 h-3.5 text-[#FFAE00] fill-amber-250 animate-spin" style={{ animationDuration: '10s' }} />
            <span>Mỗi từ vựng 3D bé nhấp vào sẽ tăng 20 điểm và 2 Ngôi sao đó! ⭐</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
