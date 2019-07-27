// Require mongoose
var mongoose = require("mongoose");

// Get a reference to the mongoose Schema constructor
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
 title: {
    type: String,
    trim: true,
    required: "Title is Required"
  },
 message: {
    type: String,
    trim: true,
    required: "Message is Required"
  },
  // `date` must be of type Date. The default value is the current date
  createdDate: {
    type: Date,
    default: Date.now
  }
});

// This creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Example model
module.exports = Comment;
