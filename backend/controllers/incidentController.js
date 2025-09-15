import Incident from '../models/Incident.js';
import incidentService from '../services/incidentService.js';

// Controller for reporting an incident
export const reportIncident = async (req, res) => {
  try {
    const incidentData = req.body;
    if (req.file) {
      incidentData.image = req.file.filename;
    }
    incidentData.sender = req.user.id;
    const incident = await incidentService.createIncident(incidentData);
    res.status(201).json(incident);
    req.io.emit('newIncident', incident);
  } catch (error) {
    res.status(400).json({ message: 'Error reporting incident', error });
  }
};

// Controller for getting pending incidents
export const getPendingIncidents = async (req, res) => {
  try {
    const incidents = await incidentService.getIncidentsByApproval(false);
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching incidents' });
  }
};

// Controller for getting approved incidents
export const getApprovedIncidents = async (req, res) => {
  try {
    const incidents = await incidentService.getIncidentsByApproval(true);
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching incidents' });
  }
};

// Controller for voting on an incident
export const voteIncident = async (req, res) => {
  try {
    const incident = await incidentService.voteOnIncident(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    res.status(200).json(incident);
  } catch (error) {
    res.status(400).json({ message: 'Error voting on incident', error });
  }
};

// Controller for removing an incident
export const removeIncident = async (req, res) => {
  try {
    const result = await incidentService.removeIncident(req.params.id, req.user.id);
    if (!result) {
      return res.status(403).json({ message: 'You can only remove your own incidents' });
    }
    res.status(200).json({ message: 'Incident removed' });
  } catch (error) {
    res.status(400).json({ message: 'Error removing incident', error });
  }
};

// Controller for public incident addition (no auth)
export const addPublicIncident = async (req, res) => {
  try {
    const incidentData = req.body;
    const incident = await incidentService.createIncident(incidentData);
    res.status(201).json(incident);
  } catch (error) {
    res.status(400).json({ message: 'Error adding incident', error });
  }
};

// Controller for paginated incidents
export const getPaginatedIncidents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const totalIncidents = await Incident.countDocuments();
    const totalPages = Math.ceil(totalIncidents / limit);
    const skip = (page - 1) * limit;

    const incidents = await Incident.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: incidents,
      currentPage: page,
      totalPages,
      totalIncidents,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching paginated incidents', error });
  }
};
