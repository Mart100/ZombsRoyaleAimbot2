const Jimp = require('jimp')
const ffi = require("ffi")
const {exec} = require('child_process')
var user32 = ffi.Library('user32', { 
  'SetCursorPos': [ 'long', ['long', 'long'] ],
  'mouse_event': ['void', ['int', 'int', 'int', 'int', 'int']]
}) 
const playerColors = [
    [252,199,119], // Default naked player
    [253,99,59] // Player with red target circle
]
const playerColorsLength = playerColors.length
const playerSize = 20
const pixelSkip = 5
let screenSize = {x: 1920, y: 1080}
const enemyScreenShotSize = 400
let screenshotLocation = `H://Programming/Projects/ZombsRoyaleAimbot2/screenshot.jpg`
let enemyPositions = []
let enemyVelocity = {x: 0, y: 0}
let enemyOnScreen = false
let predictedEnemyPos = {x: 0, y: 0}
let keys = {}
let mouseDown = false
let autoShoot = false
let autoAim = false
let shootCircle = 200
let loop
let loopRunning = false
let loopCount = 0
let timeData = {
  screenshot: {}
}

function start() {
  // if trying to start. But already running. Stop first
  if(loopRunning) {
    clearInterval(loop)
    console.log('Aimbot Restarted')
  } else {
    console.log('Aimbot Started')
  }
  // Main loop
  loop = setInterval(async () => {
    loopRunning = true
    loopCount++

    if(loopCount % 50 == 0) {
      timeData.screenshot.start = Date.now()
      let newEnemyPos = await getEnemyPos()
      timeData.screenshot.end = Date.now() - timeData.screenshot.start
      if(newEnemyPos == 0) {
        enemyOnScreen = false
      }
      else {
        enemyOnScreen = true
        enemyPositions.push({pos: newEnemyPos, time: Date.now()})
        calculateEnemyVelocity()
      }
    }

    predictedEnemyPos = predictEnemyPos()
    if(enemyOnScreen || keys[42]) {
      if(predictedEnemyPos != 0) {
        if(autoAim || keys[42]) {
          let shootPos = {x: 0, y:0}
          shootPos.x = predictedEnemyPos.x
          shootPos.y = predictedEnemyPos.y

          shootPos.x -= screenSize.x/2
          shootPos.y -= screenSize.y/2
          magnitude = Math.sqrt((shootPos.x)**2 + (shootPos.y)**2)
          shootPos.x = screenSize.x/2 + shootPos.x/magnitude * shootCircle
          shootPos.y = screenSize.y/2 + shootPos.y/magnitude * shootCircle

          shootPos.y += 30
          user32.SetCursorPos(Math.round(shootPos.x), Math.round(shootPos.y))
        }
        if(autoShoot || keys[42]) {
          user32.mouse_event(2, 0, 0, 0, 0)
          mouseDown = true
        }
      }
    }
    // mouseUp when no1 on screen
    if(!enemyOnScreen && mouseDown) user32.mouse_event(4, 0, 0, 0, 0)
  }, 2)

  
  // send drawData to client
  setInterval(() => {
    let drawData = {
      predictedEnemyPos: predictedEnemyPos,
      enemyPositions: enemyPositions,
      enemyVelocity: enemyVelocity,
      enemyOnScreen: enemyOnScreen
    }
    socket.emit('drawData', drawData)
  }, 50)

}


function stop() {
  clearInterval(loop)
  if(loopRunning) console.log('Aimbot Stopped')
  else console.log('Cant stop aimbot when not running')
  loopRunning = false
}

function updateKeys(data) {
  keys = data

  // if F8. STOP
  if(keys[66]) stop()
}
function socket(data) {
  socket = data
}

function settings(data) {
  let name = data.name
  let value = data.value
  if(name == 'screenSize') screenSize = value
  if(name == 'autoAim') autoAim = value
  if(name == 'autoShoot') autoShoot = value
}

