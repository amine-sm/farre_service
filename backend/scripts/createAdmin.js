const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

const bcrypt = require("bcryptjs");
const pool = require("../db");

async function createAdmin() {
  const name = "Administrateur";
  const email = "admin@farreservice.dz";
  const password = "Admin@2026";

  try {
    console.log(
      "Connexion MySQL avec :",
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
      }
    );

    if (!process.env.DB_USER) {
      throw new Error(
        "DB_USER est vide. Vérifiez le fichier backend/.env."
      );
    }

    if (!process.env.DB_NAME) {
      throw new Error(
        "DB_NAME est vide. Vérifiez le fichier backend/.env."
      );
    }

    const passwordHash =
      await bcrypt.hash(
        password,
        12
      );

    const [existingUsers] =
      await pool.query(
        `
          SELECT id
          FROM admin_users
          WHERE LOWER(email) = LOWER(?)
          LIMIT 1
        `,
        [email]
      );

    if (existingUsers.length > 0) {
      console.log(
        "Un administrateur avec cet email existe déjà."
      );

      process.exit(0);
    }

    await pool.query(
      `
        INSERT INTO admin_users (
          name,
          email,
          password_hash,
          role,
          is_active
        )
        VALUES (?, ?, ?, ?, ?)
      `,
      [
        name,
        email,
        passwordHash,
        "ADMIN",
        1,
      ]
    );

    console.log(
      "Administrateur créé avec succès."
    );

    console.log(
      `Email : ${email}`
    );

    console.log(
      `Mot de passe : ${password}`
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Erreur de création de l’administrateur :",
      error
    );

    process.exit(1);
  }
}

createAdmin();