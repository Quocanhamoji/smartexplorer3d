/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useStore } from "../store";
import { 
  Camera, 
  Trash2, 
  Download, 
  FolderOpen, 
  X, 
  Plus, 
  Sparkles, 
  Check, 
  Undo,
  HelpCircle,
  Clock,
  Eye,
  Settings,
  Star,
  Share2,
  Copy,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import { playClickSound, playSparkleSound, playPopSound } from "../utils/audio";

export default function DrawingBoard() {
  const {
    drawingModeEnabled,
    activeDrawingTool,
    activeDrawingColor,
    activeBrushSize,
    currentDrawingElements,
    savedDrawings,
    activeCategory,
    soundEnabled,
    setDrawingTool,
    setDrawingColor,
    setBrushSize,
    clearDrawing,
    saveCurrentDrawing,
    loadSavedDrawing,
    deleteSavedDrawing,
    setDrawingElements,
    showToast
  } = useStore();

  const [savingModalOpen, setSavingModalOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [artworkName, setArtworkName] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [capturedThumbnail, setCapturedThumbnail] = useState<string | undefined>(undefined);
  const [shareableLink, setShareableLink] = useState("");
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  if (!drawingModeEnabled || !activeCategory) return null;

  // Helper method to capture WebGL Canvas snapshot
  const captureCanvasSnapshot = (): string | undefined => {
    try {
      const canvasElement = document.getElementById("three-webgl-canvas") as HTMLCanvasElement | null;
      if (canvasElement) {
        return canvasElement.toDataURL("image/jpeg", 0.7);
      }
      const canvases = document.getElementsByTagName("canvas");
      if (canvases.length > 0) {
        return canvases[0].toDataURL("image/jpeg", 0.7);
      }
    } catch (error) {
      console.error("Error capturing 3D canvas snapshot:", error);
    }
    return undefined;
  };

  // Sound triggers
  const handleColorSelect = (color: string) => {
    setDrawingColor(color);
    playClickSound(soundEnabled);
  };

  const handleToolSelect = (tool: any) => {
    setDrawingTool(tool);
  };

  const handleClear = () => {
    if (currentDrawingElements.length === 0) return;
    setShowClearConfirm(true);
    playPopSound(soundEnabled);
  };

  const confirmClear = () => {
    clearDrawing();
    setShowClearConfirm(false);
  };

  const handleSaveClick = () => {
    if (currentDrawingElements.length === 0) return;
    
    // Process high-resolution snapshot capture
    const snapshot = captureCanvasSnapshot();
    setCapturedThumbnail(snapshot);

    setArtworkName(`Vùng đất màu sắc của bé #${Math.floor(Math.random() * 900) + 100}`);
    setSavingModalOpen(true);
    playClickSound(soundEnabled);
  };

  const handleSaveConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    saveCurrentDrawing(artworkName, capturedThumbnail);
    setSavingModalOpen(false);
  };

  const handleLoadDrawing = (id: string) => {
    loadSavedDrawing(id);
    setGalleryOpen(false);
  };

  const handleDeleteSaved = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteSavedDrawing(id);
  };

  const handleUndo = () => {
    if (currentDrawingElements.length === 0) return;
    playPopSound(soundEnabled);
    const nextElements = [...currentDrawingElements];
    nextElements.pop(); // remove last element
    setDrawingElements(nextElements);
  };

  const handleExportClick = () => {
    if (currentDrawingElements.length === 0) return;
    
    // Capture canvas snapshot for high resolution thumbnail
    const snapshot = captureCanvasSnapshot();
    setCapturedThumbnail(snapshot);
    
    // Encode the current active category & drawing elements into compressed safe Base64 URL format
    try {
      const packageObj = {
        category: activeCategory,
        elements: currentDrawingElements
      };
      const jsonStr = JSON.stringify(packageObj);
      const base64 = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      }));
      const link = window.location.origin + window.location.pathname + "?drawing=" + base64;
      setShareableLink(link);
    } catch (e) {
      console.error("Failed to generate share URL:", e);
    }
    
    setCopiedSuccess(false);
    setExportModalOpen(true);
    playClickSound(soundEnabled);
  };

  const handleDownloadImage = () => {
    if (!capturedThumbnail) return;
    try {
      const link = document.createElement("a");
      link.href = capturedThumbnail;
      link.download = `tranh-3D-tuyet-dep-cua-be-${activeCategory}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      playSparkleSound(soundEnabled);
      showToast(
        "Đã tải tranh về máy! 💾",
        "Bức tranh 3D siêu ngộ nghĩnh của bé đã tải xuống làm tệp hình ảnh thành công!",
        "🎨",
        "success"
      );
    } catch (e) {
      console.error("Failed to download image file:", e);
    }
  };

  const handleCopyLink = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareableLink);
        setCopiedSuccess(true);
        playSparkleSound(soundEnabled);
        showToast(
          "Đã copy link chia sẻ! 🔗",
          "Bé đã copy link thần kỳ thành công! Hãy gửi ngay cho bố mẹ để mọi người cùng xem nhé!",
          "✨",
          "success"
        );
      } else {
        const inputEl = document.getElementById("share-link-input") as HTMLInputElement | null;
        if (inputEl) {
          inputEl.select();
          document.execCommand("copy");
          setCopiedSuccess(true);
          playSparkleSound(soundEnabled);
          showToast(
            "Đã copy link chia sẻ! 🔗",
            "Bé đã copy link thần kỳ thành công! Hãy gửi ngay cho bố mẹ để mọi người cùng xem nhé!",
            "✨",
            "success"
          );
        }
      }
    } catch (err) {
      console.warn("Clipboard write failed: ", err);
      setCopiedSuccess(true);
    }
  };

  const handleCameraControl = (action: string) => {
    window.dispatchEvent(
      new CustomEvent("app-camera-control", { detail: { action } })
    );
    playClickSound(soundEnabled);
  };

  // Color options
  const colorPalette = [
    { name: "Đỏ", value: "#EF4444" },
    { name: "Cam", value: "#F97316" },
    { name: "Vàng", value: "#EAB308" },
    { name: "Xanh lá", value: "#10B981" },
    { name: "Xanh biển", value: "#3B82F6" },
    { name: "Hồng", value: "#EC4899" },
    { name: "Tím", value: "#8B5CF6" },
    { name: "Trắng", value: "#FFFFFF" },
    { name: "Bóng đêm", value: "#1E293B" }
  ];

  // Tool layouts
  const toolPresets = [
    { id: "orbit", label: "Xoay Góc Nhìn", emoji: "🎥", desc: "Giúp xoay camera ngắm tác phẩm" },
    { id: "free", label: "Nét Vẽ Tự Do", emoji: "✏️", desc: "Nối các chuỗi hạt lấp lánh" },
    { id: "cube", label: "Khối Lập Phương", emoji: "🟥", desc: "Xếp gạch gỗ màu sắc" },
    { id: "sphere", label: "Khối Cầu", emoji: "🟡", desc: "Bóng tròn nhảy nẩy" },
    { id: "cylinder", label: "Cột Trụ", emoji: "🟢", desc: "Lâu đài cột đứng" },
    { id: "cone", label: "Chóp Nhọn", emoji: "🔺", desc: "Kim tự tháp ma thuật" },
    { id: "star", label: "Ngôi Sao", emoji: "⭐️", desc: "Ngôi sao 3D tự quay" }
  ];

  const sizePresets = [
    { value: 0.15, label: "Nhỏ" },
    { value: 0.35, label: "Vừa" },
    { value: 0.60, label: "To" }
  ];

  const categoryName = 
    activeCategory === "garden" ? "🍎 Vườn Trái Cây" : 
    activeCategory === "pet" ? "🐶 Nhà Thú Cưng" : 
    activeCategory === "sea" ? "🐠 Đại Dương" : "🦁 Thú Hoang Dã";

  // Filter artworks corresponding only to this activeCategory
  const categorySavedDrawings = savedDrawings.filter(d => d.category === activeCategory);

  return (
    <>
      {/* MAIN FLOATING DRAWING BOARD INTERFACE CONTROLS */}
      <div id="drawing-board-panel" className="absolute top-4 right-4 z-20 w-80 max-h-[85vh] overflow-y-auto bg-white/95 backdrop-blur border-4 border-amber-400 rounded-3xl shadow-xl flex flex-col pointer-events-auto p-4 select-none animate-float" style={{ animationDuration: "12s" }}>
        
        {/* PANEL HEADER */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-amber-100 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            <div>
              <p className="text-xs font-black text-rose-500 uppercase tracking-widest leading-none">Vẽ & Sáng Tạo</p>
              <h2 className="text-sm font-black text-slate-800 leading-tight">Bảng Vẽ 3D Của Bé</h2>
            </div>
          </div>
          <p className="text-[10px] bg-slate-100 text-slate-600 font-black px-2 py-1 rounded-full uppercase">
            {categoryName}
          </p>
        </div>

        {/* 1. SECTOR MODE SELECTOR */}
        <div className="mb-4">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
            Bước 1: Chọn Chế Độ / Khối Hình
          </label>
          <div className="grid grid-cols-2 gap-2 text-left">
            {toolPresets.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolSelect(tool.id)}
                className={`flex items-center gap-1.5 p-2 rounded-2xl border-2 transition-all active:scale-95 text-xs font-bold leading-tight cursor-pointer ${
                  activeDrawingTool === tool.id
                    ? "bg-amber-405 border-amber-500 text-amber-950 shadow-[0_2px_0_#B45309]"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 shadow-[0_2px_0_#E2E8F0]"
                }`}
                style={activeDrawingTool === tool.id ? { backgroundColor: "#FDE68A" } : {}}
                title={tool.desc}
              >
                <span className="text-lg">{tool.emoji}</span>
                <span className="truncate">{tool.label}</span>
              </button>
            ))}
          </div>
          {activeDrawingTool === "orbit" && (
            <p className="mt-1.5 text-[10px] text-zinc-500 font-bold italic leading-none text-center">
              💡 Bé hãy giữ chuột và di chuyển để xoay đổi góc nhìn 3D nhé!
            </p>
          )}
          {activeDrawingTool !== "orbit" && (
            <p className="mt-1.5 text-[10px] text-zinc-550 font-bold italic leading-none text-center">
              ⚡ Nhấn giữ rê chuột để vẽ nét, hoặc bấm 1 click để đặt khối nhé!
            </p>
          )}
        </div>

        {/* CAMERA ADJUSTMENT & ZOOM CONTROLLER SYSTEM */}
        <div className="mb-4 bg-slate-50 border-2 border-slate-100 rounded-2xl p-2.5 shadow-sm">
          <label className="text-[10px] font-black uppercase text-amber-600 tracking-wider block mb-1.5 flex items-center justify-between">
            <span>🎥 Điều Chỉnh Góc Nhìn</span>
            <span className="text-slate-400 text-[9px] font-bold">Bé hãy trượt hoặc phóng to nhé!</span>
          </label>
          
          <div className="flex gap-3 items-center justify-center">
            {/* Zoom Controls */}
            <div className="flex flex-col gap-1 justify-center">
              <span className="text-[9px] font-black text-slate-400 uppercase text-center">Kính Lúp</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => handleCameraControl("zoom-in")}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-250 hover:bg-amber-50 hover:border-amber-300 flex items-center justify-center text-slate-705 active:scale-90 transition-all cursor-pointer shadow-xs"
                  title="Phóng to nhìn gần hơn"
                >
                  <ZoomIn className="w-4 h-4 stroke-[2.5] text-amber-500" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCameraControl("zoom-out")}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-250 hover:bg-amber-50 hover:border-amber-300 flex items-center justify-center text-slate-705 active:scale-90 transition-all cursor-pointer shadow-xs"
                  title="Thu nhỏ nhìn rộng hơn"
                >
                  <ZoomOut className="w-4 h-4 stroke-[2.5] text-amber-500" />
                </button>
              </div>
            </div>

            {/* Separator Line */}
            <div className="h-10 w-[2px] bg-slate-200" />

            {/* Pan Directional Controls (D-Pad arrangement) */}
            <div className="flex flex-col gap-1 justify-center items-center">
              <span className="text-[9px] font-black text-slate-400 uppercase text-center">Phím Trượt</span>
              <div className="grid grid-cols-3 gap-1 w-24">
                <div />
                <button
                  type="button"
                  onClick={() => handleCameraControl("pan-up")}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-250 hover:bg-indigo-50 hover:border-indigo-300 flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-xs"
                  title="Trượt lên trên"
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5] text-indigo-500" />
                </button>
                <div />
                
                <button
                  type="button"
                  onClick={() => handleCameraControl("pan-left")}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-250 hover:bg-indigo-50 hover:border-indigo-300 flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-xs"
                  title="Trượt sang trái"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[2.5] text-indigo-500" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCameraControl("reset")}
                  className="w-7 h-7 rounded-lg bg-indigo-50 border-2 border-indigo-200 hover:bg-indigo-100 flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-xs"
                  title="Đặt lại camera về ban đầu"
                >
                  <RotateCcw className="w-3.5 h-3.5 stroke-[3] text-indigo-600" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCameraControl("pan-right")}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-250 hover:bg-indigo-50 hover:border-indigo-300 flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-xs"
                  title="Trượt sang phải"
                >
                  <ArrowRight className="w-4 h-4 stroke-[2.5] text-indigo-500" />
                </button>
                
                <div />
                <button
                  type="button"
                  onClick={() => handleCameraControl("pan-down")}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-250 hover:bg-indigo-50 hover:border-indigo-300 flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-xs"
                  title="Trượt xuống dưới"
                >
                  <ArrowDown className="w-4 h-4 stroke-[2.5] text-indigo-500" />
                </button>
                <div />
              </div>
            </div>

          </div>
        </div>

        {/* 2. COLOR SWATCH PALETTE */}
        {activeDrawingTool !== "orbit" && (
          <div className="mb-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5 flex justify-between">
              <span>Bước 2: Chọn Màu Sắc Thần Tiên</span>
              <span className="text-slate-500 text-[9px]">Màu: {colorPalette.find(c => c.value === activeDrawingColor)?.name || ""}</span>
            </label>
            <div className="flex flex-wrap gap-2 justify-center">
              {colorPalette.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorSelect(color.value)}
                  className={`w-7 h-7 rounded-full border-2 transition-all transform hover:scale-115 cursor-pointer relative flex items-center justify-center ${
                    activeDrawingColor === color.value 
                      ? "border-pink-500 ring-2 ring-pink-300 scale-110 shadow-md" 
                      : "border-slate-300 hover:shadow-sm"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {activeDrawingColor === color.value && (
                    <Check 
                      className={`w-4 h-4 ${
                        color.value === "#FFFFFF" || color.value === "#EAB308" 
                          ? "text-slate-800" 
                          : "text-white"
                      } stroke-[4]`} 
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. BRUSH SIZE SELECTOR */}
        {activeDrawingTool !== "orbit" && (
          <div className="mb-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
              Bước 3: Chọn Kích Thước Khối Hình
            </label>
            <div className="flex bg-slate-50 border border-slate-200 rounded-2xl p-1 justify-between gap-1">
              {sizePresets.map((sz) => (
                <button
                  key={sz.value}
                  onClick={() => setBrushSize(sz.value)}
                  className={`flex-1 text-center py-1.5 px-3 rounded-xl font-black text-xs transition-all cursor-pointer ${
                    activeBrushSize === sz.value
                      ? "bg-amber-400 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span 
                      className="inline-block rounded-full bg-current" 
                      style={{ 
                        width: `${sz.value * 12 + 4}px`, 
                        height: `${sz.value * 12 + 4}px` 
                      }}
                    />
                    <span>{sz.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. ACTIONS HUB GRID */}
        <div className="border-t-2 border-slate-100 pt-3">
          <div className="flex items-center gap-2 text-xs font-black text-slate-400 mb-2 uppercase">
            <span>Thao Tác Bảng Vẽ</span>
            <span className="text-slate-500 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-md">
              Khối: {currentDrawingElements.length}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleUndo}
              disabled={currentDrawingElements.length === 0}
              className={`flex items-center justify-center gap-1 py-2 px-3 rounded-2xl border transition-all text-xs font-extrabold cursor-pointer h-10 ${
                currentDrawingElements.length === 0
                  ? "bg-slate-50 border-slate-150 text-slate-350 cursor-not-allowed opacity-50"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-rose-50 hover:border-rose-450 hover:text-rose-650"
              }`}
              title="Quay lại bước vẽ trước"
            >
              <Undo className="w-4 h-4" />
              <span>Quay Lại</span>
            </button>

            <button
              onClick={handleClear}
              disabled={currentDrawingElements.length === 0}
              className={`flex items-center justify-center gap-1 py-2 px-3 rounded-2xl border transition-all text-xs font-extrabold cursor-pointer h-10 ${
                currentDrawingElements.length === 0
                  ? "bg-slate-50 border-slate-150 text-slate-350 cursor-not-allowed opacity-50"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-red-50 hover:border-red-400 hover:text-red-650"
              }`}
              title="Xóa trắng bảng vẽ"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span>Dọn Dẹp</span>
            </button>

            <button
              onClick={handleSaveClick}
              disabled={currentDrawingElements.length === 0}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl border-2 transition-all active:scale-95 text-xs font-black cursor-pointer shadow-md h-10 ${
                currentDrawingElements.length === 0
                  ? "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-450 to-teal-550 border-emerald-400 text-white shadow-[0_3px_0_#059669] hover:brightness-105 active:shadow-none active:translate-y-0.5"
              }`}
              style={currentDrawingElements.length > 0 ? { backgroundColor: "#10B981" } : {}}
              title="Lưu tranh vẽ của bé"
            >
              <Download className="w-4 h-4 stroke-[3]" />
              <span>Lưu Lại</span>
            </button>

            <button
              onClick={() => { setGalleryOpen(true); playClickSound(soundEnabled); }}
              className="bg-white border-2 border-slate-350 text-slate-850 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-650 flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl transition-all active:scale-95 text-xs font-black shadow-[0_3px_0_#94A3B8] active:shadow-none active:translate-y-0.5 h-10 cursor-pointer"
              title="Bộ sưu tập tranh 3D"
            >
              <FolderOpen className="w-4 h-4 text-slate-500 stroke-[3]" />
              <span>Bộ Sưu Tập</span>
              {categorySavedDrawings.length > 0 && (
                <span className="inline-flex w-5 h-5 bg-indigo-500 text-white rounded-full items-center justify-center text-[10px] font-black">
                  {categorySavedDrawings.length}
                </span>
              )}
            </button>

            <button
              onClick={handleExportClick}
              disabled={currentDrawingElements.length === 0}
              className={`col-span-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border-2 transition-all active:scale-95 text-xs font-black cursor-pointer shadow-md h-11 mt-1 ${
                currentDrawingElements.length === 0
                  ? "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed opacity-70"
                  : "bg-gradient-to-r from-amber-500 to-rose-400 border-amber-400 text-white shadow-[0_3px_0_#D97706] hover:brightness-105 active:shadow-none active:translate-y-0.5"
              }`}
              style={currentDrawingElements.length > 0 ? { backgroundImage: "linear-gradient(to right, #F59E0B, #FB7185)" } : {}}
              title="Xuất tranh vẽ thành liên kết chia sẻ hoặc tải tệp ảnh nghệ thuật"
            >
              <Share2 className="w-4 h-4 stroke-[3] text-amber-100" />
              <span>Xuất Vẽ & Chia Sẻ Tranh ✨</span>
            </button>
          </div>
        </div>

        {/* 5. CUTE WARNING TO CONFIRM SWEEPMOBILE */}
        {showClearConfirm && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-2xl animate-bounce-slow text-center">
            <p className="text-xs text-red-700 font-bold mb-2">
              ⚠️ Bé có muốn xóa sạch toàn bộ hình đã vẽ không nào?
            </p>
            <div className="flex gap-2 justify-center">
              <button 
                onClick={confirmClear}
                className="bg-red-500 text-white text-xs font-black py-1 px-3 rounded-xl cursor-pointer hover:bg-red-600 shadow-sm active:scale-95 transition-all"
              >
                Đồng ý xóa! 🧹
              </button>
              <button 
                onClick={() => setShowClearConfirm(false)}
                className="bg-slate-200 text-slate-700 text-xs font-bold py-1 px-3 rounded-xl cursor-pointer hover:bg-slate-300 active:scale-95 transition-all"
              >
                Không hứa đâu
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- POPUP 1: SAVE ARTWORK NAME DIALOG MODAL --- */}
      {savingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 pointer-events-auto p-4 select-none animate-fade-in">
          <div className="bg-white rounded-3xl border-4 border-emerald-400 p-6 w-full max-w-sm shadow-2xl relative text-center">
            <button 
              onClick={() => setSavingModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 rounded-full flex items-center justify-center bg-slate-150 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-4xl inline-block mb-2">🏆</span>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Khoe Tác Phẩm Nào Mẹ!</h3>
            <p className="text-xs font-medium text-slate-500 mt-1 mb-2 leading-relaxed">
              Bé hãy đặt tên thật đáng yêu cho tác phẩm nghệ thuật 3D này nhé!
            </p>

            {capturedThumbnail && (
              <div id="captured-snapshot-preview" className="my-3 mx-auto w-48 h-32 rounded-2.5xl overflow-hidden border-4 border-amber-300 shadow-md animate-bounce-slow">
                <img src={capturedThumbnail} alt="Tác phẩm của bé" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}

            <form onSubmit={handleSaveConfirm} className="space-y-4">
              <input
                type="text"
                value={artworkName}
                onChange={(e) => setArtworkName(e.target.value)}
                maxLength={45}
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-250 font-bold text-center text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-250 outline-none transition-all placeholder:text-slate-350"
                placeholder="Đặt tên tranh mẫu..."
              />

              <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200/50 flex items-center gap-2 text-left mb-2">
                <span className="text-2xl animate-pulse">⭐️</span>
                <div>
                  <h4 className="text-xs font-black text-amber-700 leading-none mb-0.5">Thưởng Điểm Vẽ Sáng Tạo</h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                    Lưu tác phẩm giúp bé nhận thưởng <span className="font-extrabold text-[#FFAA00]">+10 Ngôi sao vàng</span> lấp lánh!
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setSavingModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-650 font-black py-3 rounded-2xl text-xs cursor-pointer shadow-md active:translate-y-0.5 active:shadow-none transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 rounded-2xl text-xs dark:bg-emerald-555 shadow-md active:translate-y-0.5 active:shadow-none transition-all border-b-4 border-emerald-700 hover:border-emerald-800"
                >
                  Đồng ý Lưu! ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- POPUP 2: SAVED GALLERY AND EXPLORATION --- */}
      {galleryOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 pointer-events-auto p-4 select-none animate-fade-in">
          <div className="bg-white rounded-[32px] border-4 border-indigo-500 p-6 w-full max-w-md shadow-2xl relative flex flex-col max-h-[85vh]">
            
            {/* CLOSE BUTTON */}
            <button 
              onClick={() => setGalleryOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* TITLE HEADER */}
            <div className="text-center pb-4 border-b-2 border-indigo-100 mb-4">
              <span className="text-4xl inline-block mb-1">🖼️</span>
              <h3 className="text-xl font-black text-indigo-700 tracking-tight leading-none mb-1">Triển Lãm Tranh Vẽ 3D</h3>
              <p className="text-xs font-bold text-slate-500 leading-normal">
                Nơi trưng bày các tác phẩm xuất sắc của bé tại vùng <span className="text-indigo-650 font-extrabold">{categoryName}</span>
              </p>
            </div>

            {/* ARTWORK LIST CONTAINER */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
              {categorySavedDrawings.length === 0 ? (
                <div className="text-center py-10 px-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center">
                  <p className="text-3xl mb-1">🧑‍🎨</p>
                  <p className="text-sm font-bold text-slate-700 mb-0.5">Phòng tranh đang trống!</p>
                  <p className="text-[11px] text-slate-400 font-semibold px-4 text-center">
                    Bé hãy tự vẽ tay các nét đầy màu sắc, xếp gạch khối rồi lưu lại để thưởng lãm ở đây nhé!
                  </p>
                </div>
              ) : (
                categorySavedDrawings.map((draw) => (
                  <div
                    key={draw.id}
                    onClick={() => handleLoadDrawing(draw.id)}
                    className="flex justify-between items-center p-3 bg-indigo-50/60 border-2 border-indigo-100 hover:bg-indigo-50 hover:border-indigo-300 rounded-2xl cursor-pointer transition-all active:scale-98 group shadow-sm"
                  >
                    <div className="text-left flex items-start gap-2.5 max-w-[75%]">
                      {draw.thumbnail ? (
                        <div className="w-16 h-12 rounded-xl overflow-hidden border-2 border-indigo-200 shrink-0 shadow-sm">
                          <img src={draw.thumbnail} alt={draw.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      ) : (
                        <div className="text-2xl mt-0.5 w-16 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0 border border-indigo-200">🖼️</div>
                      )}
                      <div className="truncate">
                        <h4 className="text-xs font-black text-slate-800 leading-snug truncate group-hover:text-indigo-650">
                          {draw.name}
                        </h4>
                        <p className="text-[10px] text-slate-450 font-bold flex items-center gap-1 mt-0.5 leading-none">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{draw.dateTime}</span>
                        </p>
                        <p className="text-[9px] text-indigo-505 font-bold uppercase mt-1 leading-none bg-indigo-100/60 px-1.5 py-0.5 rounded-md w-fit">
                          {draw.elements.length} khối ghép
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleDeleteSaved(e, draw.id)}
                        className="p-2 bg-rose-50 border border-rose-200 text-rose-500 hover:bg-rose-100 hover:text-rose-700 rounded-xl transition-all cursor-pointer"
                        title="Bỏ bức tranh này khỏi bảo tàng"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ARTWORK LIST GALLERY INSTRUCTIONS */}
            <div className="pt-3 border-t-2 border-slate-100 mt-4 text-center">
              <button
                onClick={() => setGalleryOpen(false)}
                className="w-full bg-indigo-550 hover:bg-indigo-650 text-white font-black py-3 rounded-2xl text-xs dark:bg-indigo-600 shadow-md active:translate-y-0.5"
                style={{ backgroundColor: "#4F46E5" }}
              >
                Trở Lại Sáng Tạo!
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- POPUP 3: EXPORT DRAWING MODAL DIALOG --- */}
      {exportModalOpen && (
        <div id="export-artwork-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 pointer-events-auto p-4 select-none animate-fade-in">
          <div className="bg-white rounded-3xl border-4 border-amber-400 p-6 w-full max-w-sm shadow-2xl relative text-center">
            
            {/* CLOSE BUTTON */}
            <button 
              onClick={() => setExportModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-4xl inline-block mb-1">✨</span>
            <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none mb-1">Xuất Bản & Chia Sẻ Tranh</h3>
            <p className="text-xs font-semibold text-slate-500 max-w-xs mx-auto leading-normal mb-3">
              Khoe ngay những sáng tạo 3D rực rỡ của bé với gia đình và bạn bè nào!
            </p>

            {/* SNAPSHOT WORK-PREVIEW */}
            {capturedThumbnail ? (
              <div className="my-4 mx-auto w-56 h-36 rounded-2.5xl overflow-hidden border-4 border-amber-300 shadow-md transform hover:scale-102 transition-transform">
                <img src={capturedThumbnail} alt="Tác phẩm 3D tuyệt đẹp" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ) : (
              <div className="my-4 mx-auto w-56 h-36 rounded-2.5xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center">
                <span className="text-sm font-bold text-slate-400">Không tìm thấy ảnh xem trước</span>
              </div>
            )}

            {/* DOWNLOAD AS IMAGE */}
            <div className="space-y-4 text-left">
              <div>
                <h4 className="text-xs font-black text-amber-600 tracking-wide uppercase mb-1.5 flex items-center gap-1">
                  <span>1. Tải ảnh tranh về máy</span>
                </h4>
                <button
                  onClick={handleDownloadImage}
                  disabled={!capturedThumbnail}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-black text-xs transition-all shadow-md active:translate-y-0.5 active:shadow-none cursor-pointer ${
                    !capturedThumbnail
                      ? "bg-slate-150 text-slate-400 border border-slate-200 cursor-not-allowed"
                      : "bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-700 hover:border-emerald-800 text-white"
                  }`}
                >
                  <Download className="w-4 h-4 stroke-[3]" />
                  <span>Tải ảnh tranh 3D của bé (.JPG)</span>
                </button>
              </div>

              {/* SHAREABLE LINK */}
              <div className="border-t border-slate-100 pt-3">
                <h4 className="text-xs font-black text-indigo-600 tracking-wide uppercase mb-1.5 flex items-center gap-1.5">
                  <span>2. Liên kết gửi tặng bố mẹ</span>
                </h4>
                
                <div className="flex gap-2">
                  <input
                    id="share-link-input"
                    type="text"
                    readOnly
                    value={shareableLink}
                    onClick={(e) => {
                      (e.target as HTMLInputElement).select();
                    }}
                    className="flex-1 bg-slate-50 border-2 border-slate-200 px-3 py-2.5 rounded-xl font-mono text-[9px] font-bold text-slate-600 focus:outline-none focus:border-indigo-400 cursor-pointer text-ellipsis overflow-hidden"
                    title="Nhấp để chọn toàn bộ liên kết"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md active:translate-y-0.5 active:shadow-none cursor-pointer h-10 ${
                      copiedSuccess
                        ? "bg-amber-400 text-amber-955 border-b-4 border-amber-600"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white border-b-4 border-indigo-800 hover:border-indigo-900"
                    }`}
                  >
                    {copiedSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Đã copy!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy link</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-normal font-semibold text-center italic">
                  💡 Bố mẹ khi nhấn vào link này sẽ trực tiếp thấy trọn vẹn bức tranh 3D lấp lánh do bé tự vẽ đấy!
                </p>
              </div>
            </div>

            {/* FOOTER ACTION */}
            <div className="pt-4 border-t border-slate-100 mt-4 flex gap-3">
              <button
                onClick={() => setExportModalOpen(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-650 font-black py-3 rounded-2xl text-xs cursor-pointer shadow-sm active:translate-y-0.5 transition-all text-center"
              >
                Trở Lại Vẽ Tranh! ✨
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
