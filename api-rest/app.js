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
app.get('/api/new_user/:email-:password-:name-:lastname', (req, res) => {
  // terminar
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
