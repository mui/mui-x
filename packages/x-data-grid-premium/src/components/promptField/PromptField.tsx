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
   * Whether the prompt field is disabled.
   */
  disabled?: boolean;
  /**
   * Called when an speech recognition error occurs.
   * @param {string} error The error message
   */
  onRecordError?: (error: string) => void;
  /**
   * Called when the user submits the prompt.
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
  const { render, className, lang, onRecordError, onSubmit, disabled = false, ...other } = props;
  const [value, setValue] = React.useState('');
  const [recording, setRecording] = React.useState(false);
  const state = React.useMemo(
    () => ({
      value,
      recording,
      disabled,
    }),
    [value, recording, disabled],
  );
  const resolvedClassName = typeof className === 'function' ? className(state) : className;

  const processPrompt = (prompt: string) => {
    onSubmit(prompt);
    setValue('');
  };

  const contextValue = React.useMemo(
    () => ({
      state,
      lang,
      onValueChange: setValue,
      onRecordingChange: setRecording,
      onSubmit: processPrompt,
      onError: onRecordError,
    }),
    [state, lang, onRecordError, processPrompt],
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
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { PromptField };
