/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { useStore } from "../store";
import { Trophy, Star, Sparkles, Award } from "lucide-react";
import { motion } from "motion/react";

interface LeaderboardEntry {
  id: string;
  name: string;
  emoji: string;
  score: number;
  isCurrentUser?: boolean;
}

export default function Leaderboard() {
  const { quizScore } = useStore();

  // Create a structured list of cute fictional opponents for children to compete with
  const leaderboardData = useMemo(() => {
    const list: LeaderboardEntry[] = [
      { id: "1", name: "Bé Gấu Ham Học", emoji: "🐼", score: 18 },
      { id: "2", name: "Minh Trí Thông Thái", emoji: "🦊", score: 15 },
      { id: "3", name: "Bé Thỏ Chăm Chỉ", emoji: "🐰", score: 11 },
      { id: "4", name: "Phương Thảo Siêu Sao", emoji: "🐨", score: 8 },
      { id: "5", name: "Bé Sóc Nhanh Trí", emoji: "🐿️", score: 5 },
    ];

    // Find insertion index for the active learner
    const currentUserEntry: LeaderboardEntry = {
      id: "user",
      name: "Bé Yêu (Bé Nhà Mình) ✨",
      emoji: "🦄",
      score: quizScore,
      isCurrentUser: true,
    };

    // Filter list to avoid conflicts and insert
    let merged = [...list];
    const userIndex = merged.findIndex(item => item.score < quizScore);
    
    if (userIndex === -1) {
      merged.push(currentUserEntry);
    } else {
      merged.splice(userIndex, 0, currentUserEntry);
    }

    return merged.slice(0, 6); // Top 6 scores on board
  }, [quizScore]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Visual Header Decors */}
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-300 to-amber-500 fill-white flex items-center justify-center shadow-md animate-bounce-slow mb-1">
          <Trophy className="w-6 h-6 text-white stroke-[2.5]" />
        </div>
        <h3 className="text-xl font-black text-slate-800 leading-none">
          Bảng Vàng Thi Đua 🏅
        </h3>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          Smart Discovery Leaderboard
        </p>
      </div>

      {/* Info Notice card explaining reward */}
      <div className="bg-amber-50 border border-amber-200/80 p-3 rounded-2xl flex items-center gap-2 text-amber-900">
        <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 animate-pulse" />
        <p className="text-[11px] font-bold leading-normal text-left">
          Bé hãy tiếp tục chơi <b>Trắc Nghiệm (Quiz)</b> ở các thẻ từ vựng để tích điểm thật cao và bứt phá dẫn đầu Bảng Vàng nhé!
        </p>
      </div>

      {/* Dynamic interactive ranking rows */}
      <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
        {leaderboardData.map((child, index) => {
          const rank = index + 1;
          const isUser = child.isCurrentUser;
          
          let rankBg = "bg-slate-100 text-slate-500";
          let badge = null;

          if (rank === 1) {
            rankBg = "bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-950";
            badge = "🏆";
          } else if (rank === 2) {
            rankBg = "bg-gradient-to-r from-slate-300 to-slate-400 text-slate-900";
            badge = "🥈";
          } else if (rank === 3) {
            rankBg = "bg-gradient-to-r from-amber-600 to-orange-700 text-amber-50";
            badge = "🥉";
          }

          return (
            <motion.div
              layoutId={`rank-${child.id}`}
              key={child.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all duration-300 ${
                isUser
                  ? "bg-indigo-50/90 border-indigo-400 shadow-[0_4px_0_#818CF8] scale-[1.02]"
                  : "bg-white border-slate-150 shadow-[0_3px_0_#F1F5F9]"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Seed/Numerical sequence order badge */}
                <span className={`w-6 h-6 flex items-center justify-center font-black rounded-full text-xs shadow-sm ${rankBg}`}>
                  {rank}
                </span>

                <span className="text-2xl animate-wiggle-slow flex-shrink-0">
                  {child.emoji}
                </span>

                <span className={`text-xs font-black truncate max-w-44 ${
                  isUser ? "text-indigo-900 font-extrabold" : "text-slate-700"
                }`}>
                  {child.name}
                </span>
              </div>

              {/* Quiz Correct Answers Score */}
              <div className="flex items-center gap-1">
                <span className={`font-black text-xs ${isUser ? "text-indigo-600" : "text-slate-500"}`}>
                  {child.score}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase">Điểm</span>
                {badge && <span className="ml-1 text-sm">{badge}</span>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
