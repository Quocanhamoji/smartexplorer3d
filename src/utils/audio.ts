/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Sound effects generated synthesized via Web Audio API to prevent CORS or network failures.
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    // Standard AudioContext initialization
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playPopSound = (enabled: boolean) => {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Pitch sweep for a cute pop/bubble sound
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);

  gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.12);
};

export const playWrongSound = (enabled: boolean) => {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Cute slide-down "aww" pitch sweep for a gentle incorrect feedback
  osc.type = "triangle";
  osc.frequency.setValueAtTime(250, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.35);

  gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.38);
};

export const playSparkleSound = (enabled: boolean) => {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const time = ctx.currentTime;
  
  // Create a magical two-tone chime (arpeggio)
  const notes = [587.33, 880.00, 1174.66]; // D5, A5, D6 (magical open scale)
  
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, time + i * 0.08);
    
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.08, time + i * 0.08 + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + i * 0.08 + 0.4);
    
    osc.start(time + i * 0.08);
    osc.stop(time + i * 0.08 + 0.45);
  });
};

export const playClickSound = (enabled: boolean) => {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.type = "sine";
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.setValueAtTime(300, ctx.currentTime + 0.02);

  gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.05);
};

export const playWordSynthesizedSound = (wordId: string, enabled: boolean) => {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const time = ctx.currentTime;

  switch (wordId) {
    case "apple": {
      // Crisp crunches
      for (let i = 0; i < 2; i++) {
        const crunchTime = time + i * 0.22;
        const bufferSize = ctx.sampleRate * 0.1;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) {
          data[j] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1200, crunchTime);
        filter.Q.setValueAtTime(10, crunchTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.06, crunchTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, crunchTime + 0.08);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        noise.start(crunchTime);
        noise.stop(crunchTime + 0.1);
      }
      break;
    }
    case "orange": {
      // Rapid splish-splash bubble drips
      for (let i = 0; i < 4; i++) {
        const t = time + i * 0.07;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(700 + i * 120, t);
        osc.frequency.exponentialRampToValueAtTime(350, t + 0.07);

        gainNode.gain.setValueAtTime(0.06, t);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.07);
      }
      break;
    }
    case "banana": {
      // Peeling slip-slide whistle sweep
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(280, time);
      osc.frequency.linearRampToValueAtTime(600, time + 0.32);

      gainNode.gain.setValueAtTime(0.1, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.35);
      break;
    }
    case "grapes": {
      // Plucky grapes popped one by one
      for (let i = 0; i < 3; i++) {
        const t = time + i * 0.1;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(350 + i * 80, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.06);

        gainNode.gain.setValueAtTime(0.08, t);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.07);
      }
      break;
    }
    case "strawberry": {
      // Dreamy glockenspiel bell melody
      const frequencies = [880, 1046.5, 1318.5];
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, time + idx * 0.05);

        gainNode.gain.setValueAtTime(0.06, time + idx * 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + idx * 0.05 + 0.22);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(time + idx * 0.05);
        osc.stop(time + idx * 0.05 + 0.23);
      });
      break;
    }
    case "cat": {
      // Cute kitten "Meow!"
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(450, time);
      osc.frequency.linearRampToValueAtTime(750, time + 0.15);
      osc.frequency.exponentialRampToValueAtTime(320, time + 0.55);

      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(0.12, time + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.55);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.55);
      break;
    }
    case "dog": {
      // Short and punchy puppy "Woof! Woof!"
      const makeWoof = (t: number) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gainNode = ctx.createGain();
        
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.12);
        
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(300, t);
        
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        gainNode.gain.setValueAtTime(0.15, t);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.start(t);
        osc.stop(t + 0.13);
      };
      makeWoof(time);
      makeWoof(time + 0.2);
      break;
    }
    case "rabbit": {
      // Rabbit hop bounces
      for (let i = 0; i < 2; i++) {
        const t = time + i * 0.22;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(160, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.1);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.18);

        gainNode.gain.setValueAtTime(0.12, t);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.18);
      }
      break;
    }
    case "bear": {
      // Bear roar / growl
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gainNode = ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(75, time);
      osc.frequency.linearRampToValueAtTime(40, time + 0.6);
      
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(70, time);
      osc2.frequency.linearRampToValueAtTime(35, time + 0.6);
      
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(160, time);
      
      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      gainNode.gain.setValueAtTime(0.12, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.6);
      
      osc.start(time);
      osc2.start(time);
      osc.stop(time + 0.6);
      osc2.stop(time + 0.65);
      break;
    }
    case "pig": {
      // Buzzy piggy "Oink! Oink!"
      const makeOink = (t: number) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gainNode = ctx.createGain();
        
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(90, t);
        osc.frequency.linearRampToValueAtTime(110, t + 0.1);
        
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(500, t);
        filter.Q.setValueAtTime(4, t);
        
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        gainNode.gain.setValueAtTime(0.12, t);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
        
        osc.start(t);
        osc.stop(t + 0.12);
      };
      makeOink(time);
      makeOink(time + 0.16);
      break;
    }
    case "fish": {
      // Rapid bubbly pops
      for (let i = 0; i < 4; i++) {
        const t = time + i * 0.12;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(250, t);
        osc.frequency.exponentialRampToValueAtTime(1000, t + 0.06);

        gainNode.gain.setValueAtTime(0.1, t);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.06);
      }
      break;
    }
    case "crab": {
      // Crab clicks
      for (let i = 0; i < 5; i++) {
        const t = time + i * 0.08;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(1800, t);

        gainNode.gain.setValueAtTime(0.1, t);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.026);
      }
      break;
    }
    case "starfish": {
      // Dreamy star shine scale
      const notes = [659.25, 783.99, 987.77, 1318.51];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, time + i * 0.05);

        gainNode.gain.setValueAtTime(0.06, time + i * 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + i * 0.05 + 0.3);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(time + i * 0.05);
        osc.stop(time + i * 0.05 + 0.31);
      });
      break;
    }
    case "whale": {
      // Beautiful whale call/singing
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(380, time);
      osc.frequency.linearRampToValueAtTime(520, time + 0.4);
      osc.frequency.exponentialRampToValueAtTime(320, time + 1.1);
      
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(0.1, time + 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 1.155);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(time);
      osc.stop(time + 1.16);
      break;
    }
    case "octopus": {
      // Wobbly water swish-splash
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gainNode = ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(75, time);
      
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 14;
      lfoGain.gain.value = 220;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(320, time);
      filter.Q.value = 5;
      
      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(0.1, time + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.45);
      
      lfo.start(time);
      osc.start(time);
      lfo.stop(time + 0.45);
      osc.stop(time + 0.45);
      break;
    }
    case "lion": {
      // Lion roar
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gainNode = ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(85, time);
      osc.frequency.linearRampToValueAtTime(45, time + 0.65);
      
      osc2.type = "sawtooth";
      osc2.frequency.setValueAtTime(90, time);
      osc2.frequency.linearRampToValueAtTime(40, time + 0.65);
      
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(180, time);
      
      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      gainNode.gain.setValueAtTime(0.01, time);
      gainNode.gain.linearRampToValueAtTime(0.16, time + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.65);
      
      osc.start(time);
      osc2.start(time);
      osc.stop(time + 0.65);
      osc2.stop(time + 0.65);
      break;
    }
    case "elephant": {
      // Trumpeting elephant
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gainNode = ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(480, time);
      osc.frequency.exponentialRampToValueAtTime(220, time + 0.55);
      
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 32;
      lfoGain.gain.value = 45;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      
      filter.type = "highpass";
      filter.frequency.setValueAtTime(380, time);
      
      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(0.08, time + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.55);
      
      lfo.start(time);
      osc.start(time);
      lfo.stop(time + 0.55);
      osc.stop(time + 0.55);
      break;
    }
    case "monkey": {
      // Monkey chatter chattering
      for (let i = 0; i < 3; i++) {
        const t = time + i * 0.16;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(550, t);
        osc.frequency.exponentialRampToValueAtTime(1300, t + 0.1);

        gainNode.gain.setValueAtTime(0.08, t);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.11);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.11);
      }
      break;
    }
    case "zebra": {
      // Short whinny
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(200, time);
      osc.frequency.linearRampToValueAtTime(420, time + 0.18);
      osc.frequency.exponentialRampToValueAtTime(110, time + 0.45);
      
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 22;
      lfoGain.gain.value = 12;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      gainNode.gain.setValueAtTime(0.08, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.45);
      
      lfo.start(time);
      osc.start(time);
      lfo.stop(time + 0.45);
      osc.stop(time + 0.45);
      break;
    }
    case "giraffe": {
      // Soft mystical hum
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(260, time);
      osc.frequency.linearRampToValueAtTime(140, time + 0.65);

      gainNode.gain.setValueAtTime(0.08, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.7);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.7);
      break;
    }
    default: {
      // Default: quick bouncy note
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(330, time);
      gainNode.gain.setValueAtTime(0.1, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.155);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.155);
      break;
    }
  }
};

