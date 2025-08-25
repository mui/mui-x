"use strict";
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResizeObserver = void 0;
/**
 * HACK: Minimal shim to get jsdom to work.
 */
exports.ResizeObserver = (typeof globalThis.ResizeObserver !== 'undefined'
    ? globalThis.ResizeObserver
    : /** @class */ (function () {
        function ResizeObserver() {
        }
        ResizeObserver.prototype.observe = function () { };
        ResizeObserver.prototype.unobserve = function () { };
        ResizeObserver.prototype.disconnect = function () { };
        return ResizeObserver;
    }()));
