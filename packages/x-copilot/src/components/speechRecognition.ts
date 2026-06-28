// Host-agnostic Web Speech API access. Resolved lazily off `globalThis` so the
// module is SSR-safe (no reference to `window` at import time).
export const BrowserSpeechRecognition =
  (globalThis as any).SpeechRecognition || (globalThis as any).webkitSpeechRecognition;

export const IS_SPEECH_RECOGNITION_SUPPORTED = !!BrowserSpeechRecognition;
