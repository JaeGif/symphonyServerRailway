const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema(
  {
    users: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    public: { type: Boolean, required: true },
    topic: { type: String, required: true },
    description: { type: String, maxLength: 40 },
    title: { type: String, required: true },
    avatar: { type: String },
    seen: { type: Boolean },
  },
  { timestamps: true }
);

// Export model
module.exports = mongoose.model('Room', RoomSchema);
