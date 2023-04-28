const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TopicSchema = new Schema({
  topic: { type: String, require: true },
});

// Export model
module.exports = mongoose.model('Topic', TopicSchema);
