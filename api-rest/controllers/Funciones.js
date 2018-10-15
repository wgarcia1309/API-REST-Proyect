const Hotel = require('../models/Schema').Hotel
const User = require('../models/Schema').User
const Reserve = require('../models/Schema').Reserve
const ApiKey = require('../models/Schema').ApiKey
function charge (res) {
  let jsonObj = require('../files/output.json')
  jsonObj.forEach((hotel) => {
    let ro = hotel['Rooms']
    let size
    if (ro < 50) size = 'small'
    else {
      if (ro < 100) size = 'medium'
      else { size = 'large' }
    }
    Hotel.collection.insertOne({
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
      room: parseInt(hotel['Rooms']),
      size: size
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

function val (sdate, fdate, Troom, Rroom, res) {
  return new Promise(() => {
    var sw = true
    if ((sdate - fdate) > 0) return res.status(500).send({ message: `Error la fecha final esta antes de la inicial  ${err}` })
    let today = new Date(sdate.getTime())
    var i = 0
    while (i < -1 * ((sdate - fdate) / 86400000) && sw === true) {
      Reserve.find({ sDate: { $lte: today } }, (err, users) => {
        if (err) return res.status(500).send({ message: `Error al buscar  ${err}` })
        let Aroom = users.length
        console.log(parseInt(Aroom) + parseInt(Rroom))
        console.log(Troom)
        if (Troom < Aroom + parseInt(Rroom)) {
          sw = false
          console.log(sw)
        }
      })
      today.setDate(today.getDate() + 1)
      i++
    }
    console.log('????')
  }).then(console.log('yes'), console.log('no'))
}

module.exports = {
  charge,
  xlsx2j,
  Hotel,
  User,
  Reserve,
  val,
  ApiKey
}
