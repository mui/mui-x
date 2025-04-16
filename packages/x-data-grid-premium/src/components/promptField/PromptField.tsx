import * as React from 'react';
import PropTypes from 'prop-types';
import { RenderProp } from '@mui/x-data-grid';
import { useGridComponentRenderer } from '@mui/x-data-grid/internals';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { PromptFieldContext, PromptFieldState } from './PromptFieldContext';

export type PromptFieldProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'onSubmit'
> & {
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
   * Called when an speech recognition error occurs.
   * @param {string} error The error message
   */
  onRecordError?: (error: string) => void;
  /**
   * Called when the user submits the prompt.
   * @param {string} prompt The prompt
   */
  onSubmit: (prompt: string) => void;
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
  const { render, className, lang, onRecordError, onSubmit, ...other } = props;
  const [value, setValue] = React.useState('');
  const [recording, setRecording] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const state = React.useMemo(
    () => ({
      value,
      recording,
      disabled,
    }),
    [value, recording, disabled],
  );
  const resolvedClassName = typeof className === 'function' ? className(state) : className;

  const handleOnSubmit = React.useCallback(
    async (prompt: string) => {
      setDisabled(true);
      setValue('');
      await onSubmit(prompt);
      setDisabled(false);
    },
    [onSubmit],
  );

  const contextValue = React.useMemo(
    () => ({
      state,
      lang,
      onValueChange: setValue,
      onRecordingChange: setRecording,
      onSubmit: handleOnSubmit,
      onError: onRecordError,
    }),
    [state, lang, onRecordError, handleOnSubmit],
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
   * Override or extend the styles applied to the component.
   */
  className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * Called when an speech recognition error occurs.
   * @param {string} error The error message
   */
  onRecordError: PropTypes.func,
  /**
   * Called when the user submits the prompt.
   * @param {string} prompt The prompt
   */
  onSubmit: PropTypes.func.isRequired,
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { PromptField };
