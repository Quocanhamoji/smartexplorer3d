/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { useStore, VOCABULARY_DATA } from "../store";
import { VocabularyWord } from "../types";
import { Volume2, X, ChevronLeft, ChevronRight, Award, HelpCircle, CheckCircle, AlertTriangle, Mic, MicOff, Sparkles } from "lucide-react";
import { speakEnglish, speakSharedNarrative, playClickSound, playSparkleSound, playPopSound, playWrongSound, playWordSynthesizedSound } from "../utils/audio";
import gsap from "gsap";

export default function VocabularyCard() {
  const { 
    currentWord, 
    closeWordCard, 
    selectWord, 
    soundEnabled, 
    activeCategory, 
    challengeEnabled, 
    funModeEnabled, 
    narrativeModeEnabled,
    addStar,
    quizScore,
    incrementQuizScore,
    resetQuizScore,
    showToast
  } = useStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const speakerRef = useRef<HTMLButtonElement>(null);
  const quizGridRef = useRef<HTMLDivElement>(null);

  // local game configurations
  const [activeTab, setActiveTab] = useState<"learn" | "quiz" | "voiceQuiz">("learn");
  const [quizOptions, setQuizOptions] = useState<VocabularyWord[]>([]);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizSelectedId, setQuizSelectedId] = useState<string | null>(null);
  const [quizSuccess, setQuizSuccess] = useState<boolean | null>(null);

  // AI Pronunciation states
  const [aiVoiceMode, setAiVoiceMode] = useState<"standard" | "ai">("standard");
  const [isAiRecording, setIsAiRecording] = useState(false);
  const [aiAudioBlob, setAiAudioBlob] = useState<Blob | null>(null);
  const [aiScoreResult, setAiScoreResult] = useState<{ score: number; transcription: string; feedback: string } | null>(null);
  const [isAiEvaluating, setIsAiEvaluating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiCountdown, setAiCountdown] = useState<number>(3);

  // References for AI Recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const countdownIntervalRef = useRef<any>(null);

  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [voiceResult, setVoiceResult] = useState<string>("");
  const [voiceSuccess, setVoiceSuccess] = useState<boolean | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const currentWordRef = useRef(currentWord);

  useEffect(() => {
    currentWordRef.current = currentWord;
  }, [currentWord]);

  // Handle initialization of standard browser speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceResult("");
        setVoiceSuccess(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript || "";
        setVoiceResult(transcript);

        const currentTarget = currentWordRef.current;
        if (!currentTarget) return;

        // Lenient kid-friendly matching: clear punctuation and ignore case
        const cleanResult = transcript.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").trim();
        const targetWord = currentTarget.word.toLowerCase().trim();

        if (cleanResult === targetWord || cleanResult.includes(targetWord) || targetWord.includes(cleanResult)) {
          setVoiceSuccess(true);
          incrementQuizScore();
          playSparkleSound(soundEnabled);
          addStar(5); // Speak correct bonus star reward

          // GSAP score badge pop/glowing animation
          const badge = document.getElementById("voice-score-badge");
          if (badge) {
            gsap.timeline()
              .to(badge, { scale: 1.3, backgroundColor: "#f59e0b", color: "#ffffff", duration: 0.15, ease: "power2.out" })
              .to(badge, { scale: 0.95, duration: 0.1, ease: "power2.in" })
              .to(badge, { scale: 1.15, backgroundColor: "#fbbf24", duration: 0.12, ease: "power2.out" })
              .to(badge, { scale: 1, clearProps: "scale,backgroundColor,color", duration: 0.15, ease: "power2.inOut" });
          }
        } else {
          setVoiceSuccess(false);
          playWrongSound(soundEnabled);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition error", event);
        setIsListening(false);
        if (event.error === "not-allowed") {
          setVoiceResult("Bé ơi, hãy cho phép quyền mở micro để cùng nói chuyện nhé!");
        } else if (event.error === "no-speech") {
          setVoiceResult("Hình như bé chưa nói gì nè. Bé bấm chiếc mic và thử đọc lại rõ ràng hơn nhé!");
        } else {
          setVoiceResult(`Micro chưa nghe rõ: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [soundEnabled]);

  // Clear AI Coach status on tab change or word change
  useEffect(() => {
    // Reset AI Results on Word change
    setAiScoreResult(null);
    setAiError(null);
    setIsAiRecording(false);
    setIsAiEvaluating(false);
    
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [currentWord]);

  useEffect(() => {
    if (activeTab !== "voiceQuiz") {
      stopAiRecording();
      setAiScoreResult(null);
      setAiError(null);
    }
  }, [activeTab]);

  // AI Recording and Chấm điểm functions
  const startAiRecording = async () => {
    try {
      setAiError(null);
      setAiScoreResult(null);
      audioChunksRef.current = [];

      playClickSound(soundEnabled);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setAiError("Thiết bị hoặc trình duyệt này không hỗ trợ micro kìa bé ơi!");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      let mimeType = "audio/webm";
      if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4";
      } else if (MediaRecorder.isTypeSupported("audio/ogg")) {
        mimeType = "audio/ogg";
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setAiAudioBlob(audioBlob);
        await evaluateWithAi(audioBlob, mimeType);
      };

      recorder.start();
      setIsAiRecording(true);

      // Countdown of 4 seconds is ideal for toddlers to practice a word
      setAiCountdown(4);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = setInterval(() => {
        setAiCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            stopAiRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err: any) {
      console.error("Lỗi bắt đầu micro ghi âm AI:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setAiError("Bé yêu ơi, hãy nhấn nút CHO PHÉP (Allow) mở micro để Cô Giáo AI nghe giọng của bé nha!");
      } else {
        setAiError("Micro đang bận mất rồi, bé tải lại trang và thử lại xem sao nha!");
      }
    }
  };

  const stopAiRecording = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsAiRecording(false);
  };

  const evaluateWithAi = async (blob: Blob, mimeType: string) => {
    setIsAiEvaluating(true);
    try {
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const resultStr = reader.result as string;
          const base64 = resultStr.split(",")[1];
          resolve(base64);
        };
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(blob);
      });

      const response = await fetch("/api/pronunciation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          audio: base64String,
          mimeType: mimeType,
          word: currentWord.word
        })
      });

      if (!response.ok) {
        throw new Error("Máy chủ chấm điểm phát âm đang bận nị!");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAiScoreResult(data);

      if (data.score >= 70) {
        playSparkleSound(soundEnabled);
        addStar(10);
        showToast(`Cô Giáo AI khen bé xuất sắc!`, `Bé nhận được +10 Ngôi sao AI! ⭐`, "🎉", "milestone");
      } else {
        playClickSound(soundEnabled);
        addStar(3);
        showToast(`Bé đã hoàn thành bài tập đọc!`, `Ưu đãi +3 Ngôi sao tinh thần! ⭐`, "🦁", "star");
      }

    } catch (err: any) {
      console.error("Lỗi đánh giá AI:", err);
      setAiError(err.message || "Hệ thống AI bận tẹo, bé nhấn ghi âm rồi đọc lại nha!");
    } finally {
      setIsAiEvaluating(false);
    }
  };

  // Clean ambient voice recordings if tab changes
  useEffect(() => {
    if (activeTab !== "voiceQuiz") {
      if (isListening && recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setVoiceResult("");
      setVoiceSuccess(null);
    }
  }, [activeTab]);

  const startListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      return;
    }
    playClickSound(soundEnabled);
    try {
      recognitionRef.current.start();
    } catch (e) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
      setTimeout(() => {
        try {
          recognitionRef.current.start();
        } catch (x) {}
      }, 100);
    }
  };

  // Animate the card entry with a beautiful kids' style bounce using GSAP
  useEffect(() => {
    if (currentWord && cardRef.current) {
      // Scale bounce up
      gsap.fromTo(
        cardRef.current,
        { scale: 0.3, y: 150, opacity: 0, rotate: -5 },
        { 
          scale: 1, 
          y: 0, 
          opacity: 1, 
          rotate: 0,
          duration: 0.6, 
          ease: "elastic.out(1, 0.65)" 
        }
      );
    }
  }, [currentWord]);

  // Handle options generation when active tab switches to quiz, or when word changes
  const initQuiz = () => {
    if (!currentWord) return;
    
    // Automatically play word sound (or speak english) when starting the quiz
    if (funModeEnabled) {
      playWordSynthesizedSound(currentWord.id, soundEnabled);
    } else {
      speakEnglish(currentWord.word, soundEnabled);
    }

    // Filter list to find distractors (other words) from any category
    const otherWords = VOCABULARY_DATA.filter(w => w.id !== currentWord.id);
    const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random());
    const distractors = shuffledOthers.slice(0, 3);
    
    // Combine correct response and randomly chosen distractors, and shuffle them
    const options = [currentWord, ...distractors].sort(() => 0.5 - Math.random());
    setQuizOptions(options);
    setQuizAnswered(false);
    setQuizSelectedId(null);
    setQuizSuccess(null);
  };

  useEffect(() => {
    if (activeTab === "quiz" && currentWord) {
      initQuiz();
    }
  }, [currentWord, activeTab, funModeEnabled]);

  if (!currentWord) return null;

  // Speak word
  const handlePronounce = () => {
    if (narrativeModeEnabled) {
      speakSharedNarrative(currentWord.word, currentWord.meaning, currentWord.description || "", soundEnabled);
    } else {
      speakEnglish(currentWord.word, soundEnabled);
    }
    
    // Wave ripple effect on speaker button using GSAP
    if (speakerRef.current) {
      gsap.fromTo(
        speakerRef.current,
        { scale: 1 },
        { scale: 1.2, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.out" }
      );
    }
  };

  // Switch to next or previous word in the current category
  const getSiblings = () => {
    const categoryWords = VOCABULARY_DATA.filter(w => w.category === currentWord.category);
    const index = categoryWords.findIndex(w => w.id === currentWord.id);
    return {
      prev: categoryWords[index - 1] || categoryWords[categoryWords.length - 1],
      next: categoryWords[index + 1] || categoryWords[0]
    };
  };

  const traverseWord = (direction: "prev" | "next") => {
    const { prev, next } = getSiblings();
    const targetWord = direction === "prev" ? prev : next;
    playClickSound(soundEnabled);
    selectWord(targetWord);
    // Restart quiz screen if on quiz tab
    if (activeTab === "quiz") {
      setQuizAnswered(false);
      setQuizSelectedId(null);
      setQuizSuccess(null);
    } else if (activeTab === "voiceQuiz") {
      setVoiceResult("");
      setVoiceSuccess(null);
      if (isListening && recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    }
  };

  const handleSelectQuizOption = (option: VocabularyWord) => {
    if (quizAnswered || !currentWord) return;

    setQuizSelectedId(option.id);
    setQuizAnswered(true);

    if (option.id === currentWord.id) {
      setQuizSuccess(true);
      incrementQuizScore();
      playSparkleSound(soundEnabled);
      // Reward the child 3 bonus stars for answering the quiz correctly!
      addStar(3);

      // GSAP score badge pop/glowing animation
      const badge = document.getElementById("quiz-score-badge");
      if (badge) {
        gsap.timeline()
          .to(badge, { scale: 1.3, backgroundColor: "#f59e0b", color: "#ffffff", duration: 0.15, ease: "power2.out" })
          .to(badge, { scale: 0.95, duration: 0.1, ease: "power2.in" })
          .to(badge, { scale: 1.15, backgroundColor: "#fbbf24", duration: 0.12, ease: "power2.out" })
          .to(badge, { scale: 1, clearProps: "scale,backgroundColor,color", duration: 0.15, ease: "power2.inOut" });
      }

      // GSAP celebratory pop/scale-up effect
      const element = document.getElementById(`quiz-opt-${option.id}`);
      if (element) {
        gsap.timeline()
          .to(element, { scale: 1.15, duration: 0.15, ease: "power2.out" })
          .to(element, { scale: 0.95, duration: 0.1, ease: "power2.in" })
          .to(element, { scale: 1.08, duration: 0.15, ease: "power2.out" })
          .to(element, { scale: 1, duration: 0.15, ease: "power2.inOut" });
      }
    } else {
      setQuizSuccess(false);
      playWrongSound(soundEnabled);

      // GSAP container shake effect on incorrect answer
      if (quizGridRef.current) {
        gsap.fromTo(
          quizGridRef.current,
          { x: -8 },
          { x: 8, duration: 0.08, repeat: 5, yoyo: true, ease: "power1.inOut", onComplete: () => {
            gsap.set(quizGridRef.current, { x: 0 });
          }}
        );
      }

      // Also gently shake the incorrect answer button itself
      const incorrectElement = document.getElementById(`quiz-opt-${option.id}`);
      if (incorrectElement) {
        gsap.to(incorrectElement, {
          x: -4,
          repeat: 3,
          yoyo: true,
          duration: 0.05,
          ease: "power1.inOut",
          onComplete: () => {
            gsap.set(incorrectElement, { x: 0 });
          }
        });
      }
    }
  };

  return (
    <div className="absolute inset-x-0 bottom-6 z-30 flex justify-center px-4 pointer-events-none">
      <div 
        ref={cardRef}
        className="w-full max-w-xl bg-white rounded-[40px] shadow-[0_16px_0_#D1D5DB] pointer-events-auto flex flex-col relative border-4"
        style={{ borderColor: currentWord.color }}
      >
        {/* Background gradient hint */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none rounded-[36px]"
          style={{ backgroundColor: currentWord.color }}
        ></div>

        {/* TOP DECORATION HEADER */}
        <div className="flex justify-between items-center px-6 py-4 text-white rounded-t-[34px]" style={{ backgroundColor: currentWord.color }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentWord.emoji}</span>
            <span className="font-extrabold uppercase tracking-[0.2em] text-xs">Smart Discovery • Thẻ từ vựng</span>
          </div>
          {/* Close button */}
          <button 
            onClick={closeWordCard}
            className="px-3.5 py-1.5 bg-black/20 hover:bg-black/40 rounded-full transition-colors text-white text-xs font-black uppercase tracking-wider flex items-center gap-1 active:scale-90"
          >
            <X className="w-3.5 h-3.5" />
            <span>Đóng</span>
          </button>
        </div>

        {/* CUTE TABS LIST SWITCHER */}
        <div className="flex bg-slate-100 rounded-2xl p-1 mx-6 mt-5 border border-slate-200">
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              setActiveTab("learn");
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all cursor-pointer ${
              activeTab === "learn"
                ? "bg-white text-slate-800 shadow-md border-b-2 border-slate-200"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <span>📖 Học Từ</span>
          </button>
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              setActiveTab("quiz");
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all cursor-pointer ${
              activeTab === "quiz"
                ? "bg-white text-slate-800 shadow-md border-b-2 border-slate-200"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <span>🧠 Chọn Hình</span>
          </button>
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              setActiveTab("voiceQuiz");
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all cursor-pointer ${
              activeTab === "voiceQuiz"
                ? "bg-white text-slate-800 shadow-md border-b-2 border-slate-200"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <span>🎙️ Luyện Đọc</span>
          </button>
        </div>

        {/* MAIN BODY CONTAINER */}
        <div className="p-6 md:p-8 flex flex-col items-center text-center gap-4">
          
          {activeTab === "learn" ? (
            /* --- LEARN TAB CONTENT --- */
            <>
              {/* Main word display (Artistic Flair representation) */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full mt-1">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Vocabulary</span>
                  {challengeEnabled ? (
                    <div className="flex flex-col items-center sm:items-start">
                      <h1 className="text-4xl md:text-5xl font-black text-rose-500 bg-rose-50 border-4 border-dashed border-rose-300 px-5 py-1.5 rounded-2xl animate-pulse leading-none uppercase">
                        ❓❓❓
                      </h1>
                      <span className="text-[10px] text-rose-600 font-extrabold mt-1 uppercase tracking-wider">Thách thức: Đoán từ qua loa!</span>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-5xl md:text-6xl font-black text-[#333] tracking-tight uppercase leading-none">
                        {currentWord.word}
                      </h1>
                      <p className="text-lg font-bold text-slate-400 font-mono mt-1">
                        {currentWord.pronunciation}
                      </p>
                    </>
                  )}
                </div>
                
                {/* Massive Green/Custom Clay Tone Speaker Button */}
                <button 
                  ref={speakerRef}
                  onClick={handlePronounce}
                  className="w-20 h-20 flex-shrink-0 bg-[#68C950] border-4 border-white hover:brightness-110 rounded-full shadow-[0_8px_0_#4D9A3A] hover:shadow-[0_4px_0_#4D9A3A] hover:translate-y-1 active:shadow-none active:translate-y-2 transition-all flex items-center justify-center text-white relative group cursor-pointer"
                  title="Nghe phát âm"
                >
                  <span className="text-3xl animate-pulse">🔊</span>
                </button>
              </div>

              {/* Sweet visual decorative dots */}
              <div className="flex gap-2.5 my-1">
                <div className="w-3.5 h-3.5 rounded-full bg-[#68C950] animate-bounce-slow"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 animate-bounce-slow" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-3.5 h-3.5 rounded-full bg-rose-450 animate-bounce-slow" style={{ animationDelay: '0.3s' }}></div>
              </div>

              <div className="w-full h-px bg-slate-100"></div>

              {/* Meaning / Translation */}
              <div className="bg-amber-50 rounded-2xl p-4 w-full border-2 border-dashed border-amber-200">
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] block mb-1">Dịch nghĩa nghĩa tiếng Việt</span>
                <p className="text-2xl font-black text-amber-900 leading-none">
                  {currentWord.meaning}
                </p>
              </div>

              {/* Example Sentence & Fun Fact Section */}
              <div className="bg-blue-50/70 border-2 border-blue-100/60 px-5 py-4 rounded-3xl w-full text-left flex flex-col gap-3">
                <div>
                  <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-[0.15em] block mb-1">Mẫu câu vui nhộn & Ví dụ</span>
                  <p className="text-base font-extrabold text-indigo-950 italic">
                    "{challengeEnabled ? currentWord.example.replace(new RegExp(currentWord.word, "gi"), "____") : currentWord.example}"
                  </p>
                  <p className="text-sm font-bold text-slate-600 mt-1">
                    👉 {currentWord.translation}
                  </p>
                </div>
                {currentWord.description && (
                  <div className="mt-1 pt-3 border-t border-blue-100 flex flex-col gap-1.5">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.15em] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500 fill-indigo-200" />
                      Sự thật thú vị bé có biết?
                    </span>
                    <p className="text-[11px] font-bold text-indigo-900 leading-relaxed bg-indigo-100/40 rounded-2xl p-2.5 border border-indigo-100/40">
                      💡 {currentWord.description}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : activeTab === "quiz" ? (
            /* --- QUIZ TAB CONTENT --- */
            <div className="w-full flex flex-col items-center gap-3">
              
              {/* Target Word and Kids Scoreboard Frame */}
              <div className="bg-amber-50 rounded-3xl p-4 w-full border border-amber-250 shadow-sm flex flex-col items-center gap-2">
                <div className="flex justify-between items-center w-full pb-2 border-b border-amber-200/60 mb-1">
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.15em] flex items-center gap-1">
                    🧠 Đố vui từ vựng {funModeEnabled && " - Đoán Âm Thanh"}
                  </span>
                  
                  {/* Score Indicator */}
                  <div id="quiz-score-badge" className="flex items-center gap-1.5 bg-amber-400 text-amber-950 font-black text-xs px-3 py-1 rounded-full shadow-sm animate-pulse">
                    🏆 Điểm: {quizScore}
                  </div>
                </div>

                {/* Massive english word or audio sound waves */}
                <div className="py-2 flex flex-col items-center text-center w-full">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none block mb-1">
                    {funModeEnabled ? "Bé hãy nghe âm thanh này và đoán xem của ai nhé:" : "Bé hãy chỉ ra hình vẽ tương ứng của:"}
                  </span>
                  
                  {funModeEnabled ? (
                    <div 
                      onClick={() => playWordSynthesizedSound(currentWord.id, soundEnabled)}
                      className="my-3 w-20 h-20 bg-amber-100 hover:bg-amber-200 border-4 border-amber-250 text-amber-600 flex flex-col items-center justify-center rounded-full animate-bounce-slow cursor-pointer shadow-md active:scale-95 transition-all text-3xl select-none"
                      title="Bấm để phát âm thanh"
                    >
                      🗣️
                    </div>
                  ) : (
                    <>
                      <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase leading-tight mt-1 mb-0">
                        "{currentWord.word}"
                      </p>
                      <p className="text-xs font-bold font-mono text-zinc-500 mt-0.5 mb-2">
                        /{currentWord.pronunciation}/
                      </p>
                    </>
                  )}
                </div>

                {/* Play prompt button */}
                <div className="flex items-center justify-center gap-3">
                  <button 
                    onClick={funModeEnabled ? () => playWordSynthesizedSound(currentWord.id, soundEnabled) : handlePronounce}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 active:scale-95 text-white font-black py-1.5 px-4 rounded-full text-xs shadow-[0_3px_0_#D97706] active:shadow-none active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <span>{funModeEnabled ? "🔊 Phát Lại Âm Thanh" : "🔊 Nghe phát âm"}</span>
                  </button>
                  
                  {/* Hint answer if needed or reset option */}
                  <button
                    onClick={() => {
                      playClickSound(soundEnabled);
                      resetQuizScore();
                    }}
                    className="text-[10px] text-amber-600 hover:text-amber-800 underline font-extrabold tracking-wide cursor-pointer"
                  >
                    Nhấn Chơi Lại Từ Đầu
                  </button>
                </div>
              </div>

              {/* Grid 2x2 of cute graphic options */}
              <div ref={quizGridRef} className="grid grid-cols-2 gap-3.5 w-full mt-1">
                {quizOptions.map((option) => {
                  const isSelected = quizSelectedId === option.id;
                  const isCorrect = option.id === currentWord.id;
                  
                  let btnStyle = "bg-white border-4 border-slate-200 hover:border-amber-300 shadow-[0_6px_0_#E2E8F0] hover:bg-slate-50/50";
                  if (quizAnswered) {
                    if (isCorrect) {
                       btnStyle = "bg-emerald-50 border-4 border-emerald-400 text-emerald-705 shadow-[0_6px_0_#10B981]";
                    } else if (isSelected && !isCorrect) {
                       btnStyle = "bg-rose-50 border-4 border-rose-400 text-rose-705 shadow-[0_6px_0_#F43F5E]";
                    } else {
                       btnStyle = "bg-slate-50 border-4 border-slate-100 text-slate-300 opacity-50";
                    }
                  }

                  return (
                    <button
                      id={`quiz-opt-${option.id}`}
                      key={option.id}
                      disabled={quizAnswered}
                      onClick={() => handleSelectQuizOption(option)}
                      className={`h-24 md:h-28 rounded-3xl flex flex-col items-center justify-center transition-all ${
                        !quizAnswered ? "hover:scale-102 active:scale-95 cursor-pointer" : ""
                      } ${btnStyle}`}
                    >
                      <span className="text-4xl md:text-5xl">{option.emoji}</span>
                      
                      {/* Show text translation under emoji correct identification */}
                      {quizAnswered && (
                        <span className="text-[10px] font-black uppercase mt-1 text-slate-600">
                          {option.word} ({option.meaning})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Reward Feedback alert container */}
              {quizAnswered && (
                <div className={`flex items-center gap-3 p-4 rounded-2xl w-full text-left border-2 mt-1 ${
                  quizSuccess 
                    ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                    : "bg-rose-50 border-rose-150 text-rose-800"
                }`}>
                  {quizSuccess ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-emerald-500 flex-shrink-0 animate-bounce" />
                      <div>
                        <p className="text-sm font-black uppercase leading-none">Chính xác! Bé xuất sắc! 🎉</p>
                        <p className="text-xs font-bold text-emerald-600 mt-1">Bé đã được nhận ngay +3 Ngôi sao may mắn! ⭐</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-8 h-8 text-rose-500 flex-shrink-0 animate-pulse" />
                      <div className="flex-1">
                        <p className="text-sm font-black uppercase leading-none">Chưa chính xác rồi bé yêu! ✨</p>
                        <p className="text-xs font-bold text-rose-600 mt-1">Hãy bấm "Thử Lại" hoặc click nghe âm thanh phát âm lại nhé!</p>
                      </div>
                      <button
                        onClick={() => {
                          playClickSound(soundEnabled);
                          setQuizAnswered(false);
                          setQuizSelectedId(null);
                          setQuizSuccess(null);
                        }}
                        className="bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer flex-shrink-0"
                      >
                        Thử Lại
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* --- VOICE QUIZ TAB CONTENT --- */
            <div className="w-full flex flex-col items-center gap-3">
              
              {/* CUTE TABS LIST TO SELECT STANDARD VS AI VOICE REC */}
              <div className="flex bg-slate-100 rounded-xl p-0.5 w-full max-w-[320px] border border-slate-200 mb-1">
                <button
                  onClick={() => {
                    playClickSound(soundEnabled);
                    setAiVoiceMode("standard");
                    stopAiRecording();
                  }}
                  className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    aiVoiceMode === "standard"
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  ⚡ Luyện Nói Nhanh
                </button>
                <button
                  onClick={() => {
                    playClickSound(soundEnabled);
                    setAiVoiceMode("ai");
                    if (isListening && recognitionRef.current) {
                      recognitionRef.current.stop();
                    }
                  }}
                  className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    aiVoiceMode === "ai"
                      ? "bg-indigo-600 text-white shadow-sm font-extrabold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" />
                  🤖 AI Coach Sửa Giọng
                </button>
              </div>

              {aiVoiceMode === "standard" ? (
                /* --- STANDARD MODE (FAST CLIENT SPEECH RECOGNITION) --- */
                <div className="w-full flex flex-col items-center gap-3">
                  {/* Voice quiz scoreboard and header */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-4 w-full border border-indigo-150 shadow-sm flex flex-col items-center gap-2">
                    <div className="flex justify-between items-center w-full pb-2 border-b border-indigo-200/60 mb-1">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.15em] flex items-center gap-1">
                        🎙️ Bé tập đọc tiếng Anh
                      </span>
                      
                      {/* Score Indicator */}
                      <div id="voice-score-badge" className="flex items-center gap-1.5 bg-indigo-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-sm animate-pulse">
                        🏆 Điểm: {quizScore}
                      </div>
                    </div>

                    {/* Target Emoji */}
                    <div className="text-7xl my-1 animate-bounce-slow" style={{ animationDuration: "3s" }}>
                      {currentWord.emoji}
                    </div>

                    {/* Massive word display to speak */}
                    <div className="pb-1 flex flex-col items-center text-center">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">Bé hãy nói từ này thật to nhé:</span>
                      <p className="text-4xl md:text-5xl font-black text-indigo-950 tracking-tight uppercase leading-tight mt-1 mb-0">
                        "{currentWord.word}"
                      </p>
                      <p className="text-xs font-bold font-mono text-zinc-500 mt-0.5">
                        /{currentWord.pronunciation}/ • {currentWord.meaning}
                      </p>
                    </div>

                    {/* Listen reference button */}
                    <button 
                      onClick={handlePronounce}
                      className="flex items-center gap-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-black py-1 px-3 rounded-full text-[10px] transition-all cursor-pointer"
                    >
                      <span>🔊 Nghe mẫu phát âm</span>
                    </button>
                  </div>

                  {/* Speech recognition trigger/status box */}
                  <div className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-5 flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden">
                    {!speechSupported ? (
                      <div className="flex flex-col items-center text-center p-2 text-rose-600">
                        <MicOff className="w-10 h-10 mb-2 stroke-[2.5]" />
                        <p className="text-sm font-black uppercase">Không hỗ trợ Micro</p>
                        <p className="text-[11px] font-bold text-slate-500 mt-1 max-w-xs leading-normal">
                          Thiết bị hoặc trình duyệt của bé chưa bật quyền micro, hoặc không hỗ trợ nhận diện giọng nói. Bé thử dùng Google Chrome nhé!
                        </p>
                      </div>
                    ) : isListening ? (
                      <div className="flex flex-col items-center justify-center text-center">
                        {/* Glowing microphone recording circle with soft tailwind ring animation */}
                        <button
                          onClick={() => {
                            if (recognitionRef.current) recognitionRef.current.stop();
                          }}
                          className="w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center animate-pulse shadow-[0_0_0_12px_rgba(239,68,68,0.2)] hover:scale-105 cursor-pointer relative"
                        >
                          <Mic className="w-8 h-8 text-white animate-bounce stroke-[2.5]" />
                        </button>
                        
                        <p className="text-sm font-black text-rose-600 mt-4 uppercase tracking-wider animate-pulse">
                          🎧 Đang lắng nghe bé nói...
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                          Bé hãy đọc to từ bằng tiếng Anh nha! (Nhấp nút đỏ để dừng)
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center justify-center text-slate-700">
                        <button
                          onClick={startListening}
                          className="w-16 h-16 rounded-full bg-indigo-600 hover:brightness-110 text-white flex items-center justify-center shadow-[0_5px_0_#4338CA] hover:shadow-[0_2px_0_#4338CA] hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                        >
                          <Mic className="w-8 h-8 text-white stroke-[2.5]" />
                        </button>
                        
                        <p className="text-sm font-black text-indigo-950 mt-4 uppercase tracking-tight">
                          Nhấn chiếc mic để bắt đầu
                        </p>
                        <p className="text-[10px] font-bold text-slate-550 mt-0.5 max-w-xs leading-normal">
                          Bấm míc, đồng ý cho phép trình duyệt mở micro khi nhận được thông báo, rồi đọc to từ nhé!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Feedback responses based on matching */}
                  {voiceResult && (
                    <div className={`w-full p-4 rounded-2xl border-2 text-left flex items-start gap-4 transition-all duration-300 ${
                      voiceSuccess === true
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                        : voiceSuccess === false
                        ? "bg-rose-50 border-rose-250 text-rose-900"
                        : "bg-amber-50 border-amber-250 text-amber-900"
                    }`}>
                      {voiceSuccess === true ? (
                        <>
                          <Sparkles className="w-7 h-7 text-emerald-500 flex-shrink-0 animate-bounce mt-0.5" />
                          <div className="flex-1 text-slate-800 leading-normal">
                            <p className="text-xs font-black uppercase text-slate-400 tracking-wider">Bé phát âm xuất sắc!</p>
                            <p className="text-lg font-black text-emerald-800 leading-tight">
                              " {voiceResult} "
                            </p>
                            <p className="text-[11px] font-bold text-emerald-600 mt-1">
                              🎉 Quá chính xác! Bé được nhận ngay <b>+5 ngôi sao may mắn!</b> ⭐⭐⭐⭐⭐
                            </p>
                          </div>
                        </>
                      ) : voiceSuccess === false ? (
                        <>
                          <AlertTriangle className="w-7 h-7 text-rose-500 flex-shrink-0 animate-pulse mt-0.5" />
                          <div className="flex-1 text-slate-850 leading-normal">
                            <p className="text-xs font-black uppercase text-slate-400 tracking-wider">Nghe chưa rõ lắm</p>
                            <p className="text-lg font-black text-rose-800 leading-tight border-b border-rose-250/20 pb-1 mb-1">
                              " {voiceResult} "
                            </p>
                            <p className="text-[11px] font-bold text-rose-600">
                              Bé bấm míc đọc lại thật chậm rãi, rõ ràng nhé! ✨
                            </p>
                          </div>
                          <button
                            onClick={startListening}
                            className="bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer flex-shrink-0 self-center"
                          >
                            Đọc Lại
                          </button>
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5 text-amber-500 flex-shrink-0 animate-pulse mt-0.5" />
                          <div className="flex-1 text-slate-800 text-xs font-bold leading-normal">
                            {voiceResult}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* --- AI MODE (DEEP VOICE ANALYSIS BY GEMINI COACH) --- */
                <div className="w-full flex flex-col items-center gap-3">
                  {/* AI Word banner card */}
                  <div className="bg-gradient-to-r from-purple-100 to-indigo-50 rounded-3xl p-4 w-full border border-purple-205 shadow-sm flex flex-col items-center gap-2">
                    <div className="flex justify-between items-center w-full pb-2 border-b border-purple-200/60 mb-1">
                      <span className="text-[10px] font-black text-purple-600 uppercase tracking-[0.12em] flex items-center gap-1 select-none">
                        <Sparkles className="w-3 h-3 text-purple-500 fill-purple-300 animate-pulse" />
                        AI Pronunciation Coach • Sửa Giọng Tỉ Mỉ
                      </span>
                      
                      {/* Glow indicator label */}
                      <span className="bg-purple-600 text-white font-black text-[9px] px-2.5 py-0.5 rounded-full shadow-sm">
                        ⭐ NHẬN +10 ★
                      </span>
                    </div>

                    {/* Target Emoji */}
                    <div className="text-7xl my-1 animate-bounce-slow" style={{ animationDuration: "4.s" }}>
                      {currentWord.emoji}
                    </div>

                    {/* Target word information */}
                    <div className="pb-1 flex flex-col items-center text-center">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">Bé hãy nói từ sau để AI nhận xét:</span>
                      <p className="text-4xl md:text-5xl font-black text-purple-950 tracking-tight uppercase leading-tight mt-1 mb-0">
                        "{currentWord.word}"
                      </p>
                      <p className="text-xs font-bold font-mono text-indigo-550 mt-0.5">
                        /{currentWord.pronunciation}/ • {currentWord.meaning}
                      </p>
                    </div>

                    {/* Replay sample button */}
                    <button 
                      onClick={handlePronounce}
                      className="flex items-center gap-1 bg-purple-150 hover:bg-purple-250 text-indigo-700 font-black py-1 px-3 rounded-full text-[10px] transition-all cursor-pointer"
                    >
                      <span>🔊 Nghe giọng gốc mẫu</span>
                    </button>
                  </div>

                  {/* AI Recording triggering box */}
                  <div className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-5 flex flex-col items-center justify-center min-h-[145px] relative overflow-hidden">
                    {isAiRecording ? (
                      <div className="flex flex-col items-center justify-center text-center w-full">
                        {/* Audio wave waves using small dots layout */}
                        <div className="flex justify-center items-end gap-1.5 mb-4 h-10 w-full">
                          <span className="w-2 bg-purple-500 rounded-full animate-pulse h-6"></span>
                          <span className="w-2 bg-pink-500 rounded-full animate-pulse h-10" style={{ animationDelay: "0.15s" }}></span>
                          <span className="w-2 bg-indigo-500 rounded-full animate-pulse h-4" style={{ animationDelay: "0.3s" }}></span>
                          <span className="w-2 bg-purple-400 rounded-full animate-pulse h-8" style={{ animationDelay: "0.1s" }}></span>
                          <span className="w-2 bg-indigo-400 rounded-full animate-pulse h-5" style={{ animationDelay: "0.2s" }}></span>
                        </div>

                        <p className="text-base font-black text-purple-700 uppercase tracking-wider animate-pulse">
                          🎤 Bé hãy đọc "{currentWord.word}" đi nào!
                        </p>
                        <p className="text-xs font-bold text-slate-500 mt-1">
                          Cô Giáo đang nghe âm thanh... còn <b className="text-rose-500 text-lg animate-pulse">{aiCountdown}</b> giây!
                        </p>
                      </div>
                    ) : isAiEvaluating ? (
                      <div className="flex flex-col items-center justify-center text-center py-4">
                        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-black text-purple-700 uppercase tracking-wider animate-pulse">
                          🦖 Đang kết nối AI đánh giá giọng bé...
                        </p>
                        <p className="text-[10px] font-semibold text-slate-400 mt-1 max-w-xs leading-normal">
                          Hãy chờ chú chim AI bay về báo kết quả phát âm của bé nhé!
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center justify-center text-slate-700">
                        <button
                          onClick={startAiRecording}
                          className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 hover:brightness-110 text-white flex items-center justify-center shadow-[0_5px_0_#4C1D95] hover:shadow-[0_2px_0_#4C1D95] hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all cursor-pointer group"
                        >
                          <Mic className="w-8 h-8 text-white stroke-[2.5] group-hover:scale-110 transition-transform" />
                        </button>
                        
                        <p className="text-sm font-black text-purple-950 mt-4 uppercase tracking-tight">
                          Độc Quyền AI: Bắt đầu sữa giọng
                        </p>
                        <p className="text-[10px] font-bold text-slate-500 mt-1 max-w-sm leading-normal">
                          Bấm micro, đồng ý bật quyền ghi âm, sau đó đọc to từ. Gemini AI sẽ chấm điểm và hướng dẫn bé cụ thể bằng tiếng Việt!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* AI Error display */}
                  {aiError && (
                    <div className="w-full p-4 rounded-2xl border-2 border-red-200 bg-red-50 text-red-800 text-left flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 animate-pulse" />
                      <div className="flex-1 text-slate-800">
                        <p className="text-xs font-black uppercase text-red-700 tracking-wider">Lỗi ghi âm hoặc kết nối</p>
                        <p className="text-xs font-bold leading-relaxed">{aiError}</p>
                        <button
                          onClick={() => {
                            setAiError(null);
                            setIsAiRecording(false);
                            setIsAiEvaluating(false);
                          }}
                          className="mt-1.5 text-[10px] text-purple-600 font-extrabold underline cursor-pointer hover:text-purple-800"
                        >
                          Chơi lại tẹo
                        </button>
                      </div>
                    </div>
                  )}

                  {/* AI Evaluation results rendering */}
                  {aiScoreResult && (
                    <div className="w-full flex flex-col gap-3 transition-all duration-300">
                      <div className="bg-amber-50/70 border border-amber-200/50 rounded-3xl p-5 flex flex-col items-center sm:flex-row sm:items-start gap-4 text-left">
                        {/* Cutest radial circular score display */}
                        <div className="flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 border-4 border-white shadow-lg text-amber-955 select-none animate-bounce-slow">
                          <span className="text-[10px] font-black tracking-widest uppercase leading-none text-amber-900/50">ĐIỂM</span>
                          <span className="text-3xl font-black leading-none my-0.5">{aiScoreResult.score}</span>
                          <span className="text-[9px] font-bold leading-none text-amber-900/70">/ 100</span>
                        </div>

                        <div className="flex-1">
                          <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider block">Giọng bé vừa đọc siêu tài:</span>
                          <p className="text-xl font-black text-rose-500 leading-tight">
                            "{aiScoreResult.transcription || "Âm thanh nhỏ"}"
                          </p>

                          <div className="w-full h-px bg-yellow-200/50 my-2"></div>

                          <span className="text-[10px] font-black uppercase text-purple-600 tracking-wider block">Cô Giáo AI gửi lời khuyên:</span>
                          <p className="text-[12px] font-bold text-slate-700 leading-relaxed bg-purple-100/30 border border-purple-100/40 p-3 rounded-2xl mt-1 whitespace-pre-wrap italic">
                            {aiScoreResult.feedback}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* Swipe/Navigator Controls */}
          <div className="flex justify-between items-center w-full mt-2 pt-2 border-t border-slate-150">
            <button
              onClick={() => traverseWord("prev")}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-90"
            >
              <ChevronLeft className="w-4 h-4 stroke-[3]" />
              Trước
            </button>

            <div className="hidden sm:flex items-center gap-1.5 bg-yellow-105 px-3.5 py-1.5 rounded-2xl text-yellow-905 text-[10px] font-black shadow-[0_3px_0_#FEF3C7]">
              <Award className="w-3.5 h-3.5 fill-yellow-400 stroke-yellow-700" />
              <span>
                {activeTab === "learn"
                  ? "Bé học từ: click loa để nghe phát âm"
                  : activeTab === "quiz"
                  ? "Trắc nghiệm chọn hình: đúng +3 ★"
                  : "Luyện đọc phát âm: đúng +5 ★"}
              </span>
            </div>

            <button
              onClick={() => traverseWord("next")}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-90"
            >
              Tiếp
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
