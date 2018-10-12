const Hotel = require('../models/Hotel')

function charge (res) {
  let jsonObj = require('../files/output.json')
  let hotels = new Hotel()

  jsonObj.forEach((hotel) => {
    hotels.collection.insertOne({
      name: hotel['HOTEL NAME'],
      address: hotel['ADDRESS'],
      latitude: hotel['LATITUDE'],
      longitude: hotel['LONGITUDE'],
      state: hotel['STATE'],
      phone: hotel['PHONE'],
      fax: hotel['FAX'],
      email: hotel['EMAIL ID'],
      website: hotel['WEBSITE'],
      type: hotel['TYPE'],
      room: hotel['Rooms']
    })
  }
  )
  res.status(200).send({ message: 'Base de datos cargada con exito' })
}

function xlsx2j (res) {
  let xlsxj = require('xlsx-to-json')
  xlsxj({
    input: './files/seed.xlsx',
    output: './files/output.json' },
  (err) => {
    if (err) res.status(500).send({ message: `Error al convertir a json ${err}` })
    res.status(200).send({ message: 'Convertido a json con exito' })
  })
}

module.exports = {
  charge,
  xlsx2j,
  Hotel
}
