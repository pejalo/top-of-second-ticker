export default class {
  _startDate
  _callback
  _isRunning

  start(callback, shouldExecuteCallbackImmediately = true) {
    this._startDate = new Date()
    this._callback = callback
    this.resume(shouldExecuteCallbackImmediately)
  }

  stop() {
    this._startDate = undefined
    this._callback = undefined
  }

  pause() {
    this._isRunning = false
  }

  resume(shouldExecuteCallbackImmediately = true) {
    if (!this._startDate || !this._callback)
    // ticker was stopped or never started, thus cannot be resumed
      return
    this._isRunning = true
    // set this value for `go` to close over
    const thisInstanceStartDate = this._startDate
    ;(function go(shouldExecuteCallback, scheduledDate) {
      if (this._startDate !== thisInstanceStartDate)
      // ticker was either stopped, or started again. this instance of `go` is no longer valid
        return
      if (!this._isRunning)
      // ticker was paused. wait until it is resumed
        return
      if (shouldExecuteCallback)
        this._callback(scheduledDate)
      // call `go` again at the top of the next second
      const nowValue = new Date().valueOf()
      const topOfNextSecond = nowValue - (nowValue % 1000) + 1000
      const millisecondsToWait = topOfNextSecond - nowValue
      setTimeout(go.bind(this, true, new Date(topOfNextSecond)), millisecondsToWait)
    }).bind(this)(shouldExecuteCallbackImmediately, undefined)
  }
}
