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
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Post', PostSchema);