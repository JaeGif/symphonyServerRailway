const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    user: {
      _id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      username: { type: String, required: true },
      avatar: { type: String, required: true },
    },
    _id: { type: String, required: true },
    room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    message: { type: String, required: true },
    timestamp: { type: String, required: true },
  },
  { timestamps: true }
);

// Export model
module.exports = mongoose.model('Message', MessageSchema);
