/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useStore } from "../store";
import { Award, Star, Trophy, X } from "lucide-react";

export default function ToastContainer() {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed top-24 right-4 md:right-6 z-[100] flex flex-col gap-3 w-80 md:w-96 max-w-[calc(100vw-32px)] pointer-events-none select-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let bgClass = "bg-white border-emerald-400 text-slate-800 shadow-[0_6px_0_#34D399]";
          let iconBg = "bg-emerald-100 text-emerald-600";
          let barBg = "bg-emerald-400";
          let icon = <span className="text-xl">{toast.emoji || "✨"}</span>;

          if (toast.type === "milestone") {
            bgClass = "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-400 text-amber-950 shadow-[0_6px_0_#FBBF24]";
            iconBg = "bg-amber-200 text-amber-700 animate-pulse";
            barBg = "bg-amber-500";
            icon = <Trophy className="w-5 h-5 text-amber-600 fill-amber-300 stroke-[2.5]" />;
          } else if (toast.type === "star") {
            bgClass = "bg-gradient-to-r from-sky-50 to-blue-50 border-sky-400 text-sky-950 shadow-[0_6px_0_#38BDF8]";
            iconBg = "bg-sky-200 text-sky-600";
            barBg = "bg-sky-500";
            icon = <Star className="w-5 h-5 text-sky-600 fill-sky-200 stroke-[2.5]" />;
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, x: 0, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, x: 50, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 220, damping: 15 }}
              className={`w-full pointer-events-auto flex flex-col relative rounded-3xl border-4 p-4 ${bgClass} overflow-hidden`}
              id={`toast-${toast.id}`}
            >
              {/* Top main details */}
              <div className="flex gap-3 items-start">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-black/5 shadow-sm ${iconBg}`}>
                  {icon}
                </div>
                
                <div className="flex-1 flex flex-col text-left">
                  <h4 className="text-sm font-black tracking-wide leading-none uppercase text-slate-850 mt-0.5">
                    {toast.message}
                  </h4>
                  {toast.subMessage && (
                    <p className="text-xs font-bold text-slate-600 mt-1.5 leading-snug">
                      {toast.subMessage}
                    </p>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 hover:bg-black/5 rounded-full transition-colors pointer-events-auto cursor-pointer flex-shrink-0"
                >
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600 stroke-[2.5]" />
                </button>
              </div>

              {/* Action item glow effects */}
              {toast.type === "milestone" && (
                <div className="absolute top-[-30px] right-[-30px] w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none"></div>
              )}

              {/* Dynamic decorative visual ticking timer */}
              <motion.div 
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4.5, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-1.5 ${barBg} opacity-60`}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
