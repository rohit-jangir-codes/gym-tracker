const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    weight: { type: Number },
    bodyFat: { type: Number },
    measurements: {
      chest: { type: Number },
      waist: { type: Number },
      hips: { type: Number },
      bicep: { type: Number },
      thigh: { type: Number },
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', progressSchema);
