function frame() {

  // rerun frame
  window.requestAnimationFrame(frame)
  
	// clear screen
	ctx.clearRect(0, 0, canvas.width, canvas.height)

  // draw enemy
  ctx.fillStyle = 'rgb(252, 200, 118)'
  ctx.beginPath()
  ctx.arc(enemy.x, enemy.y, 50, 0, 2 * Math.PI)
  ctx.fill()
}
