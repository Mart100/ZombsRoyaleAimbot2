let canvas, ctx
let enemy = {x: 0, y: 500}
let enemySpeed = 5

$(function() {
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  frame()
  setInterval(() => { tick() }, 10)
})
