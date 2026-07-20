const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const projectsController = require(
  "../controllers/projectController"
);

const router = express.Router();

const uploadsDirectory = path.join(
  __dirname,
  "..",
  "uploads"
);

if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (
    req,
    file,
    callback
  ) => {
    callback(null, uploadsDirectory);
  },

  filename: (
    req,
    file,
    callback
  ) => {
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const originalName = path
      .basename(
        file.originalname,
        extension
      )
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    const uniqueName =
      `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}-${originalName}${extension}`;

    callback(null, uniqueName);
  },
});

const fileFilter = (
  req,
  file,
  callback
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (
    allowedMimeTypes.includes(
      file.mimetype
    )
  ) {
    callback(null, true);
  } else {
    callback(
      new Error(
        "Format d’image non autorisé."
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.get(
  "/",
  projectsController.getAllProjects
);

router.get(
  "/:id",
  projectsController.getProjectById
);

router.post(
  "/",
  upload.single("image"),
  projectsController.createProject
);

router.put(
  "/:id",
  upload.single("image"),
  projectsController.updateProject
);

router.patch(
  "/:id",
  upload.single("image"),
  projectsController.updateProject
);

router.patch(
  "/:id/status",
  projectsController.updateProjectStatus
);

router.delete(
  "/:id",
  projectsController.deleteProject
);

module.exports = router;