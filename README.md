# top-of-second-ticker

Schedule your callback function to be run every second, close to when the system clock changes.

This relies on the [`setTimeout()`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) global function.

## Install

```bash
npm install top-of-second-ticker --save
```

## Summary

This package exposes a single class with four methods: `start(callback)`, `pause()`, `resume()`, `stop()`.

## Example

```js
import TopOfSecondTicker from 'top-of-second-ticker'

const ticker = new TopOfSecondTicker()

// start immediately
ticker.start((scheduledDate) => {
    console.log('ran', schdeuledDate)
})

// stop after ten seconds
setTimeout(ticker.stop, 10 * 1000)

// pause when the browser becomes inactive
document.addEventListener('visibilitychange', (_) => {
    if (document.visibilityState === 'visible')
        ticker.resume()
    else
        ticker.pause()
})
```

## Guide

- Constructor takes no arguments.

- `.start(callback, shouldExecuteCallbackImmediately = true)`

  `callback` is your function to be executed repeatedly. It will be passed one argument: a [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) object for when this class _intended_ to execute the callback (at the top of the second). Thus, the date's [`.valueOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/valueOf) (in milliseconds) will be divisible by 1000. If `shouldExecuteCallbackImmediately` is `true` (the default, see explanation below), the first time `callback` is executed, its date will be `undefined`.
  
  Note: The actual exact time that `callback` is executed will be some number of milliseconds after  the intended Date. If your code runs smoothly, this delay should be imperceptible to the user. For reference, see [`setTimeout()`'s Reasons for delays longer than specified](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#reasons_for_delays_longer_than_specified)

  If `shouldExecuteCallbackImmediately` is `false`, `callback` will not be executed until the top of the next second.

  If `.start(...)` is called multiple times on the same ticker instance, the previous `callback`s are forgotten. Only the most recent `callback` will continue to execute repeatedly.

- `.pause()` takes no arguments.

  When paused, the most recent `callback` is still remembered, so you can easily call `.resume()` again to continue execution.

- `.resume(shouldExecuteCallbackImmediately = true)`
  
  `shouldExecuteCallbackImmediately` behaves just like the argument to `.start(...)` above.

- `.stop()` takes no arguments.
  
  Once stopped, the `callback` is forgotten, and `resume()` has no effect (until you call `.start(...)` again).
