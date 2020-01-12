function frame() {  

  // rerun frame
  window.requestAnimationFrame(frame)

  // Clear Screen
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // if no enemy on screen. return
  if(!enemyOnScreen) return

  // some variables

  // draw enemy Pos
  ctx.beginPath()
  ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
  ctx.arc(predictedEnemyPos.x, predictedEnemyPos.y, 40, 0, 2 * Math.PI)
  ctx.fill()

  // draw enemyVelocity
  if(enemyVelocity != undefined) {
    ctx.strokeStyle = 'rgb(0, 0, 255)'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(predictedEnemyPos.x, predictedEnemyPos.y)
    ctx.lineTo(enemyVelocity.x*1e2 + predictedEnemyPos.x, enemyVelocity.y*1e2 + predictedEnemyPos.y)
    
    // arrow thing
    ctx.stroke()
  }

  // draw line from middle to predictedPos
  ctx.strokeStyle = 'rgb(255, 0, 0)'
  ctx.lineWidth = 0.2
  ctx.beginPath()
  ctx.moveTo(canvas.width/2, canvas.height/2)
  ctx.lineTo(predictedEnemyPos.x, predictedEnemyPos.y)
  ctx.stroke()

  // draw shootCircle
  ctx.beginPath()
  ctx.arc(canvas.width/2, canvas.height/2, 200, 0, 2 * Math.PI);
  ctx.stroke()

  // draw screenshotBox
  ctx.strokeStyle = 'rgb(0, 255, 0)'
  ctx.lineWidth = 0.2
  ctx.beginPath()
  ctx.rect(predictedEnemyPos.x-200, predictedEnemyPos.y-200, 400, 400)
  ctx.stroke()
}