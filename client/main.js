
// Variables
let ctx, canvas
let settings = {
  autoShoot: false,
  autoAim: false,
}

let enemyOnScreen = false
let predictedEnemyPos = {x: 0, y: 0}
let enemyPositions = [{pos: {x: 0, y: 0}}, {pos: {x: 0, y: 0}}]
let enemyVelocity = {x: 0, y: 0}

$(() => {
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')
  frame()
})



// set size of things
setInterval(() => {
  // canvas size
  if(canvas.width != window.innerWidth) {
    canvas.width = window.innerWidth
    $('#canvas').css('width', canvas.width+'px')
  }
  if(canvas.height != window.innerHeight-30) {
    canvas.height = window.innerHeight-30
    $('#canvas').css('height', canvas.height+'px')
  }

  // send screenSize to server
  socket.emit('settings', {name: 'screenSize', value: {x: canvas.width, y: canvas.height}})


  // set iframe Size
  $('#iframe').css('height', canvas.height+'px')
}, 1000)
