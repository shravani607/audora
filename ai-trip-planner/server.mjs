import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ✅ Use your Gemini API key
const genAI = new GoogleGenerativeAI("AIzaSyAQbtlS80P_FWvKAl8348vrq1_yaGt9idk");

app.post("/api/describe", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "No image provided." });

    // ✅ Use correct model name (for v1 API)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // 🧠 Generate a description for the image
    const result = await model.generateContent([
      {
        inlineData: { mimeType: "image/jpeg", data: image },
      },
      {
        text: "Describe this image in one clear sentence for a visually impaired user.",
      },
    ]);

    const description = result.response.text();
    console.log("🧠 Gemini Output:", description);

    res.json([{ generated_text: description }]);
  } catch (err) {
    console.error("❌ Gemini API error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () =>
  console.log("✅ Gemini Vision API running on http://localhost:5000")
);
