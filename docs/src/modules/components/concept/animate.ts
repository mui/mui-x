export type Animation = ReturnType<typeof animate>
export type EasingFn = (t: number) => number

export const Easing = {
  LINEAR:      (t: number) => t,
  EASE_IN_OUT: (t: number) => t * t * (3 - 2 * t),
}

type Options = {
  from: number,
  to: number,
  duration: number,
  delay?: number,
  easing?: EasingFn,
  onChange: (value: number, done: boolean) => void,
}

/** Animate a value using `requestAnimationFrame()` */
export function animate(options: Options) {
  const { from, to, duration, delay = 0, onChange, easing = Easing.EASE_IN_OUT } = options
  const start = performance.now()
  let id = 0

  const step = (timestamp: number) => {
    const elapsed = timestamp - start - delay

    if (elapsed < 0) {
      id = requestAnimationFrame(step)
    } else if (elapsed >= duration) {
      onChange(to, true)
    } else {
      onChange(lerp(easing(elapsed / duration), from, to), false)
      id = requestAnimationFrame(step)
    }
  }

  const cancel = () => cancelAnimationFrame(id)

  id = requestAnimationFrame(step)

  return {
    cancel,
  }
}

export function lerp(factor: number, a: number, b: number) {
  return a * (1 - factor) + b * factor
}
