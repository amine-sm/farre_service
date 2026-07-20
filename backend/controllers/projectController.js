
const fs = require("fs");
const path = require("path");

const pool = require("../db");

/**
 * Convertit une valeur en booléen MySQL :
 * true  => 1
 * false => 0
 */
function toMysqlBoolean(value, defaultValue = false) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return defaultValue ? 1 : 0;
  }

  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  if (typeof value === "number") {
    return value === 1 ? 1 : 0;
  }

  const normalizedValue = String(value)
    .trim()
    .toLowerCase();

  return [
    "1",
    "true",
    "yes",
    "oui",
    "on",
  ].includes(normalizedValue)
    ? 1
    : 0;
}

/**
 * Convertit une valeur en entier.
 */
function toInteger(value, defaultValue = 0) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return defaultValue;
  }

  return Math.trunc(parsedValue);
}

/**
 * Nettoie une chaîne.
 */
function cleanString(value, defaultValue = "") {
  if (
    value === undefined ||
    value === null
  ) {
    return defaultValue;
  }

  return String(value).trim();
}

/**
 * Vérifie un identifiant de projet.
 */
function getValidProjectId(value) {
  const projectId = Number(value);

  if (
    !Number.isInteger(projectId) ||
    projectId <= 0
  ) {
    return null;
  }

  return projectId;
}

/**
 * Retourne le chemin physique d’une image.
 */
function getUploadPhysicalPath(imagePath) {
  if (
    !imagePath ||
    typeof imagePath !== "string" ||
    !imagePath.startsWith("/uploads/")
  ) {
    return null;
  }

  const fileName = path.basename(imagePath);

  return path.join(
    __dirname,
    "..",
    "uploads",
    fileName
  );
}

/**
 * Supprime une image locale.
 */
function deleteUploadedImage(imagePath) {
  try {
    const physicalPath =
      getUploadPhysicalPath(imagePath);

    if (
      physicalPath &&
      fs.existsSync(physicalPath)
    ) {
      fs.unlinkSync(physicalPath);

      console.log(
        "Image supprimée :",
        physicalPath
      );
    }
  } catch (error) {
    console.error(
      "Erreur pendant la suppression de l’image :",
      error
    );
  }
}

/**
 * Retourne une erreur serveur détaillée.
 */
function sendServerError(
  res,
  error,
  defaultMessage
) {
  console.error(defaultMessage, error);

  return res.status(500).json({
    success: false,
    message: defaultMessage,
    error:
      process.env.NODE_ENV === "production"
        ? undefined
        : error?.sqlMessage ||
          error?.message ||
          String(error),
  });
}

/**
 * GET /api/projects
 */
exports.getAllProjects = async (req, res) => {
  try {
    const [projects] = await pool.query(`
      SELECT
        id,
        title,
        category,
        location,
        image,
        description,
        display_order AS displayOrder,
        is_active AS isActive,
        is_wide AS isWide,
        is_tall AS isTall,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM projects
      WHERE is_active = 1
      ORDER BY display_order ASC, id DESC
    `);

    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    return sendServerError(
      res,
      error,
      "Impossible de charger les projets."
    );
  }
};

/**
 * GET /api/projects/:id
 */
exports.getProjectById = async (req, res) => {
  try {
    const projectId = getValidProjectId(
      req.params.id
    );

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Identifiant invalide.",
      });
    }

    const [projects] = await pool.query(
      `
        SELECT
          id,
          title,
          category,
          location,
          image,
          description,
          display_order AS displayOrder,
          is_active AS isActive,
          is_wide AS isWide,
          is_tall AS isTall,
          created_at AS createdAt,
          updated_at AS updatedAt
        FROM projects
        WHERE id = ?
        LIMIT 1
      `,
      [projectId]
    );

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Projet introuvable.",
      });
    }

    return res.status(200).json({
      success: true,
      data: projects[0],
    });
  } catch (error) {
    return sendServerError(
      res,
      error,
      "Impossible de charger le projet."
    );
  }
};

/**
 * POST /api/projects
 */
