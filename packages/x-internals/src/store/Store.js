"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
var useStore_1 = require("./useStore");
/* eslint-disable no-cond-assign */
var Store = /** @class */ (function () {
    function Store(state) {
        var _this = this;
        this.subscribe = function (fn) {
            _this.listeners.add(fn);
            return function () {
                _this.listeners.delete(fn);
            };
        };
        /**
         * Returns the current state snapshot. Meant for usage with `useSyncExternalStore`.
         * If you want to access the state, use the `state` property instead.
         */
        this.getSnapshot = function () {
            return _this.state;
        };
        this.use = (function (selector, a1, a2, a3) {
            return (0, useStore_1.useStore)(_this, selector, a1, a2, a3);
        });
        this.state = state;
        this.listeners = new Set();
        this.updateTick = 0;
    }
    Store.create = function (state) {
        return new Store(state);
    };
    Store.prototype.setState = function (newState) {
        this.state = newState;
        this.updateTick += 1;
        var currentTick = this.updateTick;
        var it = this.listeners.values();
        var result;
        while (((result = it.next()), !result.done)) {
            if (currentTick !== this.updateTick) {
                // If the tick has changed, a recursive `setState` call has been made,
                // and it has already notified all listeners.
                return;
            }
            var listener = result.value;
            listener(newState);
        }
    };
    Store.prototype.update = function (changes) {
        for (var key in changes) {
            if (!Object.is(this.state[key], changes[key])) {
                this.setState(__assign(__assign({}, this.state), changes));
                return;
            }
        }
    };
    Store.prototype.set = function (key, value) {
        var _a;
        if (!Object.is(this.state[key], value)) {
            this.setState(__assign(__assign({}, this.state), (_a = {}, _a[key] = value, _a)));
        }
    };
    return Store;
}());
exports.Store = Store;
