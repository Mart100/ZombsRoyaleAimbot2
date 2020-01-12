function tick() {
  enemy.x += enemySpeed
  if(enemy.x > canvas.width+400) enemy.x = 0
}
