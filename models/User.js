const mongoose = require('mongoose'),
  passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true },
  bio: { type: String, maxLength: 150 },
  username: { type: String, required: true },
  password: { type: String, minLength: 6 },
  website: { type: String },
  isModerator: { type: Boolean, required: true },
  avatar: { type: String, required: true },
  rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
});

// plugin to handle passwords
UserSchema.plugin(passportLocalMongoose);

// Export model
module.exports = mongoose.model('User', UserSchema);
