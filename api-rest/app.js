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
app.post('/api/new_user/', (req, res) => {
  let user = new func.User()
  user.email = req.query.email
  user.password = req.query.password
  user.name = req.query.name
  user.lastname = req.query.lastname
  user.address = req.query.address

  user.save((err, User) => {
    if (err) return res.status(500).send({ message: `Error al salvar la base de datos ${err}` })
    res.status(200).send({ _id: User['_id'] })
  })
})

// actualizacion de un usuario
app.post('/api/update_user/', (req, res) => {
  func.User.update({ _id: req.query.id }, {
    password: req.query.newpassword,
    address: req.query.newadd
  }, (err, users) => {
    if (err) return res.status(500).send({ value: 0, message: `Error al realizar la peticion ${err}` })
    if (users.n === 0) return res.status(404).send({ value: 0, message: `File no found` })
    res.status(200).send({ value: 1 })
  })
})

//  Hacer una reservación
app.post('/api/reserve/', (req, res) => {
  func.Hotel.find({
    _id: req.body.hotel_id
  }, (err, hotels) => {
    if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
    if (hotels.length === 0) return res.status(500).send({ message: `No existe un hotel con ese Id` })
    func.User.find({
      _id: req.body.user_id
    }, (err, users) => {
      if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
      if (users.length === 0) return res.status(500).send({ message: `No existe un usuario con ese Id` })
      //  funcion validadora

      myFuncion()
      async function myFuncion () {
        try {
          let wait = await func.val(new Date(req.body.sdate), new Date(req.body.fdate), hotels[0].room, req.body.nroom, res)
          console.log(wait)
          if (wait) {
            let reserve = new func.Reserve()
            reserve.hotel_id = req.body.hotel_id
            reserve.user_id = req.body.user_id
            reserve.sDate = new Date(req.body.sdate)
            reserve.fDate = new Date(req.body.fdate)
            reserve.nroom = req.body.nroom
            reserve.save((err, Reserve) => {
              if (err) return res.status(500).send({ message: `Error al salvar la base de datos ${err}` })
              res.status(200).send({ _id: Reserve['_id'] })
            })
          } else { if (err) return res.status(500).send({ message: `No hay habitaciones disponibles en esas fechas ${err}` }) }
        } catch (err) {
          console.log(':c')
        }
      }
    })
  })
})

app.post('/api/new_Key/', (req, res) => {
  let apiKey = new func.ApiKey()
  apiKey.contact_name = req.body.contact_name
  apiKey.company = req.body.company
  apiKey.email = req.body.email

  apiKey.save((err, apik) => {
    if (err) return res.status(500).send({ message: `Error al salvar la base de datos ${err}` })
    res.status(200).send({ _id: apik['_id'] })
  })
})

// busqueda de hotel por nombre,estado y tipo
app.get('/api/HOTEL_NAME/', (req, res) => {
  func.Hotel.find({
    name: { $regex: req.query.name, $options: 'i' },
    state: { $regex: req.query.state, $options: 'i' },
    type: { $regex: req.query.type, $options: 'i' },
    size: { $regex: req.query.size, $options: 'i' }
  }, (err, hotels) => {
    if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
    res.status(200).send({ hotels })
  })
})

// creacion de un hotel
app.post('/api/new_hotel/', (req, res) => {
  let hotel = new func.Hotel()
  hotel.name = req.query.nam
  hotel.address = req.query.add
  hotel.latitude = req.query.lat
  hotel.longitude = req.query.lon
  hotel.state = req.query.state
  hotel.phone = req.query.pho
  hotel.fax = req.query.fax
  hotel.email = req.query.ema
  hotel.website = req.query.web
  hotel.type = req.query.typ
  hotel.room = req.query.room
  hotel.size = req.query.siz
  hotel.save((err, Hotel) => {
    if (err) return res.status(500).send({ message: `Error al salvar la base de datos ${err}` })
    res.status(200).send({ _id: Hotel['_id'] })
  })
})

// Actualizacion de un hotel
app.post('/api/update_hotel/', (req, res) => {
  let id = req.query.id
  func.Hotel.update({ _id: id }, {
    phone: req.query.phone,
    email: req.query.email,
    website: req.query.web,
    type: req.query.htype,
    room: req.query.rooms
  }, (err, hotels) => {
    if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
    else if (hotels.n === 0) return res.status(404).send({ message: 'El ID del hotel no existe' })
    res.status(200).send({ 'value': 1 })
  })
})

// Eliminacion de hotel
app.delete('/api/DEL_HOTEL/', (req, res) => {
  let id = req.query.id
  func.Hotel.deleteOne({
    _id: id
  }, (err, hotels) => {
    if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
    else if (hotels.n === 0) return res.status(404).send({ message: 'El ID del hotel no existe' })
    else res.status(200).send({ message: 'Hotel eliminado' })
  })
})

module.exports = app
