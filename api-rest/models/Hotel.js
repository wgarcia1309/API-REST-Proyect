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
  room: { type: Number, required: true }
})

module.exports = mongoose.model('Hotel', HotelSchema)
