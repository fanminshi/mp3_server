// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var Schema   = new mongoose.Schema({
  name: String,
  email: String,
  pendingTasks: [String],
  dateCreated: {type: Date, default: Date.now}
});

// Export the Mongoose model
module.exports = mongoose.model('User', Schema);