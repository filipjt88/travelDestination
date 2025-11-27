require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Unsplash
app.get("/api/photos", async (req, res) => {
  const q = req.query.q || "travel";
  try {
    const response = await axios.get(
      "https://api.unsplash.com/search/photos",
      {
        params: { query: q, per_page: 6 },
        headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
      }
    );
    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch photos" });
  }
});

// Teleport
app.get("/api/cities", async (req, res) => {
  const q = req.query.q || "";
  try {
    const response = await axios.get(
      "https://api.teleport.org/api/cities/",
      { params: { search: q } }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "City search failed" });
  }
});

app.listen(4000, () => console.log("Server running on port 4000"));
