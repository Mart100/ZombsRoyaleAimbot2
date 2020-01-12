$(() => { 
  // start aimbot button
  $('#start').on('click', () => {
    $('#start').off()
    $('#start').animate({'top': '-100px'}, 1000, () => {
      $('#start').remove()
      $('#settings').append('<div id="loadBar"></div>')
      $('#loadBar').animate({'width': '1920px'}, 5000, () => {
        $('#loadBar').animate({'top': '-100px'}, 1000, () => {
          $('#loadBar').remove()
          socket.emit('start')
          $('#settings > .setting').show().animate({'opacity': '1'}, 400)

          // autoShoot
          $('#autoShoot').on('click', () => {
            if(settings.autoShoot) {
              settings.autoShoot = false
              $('#autoShoot').removeClass('selected')
            } else {
              settings.autoShoot = true
              $('#autoShoot').addClass('selected')

            }
            socket.emit('settings', {name: 'autoShoot', value: settings.autoShoot})
          })

          // autoAim
          $('#autoAim').on('click', () => {
            if(settings.autoAim) {
              settings.autoAim = false
              $('#autoAim').removeClass('selected')
            } else {
              settings.autoAim = true
              $('#autoAim').addClass('selected')

            }
            socket.emit('settings', {name: 'autoAim', value: settings.autoAim})
          })

          // advanced
          $('#advanced').on('click', () => {
            if($('#advanced .dropdown').css('display') == 'none') {
              $('#advanced .dropdown').show()
            } else {
              $('#advanced .dropdown').hide()
            }
          })

          // testing
          $('#testing').on('click', () => {
            $('#iframe').attr('src', '../testing/index.html')
          })

          // Start to server
          $('#strTSrv').on('click', () => {
            socket.emit('start')
          })
          // Stop to server
          $('#stpTSrv').on('click', () => {
            socket.emit('stop')
          })
        })
      })
    })
  })
})