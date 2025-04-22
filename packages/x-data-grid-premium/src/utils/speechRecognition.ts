export const BrowserSpeechRecognition =
  (globalThis as any).SpeechRecognition || (globalThis as any).webkitSpeechRecognition;

export const IS_SPEECH_RECOGNITION_SUPPORTED = !!BrowserSpeechRecognition;
