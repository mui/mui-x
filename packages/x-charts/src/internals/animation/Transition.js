"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transition = void 0;
var d3_timer_1 = require("@mui/x-charts-vendor/d3-timer");
/**
 * A resumable transition class inspired by d3-transition.
 * Allows for starting, and stopping and resuming transitions.
 *
 * The transition is started automatically.
 * A transition cannot be restarted after it has finished.
 * Resuming a transition will continue from the point it was stopped, i.e., easing will continue from the point it was
 * stopped.
 */
var Transition = /** @class */ (function () {
    /**
     * Create a new ResumableTransition.
     * @param duration Duration in milliseconds
     * @param easingFn The easing function
     * @param onTick Callback function called on each animation frame with the eased time in range [0, 1].
     */
    function Transition(duration, easingFn, onTick) {
        this.elapsed = 0;
        this.timer = null;
        this.duration = duration;
        this.easingFn = easingFn;
        this.onTickCallback = onTick;
        this.resume();
    }
    Object.defineProperty(Transition.prototype, "running", {
        get: function () {
            return this.timer !== null;
        },
        enumerable: false,
        configurable: true
    });
    Transition.prototype.timerCallback = function (elapsed) {
        this.elapsed = Math.min(elapsed, this.duration);
        var t = this.duration === 0 ? 1 : this.elapsed / this.duration;
        var easedT = this.easingFn(t);
        // Call the tick callback with the current value
        this.onTickCallback(easedT);
        if (this.elapsed >= this.duration) {
            this.stop();
        }
    };
    /**
     * Resume the transition
     */
    Transition.prototype.resume = function () {
        var _this = this;
        if (this.running || this.elapsed >= this.duration) {
            return this;
        }
        /* If we're resuming the transition, then subtract elapsed to continue the easing. */
        var time = (0, d3_timer_1.now)() - this.elapsed;
        this.timer = (0, d3_timer_1.timer)(function (elapsed) { return _this.timerCallback(elapsed); }, 0, time);
        return this;
    };
    /**
     * Stops the transition.
     */
    Transition.prototype.stop = function () {
        if (!this.running) {
            return this;
        }
        if (this.timer) {
            this.timer.stop();
            this.timer = null;
        }
        return this;
    };
    /**
     * Immediately finishes the transition and calls the tick callback with the final value.
     */
    Transition.prototype.finish = function () {
        var _this = this;
        this.stop();
        (0, d3_timer_1.timeout)(function () { return _this.timerCallback(_this.duration); });
        return this;
    };
    return Transition;
}());
exports.Transition = Transition;
