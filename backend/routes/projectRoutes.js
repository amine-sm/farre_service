const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const projectsController = require("../controllers/projectController");
const router = express.Router();

const uploadsDirectory = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, uploadsDirectory),
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const originalName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    callback(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}-${originalName}${extension}`
    );
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    callback(
      allowed.includes(file.mimetype)
        ? null
        : new Error("Format d’image non autorisé."),
      allowed.includes(file.mimetype)
    );
  },
  limits: { fileSize: 10 * 1024 * 1024, files: 12 },
});

router.get("/", projectsController.getAllProjects);
router.get("/:id", projectsController.getProjectById);

router.post(
  "/",
  upload.array("images", 12),
  projectsController.createProject
);

router.put(
  "/:id",
  upload.array("images", 12),
  projectsController.updateProject
);

router.patch(
  "/:id",
  upload.array("images", 12),
  projectsController.updateProject
);

router.patch("/:id/status", projectsController.updateProjectStatus);
router.delete("/:id", projectsController.deleteProject);

module.exports = router;