// Cute speech synthesizer wrapping the Web Speech API
export const speakEnglish = (text: string, enabled: boolean) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  
  // Cancel any ongoing speaking to avoid overlapping speech
  window.speechSynthesis.cancel();
  
  if (!enabled) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  
  // Pitch and rate adjusted for engaging preschool child friendly tone
  utterance.pitch = 1.3; // Higher voice pitch
  utterance.rate = 0.85; // Slightly slower speed so kids can capture phonetic sounds

  // Find a nice female or child-sounding English voice if available
  const voices = window.speechSynthesis.getVoices();
  const premiumVoice = voices.find(v => 
    v.lang.startsWith("en-") && 
    (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("Zira"))
  );
  if (premiumVoice) {
    utterance.voice = premiumVoice;
  }

  window.speechSynthesis.speak(utterance);
};

// Cute storytelling using Web Speech API that reads English pronunciation and then reads the Vietnamese custom short story description
export const speakSharedNarrative = (wordText: string, meaning: string, description: string, enabled: boolean) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  // Cancel any ongoing speaking to avoid overlapping speech
  window.speechSynthesis.cancel();

  if (!enabled) return;

  // 1. English speaker
  const enUtterance = new SpeechSynthesisUtterance(wordText);
  enUtterance.lang = "en-US";
  enUtterance.pitch = 1.3;
  enUtterance.rate = 0.8;

  const voices = window.speechSynthesis.getVoices();
  const enVoice = voices.find(v => 
    v.lang.startsWith("en-") && 
    (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("Zira"))
  );
  if (enVoice) {
    enUtterance.voice = enVoice;
  }

  // 2. Vietnamese narrative story speaker
  const storyIntroText = `Bé yêu ơi, bạn ${meaning} trong tiếng Anh đọc là, ${wordText}. `;
  const fullNarrativeText = `${storyIntroText}${description || ""}`;
  
  const viUtterance = new SpeechSynthesisUtterance(fullNarrativeText);
  viUtterance.lang = "vi-VN";
  viUtterance.pitch = 1.25; // Higher / cute voice pitch for toddlers
  viUtterance.rate = 0.95; // Gentle clear storytelling pace

  const viVoice = voices.find(v => v.lang.startsWith("vi-") || v.lang === "vi-VN");
  if (viVoice) {
    viUtterance.voice = viVoice;
  }

  // Speak they sequentially
  window.speechSynthesis.speak(enUtterance);
  window.speechSynthesis.speak(viUtterance);
};

