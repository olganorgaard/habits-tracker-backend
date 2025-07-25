const mongoose = require('mongoose');

const habitSchema= new mongoose.Schema({
  userId: String,
  name: String,
  goal: Number, 
  history: [{ date: String, completed: Boolean }],
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Habit', habitSchema)