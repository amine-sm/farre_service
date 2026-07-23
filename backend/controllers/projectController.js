const fs = require("fs");
const path = require("path");
const pool = require("../db");

function cleanString(value, defaultValue = "") {
  return value === undefined || value === null
    ? defaultValue
    : String(value).trim();
}

function toInteger(value, defaultValue = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : defaultValue;
}

function toMysqlBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === "") {
    return defaultValue ? 1 : 0;
  }

  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "number") return value === 1 ? 1 : 0;

  return ["1", "true", "yes", "oui", "on"].includes(
    String(value).trim().toLowerCase()
  )
    ? 1
    : 0;
}

function getValidProjectId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function parseImages(value) {
  if (Array.isArray(value)) return value.filter(Boolean);

  if (typeof value !== "string" || !value.trim()) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function uploadedPaths(files = []) {
  return files.map((file) => `/uploads/${file.filename}`);
}

function physicalPath(imagePath) {
  if (typeof imagePath !== "string" || !imagePath.startsWith("/uploads/")) {
    return null;
  }

  return path.join(__dirname, "..", "uploads", path.basename(imagePath));
}

function deleteImage(imagePath) {
  try {
    const target = physicalPath(imagePath);
    if (target && fs.existsSync(target)) fs.unlinkSync(target);
  } catch (error) {
    console.error("Suppression image impossible :", error);
  }
}

function deleteImages(images) {
  [...new Set(parseImages(images))].forEach(deleteImage);
}

function sendServerError(res, error, message) {
  console.error(message, error);

  return res.status(500).json({
    success: false,
    message,
    error:
      process.env.NODE_ENV === "production"
        ? undefined
        : error?.sqlMessage || error?.message || String(error),
  });
}

const selectFields = `
  id,
  title,
  category,
  location,
  image,
  images,
  description,
  display_order AS displayOrder,
  is_active AS isActive,
  is_wide AS isWide,
  is_tall AS isTall,
  created_at AS createdAt,
  updated_at AS updatedAt
`;

function normalizeRows(rows) {
  return rows.map((project) => ({
    ...project,
    images: parseImages(project.images),
  }));
}

exports.getAllProjects = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ${selectFields}
      FROM projects
      WHERE is_active = 1
      ORDER BY display_order ASC, id DESC
    `);

    return res.status(200).json({
      success: true,
      data: normalizeRows(rows),
    });
  } catch (error) {
    return sendServerError(res, error, "Impossible de charger les projets.");
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const id = getValidProjectId(req.params.id);

    if (!id) {
      return res.status(400).json({ success: false, message: "Identifiant invalide." });
    }

    const [rows] = await pool.query(
      `SELECT ${selectFields} FROM projects WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Projet introuvable." });
    }

    return res.status(200).json({
      success: true,
      data: normalizeRows(rows)[0],
    });
  } catch (error) {
    return sendServerError(res, error, "Impossible de charger le projet.");
  }
};

