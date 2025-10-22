"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preventDefault = void 0;
var preventDefault = function (event) {
    if (event.cancelable) {
        event.preventDefault();
    }
};
exports.preventDefault = preventDefault;
