import { timer, Timer, now, timeout } from '@mui/x-charts-vendor/d3-timer';

/**
 * A resumable transition class inspired by d3-transition.
 * Allows for starting, and stopping and resuming transitions.
 *
 * The transition is started automatically.
 * A transition cannot be restarted after it has finished.
 * Resuming a transition will continue from the point it was stopped, i.e., easing will continue from the point it was
 * stopped.
 */
export class Transition {
  private readonly duration: number;

  private elapsed: number = 0;

  private readonly easingFn: (t: number) => number;

  private timer: Timer | null = null;

  private readonly onTickCallback: (easedT: number) => void;

  /**
   * Create a new ResumableTransition.
   * @param duration Duration in milliseconds
   * @param easingFn The easing function
   * @param onTick Callback function called on each animation frame with the eased time in range [0, 1].
   */
  constructor(duration: number, easingFn: (t: number) => number, onTick: (easedT: number) => void) {
    this.duration = duration;
    this.easingFn = easingFn;
    this.onTickCallback = onTick;

    this.resume();
  }

  private get running() {
    return this.timer !== null;
  }

  private timerCallback(elapsed: number) {
    this.elapsed = Math.min(elapsed, this.duration);

    const t = this.duration === 0 ? 1 : this.elapsed / this.duration;
    const easedT = this.easingFn(t);

    // Call the tick callback with the current value
    this.onTickCallback(easedT);

    if (this.elapsed >= this.duration) {
      this.stop();
    }
  }

  /**
   * Resume the transition
   */
  resume(): this {
    if (this.running || this.elapsed >= this.duration) {
      return this;
    }

    /* If we're resuming the transition, then subtract elapsed to continue the easing. */
    const time = now() - this.elapsed;

    this.timer = timer((elapsed) => this.timerCallback(elapsed), 0, time);

    return this;
  }

  /**
   * Stops the transition.
   */
  stop(): this {
    if (!this.running) {
      return this;
    }

    if (this.timer) {
      this.timer.stop();
      this.timer = null;
    }

    return this;
  }

  /**
   * Immediately finishes the transition and calls the tick callback with the final value.
   */
  finish(): this {
    this.stop();

    timeout(() => this.timerCallback(this.duration));

    return this;
  }
}