// --- SYNTHESIZED BACKGROUND AMBIENT SOUND MANAGER ---
let whiteNoiseBuffer: AudioBuffer | null = null;

function getWhiteNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (whiteNoiseBuffer) return whiteNoiseBuffer;
  const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
  whiteNoiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = whiteNoiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return whiteNoiseBuffer;
}

let activeAmbient: {
  category: string;
  gainNode: GainNode;
  sources: any[];
  intervals: any[];
} | null = null;

export const startAmbientSound = (category: string, enabled: boolean) => {
  if (typeof window === "undefined") return;
  
  // If the same category is already playing, do nothing
  if (activeAmbient && activeAmbient.category === category) {
    if (!enabled) {
      stopAmbientSound();
    }
    return;
  }

  // Stop current ambient sound first
  stopAmbientSound();
  
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  
  const mainGain = ctx.createGain();
  mainGain.gain.setValueAtTime(0.001, ctx.currentTime);
  mainGain.connect(ctx.destination);
  
  // Fade-in: ramp gain from 0.001 to 1.0 over 1.5 seconds under linear-to-exponential curve
  mainGain.gain.exponentialRampToValueAtTime(1.0, ctx.currentTime + 1.5);
  
  const sources: any[] = [];
  const intervals: any[] = [];

  if (category === "garden") {
    // 1. Gentle rustle wind
    const wind = ctx.createBufferSource();
    wind.buffer = getWhiteNoiseBuffer(ctx);
    wind.loop = true;
    
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(350, ctx.currentTime);
    
    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.008, ctx.currentTime);
    
    wind.connect(filter);
    filter.connect(windGain);
    windGain.connect(mainGain);
    
    wind.start();
    sources.push(wind);
    
    // 2. Procedural happy bird tweets
    const chirp = () => {
      const osc = ctx.createOscillator();
      const chirpGain = ctx.createGain();
      osc.connect(chirpGain);
      chirpGain.connect(mainGain);
      
      const startTime = ctx.currentTime;
      const duration = 0.12 + Math.random() * 0.15;
      
      osc.type = "sine";
      const startFreq = 2300 + Math.random() * 600;
      const endFreq = startFreq + 1200 + Math.random() * 400;
      
      osc.frequency.setValueAtTime(startFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);
      
      chirpGain.gain.setValueAtTime(0.001, startTime);
      chirpGain.gain.linearRampToValueAtTime(0.025, startTime + 0.02);
      chirpGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    
    chirp();
    const interval = setInterval(() => {
      if (Math.random() > 0.25) {
        chirp();
        if (Math.random() > 0.5) {
          setTimeout(chirp, 250 + Math.random() * 250);
        }
      }
    }, 2800);
    intervals.push(interval);
  }
  
  else if (category === "sea") {
    // White noise filtered waves rushing in / pulling back slowly
    const waves = ctx.createBufferSource();
    waves.buffer = getWhiteNoiseBuffer(ctx);
    waves.loop = true;
    
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 1.2;
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    
    const wavesGain = ctx.createGain();
    wavesGain.gain.setValueAtTime(0.015, ctx.currentTime);
    
    waves.connect(filter);
    filter.connect(wavesGain);
    wavesGain.connect(mainGain);
    
    // Wave LFO sweeps waves up and down over 7.5 seconds
    const waveLfo = ctx.createOscillator();
    waveLfo.type = "sine";
    waveLfo.frequency.setValueAtTime(0.13, ctx.currentTime);
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(220, ctx.currentTime);
    
    waveLfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    
    // Smooth volume modulation linked to wave swelling
    const volLfoGain = ctx.createGain();
    volLfoGain.gain.setValueAtTime(0.012, ctx.currentTime);
    waveLfo.connect(volLfoGain);
    volLfoGain.connect(wavesGain.gain);
    
    waves.start();
    waveLfo.start();
    sources.push(waves, waveLfo);
  }
  
  else if (category === "pet") {
    // A soft pet-purring engine rumble and warm, idle chimes (like relaxing pet nursery music)
    const basePurr = ctx.createOscillator();
    basePurr.type = "sine";
    basePurr.frequency.setValueAtTime(45, ctx.currentTime);
    
    const purrGain = ctx.createGain();
    purrGain.gain.setValueAtTime(0.05, ctx.currentTime);
    
    const purrMod = ctx.createOscillator();
    purrMod.type = "sine";
    purrMod.frequency.setValueAtTime(20, ctx.currentTime);
    
    const purrModGain = ctx.createGain();
    purrModGain.gain.setValueAtTime(0.02, ctx.currentTime);
    
    purrMod.connect(purrModGain);
    purrModGain.connect(purrGain.gain);
    
    basePurr.connect(purrGain);
    purrGain.connect(mainGain);
    
    basePurr.start();
    purrMod.start();
    sources.push(basePurr, purrMod);
    
    // Lullaby music box scale
    const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    const playChime = () => {
      const osc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      
      osc.connect(chimeGain);
      chimeGain.connect(mainGain);
      
      osc.type = "triangle";
      const note = pentatonic[Math.floor(Math.random() * pentatonic.length)];
      
      const startTime = ctx.currentTime;
      const duration = 1.8 + Math.random() * 1.5;
      
      osc.frequency.setValueAtTime(note, startTime);
      
      chimeGain.gain.setValueAtTime(0.001, startTime);
      chimeGain.gain.linearRampToValueAtTime(0.015, startTime + 0.08);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    
    playChime();
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        playChime();
      }
    }, 4200);
    intervals.push(interval);
  }
  
  else if (category === "animals") {
    // Jungle savanna whispering breeze and crickets
    const wind = ctx.createBufferSource();
    wind.buffer = getWhiteNoiseBuffer(ctx);
    wind.loop = true;
    
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 1.8;
    filter.frequency.setValueAtTime(550, ctx.currentTime);
    
    // Slow wind frequency fluctuations
    const breezeLfo = ctx.createOscillator();
    breezeLfo.type = "sine";
    breezeLfo.frequency.setValueAtTime(0.07, ctx.currentTime);
    
    const breezeGain = ctx.createGain();
    breezeGain.gain.setValueAtTime(120, ctx.currentTime);
    
    breezeLfo.connect(breezeGain);
    breezeGain.connect(filter.frequency);
    
    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.006, ctx.currentTime);
    
    wind.connect(filter);
    filter.connect(windGain);
    windGain.connect(mainGain);
    
    wind.start();
    breezeLfo.start();
    sources.push(wind, breezeLfo);
    
    // Savannah crickets chirping
    const playCrickets = () => {
      const startTime = ctx.currentTime;
      const duration = 0.35 + Math.random() * 0.4;
      
      const osc = ctx.createOscillator();
      const cGain = ctx.createGain();
      osc.connect(cGain);
      cGain.connect(mainGain);
      
      osc.type = "sine";
      const freq = 4000 + Math.random() * 500;
      osc.frequency.setValueAtTime(freq, startTime);
      
      const rate = 38;
      const pulses = Math.floor(duration * rate);
      cGain.gain.setValueAtTime(0, startTime);
      
      for (let i = 0; i < pulses; i++) {
        const pTime = startTime + (i / rate);
        cGain.gain.setValueAtTime(0.004, pTime);
        cGain.gain.setValueAtTime(0, pTime + 0.012);
      }
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    
    playCrickets();
    const interval = setInterval(() => {
      if (Math.random() > 0.35) {
        playCrickets();
      }
    }, 3200);
    intervals.push(interval);
  }

  activeAmbient = {
    category,
    gainNode: mainGain,
    sources,
    intervals
  };
};

export const stopAmbientSound = () => {
  if (typeof window === "undefined" || !activeAmbient) return;
  
  const { gainNode, sources, intervals } = activeAmbient;
  activeAmbient = null;
  
  // Clear intervals immediately
  intervals.forEach(clearInterval);
  
  const ctx = getAudioContext();
  if (ctx) {
    try {
      gainNode.gain.cancelScheduledValues(ctx.currentTime);
      gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
      // Fade-out: ramp gain down over 1.2 seconds exponentially
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    } catch (e) {
      gainNode.gain.value = 0;
    }
  } else {
    gainNode.gain.value = 0;
  }
  
  // Disconnect & stop after fade out finishes
  setTimeout(() => {
    sources.forEach(src => {
      try {
        src.stop();
      } catch (e) {}
      try {
        src.disconnect();
      } catch (e) {}
    });
    try {
      gainNode.disconnect();
    } catch (e) {}
  }, 1300);
};

