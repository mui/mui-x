"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createControllablePromise = createControllablePromise;
function createControllablePromise() {
    var resolve;
    var reject;
    var promise = new Promise(function (_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
    });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
}
