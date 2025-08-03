// backend/models/User.js
const express = require('express');
const pasth = require("path");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: { type: String, unique: true, required: true },
  password: {type: String, required: true}
});

// encrypt password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// compare password
userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model('Documents', userSchema);
module.exports = UserModel