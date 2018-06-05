var TIMEOUT_FOR_POPUP = 30
var TIMEOUT_IN_SECS = 60*3

var TEMPLATE = '<div style="position: fixed; top: 0; width: 100%; background-color: #EFFBFB; z-index: 1"><h1>' +
  '<span class="js-timer-minutes">00</span>:' +
  '<span class="js-timer-seconds">00</span>' +
  '</h1></div>'

function padZero(number) {
  return ("00" + String(number)).slice(-2);
}

class Timer {
  // IE does not support new style classes yet
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
  constructor(timeout_in_secs) {
    this.initial_timeout_in_secs = timeout_in_secs
    this.reset()
  }

  getTimestampInSecs() {
    var timestampInMilliseconds = new Date().getTime()
    return Math.round(timestampInMilliseconds / 1000)
  }

  start() {
    if (this.isRunning)
      return
    this.timestampOnStart = this.getTimestampInSecs()
    this.isRunning = true
  }

  stop() {
    if (!this.isRunning)
      return
    this.timeout_in_secs = this.calculateSecsLeft()
    this.timestampOnStart = null
    this.isRunning = false
  }

  reset(timeout_in_secs) {
    this.isRunning = false
    this.timestampOnStart = null
    this.timeout_in_secs = this.initial_timeout_in_secs
  }

  calculateSecsLeft() {
    if (!this.isRunning)
      return this.timeout_in_secs
    var currentTimestamp = this.getTimestampInSecs()
    var secsGone = currentTimestamp - this.timestampOnStart
    return Math.max(this.timeout_in_secs - secsGone, 0)
  }
}

class TimerWidget {
  // IE does not support new style classes yet
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
  construct() {
    this.timerContainer = this.minutes_element = this.seconds_element = null
  }

  mount(rootTag) {
    if (this.timerContainer)
      this.unmount()

    // adds HTML tag to current page
    this.timerContainer = document.createElement('div')

    this.timerContainer.setAttribute("style", "height: 100px;")
    this.timerContainer.innerHTML = TEMPLATE

    rootTag.insertBefore(this.timerContainer, rootTag.firstChild)

    this.minutes_element = this.timerContainer.getElementsByClassName('js-timer-minutes')[0]
    this.seconds_element = this.timerContainer.getElementsByClassName('js-timer-seconds')[0]
  }

  update(secsLeft) {
    var minutes = Math.floor(secsLeft / 60);
    var seconds = secsLeft - minutes * 60;

    this.minutes_element.innerHTML = padZero(minutes)
    this.seconds_element.innerHTML = padZero(seconds)

  }

  unmount() {
    if (!this.timerContainer)
      return
    this.timerContainer.remove()
    this.timerContainer = this.minutes_element = this.seconds_element = null
  }
}


function main() {

  var timer = new Timer(TIMEOUT_IN_SECS)
  var timerWiget = new TimerWidget()
  var intervalId = null

  var intervalIdForPopup = null
  var timerForPopup = new Timer(TIMEOUT_FOR_POPUP)
  var popupCounter = 0

  timerWiget.mount(document.body)

  function handleIntervalTickForPopup() {
    var secsLeft = timerForPopup.calculateSecsLeft()
    if (secsLeft === 0) {
      popupCounter = popupCounter + 1
      window.alert('You could not find it on the ' + popupCounter + ' try.')
      timerForPopup.reset()
      timerForPopup.start()
    }
  }

  function handleVisibilityChangeForPopup() {
    if (document.hidden) {
      timerForPopup.stop()
      clearInterval(intervalIdForPopup)
      intervalIdForPopup = null
    } else {
      timerForPopup.start()
      intervalIdForPopup = intervalIdForPopup || setInterval(handleIntervalTickForPopup, 300)
    }
  }

  function handleIntervalTick() {
    var secsLeft = timer.calculateSecsLeft()
    timerWiget.update(secsLeft)
    if (secsLeft === 0) {
      clearInterval(intervalId)
      document.addEventListener("visibilitychange", handleVisibilityChangeForPopup, false)
      handleVisibilityChangeForPopup()
    }
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      timer.stop()
      clearInterval(intervalId)
      intervalId = null
    } else {
      timer.start()
      intervalId = intervalId || setInterval(handleIntervalTick, 300)
    }
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
  document.addEventListener("visibilitychange", handleVisibilityChange, false);
  handleVisibilityChange()
}

// initialize timer when page ready for presentation
window.addEventListener('load', main)