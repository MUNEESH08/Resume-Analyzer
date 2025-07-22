const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { extractTextFromPDF } = require("../utils/extractText");
const { CohereClient } = require("cohere-ai");
require("dotenv").config();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const filePath = path.join("uploads", req.file.filename);
    const text = await extractTextFromPDF(filePath);

    const response = await cohere.chat({
      model: process.env.COHERE_MODEL,
      message: `Analyze this resume and suggest skills, improvements, and companies:\n\n${text}`,
    });

    fs.unlinkSync(filePath);

    res.json({ analysis: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
});

module.exports = router;
