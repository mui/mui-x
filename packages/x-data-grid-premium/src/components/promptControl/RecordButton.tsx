import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { Timeout } from '@mui/utils/useTimeout';
import useLazyRef from '@mui/utils/useLazyRef';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

const BrowserSpeechRecognition = (globalThis as any).webkitSpeechRecognition;

type SpeechRecognitionOptions = {
  onUpdate: (value: string) => void;
  onDone: (value: string) => void;
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
  const { lang, recording, setRecording, disabled, className, onDone, onUpdate } = props;
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
    instance.lang = lang ?? 'en-US';

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

      instance.start();
    }

    function abort() {
      instance.abort();
    }

    return { start, abort };
  }).current;

  const handleClick = useEventCallback(() => {
    if (!recording) {
      recognition.start({ onDone, onUpdate });
      return;
    }

    recognition.abort();
  });

  return (
    BrowserSpeechRecognition && (
      <rootProps.slots.baseTooltip
        title={
          recording
            ? apiRef.current.getLocaleText('toolbarPromptControlRecordButtonDefaultLabel')
            : apiRef.current.getLocaleText('toolbarPromptControlRecordButtonActiveLabel')
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
          >
            <rootProps.slots.toolbarPromptRecordIcon fontSize="small" />
          </rootProps.slots.baseIconButton>
        </div>
      </rootProps.slots.baseTooltip>
    )
  );
}

export { RecordButton };
