"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManager = void 0;
// Used https://gist.github.com/mudge/5830382 as a starting point.
// See https://github.com/browserify/events/blob/master/events.js for
// the Node.js (https://nodejs.org/api/events.html) polyfill used by webpack.
var EventManager = /** @class */ (function () {
    function EventManager() {
        this.maxListeners = 20;
        this.warnOnce = false;
        this.events = {};
    }
    EventManager.prototype.on = function (eventName, listener, options) {
        if (options === void 0) { options = {}; }
        var collection = this.events[eventName];
        if (!collection) {
            collection = {
                highPriority: new Map(),
                regular: new Map(),
            };
            this.events[eventName] = collection;
        }
        if (options.isFirst) {
            collection.highPriority.set(listener, true);
        }
        else {
            collection.regular.set(listener, true);
        }
        if (process.env.NODE_ENV !== 'production') {
            var collectionSize = collection.highPriority.size + collection.regular.size;
            if (collectionSize > this.maxListeners && !this.warnOnce) {
                this.warnOnce = true;
                console.warn([
                    "Possible EventEmitter memory leak detected. ".concat(collectionSize, " ").concat(eventName, " listeners added."),
                ].join('\n'));
            }
        }
    };
    EventManager.prototype.removeListener = function (eventName, listener) {
        if (this.events[eventName]) {
            this.events[eventName].regular.delete(listener);
            this.events[eventName].highPriority.delete(listener);
        }
    };
    EventManager.prototype.removeAllListeners = function () {
        this.events = {};
    };
    EventManager.prototype.emit = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var collection = this.events[eventName];
        if (!collection) {
            return;
        }
        var highPriorityListeners = Array.from(collection.highPriority.keys());
        var regularListeners = Array.from(collection.regular.keys());
        for (var i = highPriorityListeners.length - 1; i >= 0; i -= 1) {
            var listener = highPriorityListeners[i];
            if (collection.highPriority.has(listener)) {
                listener.apply(this, args);
            }
        }
        for (var i = 0; i < regularListeners.length; i += 1) {
            var listener = regularListeners[i];
            if (collection.regular.has(listener)) {
                listener.apply(this, args);
            }
        }
    };
    EventManager.prototype.once = function (eventName, listener) {
        // eslint-disable-next-line consistent-this
        var that = this;
        this.on(eventName, function oneTimeListener() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            that.removeListener(eventName, oneTimeListener);
            listener.apply(that, args);
        });
    };
    return EventManager;
}());
exports.EventManager = EventManager;
