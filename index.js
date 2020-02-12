/*
  If the location.hash element doesn't exist yet, show a spinner until
  it does, then jump there.
*/
const whenDomReady = require('when-dom-ready')
const debug = require('debug')('late-jump')

const $ = (selector, elem) => {
  if (elem === undefined) elem = document
  return elem.querySelector(selector)
}

let interval
let spinner
let count = 0 // don't show spinner for short waits

whenDomReady().then(() => {
  if (document.location.hash) {
    const elem = $(document.location.hash)
    if (!elem) {
      debug('we are needed')
      interval = setInterval(check, 200)
    } else {
      debug('we are not needed')
    }
  } else {
    debug('no hash')
  }
})

function check () {
  // If we arrived at the page with a hash (fragmentID) of an element
  // that's not loaded yet, we might be in the wrong place.  Important
  // that we only do this once.
  debug('can we late jump now?')
  const elem = $(document.location.hash)
  if (elem) {
    clearInterval(interval)
    debug('YES', elem)
    // This puts us to the right place, but doesn't activate
    // the :target css (at least in FF 77.0.1 Linux)
    //
    // elem.scrollIntoView(true)
    //
    // So instead lets do this:
    const hash = document.location.hash
    document.location.hash = ''
    if (spinner) {
      spinner.style.display = 'none'
      // document.body.removeChild(spinner)
      debug('spinner disabled')
    }
    setTimeout(() => {
      document.location.hash = hash
    }, 1)
  } else {
    debug('not yet')
    if (count++ > 3 && !spinner) {
      spinner = document.createElement('div')
      spinner.id = 'spinner'
      spinner.innerHTML = '<b>Working...</b><div class="loader"></div>'
      const first = document.body.firstChild
      first.parentNode.insertBefore(spinner, first)
      debug('spinner element', spinner, spinner.outerHTML)
      debug('first el', first)
    }
    if (count === 35) {
      console.error('fragment taking too long to appear?')
      spinner.style.display = 'none'
    }
  }
}