exports.createProject = async (req, res) => {
  let uploadedImage = null;

  try {
    const title = cleanString(
      req.body.title
    );

    const category = cleanString(
      req.body.category
    );

    const location = cleanString(
      req.body.location
    );

    const description = cleanString(
      req.body.description
    );

    const displayOrder = toInteger(
      req.body.displayOrder,
      0
    );

    const isActive = toMysqlBoolean(
      req.body.isActive,
      true
    );

    const isWide = toMysqlBoolean(
      req.body.isWide,
      false
    );

    const isTall = toMysqlBoolean(
      req.body.isTall,
      false
    );

    if (!title) {
      if (req.file) {
        deleteUploadedImage(
          `/uploads/${req.file.filename}`
        );
      }

      return res.status(400).json({
        success: false,
        message: "Le titre est obligatoire.",
      });
    }

    if (!category) {
      if (req.file) {
        deleteUploadedImage(
          `/uploads/${req.file.filename}`
        );
      }

      return res.status(400).json({
        success: false,
        message:
          "La catégorie est obligatoire.",
      });
    }

    uploadedImage = req.file
      ? `/uploads/${req.file.filename}`
      : cleanString(req.body.image);

    if (!uploadedImage) {
      return res.status(400).json({
        success: false,
        message: "Une image est obligatoire.",
      });
    }

    const [result] = await pool.query(
      `
        INSERT INTO projects (
          title,
          category,
          location,
          image,
          description,
          display_order,
          is_active,
          is_wide,
          is_tall
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        category,
        location,
        uploadedImage,
        description,
        displayOrder,
        isActive,
        isWide,
        isTall,
      ]
    );

    const [createdProjects] =
      await pool.query(
        `
          SELECT
            id,
            title,
            category,
            location,
            image,
            description,
            display_order AS displayOrder,
            is_active AS isActive,
            is_wide AS isWide,
            is_tall AS isTall,
            created_at AS createdAt,
            updated_at AS updatedAt
          FROM projects
          WHERE id = ?
          LIMIT 1
        `,
        [result.insertId]
      );

    return res.status(201).json({
      success: true,
      message:
        "Projet ajouté avec succès.",
      data:
        createdProjects.length > 0
          ? createdProjects[0]
          : {
              id: result.insertId,
            },
    });
  } catch (error) {
    if (uploadedImage) {
      deleteUploadedImage(uploadedImage);
    }

    return sendServerError(
      res,
      error,
      "Impossible d’ajouter le projet."
    );
  }
};

/**
 * PUT ou PATCH /api/projects/:id
 */
exports.updateProject = async (req, res) => {
  let newUploadedImage = null;

  try {
    const projectId = getValidProjectId(
      req.params.id
    );

    if (!projectId) {
      if (req.file) {
        deleteUploadedImage(
          `/uploads/${req.file.filename}`
        );
      }

      return res.status(400).json({
        success: false,
        message: "Identifiant invalide.",
      });
    }

    const [existingProjects] =
      await pool.query(
        `
          SELECT
            id,
            title,
            category,
            location,
            image,
            description,
            display_order,
            is_active,
            is_wide,
            is_tall
          FROM projects
          WHERE id = ?
          LIMIT 1
        `,
        [projectId]
      );

    if (existingProjects.length === 0) {
      if (req.file) {
        deleteUploadedImage(
          `/uploads/${req.file.filename}`
        );
      }

      return res.status(404).json({
        success: false,
        message: "Projet introuvable.",
      });
    }

    const existingProject =
      existingProjects[0];

    const title =
      req.body.title !== undefined
        ? cleanString(req.body.title)
        : cleanString(
            existingProject.title
          );

    const category =
      req.body.category !== undefined
        ? cleanString(req.body.category)
        : cleanString(
            existingProject.category
          );

    const location =
      req.body.location !== undefined
        ? cleanString(req.body.location)
        : cleanString(
            existingProject.location
          );

    const description =
      req.body.description !== undefined
        ? cleanString(
            req.body.description
          )
        : cleanString(
            existingProject.description
          );

    const displayOrder =
      req.body.displayOrder !== undefined
        ? toInteger(
            req.body.displayOrder,
            existingProject.display_order
          )
        : toInteger(
            existingProject.display_order,
            0
          );

    const isActive =
      req.body.isActive !== undefined
        ? toMysqlBoolean(
            req.body.isActive,
            true
          )
        : toMysqlBoolean(
            existingProject.is_active,
            true
          );

    const isWide =
      req.body.isWide !== undefined
        ? toMysqlBoolean(
            req.body.isWide,
            false
          )
        : toMysqlBoolean(
            existingProject.is_wide,
            false
          );

    const isTall =
      req.body.isTall !== undefined
        ? toMysqlBoolean(
            req.body.isTall,
            false
          )
        : toMysqlBoolean(
            existingProject.is_tall,
            false
          );

    if (!title) {
      if (req.file) {
        deleteUploadedImage(
          `/uploads/${req.file.filename}`
        );
      }

      return res.status(400).json({
        success: false,
        message: "Le titre est obligatoire.",
      });
    }

    if (!category) {
      if (req.file) {
        deleteUploadedImage(
          `/uploads/${req.file.filename}`
        );
      }

      return res.status(400).json({
        success: false,
        message:
          "La catégorie est obligatoire.",
      });
    }

    let image = existingProject.image;

    if (req.file) {
      newUploadedImage =
        `/uploads/${req.file.filename}`;

      image = newUploadedImage;
    } else if (
      req.body.image !== undefined
    ) {
      const requestedImage = cleanString(
        req.body.image
      );

      if (requestedImage) {
        image = requestedImage;
      }
    }

    if (!image) {
      if (newUploadedImage) {
        deleteUploadedImage(
          newUploadedImage
        );
      }

      return res.status(400).json({
        success: false,
        message: "Une image est obligatoire.",
      });
    }

    await pool.query(
      `
        UPDATE projects
        SET
          title = ?,
          category = ?,
          location = ?,
          image = ?,
          description = ?,
          display_order = ?,
          is_active = ?,
          is_wide = ?,
          is_tall = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [
        title,
        category,
        location,
        image,
        description,
        displayOrder,
        isActive,
        isWide,
        isTall,
        projectId,
      ]
    );

    if (
      newUploadedImage &&
      existingProject.image &&
      existingProject.image !==
        newUploadedImage
    ) {
      deleteUploadedImage(
        existingProject.image
      );
    }

    const [updatedProjects] =
      await pool.query(
        `
          SELECT
            id,
            title,
            category,
            location,
            image,
            description,
            display_order AS displayOrder,
            is_active AS isActive,
            is_wide AS isWide,
            is_tall AS isTall,
            created_at AS createdAt,
            updated_at AS updatedAt
          FROM projects
          WHERE id = ?
          LIMIT 1
        `,
        [projectId]
      );

    return res.status(200).json({
      success: true,
      message:
        "Projet modifié avec succès.",
      data:
        updatedProjects.length > 0
          ? updatedProjects[0]
          : null,
    });
  } catch (error) {
    if (newUploadedImage) {
      deleteUploadedImage(
        newUploadedImage
      );
    }

    return sendServerError(
      res,
      error,
      "Impossible de modifier le projet."
    );
  }
};