function predictEnemyPos() {
  let lastEnemy = enemyPositions[enemyPositions.length-1]
  if(lastEnemy == undefined || lastEnemy.pos == undefined) return 0
  let distance = Math.sqrt((screenSize.x/2 - lastEnemy.pos.x)**2 + (screenSize.y/2 - lastEnemy.pos.y)**2 )
  let timeBetweenNow = (Date.now() - lastEnemy.time)
  let predictedMove = {x: enemyVelocity.x*timeBetweenNow, y: enemyVelocity.y*timeBetweenNow}
  let predictedPos = {x: predictedMove.x+lastEnemy.pos.x, y: predictedMove.y+lastEnemy.pos.y}
  return predictedPos
}

function calculateEnemyVelocity() {
  let latest = enemyPositions.slice(-2)
  if(latest.length == 0) return 0
  if(latest.length == 1) return latest[0].pos
  
  let timeBetween = latest[0].time - latest[1].time
  let posBetweenX = latest[0].pos.x - latest[1].pos.x -0.00001
  let posBetweenY = latest[0].pos.y - latest[1].pos.y -0.00001
  let xPerSec = posBetweenX/timeBetween
  let yPerSec = posBetweenY/timeBetween
  enemyVelocity = {x: xPerSec, y: yPerSec }
}

async function getEnemyPos() {
  return new Promise(async (resolve, reject) => {
    // decide which part of screen to screenshot
    let screenshotLoc = ''
    if(enemyOnScreen) {
      screenshotLoc = `${predictedEnemyPos.x-200} ${predictedEnemyPos.y+30-200} 400 400`

      if(predictedEnemyPos.x-200 < 0 || predictedEnemyPos.x+200 > screenSize.x) screenshotLoc = ''
      if(predictedEnemyPos.y-200 < 0 || predictedEnemyPos.y+200 > screenSize.y) screenshotLoc = ''

      //if(screenshotLoc != '') console.log('screenshotLoc: ', screenshotLoc)
    }

    exec(`Nircmd.exe savescreenshot "${screenshotLocation}" ${screenshotLoc}`)
    setTimeout(async() => {
        let pos = 0
        try {
            pos = await Jimp.read('screenshot.jpg').then(imageProcessing)
        } catch(e) { 
            //throw e
            resolve(0) 
        }

        if(pos != 0) {
            // add size of player
            pos.x += playerSize
            pos.y += playerSize

            // if only took screenshot of small portion of screen. Add up
            if(screenshotLoc != '') {
            pos.x += predictedEnemyPos.x-200
            pos.y += predictedEnemyPos.y-200
            }
        }

        resolve(pos)
    }, 50)
  })
}

async function imageProcessing(image) {
  let pos = 0
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    if(x % 5 != 0) return
    if(y % 5 != 0) return
    if(pos != 0) return

    // get colors
    let r = image.bitmap.data[idx+0]
    let g = image.bitmap.data[idx+1]
    let b = image.bitmap.data[idx+2]
    let pixColor = [r,g,b]

    // return if pixel is grass
    if(arraysEqual(pixColor, [35,51,40])) return

    // return if pixel in middle. Since it will be player himself
    if(x > screenSize.x/2-60 && x < screenSize.x/2+60  &&  y > screenSize.y/2-60 && y < screenSize.y/2+60) return
    
    // check if playerColors has pixelColor
    for(let i=0;i<playerColorsLength;i++) if(arraysEqual(playerColors[i], pixColor)) pos = {x: x, y: y}


  })
  return pos
}



function arraysEqual(a, b) {
  if (a === b) return true
  if (a == null || b == null) return false
  if (a.length != b.length) return false

  for(let i=0; i<a.length;++i) if(a[i]!==b[i]) return false
  return true
}


module.exports = {start: start, updateKeys: updateKeys, socket: socket, settings: settings, stop: stop}