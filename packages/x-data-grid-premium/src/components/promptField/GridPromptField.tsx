import { PromptField, PromptFieldProps } from './PromptField';
import { PromptFieldControl } from './PromptFieldControl';
import { PromptFieldRecord } from './PromptFieldRecord';
import { PromptFieldSend } from './PromptFieldSend';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { IS_SPEECH_RECOGNITION_SUPPORTED } from '../../utils/speechRecognition';

function GridPromptField(props: PromptFieldProps) {
  const { slots } = useGridRootProps();
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
          <slots.baseTextField
            {...controlProps}
            fullWidth
            inputRef={ref}
            aria-label={apiRef.current.getLocaleText('promptFieldLabel')}
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
                  <slots.baseTooltip
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
                      <slots.promptSpeechRecognitionIcon fontSize="small" />
                    </PromptFieldRecord>
                  </slots.baseTooltip>
                ) : (
                  <slots.baseTooltip
                    title={apiRef.current.getLocaleText('promptFieldSpeechRecognitionNotSupported')}
                  >
                    <slots.promptSpeechRecognitionOffIcon fontSize="small" />
                  </slots.baseTooltip>
                ),
                endAdornment: (
                  <slots.baseTooltip title={apiRef.current.getLocaleText('promptFieldSend')}>
                    <span>
                      <PromptFieldSend size="small" edge="end" color="primary">
                        <slots.promptSendIcon fontSize="small" />
                      </PromptFieldSend>
                    </span>
                  </slots.baseTooltip>
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
