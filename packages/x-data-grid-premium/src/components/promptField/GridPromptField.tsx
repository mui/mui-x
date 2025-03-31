import * as React from 'react';
import { PromptField, PromptFieldProps } from './PromptField';
import { PromptFieldControl } from './PromptFieldControl';
import { PromptFieldRecord } from './PromptFieldRecord';
import { PromptFieldSend } from './PromptFieldSend';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { IS_SPEECH_RECOGNITION_SUPPORTED } from '../../utils/speechRecognition';

function GridPromptField(props: PromptFieldProps) {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  let placeholder = apiRef.current.getLocaleText('promptFieldPlaceholder');

  if (IS_SPEECH_RECOGNITION_SUPPORTED) {
    placeholder = apiRef.current.getLocaleText('promptFieldPlaceholderWithRecording');
  }

  return (
    <PromptField {...props}>
      <PromptFieldControl
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            // Prevents the `multiline` TextField from adding a new line
            event.preventDefault();
          }
        }}
        render={({ ref, ...controlProps }, state) => (
          <rootProps.slots.baseTextField
            {...controlProps}
            fullWidth
            inputRef={ref}
            aria-label="Prompt"
            placeholder={
              state.recording
                ? apiRef.current.getLocaleText('promptFieldPlaceholderListening')
                : placeholder
            }
            size="small"
            multiline
            autoFocus
            slotProps={{
              input: {
                startAdornment: IS_SPEECH_RECOGNITION_SUPPORTED ? (
                  <rootProps.slots.baseTooltip
                    title={
                      state.recording
                        ? apiRef.current.getLocaleText('promptFieldStopRecording')
                        : apiRef.current.getLocaleText('promptFieldRecord')
                    }
                  >
                    <PromptFieldRecord
                      size="small"
                      edge="start"
                      color={state.recording ? 'primary' : 'default'}
                    >
                      <rootProps.slots.promptSpeechRecognitionIcon fontSize="small" />
                    </PromptFieldRecord>
                  </rootProps.slots.baseTooltip>
                ) : (
                  <rootProps.slots.baseTooltip
                    title={apiRef.current.getLocaleText('promptFieldSpeechRecognitionNotSupported')}
                  >
                    <rootProps.slots.promptSpeechRecognitionOffIcon fontSize="small" />
                  </rootProps.slots.baseTooltip>
                ),
                endAdornment: (
                  <rootProps.slots.baseTooltip title="Send">
                    <span>
                      <PromptFieldSend size="small" edge="end" color="primary">
                        <rootProps.slots.promptSendIcon fontSize="small" />
                      </PromptFieldSend>
                    </span>
                  </rootProps.slots.baseTooltip>
                ),
                ...controlProps.slotProps?.input,
              },
              ...controlProps.slotProps,
            }}
          />
        )}
      />
    </PromptField>
  );
}

export { GridPromptField };
