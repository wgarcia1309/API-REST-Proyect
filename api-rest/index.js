const mongoose = require('mongoose')
const app = require('./app.js')
const port = 3000

mongoose.connect('mongodb://localhost:27017/hotels', (err, res) => {
  if (err) {
    console.log(`Error al conectarse a la base de datos `)
    console.log(`${err}`)
  }
  console.log('Conecion a la base de datos establecida...')
  app.listen(port, () => {
    console.log(`API REST corriendo en http://localhost:${port}`)
  })
})
