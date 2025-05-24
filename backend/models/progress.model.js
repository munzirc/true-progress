import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  intervals: [[Number]],
  lastPosition: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

progressSchema.index({ user: 1, video: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
