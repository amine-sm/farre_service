const express = require("express");

const {
  createContactRequest,
  getContactRequests,
  getContactRequestById,
  updateContactRequestReadStatus,
  deleteContactRequest,
} = require("../controllers/contactRequestController");

const {
  requireAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", createContactRequest);

router.get("/", requireAdmin, getContactRequests);

router.get("/:id", requireAdmin, getContactRequestById);

router.patch(
  "/:id/read",
  requireAdmin,
  updateContactRequestReadStatus
);

router.delete(
  "/:id",
  requireAdmin,
  deleteContactRequest
);

module.exports = router;
