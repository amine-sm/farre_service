const express = require("express");

const {
  login,
  logout,
  me,
  getUsers,
  createUser,
  changePassword,
} = require("../controllers/authController");

const {
  requireAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
 * Vérification utile au démarrage.
 */
console.log("Fonctions auth chargées :", {
  login: typeof login,
  logout: typeof logout,
  me: typeof me,
  getUsers: typeof getUsers,
  createUser: typeof createUser,
  changePassword: typeof changePassword,
  requireAdmin: typeof requireAdmin,
});

router.post("/login", login);

router.post("/logout", logout);

router.get(
  "/me",
  requireAdmin,
  me
);

router.get(
  "/users",
  requireAdmin,
  getUsers
);

router.post(
  "/users",
  requireAdmin,
  createUser
);

router.post(
  "/change-password",
  requireAdmin,
  changePassword
);

module.exports = router;