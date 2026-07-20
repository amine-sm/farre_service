const pool = require("../db");

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
        is_wide AS isWide,
        is_tall AS isTall,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM projects
      WHERE is_active = TRUE
      ORDER BY display_order ASC, id DESC
    `);

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Erreur getAllProjects :", error);

    res.status(500).json({
      success: false,
      message: "Impossible de charger les projets.",
    });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const projectId = Number(req.params.id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
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
          is_tall AS isTall
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

    res.status(200).json({
      success: true,
      data: projects[0],
    });
  } catch (error) {
    console.error("Erreur getProjectById :", error);

    res.status(500).json({
      success: false,
      message: "Impossible de charger le projet.",
    });
  }
};

exports.createProject = async (req, res) => {
  try {
    const {
      title,
      category,
      location = "",
      description = "",
      displayOrder = 0,
      isWide = false,
      isTall = false,
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Le titre et la catégorie sont obligatoires.",
      });
    }

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image;

    if (!image) {
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
          is_wide,
          is_tall
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title.trim(),
        category.trim(),
        location.trim(),
        image,
        description.trim(),
        Number(displayOrder) || 0,
        isWide === true || isWide === "true",
        isTall === true || isTall === "true",
      ]
    );

    res.status(201).json({
      success: true,
      message: "Projet ajouté avec succès.",
      data: {
        id: result.insertId,
      },
    });
  } catch (error) {
    console.error("Erreur createProject :", error);

    res.status(500).json({
      success: false,
      message: "Impossible d’ajouter le projet.",
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const projectId = Number(req.params.id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Identifiant invalide.",
      });
    }

    const [existingProjects] = await pool.query(
      "SELECT * FROM projects WHERE id = ? LIMIT 1",
      [projectId]
    );

    if (existingProjects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Projet introuvable.",
      });
    }

    const existingProject = existingProjects[0];

    const title = req.body.title ?? existingProject.title;
    const category = req.body.category ?? existingProject.category;
    const location = req.body.location ?? existingProject.location;
    const description =
      req.body.description ?? existingProject.description;
    const displayOrder =
      req.body.displayOrder ?? existingProject.display_order;

    const isWide =
      req.body.isWide !== undefined
        ? req.body.isWide === true || req.body.isWide === "true"
        : existingProject.is_wide;

    const isTall =
      req.body.isTall !== undefined
        ? req.body.isTall === true || req.body.isTall === "true"
        : existingProject.is_tall;

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image ?? existingProject.image;

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
          is_wide = ?,
          is_tall = ?
        WHERE id = ?
      `,
      [
        title,
        category,
        location,
        image,
        description,
        Number(displayOrder) || 0,
        isWide,
        isTall,
        projectId,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Projet modifié avec succès.",
    });
  } catch (error) {
    console.error("Erreur updateProject :", error);

    res.status(500).json({
      success: false,
      message: "Impossible de modifier le projet.",
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const projectId = Number(req.params.id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Identifiant invalide.",
      });
    }

    const [result] = await pool.query(
      "DELETE FROM projects WHERE id = ?",
      [projectId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Projet introuvable.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Projet supprimé avec succès.",
    });
  } catch (error) {
    console.error("Erreur deleteProject :", error);

    res.status(500).json({
      success: false,
      message: "Impossible de supprimer le projet.",
    });
  }
};