/**
 * PATCH /api/projects/:id/status
 */
exports.updateProjectStatus = async (
  req,
  res
) => {
  try {
    const projectId = getValidProjectId(
      req.params.id
    );

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Identifiant invalide.",
      });
    }

    if (req.body.isActive === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "Le champ isActive est obligatoire.",
      });
    }

    const isActive = toMysqlBoolean(
      req.body.isActive,
      false
    );

    const [result] = await pool.query(
      `
        UPDATE projects
        SET
          is_active = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [isActive, projectId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Projet introuvable.",
      });
    }

    return res.status(200).json({
      success: true,
      message: isActive
        ? "Projet activé avec succès."
        : "Projet désactivé avec succès.",
    });
  } catch (error) {
    return sendServerError(
      res,
      error,
      "Impossible de modifier le statut du projet."
    );
  }
};

/**
 * DELETE /api/projects/:id
 */
exports.deleteProject = async (req, res) => {
  try {
    const projectId = getValidProjectId(
      req.params.id
    );

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Identifiant invalide.",
      });
    }

    const [projects] = await pool.query(
      `
        SELECT
          id,
          image
        FROM projects
        WHERE id = ?
        LIMIT 1
      `,
      [projectId]
    );

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Projet introuvable.",
      });
    }

    const [result] = await pool.query(
      `
        DELETE FROM projects
        WHERE id = ?
      `,
      [projectId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Projet introuvable.",
      });
    }

    deleteUploadedImage(
      projects[0].image
    );

    return res.status(200).json({
      success: true,
      message:
        "Projet supprimé avec succès.",
    });
  } catch (error) {
    return sendServerError(
      res,
      error,
      "Impossible de supprimer le projet."
    );
  }
};

