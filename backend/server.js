const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const projectRoutes = require("./routes/projectRoutes");
const authRoutes = require("./routes/authRoutes");
const contactRequestRoutes = require("./routes/contactRequestRoutes");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contact-requests", contactRequestRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Farre Service opérationnelle.",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Serveur opérationnel.",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route API introuvable.",
  });
});

app.use((error, req, res, next) => {
  console.error("Erreur serveur :", error);

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "La taille du fichier est trop importante.",
    });
  }

  if (error.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: error.message || "Erreur pendant l’envoi du fichier.",
    });
  }

  return res.status(error.status || 500).json({
    success: false,
    message: error.message || "Erreur interne du serveur.",
  });
});

const port = Number(process.env.PORT || 5000);

app.listen(port, () => {
  console.log("========================================");
  console.log(`Serveur lancé sur http://localhost:${port}`);
  console.log(
    `Frontend autorisé : ${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }`
  );
  console.log(
    `Environnement : ${process.env.NODE_ENV || "development"}`
  );
  console.log("========================================");
});
