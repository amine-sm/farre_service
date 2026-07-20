const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const projectRoutes = require("./routes/projectRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

/*
 * ============================================================
 * CONFIGURATION CORS
 * ============================================================
 *
 * credentials: true est obligatoire pour recevoir et envoyer
 * le cookie JWT entre Next.js et Express.
 */
app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:3000",

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
    ],
  })
);

/*
 * ============================================================
 * MIDDLEWARES
 * ============================================================
 */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

/*
 * ============================================================
 * FICHIERS IMAGES
 * ============================================================
 */

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

/*
 * ============================================================
 * ROUTES API
 * ============================================================
 */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/projects",
  projectRoutes
);

/*
 * ============================================================
 * ROUTE DE TEST
 * ============================================================
 */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "API Farre Service opérationnelle.",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Serveur opérationnel.",
    environment:
      process.env.NODE_ENV ||
      "development",
    timestamp: new Date().toISOString(),
  });
});

/*
 * ============================================================
 * ROUTE INTROUVABLE
 * ============================================================
 */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route API introuvable.",
  });
});

/*
 * ============================================================
 * GESTION GLOBALE DES ERREURS
 * ============================================================
 */

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "Erreur serveur :",
      error
    );

    /*
     * Erreur Multer :
     * fichier trop volumineux.
     */
    if (
      error.code ===
      "LIMIT_FILE_SIZE"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "La taille de l’image ne doit pas dépasser 5 Mo.",
      });
    }

    /*
     * Autres erreurs Multer ou validation d’image.
     */
    if (
      error.name ===
        "MulterError" ||
      error.message?.includes(
        "JPG"
      ) ||
      error.message?.includes(
        "PNG"
      ) ||
      error.message?.includes(
        "WEBP"
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Fichier image invalide.",
      });
    }

    return res.status(
      error.status || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Erreur interne du serveur.",
    });
  }
);

/*
 * ============================================================
 * DÉMARRAGE DU SERVEUR
 * ============================================================
 */

const port = Number(
  process.env.PORT || 5000
);

app.listen(port, () => {
  console.log(
    "========================================"
  );

  console.log(
    `Serveur lancé sur http://localhost:${port}`
  );

  console.log(
    `Frontend autorisé : ${
      process.env.FRONTEND_URL ||
      "http://localhost:3000"
    }`
  );

  console.log(
    `Environnement : ${
      process.env.NODE_ENV ||
      "development"
    }`
  );

  console.log(
    "========================================"
  );
});