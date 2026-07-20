const pool = require("../db");

exports.createContactRequest = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const company = String(req.body.company || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const phone = String(req.body.phone || "").trim();
    const service = String(req.body.service || "").trim();
    const message = String(req.body.message || "").trim();

    if (!name || !email || !phone || !service || !message) {
      return res.status(400).json({
        success: false,
        message: "Veuillez remplir tous les champs obligatoires.",
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        message: "L’adresse email est invalide.",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO contact_requests
       (name, company, email, phone, service, message, is_read)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [name, company || null, email, phone, service, message]
    );

    return res.status(201).json({
      success: true,
      message: "Votre demande a été envoyée avec succès.",
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error("Erreur création demande :", error);
    return res.status(500).json({
      success: false,
      message: "Impossible d’envoyer la demande.",
    });
  }
};

exports.getContactRequests = async (req, res) => {
  try {
    const [requests] = await pool.query(
      `SELECT id, name, company, email, phone, service,
              message, is_read, created_at, updated_at
       FROM contact_requests
       ORDER BY is_read ASC, created_at DESC, id DESC`
    );

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error("Erreur chargement demandes :", error);
    return res.status(500).json({
      success: false,
      message: "Impossible de charger les demandes.",
    });
  }
};

exports.getContactRequestById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Identifiant invalide.",
      });
    }

    const [requests] = await pool.query(
      `SELECT id, name, company, email, phone, service,
              message, is_read, created_at, updated_at
       FROM contact_requests
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Demande introuvable.",
      });
    }

    return res.status(200).json({
      success: true,
      data: requests[0],
    });
  } catch (error) {
    console.error("Erreur lecture demande :", error);
    return res.status(500).json({
      success: false,
      message: "Impossible de charger la demande.",
    });
  }
};

exports.updateContactRequestReadStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const isRead =
      req.body.isRead === true ||
      req.body.isRead === 1 ||
      req.body.isRead === "1";

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Identifiant invalide.",
      });
    }

    const [result] = await pool.query(
      "UPDATE contact_requests SET is_read = ? WHERE id = ?",
      [isRead ? 1 : 0, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Demande introuvable.",
      });
    }

    return res.status(200).json({
      success: true,
      message: isRead
        ? "Demande marquée comme lue."
        : "Demande marquée comme non lue.",
    });
  } catch (error) {
    console.error("Erreur statut demande :", error);
    return res.status(500).json({
      success: false,
      message: "Impossible de modifier le statut.",
    });
  }
};

exports.deleteContactRequest = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Identifiant invalide.",
      });
    }

    const [result] = await pool.query(
      "DELETE FROM contact_requests WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Demande introuvable.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Demande supprimée avec succès.",
    });
  } catch (error) {
    console.error("Erreur suppression demande :", error);
    return res.status(500).json({
      success: false,
      message: "Impossible de supprimer la demande.",
    });
  }
};
