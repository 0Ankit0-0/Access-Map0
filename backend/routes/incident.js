import express from "express";
import {
  reportIncident,
  getPendingIncidents,
  getApprovedIncidents,
  voteIncident,
  removeIncident,
  addPublicIncident,
} from "../controllers/incidentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { incidentRateLimiter } from "../middleware/rateLimiter.js";
import { validateIncidentReport } from "../middleware/validators.js";
import upload from "../middleware/multerConfig.js";

const router = express.Router();

// Report an incident with file upload, validation, rate limiting, and auth
router.post(
  "/report",
  upload.single("image"),
  validateIncidentReport,
  incidentRateLimiter,
  authMiddleware,
  reportIncident
);

// Get pending incidents
router.get("/pending", getPendingIncidents);

// Get approved incidents
router.get("/approved", getApprovedIncidents);

// Vote on an incident
router.post("/:id/vote", authMiddleware, voteIncident);

// Remove incident (only sender can remove)
router.delete("/:id", authMiddleware, removeIncident);

// POST route for adding an incident publicly (no auth, but rate limited)
router.post("/public", incidentRateLimiter, addPublicIncident);

export default router;
