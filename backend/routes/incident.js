import express from "express";
import Incident from "../models/Incident.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Report an incident
router.post("/report", authMiddleware, async (req, res) => {
  try {
    const incident = new Incident({
      ...req.body,
      sender: req.user.id, // Store sender's user ID
    });
    await incident.save();
    res.status(201).json(incident);

    // Emit a notification to all users about the new incident
    req.io.emit("newIncident", incident);
  } catch (error) {
    res.status(400).json({ message: "Error reporting incident", error });
  }
});
// In your incidents route handler
router.get("/pending", async (req, res) => {
  try {
    const incidents = await Incident.find({ isApproved: false });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching incidents" });
  }
});
// In your incidents route handler
router.get("/approved", async (req, res) => {
  try {
    const incidents = await Incident.find({ isApproved: true });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching incidents" });
  }
});

// Vote on an incident
router.post("/:id/vote", authMiddleware, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident)
      return res.status(404).json({ message: "Incident not found" });

    incident.votes += 1;
    await incident.save();

    // Check if votes exceed the threshold for approval
    if (incident.votes >= 5) {
      incident.isApproved = true;
      await incident.save();
      req.io.emit("approvedIncident", incident); // Notify clients
    }

    res.status(200).json(incident);
  } catch (error) {
    res.status(400).json({ message: "Error voting on incident", error });
  }
});

// Remove incident (only sender can remove)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident)
      return res.status(404).json({ message: "Incident not found" });

    if (incident.sender.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only remove your own incidents" });
    }

    await incident.remove();
    res.status(200).json({ message: "Incident removed" });
  } catch (error) {
    res.status(400).json({ message: "Error removing incident", error });
  }
});

// POST route for adding an incident (alternative method without authMiddleware)
router.post("/public", async (req, res) => {
  try {
    const {
      title,
      description,
      latitude,
      longitude,
      placeName,
      type,
      image,
      sender,
    } = req.body;

    const newIncident = new Incident({
      title,
      description,
      latitude,
      longitude,
      placeName,
      type,
      image,
      sender,
    });

    await newIncident.save();

    res.status(201).json(newIncident);
  } catch (error) {
    res.status(400).json({ message: "Error adding incident", error });
  }
});

export default router;
