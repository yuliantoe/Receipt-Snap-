import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "Receipt Snap Photobooth Server" });
  });

  // AI Vibe Check Route for Thermal Receipt Fun Line Items
  app.post("/api/ai-vibe", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({
          success: true,
          items: [
            { name: "1x Main Character Energy", price: "Rp 0" },
            { name: "2x Overthinking at 2 AM", price: "Rp 15.000" },
            { name: "1x Unlimited Aesthetic Vibe", price: "Rp 0" },
            { name: "1x Aura Points Boost (+999)", price: "Rp 25.000" }
          ],
          motto: "Keep shining! Certified Gen-Z Vibe Approved ★★★★★",
          vibeRating: "100% UNMATCHED"
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const { mood, theme, photoCount } = req.body;

      const prompt = `Generate a creative, funny Gen-Z / Millennial shopping receipt breakdown in Indonesian / English blend for a photobooth called "Receipt Snap".
Mood/Theme: ${mood || "Cool Gen-Z Vibe"}, Photos Taken: ${photoCount || 3}.
Return ONLY a valid JSON object matching this schema:
{
  "items": [
    { "name": "string (e.g. 1x Main Character Smile)", "price": "string (e.g. Rp 0 or Rp 12.000)" },
    { "name": "string", "price": "string" },
    { "name": "string", "price": "string" }
  ],
  "motto": "string (funny Gen-Z slogan max 12 words)",
  "vibeRating": "string (e.g. 10/10 Aesthetic, 9999 Aura Points)"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);

      return res.json({
        success: true,
        items: parsed.items || [
          { name: "1x Main Character Energy", price: "Rp 0" },
          { name: "1x Certified Good Vibes", price: "Rp 0" }
        ],
        motto: parsed.motto || "No refunds on good vibes! ★★★★★",
        vibeRating: parsed.vibeRating || "100% VIBE MATCH"
      });
    } catch (err: any) {
      console.error("Gemini AI Vibe error:", err);
      return res.json({
        success: true,
        items: [
          { name: "1x Photobooth Snap Session", price: "Rp 25.000" },
          { name: "1x Pure Aesthetic Aura", price: "Rp 0" },
          { name: "1x Unlimited Core Memories", price: "Rp 0" }
        ],
        motto: "Thanks for snapping with us! Stay iconic ★",
        vibeRating: "MAXIMUM AURA"
      });
    }
  });

  // Vite middleware in dev mode
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
    console.log(`Receipt Photobooth server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
