socket.on('drawData', (data) => {
  predictedEnemyPos = data.predictedEnemyPos
  enemyPositions = data.enemyPositions
  enemyVelocity = data.enemyVelocity
  enemyOnScreen = data.enemyOnScreen
})