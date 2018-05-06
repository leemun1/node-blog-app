const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Creat Schema
const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  user: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model('Post', PostSchema);

module.exports = { Post };