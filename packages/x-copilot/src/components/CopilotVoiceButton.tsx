'use client';
import * as React from 'react';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import MicNoneRoundedIcon from '@mui/icons-material/MicNoneRounded';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import type { CopilotPanelIcons } from './CopilotChatPanel.types';
import {
  BrowserSpeechRecognition,
  IS_SPEECH_RECOGNITION_SUPPORTED,
} from './speechRecognition';

export interface CopilotVoiceButtonProps extends Omit<IconButtonProps, 'onSubmit'> {
  /**
   * Called with the live transcript as the user speaks (interim + final).
   * Wire this to the composer's `setValue`.
   */
  onTranscript?(text: string): void;
  /**
   * Called once recognition ends with a non-empty final transcript. Wire this
   * to the composer's `submit`.
   */
  onSubmit?(): void;
  /** Icon overrides; only `speechRecognition` / `speechRecognitionOff` are read. */
  icons?: Pick<CopilotPanelIcons, 'speechRecognition' | 'speechRecognitionOff'>;
  /** Accessible label shown while recording. */
  stopLabel?: string;
  /** Accessible label shown when idle. */
  startLabel?: string;
}

const DEFAULT_STOP_LABEL = 'Stop recording';
const DEFAULT_START_LABEL = 'Start voice input';

/**
 * Microphone button that transcribes speech into the composer via the Web
 * Speech API, then submits when the user stops speaking. Falls back to a
 * disabled mic-off icon when the browser does not support `SpeechRecognition`.
 *
 * Host-agnostic: the transcript and submit are surfaced through `onTranscript`
 * / `onSubmit` callbacks rather than reaching into a grid composer.
 */
function CopilotVoiceButton(props: CopilotVoiceButtonProps) {
  const {
    onTranscript,
    onSubmit,
    icons,
    stopLabel = DEFAULT_STOP_LABEL,
    startLabel = DEFAULT_START_LABEL,
    ...other
  } = props;

  const [recording, setRecording] = React.useState(false);
  const recognitionRef = React.useRef<any>(null);

  // Keep latest callbacks in refs so the recognition handlers don't need to be
  // recreated (and the active session re-bound) on every render.
  const onTranscriptRef = React.useRef(onTranscript);
  const onSubmitRef = React.useRef(onSubmit);
  React.useEffect(() => {
    onTranscriptRef.current = onTranscript;
    onSubmitRef.current = onSubmit;
  });

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
      onTranscriptRef.current?.(`${finalText}${interim}`);
    };

    instance.onend = () => {
      setRecording(false);
      recognitionRef.current = null;
      if (finalText.trim()) {
        onSubmitRef.current?.();
      }
    };

    instance.onerror = () => {
      setRecording(false);
      recognitionRef.current = null;
    };

    setRecording(true);
    instance.start();
  }, [recording]);

  const stop = React.useCallback(() => {
    recognitionRef.current?.abort?.();
    recognitionRef.current = null;
    setRecording(false);
  }, []);

  const Icon = IS_SPEECH_RECOGNITION_SUPPORTED
    ? icons?.speechRecognition ?? MicNoneRoundedIcon
    : icons?.speechRecognitionOff ?? MicOffOutlinedIcon;

  return (
    <IconButton
      {...other}
      disabled={!IS_SPEECH_RECOGNITION_SUPPORTED || other.disabled}
      aria-label={recording ? stopLabel : startLabel}
      color={recording ? 'primary' : 'default'}
      onClick={() => (recording ? stop() : start())}
    >
      <Icon fontSize="small" />
    </IconButton>
  );
}

export { CopilotVoiceButton };
