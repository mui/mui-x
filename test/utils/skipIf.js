"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTouchSupport = exports.isOSX = exports.isJSDOM = void 0;
exports.isJSDOM = /jsdom/.test(window.navigator.userAgent);
exports.isOSX = /macintosh/i.test(window.navigator.userAgent);
exports.hasTouchSupport = typeof window.Touch !== 'undefined' && typeof window.TouchEvent !== 'undefined';
