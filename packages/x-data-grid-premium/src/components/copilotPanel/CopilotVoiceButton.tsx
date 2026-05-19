'use client';
import * as React from 'react';
import { useChatComposer } from '@mui/x-chat-headless';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import {
  BrowserSpeechRecognition,
  IS_SPEECH_RECOGNITION_SUPPORTED,
} from '../../utils/speechRecognition';

/**
 * Replacement for the ChatBox `composerAttachButton` slot.
 *
 * Renders a microphone button that transcribes speech into the composer
 * via the Web Speech API, then submits the message when the user stops
 * speaking. Falls back to a disabled mic-off icon when the browser does
 * not support `SpeechRecognition`.
 */
function CopilotVoiceButton() {
  const rootProps = useGridRootProps();
  const composer = useChatComposer();
  const [recording, setRecording] = React.useState(false);
  const recognitionRef = React.useRef<any>(null);

  React.useEffect(
    () => () => {
      recognitionRef.current?.abort?.();
    },
    [],
  );

  const start = React.useCallback(() => {
    if (!BrowserSpeechRecognition || recording) {
      return;
    }
    const instance = new BrowserSpeechRecognition();
    instance.continuous = true;
    instance.interimResults = true;
    recognitionRef.current = instance;

    let finalText = '';

    instance.onresult = (event: { results: SpeechRecognitionResultList; resultIndex: number }) => {
      let interim = '';
      finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      composer.setValue(`${finalText}${interim}`);
    };

    instance.onend = () => {
      setRecording(false);
      recognitionRef.current = null;
      if (finalText.trim()) {
        composer.submit();
      }
    };

    instance.onerror = () => {
      setRecording(false);
      recognitionRef.current = null;
    };

    setRecording(true);
    instance.start();
  }, [composer, recording]);

  const stop = React.useCallback(() => {
    recognitionRef.current?.abort?.();
    recognitionRef.current = null;
    setRecording(false);
  }, []);

  const Icon = IS_SPEECH_RECOGNITION_SUPPORTED
    ? rootProps.slots.promptSpeechRecognitionIcon
    : rootProps.slots.promptSpeechRecognitionOffIcon;

  return (
    <rootProps.slots.baseIconButton
      {...rootProps.slotProps?.baseIconButton}
      disabled={!IS_SPEECH_RECOGNITION_SUPPORTED}
      aria-label={recording ? 'Stop recording' : 'Start voice input'}
      color={recording ? 'primary' : 'default'}
      onClick={() => (recording ? stop() : start())}
    >
      <Icon fontSize="small" />
    </rootProps.slots.baseIconButton>
  );
}

export { CopilotVoiceButton };