exports.createProject = async (req, res) => {
  const newImages = uploadedPaths(req.files);

  try {
    const title = cleanString(req.body.title);
    const category = cleanString(req.body.category);
    const location = cleanString(req.body.location);
    const description = cleanString(req.body.description);
    const displayOrder = toInteger(req.body.displayOrder, 0);
    const isActive = toMysqlBoolean(req.body.isActive, true);
    const isWide = toMysqlBoolean(req.body.isWide);
    const isTall = toMysqlBoolean(req.body.isTall);

    if (!title || !category || newImages.length === 0) {
      deleteImages(newImages);

      return res.status(400).json({
        success: false,
        message: !title
          ? "Le titre est obligatoire."
          : !category
          ? "La catégorie est obligatoire."
          : "Sélectionnez au moins une photo.",
      });
    }

    const cover = newImages[0];

    const [result] = await pool.query(
      `INSERT INTO projects
       (title, category, location, image, images, description,
        display_order, is_active, is_wide, is_tall)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        category,
        location,
        cover,
        JSON.stringify(newImages),
        description,
        displayOrder,
        isActive,
        isWide,
        isTall,
      ]
    );

    const [rows] = await pool.query(
      `SELECT ${selectFields} FROM projects WHERE id = ? LIMIT 1`,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "Projet et galerie ajoutés avec succès.",
      data: normalizeRows(rows)[0],
    });
  } catch (error) {
    deleteImages(newImages);
    return sendServerError(res, error, "Impossible d’ajouter le projet.");
  }
};

exports.updateProject = async (req, res) => {
  const newImages = uploadedPaths(req.files);

  try {
    const id = getValidProjectId(req.params.id);

    if (!id) {
      deleteImages(newImages);

      return res.status(400).json({
        success: false,
        message: "Identifiant invalide.",
      });
    }

    const [rows] = await pool.query(
      `SELECT * FROM projects WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!rows.length) {
      deleteImages(newImages);

      return res.status(404).json({
        success: false,
        message: "Projet introuvable.",
      });
    }

    const old = rows[0];

    const oldImagesFromColumn = parseImages(old.images);

    const oldImages = Array.from(
      new Set(
        [
          old.image,
          ...oldImagesFromColumn,
        ].filter(Boolean)
      )
    );

    let galleryOrder = [];

    if (
      typeof req.body.galleryOrder === "string" &&
      req.body.galleryOrder.trim()
    ) {
      try {
        const parsedOrder = JSON.parse(
          req.body.galleryOrder
        );

        if (Array.isArray(parsedOrder)) {
          galleryOrder = parsedOrder;
        }
      } catch {
        deleteImages(newImages);

        return res.status(400).json({
          success: false,
          message:
            "L’ordre des photos envoyé est invalide.",
        });
      }
    }

    let finalImages = [];

    if (galleryOrder.length > 0) {
      finalImages = galleryOrder
        .map((item) => {
          if (
            item &&
            item.type === "existing" &&
            typeof item.value === "string" &&
            oldImages.includes(item.value)
          ) {
            return item.value;
          }

          if (
            item &&
            item.type === "new" &&
            Number.isInteger(Number(item.index))
          ) {
            return newImages[Number(item.index)] || null;
          }

          return null;
        })
        .filter(Boolean);
    } else if (newImages.length > 0) {
      /*
       * Compatibilité avec un ancien frontend :
       * lorsque galleryOrder n’est pas envoyé,
       * les nouvelles photos remplacent les anciennes.
       */
      finalImages = newImages;
    } else {
      finalImages = oldImages;
    }

    finalImages = Array.from(
      new Set(finalImages)
    ).slice(0, 12);

    const cover = finalImages[0] || null;

    const title =
      req.body.title !== undefined
        ? cleanString(req.body.title)
        : old.title;

    const category =
      req.body.category !== undefined
        ? cleanString(req.body.category)
        : old.category;

    const location =
      req.body.location !== undefined
        ? cleanString(req.body.location)
        : old.location;

    if (!title || !category || !location || !cover) {
      deleteImages(newImages);

      return res.status(400).json({
        success: false,
        message:
          "Le titre, la catégorie, le lieu et une photo sont obligatoires.",
      });
    }

    await pool.query(
      `UPDATE projects SET
        title = ?,
        category = ?,
        location = ?,
        image = ?,
        images = ?,
        description = ?,
        display_order = ?,
        is_active = ?,
        is_wide = ?,
        is_tall = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        title,
        category,
        location,
        cover,
        JSON.stringify(finalImages),

        req.body.description !== undefined
          ? cleanString(req.body.description)
          : old.description,

        req.body.displayOrder !== undefined
          ? toInteger(
              req.body.displayOrder,
              old.display_order
            )
          : old.display_order,

        req.body.isActive !== undefined
          ? toMysqlBoolean(req.body.isActive, true)
          : old.is_active,

        req.body.isWide !== undefined
          ? toMysqlBoolean(req.body.isWide)
          : old.is_wide,

        req.body.isTall !== undefined
          ? toMysqlBoolean(req.body.isTall)
          : old.is_tall,

        id,
      ]
    );

    /*
     * On supprime physiquement seulement les anciennes
     * photos que l’utilisateur a retirées de la galerie.
     */
    const removedOldImages = oldImages.filter(
      (image) => !finalImages.includes(image)
    );

    deleteImages(removedOldImages);

    /*
     * Sécurité : si une nouvelle image a été uploadée
     * mais n’existe pas dans l’ordre final, on la supprime.
     */
    const unusedNewImages = newImages.filter(
      (image) => !finalImages.includes(image)
    );

    deleteImages(unusedNewImages);

    const [updated] = await pool.query(
      `SELECT ${selectFields}
       FROM projects
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    return res.status(200).json({
      success: true,
      message:
        "Projet et galerie modifiés avec succès.",
      data: normalizeRows(updated)[0],
    });
  } catch (error) {
    deleteImages(newImages);

    return sendServerError(
      res,
      error,
      "Impossible de modifier le projet."
    );
  }
};

exports.updateProjectStatus = async (req, res) => {
  try {
    const id = getValidProjectId(req.params.id);

    if (!id || req.body.isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: "Identifiant ou statut invalide.",
      });
    }

    const isActive = toMysqlBoolean(req.body.isActive);

    const [result] = await pool.query(
      `UPDATE projects
       SET is_active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [isActive, id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: "Projet introuvable." });
    }

    return res.status(200).json({
      success: true,
      message: isActive ? "Projet activé avec succès." : "Projet désactivé avec succès.",
    });
  } catch (error) {
    return sendServerError(res, error, "Impossible de modifier le statut.");
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const id = getValidProjectId(req.params.id);

    if (!id) {
      return res.status(400).json({ success: false, message: "Identifiant invalide." });
    }

    const [rows] = await pool.query(
      `SELECT image, images FROM projects WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Projet introuvable." });
    }

    await pool.query(`DELETE FROM projects WHERE id = ?`, [id]);

    const allImages = parseImages(rows[0].images);
    deleteImages(allImages.length ? allImages : [rows[0].image]);

    return res.status(200).json({
      success: true,
      message: "Projet et toutes ses photos supprimés avec succès.",
    });
  } catch (error) {
    return sendServerError(res, error, "Impossible de supprimer le projet.");
  }
};
