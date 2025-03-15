import * as React from 'react';
import { styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import useEventCallback from '@mui/utils/useEventCallback';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { PromptResponse } from '../../hooks/features/prompt/gridPromptInterfaces';
import { RecordButton, BrowserSpeechRecognition } from './RecordButton';

type OwnerState = Pick<DataGridPremiumProcessedProps, 'classes'> & { recording: boolean };

const supportsSpeechRecognition = !!BrowserSpeechRecognition;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes, recording } = ownerState;

  const slots = {
    root: ['toolbarPromptControl', recording && 'toolbarPromptControl--recording'],
    recordingIndicator: ['toolbarPromptControlRecordingIndicator'],
    recordButton: ['toolbarPromptControlRecordButton'],
    sendButton: ['toolbarPromptControlSendButton'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridToolbarPromptControlRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ToolbarPromptControl',
  overridesResolver: (props, styles) => {
    const { ownerState } = props;
    return [
      styles.toolbarPromptControl,
      ownerState.recording && styles['toolbarPromptControl--recording'],
    ];
  },
})<{ ownerState: OwnerState }>({
  flex: 1,
  display: 'flex',
  flexDirection: 'row',
});

type GridToolbarPromptControlProps = {
  /**
   * Allow taking couple of random cell values from each column to improve the prompt context.
   * If allowed, samples are taken from different rows.
   * If not allowed, the column examples are used.
   * @default false
   */
  allowDataSampling?: boolean;
  /**
   * The BCP 47 language tag to use for the speech recognition.
   * @default HTML lang attribute value or the user agent's language setting
   */
  lang?: string;
  /**
   * Called when the new prompt is ready to be processed.
   * Provides the prompt and the data context and expects the grid state updates to be returned.
   * @param {string} context The context of the prompt
   * @param {string} query The query to process
   * @returns {Promise<PromptResponse>} The grid state updates
   */
  onPrompt: (context: string, query: string) => Promise<PromptResponse>;
  /**
   * Called when an error occurs.
   * @param {string} error The error message
   */
  onError?: (error: string) => void;
};

function GridToolbarPromptControl(props: GridToolbarPromptControlProps) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const { lang, onPrompt, onError, allowDataSampling = false } = props;

  const [isLoading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isRecording, setRecording] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const ownerState = { classes: rootProps.classes, recording: isRecording };
  const classes = useUtilityClasses(ownerState);

  const context = React.useMemo(() => {
    const examples = allowDataSampling ? apiRef.current.unstable_collectSampleData() : undefined;
    return apiRef.current.unstable_getPromptContext(examples);
  }, [apiRef, allowDataSampling]);

  const processPrompt = React.useCallback(() => {
    setLoading(true);
    setError(null);
    apiRef.current.setLoading(true);

    onPrompt(context, query)
      .then(apiRef.current.unstable_applyPromptResult)
      .catch((promptError) => {
        setError(apiRef.current.getLocaleText('toolbarPromptControlErrorMessage'));
        onError?.(promptError);
      })
      .finally(() => {
        setLoading(false);
        apiRef.current.setLoading(false);
      });
  }, [apiRef, query, context, onPrompt, onError]);

  const handleChange = useEventCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  });

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      processPrompt();
    }
  });

  const handleDone = useEventCallback((value: string) => {
    setQuery(value);
    if (value) {
      processPrompt();
    }
  });

  const placeholder = supportsSpeechRecognition
    ? apiRef.current.getLocaleText('toolbarPromptControlWithRecordingPlaceholder')
    : apiRef.current.getLocaleText('toolbarPromptControlPlaceholder');

  return (
    <GridToolbarPromptControlRoot ownerState={ownerState} className={classes.root}>
      <rootProps.slots.baseTextField
        placeholder={
          isRecording
            ? apiRef.current.getLocaleText('toolbarPromptControlRecordingPlaceholder')
            : placeholder
        }
        aria-label={apiRef.current.getLocaleText('toolbarPromptControlLabel')}
        disabled={isLoading}
        value={query}
        style={{ flex: 1 }}
        onChange={handleChange}
        size="small"
        onKeyDown={handleKeyDown}
        error={!!error}
        helperText={error}
        slotProps={{
          input: {
            startAdornment: supportsSpeechRecognition && (
              <RecordButton
                className={classes.recordButton}
                lang={lang}
                recording={isRecording}
                setRecording={setRecording}
                disabled={isLoading}
                onUpdate={setQuery}
                onDone={handleDone}
                onError={setError}
              />
            ),
            endAdornment: (
              <rootProps.slots.baseTooltip
                title={apiRef.current.getLocaleText('toolbarPromptControlSendActionLabel')}
              >
                <div>
                  <rootProps.slots.baseIconButton
                    className={classes.sendButton}
                    disabled={isLoading || isRecording || query === ''}
                    color="primary"
                    onClick={processPrompt}
                    size="small"
                    aria-label={apiRef.current.getLocaleText(
                      'toolbarPromptControlSendActionAriaLabel',
                    )}
                    edge="end"
                  >
                    <rootProps.slots.toolbarPromptSendIcon fontSize="small" />
                  </rootProps.slots.baseIconButton>
                </div>
              </rootProps.slots.baseTooltip>
            ),
          },
        }}
      />
    </GridToolbarPromptControlRoot>
  );
}

export { GridToolbarPromptControl };
