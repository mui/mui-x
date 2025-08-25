"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJSDOM = exports.isFirefox = void 0;
var userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : 'empty';
exports.isFirefox = userAgent.includes('firefox');
exports.isJSDOM = typeof window !== 'undefined' && /jsdom|HappyDOM/.test(window.navigator.userAgent);
exports.default = {
    isFirefox: exports.isFirefox,
    isJSDOM: exports.isJSDOM,
};
