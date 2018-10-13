'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')

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
  address: String,
  avatar: String
})

UserSchema.pre('save', (next)=> {
  let user = this
  if(!user.isModified('password')) return next()

  bcrypt.genSalt(10, (err, salt) => {
    if(err) return next(err)

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if(err) return next(err)

      user.password = hash
      next()
    })
  })
})

UserSchema.methods.gravatar = function () {
  if(!this.email) return 'https://gravatar.com/avatar/?s=200&d=retro'

  const md5 = crypto.createHash('md5').update(this.email).digest('hex')
  return 'https://gravatar.com/avatar/${md5}?s=200&d=retro'
}



let Hotel = mongoose.model('Hotel', HotelSchema)
let User = mongoose.model('User', UserSchema)
module.exports = { Hotel, User }
