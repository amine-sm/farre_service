const jwt = require("jsonwebtoken");

const COOKIE_NAME =
  process.env.COOKIE_NAME ||
  "farre_admin_token";

exports.requireAdmin = (
  req,
  res,
  next
) => {
  try {
    const token =
      req.cookies?.[COOKIE_NAME];

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Authentification obligatoire.",
      });
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (payload.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Accès interdit.",
      });
    }

    req.auth = {
      userId: Number(payload.sub),
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Session expirée ou invalide.",
    });
  }
};