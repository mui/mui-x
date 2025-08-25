"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeViewStore = void 0;
var TreeViewStore = /** @class */ (function () {
    function TreeViewStore(value) {
        var _this = this;
        this.subscribe = function (fn) {
            _this.listeners.add(fn);
            return function () {
                _this.listeners.delete(fn);
            };
        };
        this.getSnapshot = function () {
            return _this.value;
        };
        this.update = function (updater) {
            var newState = updater(_this.value);
            if (newState !== _this.value) {
                _this.value = newState;
                _this.listeners.forEach(function (l) { return l(newState); });
            }
        };
        this.value = value;
        this.listeners = new Set();
    }
    return TreeViewStore;
}());
exports.TreeViewStore = TreeViewStore;
