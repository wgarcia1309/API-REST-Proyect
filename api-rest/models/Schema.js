'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HotelSchema = Schema({
  name: { type: String, required: true },
  address: String,
  latitude: Number,
  longitude: Number,
  state: String,
  phone: String,
  fax: Number,
  email: String,
  website: String,
  type: String,
  room: { type: Number, required: true },
  size: String
})

const UserSchema = Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, select: false },
  name: String,
  lastname: String,
  address: String
})
let Hotel = mongoose.model('Hotel', HotelSchema)
let User = mongoose.model('User', UserSchema)
module.exports = { Hotel, User }
