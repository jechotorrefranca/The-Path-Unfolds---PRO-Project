require("dotenv").config();
const express = require("express");
const { createProdia } = require("prodia");
const cors = require("cors");

const app = express();
const PORT = 5000;

const prodia = createProdia({
  apiKey: process.env.REACT_APP_PRODIA_API_KEY,
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("Received prompt:", prompt);

    const job = await prodia.generate({
      prompt: prompt,
      width: 1024,
      height: 576,
    });

    console.log("Prodia job response:", job);

    const { imageUrl, status } = await prodia.wait(job);
    console.log("Prodia job status:", status, "Image URL:", imageUrl);

    if (status === "completed") {
      res.json({ imageUrl });
    } else {
      throw new Error("Image generation failed.");
    }
  } catch (error) {
    console.error(
      "Error from Prodia API:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Error generating image",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
