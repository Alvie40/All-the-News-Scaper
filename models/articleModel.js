// Require mongoose
var mongoose = require("mongoose");

// Get a reference to the mongoose Schema constructor
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
 title: {
    type: String,
    trim: true,
    required: "Title is Required"
  },
 summary: {
    type: String,
    trim: true,
 },
 link: {
    type: String,
    trim: true,
    required: "Link is Required"
  },
  saved: {
    type: Boolean,
    default: false
  },
  // `date` must be of type Date. The default value is the current date
  createdDate: {
    type: Date,
    default: Date.now
  },
  // `comments` is an array that stores ObjectIds
  // The ref property links these ObjectIds to the comment model
  // This allows us to populate the article with any associated comments
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Example model
module.exports = Article;
