// MIT License https://github.com/vuetifyjs/vuetify
function buildThresholdList (numSteps = 5) {
  let thresholds = []

  for (let i = 1.0; i <= numSteps; i++) {
    let ratio = i / numSteps
    thresholds.push(ratio)
  }

  thresholds.push(0)
  return thresholds
}

function mounted (el, binding) {
  const modifiers = binding.modifiers || /* istanbul ignore next */ {}
  const value = binding.value
  const isObject = typeof value === 'object'
  const callback = isObject ? value.handler : value
  let options = {}
  if (binding.arg) {
    options = {
      root: null,
      rootMargin: '0px',
      threshold: buildThresholdList(parseFloat(binding.arg))
    }
  }
  const observer = new IntersectionObserver((
    entries = [],
    observer
  ) => {
    /* istanbul ignore if */
    if (!el._observe) return // Just in case, should never fire

    // If is not quiet or has already been
    // initted, invoke the user callback
    if (
      callback && (
        !modifiers.quiet ||
        el._observe.init
      )
    ) {
      const isIntersecting = Boolean(entries.find(entry => entry.isIntersecting))

      callback(entries, observer, isIntersecting)
    }

    // If has already been initted and
    // has the once modifier, unbind
    if (el._observe.init && modifiers.once) unbind(el)
    // Otherwise, mark the observer as initted
    else (el._observe.init = true)
  }, options)

  el._observe = { init: false, observer }

  observer.observe(el)
}

function unmounted (el) {
  /* istanbul ignore if */
  if (!el._observe) return

  el._observe.observer.unobserve(el)
  delete el._observe
}

export const Intersect = {
  mounted,
  unmounted
}

export default Intersect
