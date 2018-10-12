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

//  punto 1
app.get('/api/HOTEL_NAME/:name-:state', (req, res) => {
  let nam = req.params.name
  let state = req.params.state
  func.Hotel.find({ name: { $regex: nam, $options: 'i' }, state: { $regex: state, $options: 'i' } }, (err, hotels) => {
    if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })

    res.status(200).send({ hotels })
  })
})

// app.get('/api/HOTEL_NAME/:name', (req, res) => {
//   let name = req.params.name
//
//   func.Hotel.findById(name, (err, hotel) => {
//     if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
//
//     res.status(200).send({ hotel })
//   })
// })

app.put('/api/HOTEL_NAME/:name', (req, res) => {

})

app.delete('/api/HOTEL_NAME/:name', (req, res) => {

})

module.exports = app
