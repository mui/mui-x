import * as React from 'react';
import PropTypes from 'prop-types';
import { RenderProp } from '@mui/x-data-grid';
import { useGridComponentRenderer } from '@mui/x-data-grid/internals';
import useEventCallback from '@mui/utils/useEventCallback';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { PromptFieldContext, PromptFieldState } from './PromptFieldContext';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';

export type PromptFieldProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<React.ComponentProps<'div'>, PromptFieldState>;
  /**
   * Override or extend the styles applied to the component.
   */
  className?: string | ((state: PromptFieldState) => string);
  /**
   * The BCP 47 language tag to use for the speech recognition.
   * @default HTML lang attribute value or the user agent's language setting
   */
  lang?: string;
  /**
   * Called when an error occurs.
   * @param {string} error The error message
   */
  onError?: (error: string) => void;
};

/**
 * The top level Prompt Field component that provides context to child components.
 * It renders a `<div />` element.
 *
 * Demos:
 *
 * - [Prompt Field](https://mui.com/x/react-data-grid/components/prompt-field/)
 *
 * API:
 *
 * - [PromptField API](https://mui.com/x/api/data-grid/prompt-field/)
 */
const PromptField = forwardRef<HTMLDivElement, PromptFieldProps>(function PromptField(props, ref) {
  const { render, className, lang, onError, ...other } = props;
  const [value, setValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [recording, setRecording] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const apiRef = useGridApiContext();
  const state = React.useMemo(
    () => ({
      value,
      loading,
      recording,
      error,
    }),
    [value, loading, recording, error],
  );
  const resolvedClassName = typeof className === 'function' ? className(state) : className;

  const processPrompt = React.useCallback(() => {
    setLoading(true);
    setError(null);
    setValue('');

    apiRef.current.aiAssistant
      .processPrompt(value)
      .then((result) => {
        if (result) {
          apiRef.current.aiAssistant.applyPromptResult(result);
        }
      })
      .catch((promptError) => {
        onError?.(promptError);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiRef, value, onError]);

  const handleValueChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
  }, []);

  const handleStopRecording = useEventCallback((newValue: string) => {
    setValue(newValue);
    if (newValue) {
      processPrompt();
    }
  });

  const contextValue = React.useMemo(
    () => ({
      state,
      lang,
      onValueUpdate: setValue,
      onValueChange: handleValueChange,
      onRecordingChange: setRecording,
      onStopRecording: handleStopRecording,
      onSend: processPrompt,
      onError: setError,
    }),
    [state, lang, handleValueChange, handleStopRecording, setError, processPrompt],
  );

  const element = useGridComponentRenderer(
    'div',
    render,
    {
      className: resolvedClassName,
      ...other,
      ref,
    },
    state,
  );

  return <PromptFieldContext.Provider value={contextValue}>{element}</PromptFieldContext.Provider>;
});

PromptField.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Allow taking couple of random cell values from each column to improve the prompt context.
   * If allowed, samples are taken from different rows.
   * If not allowed, the column examples are used.
   * @default false
   */
  allowDataSampling: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * Called when the new prompt is ready to be processed.
   * Provides the prompt and the data context and expects the grid state updates to be returned.
   * @param {string} query The query to process
   * @param {string} context The context of the prompt
   * @returns {Promise<PromptResponse>} The grid state updates
   */
  onPrompt: PropTypes.func.isRequired,
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { PromptField };
