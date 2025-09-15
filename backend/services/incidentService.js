import Incident from '../models/Incident.js';

// Service for creating an incident
export const createIncident = async (incidentData) => {
  const incident = new Incident(incidentData);
  await incident.save();
  return incident;
};

// Service for getting incidents by approval status
export const getIncidentsByApproval = async (isApproved) => {
  return await Incident.find({ isApproved });
};

// Service for voting on an incident
export const voteOnIncident = async (incidentId) => {
  const incident = await Incident.findById(incidentId);
  if (!incident) return null;

  incident.votes += 1;
  await incident.save();

  // Check if votes exceed the threshold for approval
  if (incident.votes >= 5) {
    incident.isApproved = true;
    await incident.save();
  }

  return incident;
};

// Service for removing an incident
export const removeIncident = async (incidentId, userId) => {
  const incident = await Incident.findById(incidentId);
  if (!incident) return null;

  if (incident.sender.toString() !== userId) {
    return false;
  }

  await incident.remove();
  return true;
};

export default {
  createIncident,
  getIncidentsByApproval,
  voteOnIncident,
  removeIncident,
};
