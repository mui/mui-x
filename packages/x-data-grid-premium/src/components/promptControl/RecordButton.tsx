import * as React from 'react';
import { Timeout } from '@mui/utils/useTimeout';
import useLazyRef from '@mui/utils/useLazyRef';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export const BrowserSpeechRecognition =
  (globalThis as any).SpeechRecognition || (globalThis as any).webkitSpeechRecognition;

type SpeechRecognitionOptions = {
  onUpdate: (value: string) => void;
  onDone: (value: string) => void;
  onError: (error: string) => void;
};

interface RecordButtonProps extends SpeechRecognitionOptions {
  disabled: boolean;
  lang?: string;
  recording: boolean;
  setRecording: (value: boolean) => void;
  className: string;
}

function RecordButton(props: RecordButtonProps) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const { lang, recording, setRecording, disabled, className, onDone, onUpdate, onError } = props;
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const recognition = useLazyRef(() => {
    if (!BrowserSpeechRecognition) {
      return {
        start: () => {},
        abort: () => {},
      };
    }

    const timeout = new Timeout();
    const instance = new BrowserSpeechRecognition();
    instance.continuous = true;
    instance.interimResults = true;
    instance.lang = lang;

    let finalResult = '';
    let interimResult = '';

    function start(options: SpeechRecognitionOptions) {
      if (recording) {
        return;
      }
      setRecording(true);

      instance.onresult = (event: any) => {
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
          options.onUpdate(interimResult);
        }
        timeout.start(1000, () => instance.stop());
      };

      instance.onsoundend = () => {
        instance.stop();
      };

      instance.onend = () => {
        options.onDone(finalResult);
        setRecording(false);
      };

      instance.onerror = (error: { error: string; message: string }) => {
        options.onError(error.message);
        instance.stop();
        setRecording(false);
      };

      instance.start();
    }

    function abort() {
      instance.abort();
    }

    return { start, abort };
  }).current;

  const handleClick = () => {
    if (!recording) {
      recognition.start({ onDone, onUpdate, onError });
      return;
    }

    recognition.abort();
  };

  return (
    <rootProps.slots.baseTooltip
      title={
        recording
          ? apiRef.current.getLocaleText('toolbarPromptControlRecordButtonActiveLabel')
          : apiRef.current.getLocaleText('toolbarPromptControlRecordButtonDefaultLabel')
      }
    >
      <div>
        <rootProps.slots.baseIconButton
          color={recording ? 'primary' : 'default'}
          className={className}
          disabled={disabled}
          onClick={handleClick}
          ref={buttonRef}
          size="small"
          edge="start"
        >
          <rootProps.slots.toolbarPromptRecordIcon fontSize="small" />
        </rootProps.slots.baseIconButton>
      </div>
    </rootProps.slots.baseTooltip>
  );
}

export { RecordButton };
