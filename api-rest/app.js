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
  let id=req.params.id;
  func.User.update({_id:id}, {
      password: req.params.newpassword,
      address: req.params.newadd
  }, (err, users) => {
    if (err) return res.status(500).send({"value":0, message: `Error al realizar la peticion ${err}` })
    res.status(200).send({"value":1})
  })
})
//Hacer una reservación
app.get('/api/reserve/:hotel_id-:user_id-:sdate-:fdate', (req, res) => {
  func.Hotel.find({
    _id: req.params.hotel_id
  }, (err, hotels) => {
    if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
    if (hotels.length==0) return res.status(500).send({ message: `No existe un hotel con ese Id` })

    let reserve = new func.Reserve()
    reserve.hotelId = req.params.hotel_id
    reserve.userId = req.params.user_id
    reserve.sDate = req.params.sdate
    reserve.fDate = req.params.fdate

    reserve.save((err, Reserve) => {
      if (err) return res.status(500).send({ message: `Error al salvar la base de datos ${err}` })
      res.status(200).send({ _id: Reserve['_id'] })
    })

  })
})



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

app.put('/api/HOTEL_NAME/:name', (req, res) => {

})

app.delete('/api/HOTEL_NAME/:name', (req, res) => {

})

module.exports = app
