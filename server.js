// init project
var express = require('express')
var Socket = require('socket.io')
let aimbot = require('./aimbot.js')
var app = express()
let keys = []

function start() {
  app.use('/', express.static('client'))

  // listen on port :)
  var server = app.listen(process.env.PORT || 3001, () => {
    console.log('Your app is listening on port ' + server.address().port)
  })


  var io = Socket(server)


  io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`)

    socket.on('start', () => {
      aimbot.start()
      aimbot.socket(socket)
    })
    socket.on('settings', (data) => {
      aimbot.settings(data)
    })
    socket.on('stop', () => {
      aimbot.stop()
    })
  })
}

module.exports = {start: start}