import React from "react";
import { useStore } from "../store";
import { Sparkles, Gift, Star } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { motion, AnimatePresence } from "motion/react";
import { playSparkleSound } from "../utils/audio";

// Minimal duplicate of the 3D model for standalone notification scene rendering

function StandaloneChest() {
  return (
    <group rotation={[0.2, -0.6, 0]}>
      {/* Wood Base */}
      <mesh castShadow>
        <boxGeometry args={[1.3, 0.55, 0.85]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.65} />
      </mesh>
      {/* Gold Trim */}
      <mesh position={[0, -0.05, 0.44]}>
        <boxGeometry args={[0.2, 0.25, 0.05]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.85} roughness={0.15} />
      </mesh>
      {/* Lid */}
      <mesh position={[0, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.42, 0.42, 1.3, 12, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#78350F" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.24, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.43, 0.43, 0.12, 12, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.9} />
      </mesh>
    </group>
  );
}

export default function RewardUnlockNotification() {
  const { 
    showUnlockNotification, 
    setShowUnlockNotification, 
    setRewardsModalOpen,
    soundEnabled
  } = useStore();

  const handleOpenRewards = () => {
    // Dismiss notification, open rewards screen!
    setShowUnlockNotification(false);
    setRewardsModalOpen(true);
  };

  if (!showUnlockNotification) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/75 backdrop-blur-lg select-none">
        
        {/* Particle/Star explosion effect container */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="absolute text-3xl animate-float opacity-75"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 6}s`
              }}
            >
              {i % 3 === 0 ? "⭐️" : i % 3 === 1 ? "🎉" : "🎈"}
            </div>
          ))}
        </div>

        {/* Floating Celebration Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.7, rotate: 5 }}
          transition={{ type: "spring", damping: 15, stiffness: 220 }}
          className="relative w-full max-w-md bg-gradient-to-b from-indigo-900 to-slate-900 text-white rounded-[44px] border-4 border-yellow-400 p-8 shadow-[0_0_100px_rgba(251,191,36,0.35)] flex flex-col items-center text-center overflow-hidden"
        >
          {/* Decorative radiating yellow background */}
          <div className="absolute -top-1/3 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none scale-150"></div>

          {/* Glowing Gift Icon */}
          <div className="bg-yellow-400 text-slate-950 p-5 rounded-full inline-flex border-4 border-white shadow-xl mb-6 relative animate-bounce-slow">
            <Gift className="w-10 h-10 stroke-[2.5]" />
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-black animate-pulse">NEW</div>
          </div>

          <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-none text-yellow-300 drop-shadow-md">
            MỞ KHÓA <br /> HỘP QUÀ! 🎁
          </h3>
          
          <p className="text-slate-205 text-sm md:text-base font-extrabold mt-3 max-w-xs leading-snug text-slate-300">
            Chăm chỉ học tập đã được đền đáp! Bé xuất sắc gom đủ 500 điểm để mở hộp báu vật thần kỳ này!
          </p>

          {/* LIVE 3D MINI ROTATING CANVAS */}
          <div className="w-52 h-44 my-4 relative bg-white/5 rounded-3xl border border-white/10 shadow-inner overflow-hidden">
            <Canvas camera={{ position: [0, 1.0, 2.0], fov: 45 }}>
              <ambientLight intensity={1.2} />
              <directionalLight position={[3, 4, 2]} intensity={1.5} />
              <Float speed={2.5} rotationIntensity={0.5} floatIntensity={0.5}>
                <StandaloneChest />
              </Float>
            </Canvas>
          </div>

          {/* Action Button */}
          <div className="w-full flex flex-col gap-3 mt-4">
            <button
              onClick={handleOpenRewards}
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black py-4.5 px-6 rounded-[28px] shadow-[0_6px_0_#B45309] border border-white tracking-wide uppercase transition-all transform hover:scale-105 active:scale-95 text-base cursor-pointer"
            >
              Mở Hộp Quà Ngay! 🎉
            </button>
            
            <button
              onClick={() => setShowUnlockNotification(false)}
              className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors cursor-pointer"
            >
              Xem sau
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
