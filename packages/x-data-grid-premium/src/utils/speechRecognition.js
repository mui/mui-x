export const BrowserSpeechRecognition = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition;
export const IS_SPEECH_RECOGNITION_SUPPORTED = !!BrowserSpeechRecognition;
