const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },

  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${extension}`;

    callback(null, uniqueName);
  },
});

const fileFilter = (req, file, callback) => {
  const acceptedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!acceptedTypes.includes(file.mimetype)) {
    return callback(
      new Error("Seules les images JPG, PNG et WEBP sont acceptées.")
    );
  }

  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/", upload.single("imageFile"), createProject);
router.put("/:id", upload.single("imageFile"), updateProject);
router.delete("/:id", deleteProject);

module.exports = router;