/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Award, Star, Trophy } from "lucide-react";

interface AchievementBadgeProps {
  percentage: number;
}

export default function AchievementBadge({ percentage }: AchievementBadgeProps) {
  // Check if we hit milestones
  const isBronze = percentage >= 50 && percentage < 75;
  const isSilver = percentage >= 75 && percentage < 100;
  const isGold = percentage === 100;

  if (!isBronze && !isSilver && !isGold) return null;

  let title = "";
  let emoji = "";
  let gradientClass = "";
  let borderClass = "";
  let iconColor = "";

  if (isGold) {
    title = "Cao Thủ 100%";
    emoji = "🏆";
    gradientClass = "from-yellow-400 via-amber-400 to-orange-500 shadow-[0_6px_0_#B45309]";
    borderClass = "border-amber-300";
    iconColor = "text-yellow-100";
  } else if (isSilver) {
    title = "Siêu Sao 75%";
    emoji = "⭐";
    gradientClass = "from-slate-300 via-sky-300 to-slate-400 shadow-[0_6px_0_#475569]";
    borderClass = "border-slate-200";
    iconColor = "text-sky-100";
  } else {
    title = "Khám Phá 50%";
    emoji = "✨";
    gradientClass = "from-amber-600 via-rose-450 to-amber-700 shadow-[0_6px_0_#78350F]";
    borderClass = "border-amber-500";
    iconColor = "text-rose-100";
  }

  return (
    <motion.div
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 15,
        delay: 0.2 
      }}
      className={`absolute -top-3 -right-3 z-20 flex items-center gap-1 bg-gradient-to-r ${gradientClass} ${borderClass} border-4 px-3.5 py-1.5 rounded-full select-none shadow-lg`}
      title={title}
    >
      <span className="text-lg animate-pulse">{emoji}</span>
      <span className="text-[10px] font-black tracking-wider uppercase text-white drop-shadow-sm">
        {title}
      </span>
    </motion.div>
  );
}
