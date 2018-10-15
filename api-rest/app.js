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
  user.email = req.body.email
  user.password = req.body.password
  user.name = req.body.name
  user.lastname = req.body.lastname
  user.address = req.body.address

  user.save((err, User) => {
    if (err) return res.status(500).send({ message: `Error al salvar la base de datos ${err}` })
    res.status(200).send({ _id: User['_id'] })
  })
})

// actualizacion de un usuario
app.post('/api/update_user/', (req, res) => {
  func.User.update({ _id: req.body.id }, {
    password: req.body.newpassword,
    address: req.body.newadd
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

// Creacion de key
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
    size: { $regex: req.body.size, $options: 'i' }
  }, (err, hotels) => {
    if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
    res.status(200).send({ hotels })
  })
})

// creacion de un hotel
app.post('/api/new_hotel/', (req, res) => {
  func.ApiKey.find({ _id: req.body.apikey }, (err, keys) => {
    if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
    if (keys.length == 0) return res.status(404).send({ message: 'Api key no existe' })
    let hotel = new func.Hotel()
    hotel.name = req.body.nam
    hotel.address = req.body.add
    hotel.latitude = req.body.lat
    hotel.longitude = req.body.lon
    hotel.state = req.body.state
    hotel.phone = req.body.pho
    hotel.fax = req.body.fax
    hotel.email = req.body.ema
    hotel.website = req.body.web
    hotel.type = req.body.typ
    hotel.room = req.body.room
    hotel.size = req.body.siz
    hotel.save((err, Hotel) => {
      if (err) return res.status(500).send({ message: `Error al salvar la base de datos ${err}` })
      res.status(200).send({ _id: Hotel['_id'] })
    })
  })
})

// Actualizacion de un hotel
app.post('/api/update_hotel/', (req, res) => {
  func.ApiKey.find({ _id: req.body.apikey }, (err, keys) => {
    if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
    if (keys.length === 0) return res.status(404).send({ message: 'Api key no existe' })
    let id = req.body.id
    func.Hotel.update({ _id: id }, {
      phone: req.body.phone,
      email: req.body.email,
      website: req.body.web,
      type: req.body.htype,
      room: req.body.rooms
    }, (err, hotels) => {
      if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
      else if (hotels.n === 0) return res.status(404).send({ message: 'El ID del hotel no existe' })
      res.status(200).send({ 'value': 1 })
    })
  })
})

// Eliminacion de hotel
app.delete('/api/DEL_HOTEL/', (req, res) => {
  func.ApiKey.find({ _id: req.body.apikey }, (err, keys) => {
    if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
    if (keys.length === 0) return res.status(404).send({ message: 'Api key no existe' })
    func.Hotel.deleteOne({
      _id: req.body.id
    }, (err, hotels) => {
      console.log(hotels)
      if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
      else if (hotels.n === 0) return res.status(404).send({ message: 'El ID del hotel no existe' })
      else res.status(200).send({ message: 'Hotel eliminado' })
    })
  })
})

module.exports = app
