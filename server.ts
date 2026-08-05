import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add middlewears
  app.use(express.json({ limit: "15mb" }));

  // Initialize Gemini client on the server lazily
  let ai: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not defined in the environment!");
      }
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return ai;
  }

  // API Route for pronunciation voice comparison
  app.post("/api/pronunciation", async (req, res) => {
    try {
      const { audio, mimeType, word } = req.body;
      if (!audio || !word) {
        return res.status(400).json({ error: "Thừa hoặc thiếu dữ liệu: Cần giọng nói và từ vựng." });
      }

      const client = getGeminiClient();

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            inlineData: {
              mimeType: mimeType || "audio/webm",
              data: audio,
            },
          },
          {
            text: `You are a super friendly, encouraging, and magical English pronunciation helper for Vietnamese preschool/kindergarten (mầm non, mẫu giáo) children.
The target English word the child is practicing is: "${word}".
They recorded their voice saying this word and uploaded it.

Analyze this child's recorded voice:
1. Compare it directly with the standard pronunciation of "${word}".
2. Grade their speech accuracy on a scale of 0 to 100. Be extremely encouraging! For small children, a score above 80 is excellent, above 60 is a great start. Be generous with scoring but also accurate in detecting if they actually tried to pronounce the word.
3. Write a warm, cute, and child-friendly feedback in Vietnamese (tiếng Việt). 
   - Highlight exactly what they did perfectly (e.g., correct initial sound, good volume) and give a very simple, fun tip on pronunciation if they missed a sound (e.g., "Chú ý rung giọng nhẹ âm gió ở cuối nha", "Ngắt hơi thật ngắn bập bập hai môi lại nè").
   - Use sweet mầm non terms (e.g., "bé yêu", "bé ngoan", "giọng bé siêu cưng luôn", "như người bản xứ nè").
   - Include lots of exciting child-oriented emojis (⭐, 🎨, 🦁, 🦖, ✨, 🌈, 🎉).

Return the evaluation strictly in JSON format matching this schema:
{
  "score": number,
  "transcription": string,
  "feedback": string
}`,
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { 
                type: Type.INTEGER, 
                description: "Pronunciation score from 0 to 100 based on standard English pronunciation." 
              },
              transcription: { 
                type: Type.STRING, 
                description: "What you heard the child say (write what was transcribed)." 
              },
              feedback: { 
                type: Type.STRING, 
                description: "Warm, supportive feedback in Vietnamese with instructions and cute emojis." 
              },
            },
            required: ["score", "transcription", "feedback"],
          },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Không nhận được phản hồi từ AI");
      }

      const result = JSON.parse(text.trim());
      res.json(result);
    } catch (error: any) {
      console.error("Lỗi api/pronunciation:", error);
      res.status(500).json({ 
        error: "Phân tích phát âm thất bại", 
        details: error?.message || error 
      });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
