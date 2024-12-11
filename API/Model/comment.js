const mongoose = require('mongoose');

const RateSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'Product',
  },
  users: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
      comment: {
        type: String, 
      },
      rate: {
        type: Number,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  rate: {
    type: Number,
    default: 0, 
  },
}, { versionKey: false });

module.exports = mongoose.model('Rate', RateSchema);