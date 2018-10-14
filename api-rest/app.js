'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const func = require('./controllers/Funciones')
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/api/charge', (req, res) => {
  func.charge(res)
})

app.get('/api/xlsx2j', (req, res) => {
  func.xlsx2j(res)
})

// creacion de un nuevo usuario
app.get('/api/new_user/:email-:password-:name-:lastname-:address', (req, res) => {
  let user = new func.User()
  user.email = req.params.email
  user.password = req.params.password
  user.name = req.params.name
  user.lastname = req.params.lastname
  user.address = req.params.address

  user.save((err, User) => {
    if (err) return res.status(500).send({ message: `Error al salvar la base de datos ${err}` })
    res.status(200).send({ _id: User['_id'] })
  })
})

// actualizacion de un usuario
app.get('/api/update_user/:id-:newpassword-:newadd', (req, res) => {
  func.User.update({ _id: req.params.id }, {
    password: req.params.newpassword,
    address: req.params.newadd
  }, (err, users) => {
    if (err) return res.status(500).send({ value: 0, message: `Error al realizar la peticion ${err}` })
    if (users.n === 0) return res.status(404).send({ value: 0, message: `File no found` })
    res.status(200).send({ value: 1 })
  })
})

// Hacer una reservación
app.get('/api/reserve/:hotel_id-:user_id-:sdate-:fdate', (req, res) => {
  func.Hotel.find({
    _id: req.params.hotel_id
  }, (err, hotels) => {
    if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
    else if (hotels.length === 0) return res.status(500).send({ message: `No existe un hotel con ese Id` })
    else {
      let reserve = new func.Reserve()
      reserve.hotelId = req.params.hotel_id
      reserve.userId = req.params.user_id
      reserve.sDate = req.params.sdate
      reserve.fDate = req.params.fdate
      reserve.save((err, Reserve) => {
        if (err) return res.status(500).send({ message: `Error al salvar la base de datos ${err}` })
        else res.status(200).send({ _id: Reserve['_id'] })
      })
    }
  })
})

// busqueda de hotel por nombre,estado y tipo
app.get('/api/HOTEL_NAME/:name-:state-:type-:size', (req, res) => {
  func.Hotel.find({
    name: { $regex: req.params.name, $options: 'i' },
    state: { $regex: req.params.state, $options: 'i' },
    type: { $regex: req.params.type, $options: 'i' },
    size: { $regex: req.params.size, $options: 'i' }
  }, (err, hotels) => {
    if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
    res.status(200).send({ hotels })
  })
})

// creacion de un hotel
app.get('/api/new_hotel/:nam-:add-:lat-:lon-:state-:pho-:fax-:ema-:web-:typ-:room-:siz', (req, res) => {
  let hotel = new func.Hotel()
  hotel.name = req.params.nam
  hotel.address = req.params.add
  hotel.latitude = req.params.lat
  hotel.longitude = req.params.lon
  hotel.state = req.params.state
  hotel.phone = req.params.pho
  hotel.fax = req.params.fax
  hotel.email = req.params.ema
  hotel.website = req.params.web
  hotel.type = req.params.typ
  hotel.room = req.params.room
  hotel.size = req.params.siz
  hotel.save((err, Hotel) => {
    if (err) return res.status(500).send({ message: `Error al salvar la base de datos ${err}` })
    res.status(200).send({ _id: Hotel['_id'] })
  })
})

// Actualizacion de un hotel
app.get('/api/update_hotel/:id-:htype-:rooms-:phone-:web-:email', (req, res) => {
  let id = req.params.id
  func.Hotel.update({ _id: id }, {
    phone: req.params.phone,
    email: req.params.email,
    website: req.params.web,
    type: req.params.htype,
    room: req.params.rooms
  }, (err, hotels) => {
    if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
    else if (hotels.n === 0) return res.status(404).send({ message: 'El ID del hotel no existe' })
    res.status(200).send({ 'value': 1 })
  })
})

// Eliminacion de hotel
app.get('/api/DEL_HOTEL/:id', (req, res) => {
  let id = req.params.id
  func.Hotel.deleteOne({
    _id: id
  }, (err, hotels) => {
    if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
    else if (hotels.n === 0) return res.status(404).send({ message: 'El ID del hotel no existe' })
    else res.status(200).send({ message: 'Hotel eliminado' })
  })
})

module.exports = app
