"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJSDOM = void 0;
exports.isJSDOM = typeof window !== 'undefined' && /jsdom|HappyDOM/.test(window.navigator.userAgent);
