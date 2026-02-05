'use client';
import * as React from 'react';
import { Timeout } from '@mui/utils/useTimeout';

const BrowserSpeechRecognition =
  (globalThis as any).SpeechRecognition || (globalThis as any).webkitSpeechRecognition;

export const IS_SPEECH_RECOGNITION_SUPPORTED = !!BrowserSpeechRecognition;

interface UseSpeechRecognitionOptions {
  /** Called with interim transcript text as the user speaks */
  onUpdate: (value: string) => void;
  /** Called with the final transcript when speech ends */
  onDone: (value: string) => void;
  /** BCP 47 language tag (e.g. 'en-US') */
  lang?: string;
}

interface UseSpeechRecognitionReturn {
  /** Whether the microphone is currently recording */
  recording: boolean;
  /** Whether the browser supports speech recognition */
  supported: boolean;
  /** Toggle recording on/off */
  toggleRecording: () => void;
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions,
): UseSpeechRecognitionReturn {
  const [recording, setRecording] = React.useState(false);
  const optionsRef = React.useRef(options);
  optionsRef.current = options;

  const recognitionRef = React.useRef<{
    start: () => void;
    abort: () => void;
  } | null>(null);

  if (recognitionRef.current === null && BrowserSpeechRecognition) {
    const timeout = new Timeout();
    const instance = new BrowserSpeechRecognition();
    instance.continuous = true;
    instance.interimResults = true;
    if (options.lang) {
      instance.lang = options.lang;
    }

    let finalResult = '';
    let interimResult = '';

    function start() {
      finalResult = '';
      interimResult = '';

      instance.onresult = (event: {
        results: SpeechRecognitionResultList;
        resultIndex: number;
      }) => {
        finalResult = '';
        interimResult = '';
        if (typeof event.results === 'undefined') {
          instance.stop();
          return;
        }

        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          if (event.results[i].isFinal) {
            finalResult += event.results[i][0].transcript;
          } else {
            interimResult += event.results[i][0].transcript;
          }
        }

        if (finalResult === '') {
          optionsRef.current.onUpdate(interimResult);
        }
        timeout.start(2000, () => instance.stop());
      };

      instance.onsoundend = () => {
        instance.stop();
      };

      instance.onend = () => {
        optionsRef.current.onDone(finalResult);
        setRecording(false);
      };

      instance.onerror = () => {
        instance.stop();
        setRecording(false);
      };

      instance.start();
      setRecording(true);
    }

    function abort() {
      instance.abort();
    }

    recognitionRef.current = { start, abort };
  }

  const toggleRecording = React.useCallback(() => {
    if (!recognitionRef.current) {
      return;
    }
    if (recording) {
      recognitionRef.current.abort();
    } else {
      recognitionRef.current.start();
    }
  }, [recording]);

  return {
    recording,
    supported: IS_SPEECH_RECOGNITION_SUPPORTED,
    toggleRecording,
  };
}
