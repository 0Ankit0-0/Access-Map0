import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
  title: String,
  description: String,
  latitude: Number,
  longitude: Number,
  placeName: String,
  type: String,
  image: String,
  votes: { type: Number, default: 0 },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isApproved: { type: Boolean, default: false },
});

export default mongoose.model('Incident', incidentSchema);
