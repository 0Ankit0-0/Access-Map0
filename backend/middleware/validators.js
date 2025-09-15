import Joi from 'joi';

// Validation schema for incident reporting
export const incidentReportSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().min(1).max(500).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  placeName: Joi.string().min(1).max(100).required(),
  type: Joi.string().valid('Obstacle', 'Hazard', 'Amenity').required(),
});

// Middleware to validate request body
export const validateIncidentReport = (req, res, next) => {
  const { error } = incidentReportSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
