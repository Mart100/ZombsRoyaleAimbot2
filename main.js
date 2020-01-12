// own scripts
let aimbot = require('./aimbot.js')
let server = require('./server.js')

// modules
let ioHook = require('ioHook')

// other vars
let keys = {}
let win

// start server
server.start()

// listen for keys
ioHook.on("keydown", event => { 
  keys[event.keycode] = true
  aimbot.updateKeys(keys)
})
ioHook.on("keyup", event => { 
  keys[event.keycode] = false
  aimbot.updateKeys(keys)
})
ioHook.start()
