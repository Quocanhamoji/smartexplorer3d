/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { useStore, VOCABULARY_DATA } from "../store";
import { Search, X } from "lucide-react";
import { playClickSound } from "../utils/audio";

export default function VocabularySearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { setCategory, selectWord, soundEnabled } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleSelectWord = (word: any) => {
    playClickSound(soundEnabled);
    setCategory(word.category);
    // Short delay to allow scene to mount before opening card
    setTimeout(() => {
      selectWord(word);
    }, 100);
    setQuery("");
    setIsOpen(false);
  };

  const clearSearch = () => {
    playClickSound(soundEnabled);
    setQuery("");
    setIsOpen(false);
  };

  // Filter vocabulary by English word or Vietnamese meaning
  const filteredWords = query.trim()
    ? VOCABULARY_DATA.filter(
        (w) =>
          w.word.toLowerCase().includes(query.toLowerCase()) ||
          w.meaning.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const getCategoryEmoji = (cat: string) => {
    switch (cat) {
      case "garden":
        return "🍎";
      case "pet":
        return "🐱";
      case "sea":
        return "🐠";
      case "animals":
        return "🦁";
      default:
        return "🗺️";
    }
  };

  const getCategoryName = (cat: string) => {
    switch (cat) {
      case "garden":
        return "Khu Vườn Trái Cây";
      case "pet":
        return "Ngôi Nhà Thú Cưng";
      case "sea":
        return "Thế Giới Đại Dương";
      case "animals":
        return "Thú Rừng Hoang Dã";
      default:
        return "";
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs md:max-w-sm pointer-events-auto">
      <div className="relative flex items-center bg-white/95 backdrop-blur-md rounded-2xl border-4 border-amber-300 shadow-[0_6px_0_#FCD34D] h-12 px-3.5 transition-all focus-within:ring-4 focus-within:ring-amber-200">
        <Search className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Tìm từ vựng: Apple, Cat, Lion..."
          className="w-full bg-transparent text-sm font-bold text-slate-800 placeholder-slate-400 outline-none border-none py-1 h-full"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* Suggested Dropdown results */}
      {isOpen && query.trim() && (
        <div className="absolute top-14 left-0 right-0 bg-white/98 backdrop-blur-md border-4 border-amber-200 rounded-3xl shadow-2xl p-2.5 max-h-72 overflow-y-auto z-50 flex flex-col gap-1.5 scrollbar-thin">
          {filteredWords.length > 0 ? (
            filteredWords.map((word) => (
              <button
                key={word.id}
                onClick={() => handleSelectWord(word)}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-amber-50 cursor-pointer text-left transition-all border-2 border-transparent hover:border-amber-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl bg-slate-50 w-11 h-11 rounded-xl flex items-center justify-center border-2 border-slate-100 shadow-sm">
                    {word.emoji}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-base font-black text-slate-800 leading-none">
                      {word.word}
                    </span>
                    <span className="text-xs font-bold text-slate-400 leading-none mt-1">
                      {word.pronunciation}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end text-right">
                  <span className="text-sm font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100">
                    {word.meaning}
                  </span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1 leading-none">
                    {getCategoryEmoji(word.category)} {getCategoryName(word.category)}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div className="py-8 text-center flex flex-col items-center gap-2">
              <span className="text-4xl text-slate-300">🕵️‍♀️</span>
              <p className="text-sm font-black text-slate-500">
                Ôi, từ này bé tìm chưa thấy rồi!
              </p>
              <p className="text-xs font-bold text-slate-400">
                Bé thử gõ từ khác xem sao nha!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
