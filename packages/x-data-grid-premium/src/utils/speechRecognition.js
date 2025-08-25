"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IS_SPEECH_RECOGNITION_SUPPORTED = exports.BrowserSpeechRecognition = void 0;
exports.BrowserSpeechRecognition = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition;
exports.IS_SPEECH_RECOGNITION_SUPPORTED = !!exports.BrowserSpeechRecognition;
