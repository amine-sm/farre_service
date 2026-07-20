const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = require("../db");

const COOKIE_NAME =
  process.env.COOKIE_NAME ||
  "farre_admin_token";

function cookieOptions() {
  const production =
    process.env.NODE_ENV ===
    "production";

  return {
    httpOnly: true,
    secure: production,
    sameSite: production
      ? "none"
      : "lax",
    maxAge:
      8 * 60 * 60 * 1000,
    path: "/",
  };
}

exports.login = async (
  req,
  res
) => {
  try {
    const email = String(
      req.body.email || ""
    )
      .trim()
      .toLowerCase();

    const password = String(
      req.body.password || ""
    );

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "L’adresse email et le mot de passe sont obligatoires.",
      });
    }

    const [users] =
      await pool.query(
        `
          SELECT
            id,
            name,
            email,
            password_hash,
            role,
            is_active
          FROM admin_users
          WHERE LOWER(email) = ?
          LIMIT 1
        `,
        [email]
      );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message:
          "Adresse email ou mot de passe incorrect.",
      });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message:
          "Ce compte est désactivé.",
      });
    }

    const validPassword =
      await bcrypt.compare(
        password,
        user.password_hash
      );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message:
          "Adresse email ou mot de passe incorrect.",
      });
    }

    const token = jwt.sign(
      {
        sub: String(user.id),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn:
          process.env.JWT_EXPIRES_IN ||
          "8h",
      }
    );

    res.cookie(
      COOKIE_NAME,
      token,
      cookieOptions()
    );

    return res.status(200).json({
      success: true,
      message:
        "Connexion réussie.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Erreur login :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Impossible de se connecter.",
    });
  }
};

exports.logout = (
  req,
  res
) => {
  res.clearCookie(
    COOKIE_NAME,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite:
        process.env.NODE_ENV ===
        "production"
          ? "none"
          : "lax",
      path: "/",
    }
  );

  return res.status(200).json({
    success: true,
    message:
      "Déconnexion réussie.",
  });
};

exports.me = async (
  req,
  res
) => {
  try {
    const [users] =
      await pool.query(
        `
          SELECT
            id,
            name,
            email,
            role,
            is_active,
            created_at
          FROM admin_users
          WHERE id = ?
          LIMIT 1
        `,
        [req.auth.userId]
      );

    if (
      users.length === 0 ||
      !users[0].is_active
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Session invalide.",
      });
    }

    return res.status(200).json({
      success: true,
      data: users[0],
    });
  } catch (error) {
    console.error(
      "Erreur profil :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Impossible de charger le profil.",
    });
  }
};

exports.getUsers = async (
  req,
  res
) => {
  try {
    const [users] =
      await pool.query(
        `
          SELECT
            id,
            name,
            email,
            role,
            is_active,
            created_at
          FROM admin_users
          ORDER BY id DESC
        `
      );

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(
      "Erreur utilisateurs :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Impossible de charger les utilisateurs.",
    });
  }
};

exports.createUser = async (
  req,
  res
) => {
  try {
    const name = String(
      req.body.name || ""
    ).trim();

    const email = String(
      req.body.email || ""
    )
      .trim()
      .toLowerCase();

    const password = String(
      req.body.password || ""
    );

    const confirmPassword =
      String(
        req.body.confirmPassword ||
          ""
      );

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Tous les champs sont obligatoires.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Le mot de passe doit contenir au moins 8 caractères.",
      });
    }

    if (
      password !==
      confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "La confirmation du mot de passe est incorrecte.",
      });
    }

    const [existingUsers] =
      await pool.query(
        `
          SELECT id
          FROM admin_users
          WHERE LOWER(email) = ?
          LIMIT 1
        `,
        [email]
      );

    if (
      existingUsers.length > 0
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Un utilisateur avec cette adresse email existe déjà.",
      });
    }

    const passwordHash =
      await bcrypt.hash(
        password,
        12
      );

    const [result] =
      await pool.query(
        `
          INSERT INTO admin_users (
            name,
            email,
            password_hash,
            role,
            is_active
          )
          VALUES (?, ?, ?, 'ADMIN', 1)
        `,
        [
          name,
          email,
          passwordHash,
        ]
      );

    return res.status(201).json({
      success: true,
      message:
        "Administrateur ajouté avec succès.",
      data: {
        id: result.insertId,
        name,
        email,
        role: "ADMIN",
        is_active: 1,
      },
    });
  } catch (error) {
    console.error(
      "Erreur création utilisateur :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Impossible d’ajouter l’utilisateur.",
    });
  }
};

exports.changePassword = async (
  req,
  res
) => {
  try {
    const currentPassword =
      String(
        req.body.currentPassword ||
          ""
      );

    const newPassword =
      String(
        req.body.newPassword ||
          ""
      );

    const confirmPassword =
      String(
        req.body.confirmPassword ||
          ""
      );

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Tous les champs sont obligatoires.",
      });
    }

    if (
      newPassword.length < 8
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Le nouveau mot de passe doit contenir au moins 8 caractères.",
      });
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "La confirmation du mot de passe est incorrecte.",
      });
    }

    const [users] =
      await pool.query(
        `
          SELECT
            id,
            password_hash
          FROM admin_users
          WHERE id = ?
          LIMIT 1
        `,
        [req.auth.userId]
      );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Utilisateur introuvable.",
      });
    }

    const validPassword =
      await bcrypt.compare(
        currentPassword,
        users[0].password_hash
      );

    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Le mot de passe actuel est incorrect.",
      });
    }

    const samePassword =
      await bcrypt.compare(
        newPassword,
        users[0].password_hash
      );

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message:
          "Le nouveau mot de passe doit être différent de l’ancien.",
      });
    }

    const newPasswordHash =
      await bcrypt.hash(
        newPassword,
        12
      );

    await pool.query(
      `
        UPDATE admin_users
        SET password_hash = ?
        WHERE id = ?
      `,
      [
        newPasswordHash,
        req.auth.userId,
      ]
    );

    return res.status(200).json({
      success: true,
      message:
        "Mot de passe modifié avec succès.",
    });
  } catch (error) {
    console.error(
      "Erreur changement mot de passe :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Impossible de modifier le mot de passe.",
    });
  }
};
